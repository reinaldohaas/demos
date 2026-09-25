function renderRMMDiagram(phase, amplitude) {
  const root = document.getElementById('rmmDiagram');
  const angle = (phase * 45 - 202.5) * Math.PI / 180;
  const r1 = amplitude * Math.cos(angle), r2 = amplitude * Math.sin(angle);
  let markup = '<circle cx="160" cy="160" r="40" fill="#334155" fill-opacity=".6" stroke="#94a3b8"/>';
  for (const radius of [80,120]) markup += `<circle cx="160" cy="160" r="${radius}" fill="none" stroke="#334155"/>`;
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    markup += `<line x1="${160+40*Math.cos(a)}" y1="${160-40*Math.sin(a)}" x2="${160+120*Math.cos(a)}" y2="${160-120*Math.sin(a)}" stroke="#486078"/>`;
    const p=i+1, b=(p*45-202.5)*Math.PI/180;
    markup += `<g role="button" tabindex="0" data-rmm-phase="${p}" aria-label="Selecionar fase ${p}" style="cursor:pointer"><circle cx="${160+99*Math.cos(b)}" cy="${160-99*Math.sin(b)}" r="15" fill="${p===phase?'#147d83':'#172c40'}"/><text x="${160+99*Math.cos(b)}" y="${165-99*Math.sin(b)}" fill="white" text-anchor="middle">${p}</text></g>`;
  }
  markup += `<circle cx="${160+40*r1}" cy="${160-40*r2}" r="6" fill="${amplitude<1?'#cbd5e1':'#fbbf24'}" stroke="white"/><text x="160" y="153" fill="#cbd5e1" text-anchor="middle" font-size="11">A &lt; 1</text><text x="160" y="170" fill="#cbd5e1" text-anchor="middle" font-size="11">MJO fraca</text><text x="274" y="177" fill="#cbd5e1" font-size="11">RMM1 →</text><text x="164" y="25" fill="#cbd5e1" font-size="11">RMM2 ↑</text>`;
  root.innerHTML=markup;
  document.getElementById('mjoAmplitude').value=amplitude;
  document.getElementById('mjoAmplitudeValue').textContent=amplitude.toFixed(1).replace('.',',');
  document.getElementById('rmmStatus').textContent=`${amplitude<1?'MJO fraca; fase apenas selecionada':'MJO ativa'} · Fase ${phase} · RMM1 ${r1.toFixed(2)} · RMM2 ${r2.toFixed(2)}`;
}
document.getElementById('mjoAmplitude').addEventListener('input',e=>setClimateState({amplitude:Number(e.target.value)}));
function selectRMM(event) {
  if(event.type==='keydown' && !['Enter',' '].includes(event.key)) return;
  const button=event.target.closest('[data-rmm-phase]');
  if(!button)return;
  event.preventDefault();
  setClimateState({phase:Number(button.dataset.rmmPhase)});
}
document.getElementById('rmmDiagram').addEventListener('click',selectRMM);
document.getElementById('rmmDiagram').addEventListener('keydown',selectRMM);
