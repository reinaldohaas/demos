// Gerenciador de Painéis Móveis, Redimensionáveis e Recolhíveis
// Demonstração MJO, ENOS e Teleconexões com o SESA
// Suporta arrastar pelo cabeçalho, redimensionar, recolher, ocultar,
// reabrir via menu "Painéis", restaurar layout original e persistência em localStorage.
// Compatível com GitHub Pages (sem build server ou dependências externas).

(function() {
  const STORAGE_KEY = 'mjo_panels_layout_v2';
  const MIN_PANEL_WIDTH = 240;
  const MIN_PANEL_HEIGHT = 100;

  const PANELS_CONFIG = [
    { id: 'panelRMM', name: 'Diagrama RMM & Amplitude', defaultDock: 'top-right' },
    { id: 'panelNarration', name: 'Narração Explicativa & Síntese', defaultDock: 'grid-row' },
    { id: 'panelResult', name: 'Resultado Documentado & Fonte', defaultDock: 'grid-cell' },
    { id: 'panelPsa', name: 'Mecanismo Físico & PSA', defaultDock: 'grid-cell' },
    { id: 'panelSst', name: 'Pacífico Equatorial & ENOS', defaultDock: 'grid-cell' },
    { id: 'panelPhase', name: 'MJO: Fase Selecionada', defaultDock: 'grid-cell' }
  ];

  let highestZIndex = 60;

  function isMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 960;
  }

  function getSavedLayout() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveLayout(layout) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch (e) {
      // Ignorar falhas de quota ou privacidade
    }
  }

  function updatePanelState(panelId, updates) {
    if (isMobile()) return; // Não salvar coordenadas absolutas em modo responsivo mobile
    const layout = getSavedLayout();
    layout[panelId] = Object.assign({}, layout[panelId] || {}, updates);
    saveLayout(layout);
  }

  function clampPosition(left, top, width, height) {
    const margin = 10;
    const maxLeft = Math.max(10, window.innerWidth - width - margin);
    const maxTop = Math.max(10, (document.documentElement.scrollHeight || 3000) - height - margin);
    const clampedLeft = Math.max(margin, Math.min(maxLeft, left));
    const clampedTop = Math.max(margin, Math.min(maxTop, top));
    return { left: clampedLeft, top: clampedTop };
  }

  function applyLayout() {
    const layout = getSavedLayout();
    if (isMobile()) {
      // Em mobile/telas pequenas: fluxo normal responsivo
      PANELS_CONFIG.forEach(cfg => {
        const el = document.getElementById(cfg.id);
        if (!el) return;
        el.classList.remove('is-floating');
        el.style.left = '';
        el.style.top = '';
        el.style.width = '';
        el.style.height = '';
        el.style.zIndex = '';
        const saved = layout[cfg.id];
        if (saved && saved.hidden) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
        if (saved && saved.collapsed) {
          el.classList.add('is-collapsed');
        } else {
          el.classList.remove('is-collapsed');
        }
      });
      updatePanelsMenuUI();
      return;
    }

    // Em desktop: restaurar posições salvas com clamping
    PANELS_CONFIG.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;
      const saved = layout[cfg.id];
      if (saved) {
        if (saved.floating && saved.left !== undefined && saved.top !== undefined) {
          el.classList.add('is-floating');
          const rect = el.getBoundingClientRect();
          const w = saved.width || rect.width || 280;
          const h = saved.height || rect.height || 200;
          const clamped = clampPosition(saved.left, saved.top, w, h);
          el.style.left = `${clamped.left}px`;
          el.style.top = `${clamped.top}px`;
          if (saved.width) el.style.width = `${saved.width}px`;
          if (saved.height) el.style.height = `${saved.height}px`;
          if (saved.zIndex) el.style.zIndex = saved.zIndex;
        } else {
          el.classList.remove('is-floating');
          el.style.left = '';
          el.style.top = '';
          el.style.width = '';
          el.style.height = '';
          el.style.zIndex = '';
        }

        if (saved.hidden) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }

        if (saved.collapsed) {
          el.classList.add('is-collapsed');
        } else {
          el.classList.remove('is-collapsed');
        }
      }
    });

    updatePanelsMenuUI();
  }

  function resetLayout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    PANELS_CONFIG.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;
      el.classList.remove('is-floating', 'is-collapsed', 'is-dragging');
      el.style.display = '';
      el.style.left = '';
      el.style.top = '';
      el.style.width = '';
      el.style.height = '';
      el.style.zIndex = '';
      const collapseBtn = el.querySelector('[data-action="collapse"]');
      if (collapseBtn) collapseBtn.textContent = '_';
    });

    updatePanelsMenuUI();
  }

  function initDraggablePanel(panelEl) {
    const header = panelEl.querySelector('.panel-header');
    if (!header) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    function bringToFront() {
      highestZIndex += 2;
      panelEl.style.zIndex = highestZIndex;
      updatePanelState(panelEl.id, { zIndex: highestZIndex });
    }

    panelEl.addEventListener('mousedown', bringToFront);

    header.addEventListener('mousedown', function(e) {
      if (isMobile()) return; // Não arrastar em mobile
      if (e.target.closest('.panel-actions') || e.target.closest('button') || e.target.closest('input')) return;
      e.preventDefault();

      isDragging = true;
      bringToFront();
      panelEl.classList.add('is-dragging');

      const rect = panelEl.getBoundingClientRect();
      // Se não era flutuante ainda, torná-lo flutuante preservando as coordenadas atuais absolutas
      if (!panelEl.classList.contains('is-floating')) {
        panelEl.classList.add('is-floating');
        panelEl.style.width = `${rect.width}px`;
        panelEl.style.left = `${rect.left + window.scrollX}px`;
        panelEl.style.top = `${rect.top + window.scrollY}px`;
      }

      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseFloat(panelEl.style.left) || (rect.left + window.scrollX);
      initialTop = parseFloat(panelEl.style.top) || (rect.top + window.scrollY);

      function onMouseMove(moveEvent) {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const w = panelEl.offsetWidth || 280;
        const h = panelEl.offsetHeight || 200;
        const rawLeft = initialLeft + dx;
        const rawTop = initialTop + dy;
        const clamped = clampPosition(rawLeft, rawTop, w, h);
        panelEl.style.left = `${clamped.left}px`;
        panelEl.style.top = `${clamped.top}px`;
      }

      function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        panelEl.classList.remove('is-dragging');
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        const left = parseFloat(panelEl.style.left);
        const top = parseFloat(panelEl.style.top);
        const width = panelEl.offsetWidth;
        const height = panelEl.offsetHeight;
        updatePanelState(panelEl.id, {
          floating: true,
          left,
          top,
          width,
          height,
          zIndex: parseInt(panelEl.style.zIndex, 10) || 50
        });
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // Acessibilidade por Teclado no Cabeçalho
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'region');
    header.addEventListener('keydown', function(e) {
      if (['Enter', ' '].includes(e.key)) {
        if (e.target === header) {
          e.preventDefault();
          toggleCollapsePanel(panelEl);
        }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !isMobile()) {
        e.preventDefault();
        bringToFront();
        const rect = panelEl.getBoundingClientRect();
        if (!panelEl.classList.contains('is-floating')) {
          panelEl.classList.add('is-floating');
          panelEl.style.width = `${rect.width}px`;
          panelEl.style.left = `${rect.left + window.scrollX}px`;
          panelEl.style.top = `${rect.top + window.scrollY}px`;
        }
        let curLeft = parseFloat(panelEl.style.left) || (rect.left + window.scrollX);
        let curTop = parseFloat(panelEl.style.top) || (rect.top + window.scrollY);
        const step = e.shiftKey ? 40 : 15;
        if (e.key === 'ArrowUp') curTop -= step;
        if (e.key === 'ArrowDown') curTop += step;
        if (e.key === 'ArrowLeft') curLeft -= step;
        if (e.key === 'ArrowRight') curLeft += step;
        const clamped = clampPosition(curLeft, curTop, panelEl.offsetWidth, panelEl.offsetHeight);
        panelEl.style.left = `${clamped.left}px`;
        panelEl.style.top = `${clamped.top}px`;
        updatePanelState(panelEl.id, {
          floating: true,
          left: clamped.left,
          top: clamped.top,
          width: panelEl.offsetWidth,
          height: panelEl.offsetHeight
        });
      }
    });

    // Observador de Redimensionamento (para salvar width e height ao redimensionar)
    if (typeof ResizeObserver !== 'undefined') {
      let resizeTimer = null;
      const ro = new ResizeObserver(entries => {
        if (isMobile()) return;
        for (const entry of entries) {
          if (panelEl.classList.contains('is-floating') && !panelEl.classList.contains('is-collapsed')) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              updatePanelState(panelEl.id, {
                width: Math.round(entry.contentRect.width + 28),
                height: Math.round(entry.contentRect.height + 40)
              });
            }, 300);
          }
        }
      });
      const body = panelEl.querySelector('.panel-body');
      if (body) ro.observe(body);
    }
  }

  function toggleCollapsePanel(panelEl) {
    const isCollapsed = panelEl.classList.toggle('is-collapsed');
    const btn = panelEl.querySelector('[data-action="collapse"]');
    if (btn) btn.textContent = isCollapsed ? '▲' : '_';
    updatePanelState(panelEl.id, { collapsed: isCollapsed });
  }

  function closePanel(panelEl) {
    panelEl.style.display = 'none';
    updatePanelState(panelEl.id, { hidden: true });
    updatePanelsMenuUI();
  }

  function openPanel(panelEl) {
    panelEl.style.display = '';
    updatePanelState(panelEl.id, { hidden: false });
    updatePanelsMenuUI();
  }

  function initPanelActions() {
    document.querySelectorAll('.movable-panel').forEach(panelEl => {
      initDraggablePanel(panelEl);

      const collapseBtn = panelEl.querySelector('[data-action="collapse"]');
      if (collapseBtn) {
        collapseBtn.addEventListener('click', e => {
          e.stopPropagation();
          toggleCollapsePanel(panelEl);
        });
      }

      const closeBtn = panelEl.querySelector('[data-action="close"]');
      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.stopPropagation();
          closePanel(panelEl);
        });
      }
    });
  }

  function initPanelsMenu() {
    const btnMenu = document.getElementById('btnPanelsMenu');
    const dropdown = document.getElementById('panelsDropdown');
    const btnReset = document.getElementById('btnResetLayout');

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        resetLayout();
      });
    }

    if (!btnMenu || !dropdown) return;

    btnMenu.addEventListener('click', e => {
      e.stopPropagation();
      const isExpanded = btnMenu.getAttribute('aria-expanded') === 'true';
      btnMenu.setAttribute('aria-expanded', String(!isExpanded));
      dropdown.hidden = isExpanded;
    });

    document.addEventListener('click', e => {
      if (!dropdown.hidden && !dropdown.contains(e.target) && e.target !== btnMenu) {
        dropdown.hidden = true;
        btnMenu.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.addEventListener('change', e => {
      if (e.target.matches('input[data-panel-target]')) {
        const targetId = e.target.dataset.panelTarget;
        const panelEl = document.getElementById(targetId);
        if (!panelEl) return;
        if (e.target.checked) {
          openPanel(panelEl);
        } else {
          closePanel(panelEl);
        }
      }
    });
  }

  function updatePanelsMenuUI() {
    const dropdown = document.getElementById('panelsDropdown');
    if (!dropdown) return;
    PANELS_CONFIG.forEach(cfg => {
      const checkbox = dropdown.querySelector(`input[data-panel-target="${cfg.id}"]`);
      const panelEl = document.getElementById(cfg.id);
      if (checkbox && panelEl) {
        checkbox.checked = panelEl.style.display !== 'none';
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initPanelActions();
    initPanelsMenu();
    applyLayout();
  });

  window.addEventListener('resize', () => {
    applyLayout();
  });

  if (typeof window !== 'undefined') {
    window.resetPanelLayout = resetLayout;
  }
})();
