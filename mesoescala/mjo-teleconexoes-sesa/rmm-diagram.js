function renderRMMDiagram(phase, amplitude) {
  const root = document.getElementById('rmmDiagram');
  if (!root) return;
  const angle = (phase * 45 - 202.5) * Math.PI / 180;
  const r1 = amplitude * Math.cos(angle), r2 = amplitude * Math.sin(angle);
  const cx = 110, cy = 110, uR = 30; // uR = 30px equivale a A = 1 (círculo unitário)

  let markup = `<circle cx="${cx}" cy="${cy}" r="${uR}" fill="#334155" fill-opacity=".55" stroke="#94a3b8" stroke-width="1.2"/>`;
  markup += `<circle cx="${cx}" cy="${cy}" r="${uR*2}" fill="none" stroke="#253a50" stroke-width="1" stroke-dasharray="3 3"/>`;
  markup += `<circle cx="${cx}" cy="${cy}" r="${uR*3}" fill="none" stroke="#334d66" stroke-width="1"/>`;

  // Linhas divisórias dos octantes
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    markup += `<line x1="${cx + uR * Math.cos(a)}" y1="${cy - uR * Math.sin(a)}" x2="${cx + uR * 3 * Math.cos(a)}" y2="${cy - uR * 3 * Math.sin(a)}" stroke="#3b536b" stroke-width="1"/>`;
    const p = i + 1, b = (p * 45 - 202.5) * Math.PI / 180;
    const btnX = cx + 75 * Math.cos(b);
    const btnY = cy - 75 * Math.sin(b);
    const isSelected = p === phase;
    markup += `<g role="button" tabindex="0" data-rmm-phase="${p}" aria-label="Selecionar fase ${p}" style="cursor:pointer">
      <circle cx="${btnX}" cy="${btnY}" r="11" fill="${isSelected ? '#0d9488' : '#1e293b'}" stroke="${isSelected ? '#5eead4' : '#475569'}" stroke-width="${isSelected ? 1.6 : 1}"/>
      <text x="${btnX}" y="${btnY + 3.8}" fill="white" text-anchor="middle" font-size="10.5" font-weight="700" font-family="system-ui, sans-serif">${p}</text>
    </g>`;
  }

  // Ponto anômalo da MJO
  const px = cx + uR * r1;
  const py = cy - uR * r2;
  markup += `<circle cx="${px}" cy="${py}" r="5" fill="${amplitude < 1 ? '#cbd5e1' : '#fbbf24'}" stroke="#ffffff" stroke-width="1.5"/>`;

  // Rótulos explicativos
  markup += `<text x="${cx}" y="${cy - 3}" fill="#cbd5e1" text-anchor="middle" font-size="8.5" font-weight="600">A &lt; 1</text>`;
  markup += `<text x="${cx}" y="${cy + 8}" fill="#94a3b8" text-anchor="middle" font-size="8">Fraca</text>`;
  markup += `<text x="185" y="113" fill="#64748b" font-size="8.5" font-family="sans-serif">RMM1→</text>`;
  markup += `<text x="114" y="14" fill="#64748b" font-size="8.5" font-family="sans-serif">RMM2↑</text>`;

  root.innerHTML = markup;

  const ampInput = document.getElementById('mjoAmplitude');
  if (ampInput) ampInput.value = amplitude;

  const ampVal = document.getElementById('mjoAmplitudeValue');
  if (ampVal) ampVal.textContent = amplitude.toFixed(1).replace('.', ',');

  const tag = document.getElementById('rmmStatusTag');
  if (tag) {
    tag.textContent = amplitude < 1 ? 'A < 1 (Fraca)' : 'A ≥ 1 (Ativa)';
    tag.style.color = amplitude < 1 ? '#94a3b8' : 'var(--accent-teal)';
  }

  const status = document.getElementById('rmmStatus');
  if (status) {
    status.textContent = amplitude < 1
      ? `A < 1: Fase ${phase} (MJO desorganizada)`
      : `A ≥ 1: Fase ${phase} ativa · RMM1 ${r1.toFixed(2)} · RMM2 ${r2.toFixed(2)}`;
  }
}

const ampControl = document.getElementById('mjoAmplitude');
if (ampControl) {
  ampControl.addEventListener('input', e => {
    if (typeof setClimateState === 'function') {
      setClimateState({ amplitude: Number(e.target.value) });
    }
  });
}

function handleRMMClick(event) {
  if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
  const button = event.target.closest('[data-rmm-phase]');
  if (button) {
    event.preventDefault();
    if (typeof setClimateState === 'function') {
      setClimateState({ phase: Number(button.dataset.rmmPhase) });
    }
    return;
  }

  const root = document.getElementById('rmmDiagram');
  if (!root) return;
  const rect = root.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scale = 220 / rect.width;
  const clickX = (event.clientX - rect.left) * scale;
  const clickY = (event.clientY - rect.top) * scale;
  const dx = clickX - 110;
  const dy = 110 - clickY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const newAmp = Math.max(0.1, Math.min(3.0, Math.round((dist / 30) * 10) / 10));

  let angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
  let p = 5;
  if (angleDeg >= 0 && angleDeg < 45) p = 5;
  else if (angleDeg >= 45 && angleDeg < 90) p = 6;
  else if (angleDeg >= 90 && angleDeg < 135) p = 7;
  else if (angleDeg >= 135 && angleDeg <= 180) p = 8;
  else if (angleDeg >= -180 && angleDeg < -135) p = 1;
  else if (angleDeg >= -135 && angleDeg < -90) p = 2;
  else if (angleDeg >= -90 && angleDeg < -45) p = 3;
  else if (angleDeg >= -45 && angleDeg < 0) p = 4;

  if (typeof setClimateState === 'function') {
    setClimateState({ phase: p, amplitude: newAmp });
  }
}

const rmmEl = document.getElementById('rmmDiagram');
if (rmmEl) {
  rmmEl.addEventListener('click', handleRMMClick);
  rmmEl.addEventListener('keydown', handleRMMClick);
}
