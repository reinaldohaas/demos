/* Campos sintéticos de TSM e síntese bibliográfica: não são observações ou previsão. */
const ENSOScience = (() => {
    const frequency = {
        'el-nino': {SON:[6.6,5.4,true,true],DJF:[7.2,4.2,true,true],MAM:[-2.3,-3.2,false,false],JJA:[6.0,4.9,true,true]},
        'la-nina': {SON:[-1.3,-2.0,false,false],DJF:[-2.4,-3.5,false,false],MAM:[-6.0,-3.2,true,false],JJA:[0.7,-1.9,false,false]}
    };
    const sign = x => `${x > 0 ? '+' : ''}${x.toFixed(1)}`;
    function response(enso, season) {
        const enhanced = enso === 'el-nino' && season === 'SON';
        const f = frequency[enso]?.[season];
        return {
            // Ganhos de desenho, sem equivalência com anomalias medidas em m/s.
            stjGain: enso === 'el-nino' ? 1.25 : enso === 'la-nina' ? 0.78 : 1,
            stjWidth: enso === 'el-nino' ? 9 : enso === 'la-nina' ? 3 : 6,
            stjShift: enso === 'el-nino' ? 3 : enso === 'la-nina' ? -3 : 0,
            salljGain: enhanced ? 1.18 : 1,
            stj: enso === 'el-nino' ? 'Esquema: jato mais forte (grosso) e mais ao norte.' : enso === 'la-nina' ? 'Esquema: jato mais fraco (fino) e mais ao sul.' : 'Referência sazonal: espessura e latitude intermediárias.',
            sallj: enhanced ? 'Maior transporte de umidade para o sul do Brasil; vento e umidade contribuem. Espessura reforçada apenas como ilustração.' : 'Intensidade e transporte não são inferidos da frequência. Mantém-se o traçado de referência onde não há magnitude validada.',
            frequency: f ? `Diferença na proporção de dias com SALLJ: Santa Cruz ${sign(f[0])} p.p. (${f[2] ? 'significativa' : 'não significativa'}); Mariscal ${sign(f[1])} p.p. (${f[3] ? 'significativa' : 'não significativa'}), ao nível de 5%.` : 'Referência neutra. Frequência de dias com jato não é frequência de dias chuvosos.',
            interaction: season === 'DJF' ? `Fernandes e Grimm (2023): maior resposta positiva na região da ZCAS na fase ${enso === 'el-nino' ? '1 em El Niño' : enso === 'la-nina' ? '8 em La Niña' : '8–1 na síntese geral; o neutro tem resposta própria'}. A fase de maior efeito pode mudar com o ENOS; não é uma soma de efeitos independentes.` : 'O resultado de Fernandes e Grimm (2023) aqui destacado refere-se a DJF; não é extrapolado às outras estações.'
        };
    }
    function field(lon, lat, enso, season) {
        // Longitude contínua 120°E–280°E. Escalas escolhidas para ensino.
        const g = (x,c,s) => Math.exp(-(((x-c)/s)**2));
        const base = 28 - 4.5*g(lon,270,38)*g(lat,0,11) - 0.008*lat*lat + ({DJF:0.3,MAM:0.6,JJA:-0.3,SON:-0.6}[season])*g(lon,255,45);
        const anomaly = enso === 'el-nino' ? 2.2*g(lon,240,39)*g(lat,0,9)-0.5*g(lon,145,20)*g(lat,0,13) : enso === 'la-nina' ? -1.8*g(lon,225,42)*g(lat,0,8)+0.4*g(lon,145,20)*g(lat,0,12) : 0;
        return {base, anomaly, sst:base+anomaly};
    }
    function draw(state) {
        const canvas = document.getElementById('sstCanvas');
        const mode = document.getElementById('sstMode').value;
        const w = canvas.clientWidth, h = 240, dpr = window.devicePixelRatio || 1;
        canvas.width=w*dpr; canvas.height=h*dpr;
        const c=canvas.getContext('2d'); c.scale(dpr,dpr);
        const left=40, top=28, pw=w-55, ph=155;
        const x=lon=>left+(lon-120)/160*pw, y=lat=>top+(25-lat)/50*ph;
        c.fillStyle='#071323'; c.fillRect(0,0,w,h);
        const color=v=> {
            const t=Math.max(0,Math.min(1,mode==='anomaly' ? (v+3)/6 : (v-18)/14));
            const a=t<0.5?[34,104,192]:[237,239,230], b=t<0.5?[237,239,230]:[204,55,39], u=t<0.5?t*2:(t-0.5)*2;
            return `rgb(${a.map((n,i)=>Math.round(n+(b[i]-n)*u)).join(',')})`;
        };
        for(let lon=120;lon<280;lon+=2)for(let lat=-25;lat<25;lat+=2){
            const f=field(lon+1,lat+1,state.enso,state.season);
            c.fillStyle=color(f[mode]); c.fillRect(x(lon),y(lat+2),pw/80+0.5,ph/25+0.5);
        }
        c.strokeStyle='#172334';c.lineWidth=1;c.setLineDash([3,3]);
        c.beginPath();c.moveTo(x(120),y(0));c.lineTo(x(280),y(0));c.stroke();
        c.setLineDash([]);c.strokeStyle='#172334';c.strokeRect(x(190),y(5),x(240)-x(190),y(-5)-y(5));
        c.font='11px Inter, sans-serif';c.fillStyle='#172334';c.fillText('Niño 3.4',x(191),y(7));
        c.fillStyle='#e2e8f0';c.fillText('Pacífico equatorial • campo idealizado',left,17);
        for(const [lon,label] of [[120,'120°E'],[180,'180°'],[240,'120°W'],[280,'80°W']]){c.textAlign=lon===280?'right':'left';c.fillText(label,x(lon),top+ph+17);}
        c.textAlign='left';c.fillText('25°N',1,top+10);c.fillText('0°',10,y(0));c.fillText('25°S',1,top+ph);
        for(let i=0;i<100;i++){const v=mode==='anomaly'?-3+i*6/99:18+i*14/99;c.fillStyle=color(v);c.fillRect(left+i*pw/100,211,pw/100+1,8);}
        c.fillStyle='#e2e8f0';c.fillText(mode==='anomaly'?'−3 °C (fria)':'18 °C',left,235);c.textAlign='center';c.fillText(mode==='anomaly'?'0 °C':'25 °C',left+pw/2,235);c.textAlign='right';c.fillText(mode==='anomaly'?'+3 °C (quente)':'32 °C',left+pw,235);
    }
    function update(state) {
        const r=response(state.enso,state.season);
        document.getElementById('ensoStjEvidence').textContent=r.stj;
        document.getElementById('ensoSalljEvidence').textContent=r.sallj;
        document.getElementById('ensoFrequencyEvidence').textContent=r.frequency;
        document.getElementById('ensoMjoEvidence').textContent=r.interaction;
        document.getElementById('sstExplanation').textContent=state.enso==='neutro' ? 'Neutro: este exemplo usa anomalia zero como referência idealizada. Na natureza, neutralidade não significa ausência de anomalias locais nem ausência de jatos.' : state.enso==='el-nino' ? 'El Niño: aquecimento anômalo no Pacífico equatorial central/oriental. A posição e a intensidade variam entre eventos; este desenho não representa um evento observado.' : 'La Niña: resfriamento anômalo no Pacífico equatorial central/oriental. Não é o negativo exato de El Niño; este desenho é ilustrativo.';
        draw(state);
    }
    return {response,field,update,frequency};
})();
