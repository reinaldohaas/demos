// Base de Conhecimento Científico das 96 Permutações (4 Estações × 3 Estados de ENOS × 8 Fases da MJO)
// Fundamentada na literatura seminal de Alice M. Grimm e colaboradores:
// - Grimm, Ferraz & Gomes (1998), J. Climate (Impactos de El Niño e La Niña no Sul do Brasil)
// - Grimm, Barros & Doyle (2000), J. Climate (Variabilidade climática no Sul da América do Sul)
// - Grimm (2003), J. Climate (Impactos do El Niño na Monção da América do Sul e transição intra-sazonal)
// - Grimm (2004), Climate Dynamics (Perturbações da La Niña na monção e secas no SESA)
// - Grimm & Tedeschi (2009), J. Climate (ENOS e eventos extremos na América do Sul)
// - Grimm (2011), Interannual Climate Variability in South America
// - Fernandes & Grimm (2023), J. Climate (Modulação do ENOS sobre a MJO e teleconexões com o SESA e ZCAS)
// - Alvarez, Vera, Kiladis & Liebmann (2016), Climate Dynamics (Semanas chuvosas no SESA e ZCAS)

const GRIMM_96_MATRIX = {};

(function() {
  const SEASONS = ['DJF', 'MAM', 'JJA', 'SON'];
  const ENSOS = ['la-nina', 'neutro', 'el-nino'];
  const PHASES = [1, 2, 3, 4, 5, 6, 7, 8];

  const PHASE_NAMES = {
    1: 'Hemisfério Ocidental/África',
    2: 'Oceano Índico Ocidental',
    3: 'Oceano Índico Central/Leste',
    4: 'Continente Marítimo',
    5: 'Continente Marítimo Oriental',
    6: 'Pacífico Ocidental',
    7: 'Linha de Data',
    8: 'Pacífico Leste/Hemisfério Ocidental'
  };

  // 10 Casos de Referência Curados da Literatura ("Eventos de Interesse")
  const CURATED_BENCHMARKS = {
    'DJF-la-nina-8': {
      id: 'DJF-la-nina-8',
      title: 'DJF · Fernandes & Grimm · La Niña 8 — pico na ZCAS',
      author: 'Fernandes & Grimm (2023)',
      doi: 'https://doi.org/10.1175/JCLI-D-22-0781.1'
    },
    'DJF-el-nino-1': {
      id: 'DJF-el-nino-1',
      title: 'DJF · Fernandes & Grimm · El Niño 1 — pico na ZCAS (fase posterior)',
      author: 'Fernandes & Grimm (2023)',
      doi: 'https://doi.org/10.1175/JCLI-D-22-0781.1'
    },
    'DJF-el-nino-3': {
      id: 'DJF-el-nino-3',
      title: 'DJF · Fernandes & Grimm · El Niño 3 — pico no SESA',
      author: 'Fernandes & Grimm (2023)',
      doi: 'https://doi.org/10.1175/JCLI-D-22-0781.1'
    },
    'DJF-neutro-4': {
      id: 'DJF-neutro-4',
      title: 'DJF · Fernandes & Grimm · Neutro 4 — maior aumento no SESA',
      author: 'Fernandes & Grimm (2023)',
      doi: 'https://doi.org/10.1175/JCLI-D-22-0781.1'
    },
    'DJF-alvarez-3-4': {
      id: 'DJF-alvarez-3-4',
      title: 'DJF · Alvarez · 3–4 — mais chance de semana chuvosa (SESA)',
      author: 'Alvarez et al. (2016)',
      doi: 'https://doi.org/10.1007/s00382-015-2581-6'
    },
    'DJF-alvarez-8-1': {
      id: 'DJF-alvarez-8-1',
      title: 'DJF · Alvarez · 8–1 — mais chance de semana chuvosa (ZCAS)',
      author: 'Alvarez et al. (2016)',
      doi: 'https://doi.org/10.1007/s00382-015-2581-6'
    },
    'MAM-alvarez-1': {
      id: 'MAM-alvarez-1',
      title: 'MAM · Alvarez · 1 — mais chance de semana chuvosa (ZCAS)',
      author: 'Alvarez et al. (2016)',
      doi: 'https://doi.org/10.1007/s00382-015-2581-6'
    },
    'JJA-alvarez-8': {
      id: 'JJA-alvarez-8',
      title: 'JJA · Alvarez · 8 — mais chance de semana chuvosa (ZCAS)',
      author: 'Alvarez et al. (2016)',
      doi: 'https://doi.org/10.1007/s00382-015-2581-6'
    },
    'SON-alvarez-7-8': {
      id: 'SON-alvarez-7-8',
      title: 'SON · Alvarez · 7–8 — mais chance de semana chuvosa (ZCAS)',
      author: 'Alvarez et al. (2016)',
      doi: 'https://doi.org/10.1007/s00382-015-2581-6'
    },
    'SON-alvarez-1': {
      id: 'SON-alvarez-1',
      title: 'SON · Alvarez · 1 — mais chance de semana chuvosa (SESA)',
      author: 'Alvarez et al. (2016)',
      doi: 'https://doi.org/10.1007/s00382-015-2581-6'
    }
  };

  // Gerador das 96 permutações com diagnósticos físicos rigorosos
  for (const season of SEASONS) {
    for (const enso of ENSOS) {
      for (const phase of PHASES) {
        const key = `${season}-${enso}-${phase}`;
        let impact = 'neutro'; // 'chuva_extrema' | 'chuva_moderada' | 'neutro' | 'seca_moderada' | 'seca_severa' | 'zcas_favoravel'
        let impactLabel = 'Próximo à climatologia';
        let sesaSignal = '0';
        let backgroundSummary = '';
        let mjoTrigger = '';
        let synthesis = '';
        let citations = '';

        // 1. DJF (Verão)
        if (season === 'DJF') {
          if (enso === 'el-nino') {
            backgroundSummary = 'El Niño no verão: Jato Subtropical reforçado e convecção monçônica ativa na bacia do Prata (Grimm 2003).';
            if (phase === 1) {
              impact = 'zcas_favoravel';
              impactLabel = 'Pico na ZCAS (fase posterior)';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Hemisfério Ocidental/África; fonte de convecção no Pacífico subtropical deslocada mais a leste.';
              synthesis = 'Pico de chuva na ZCAS em El Niño (uma fase após La Niña). Fluxo de umidade desviado da Amazônia para a ZCAS, atenuando temporariamente o SESA (Fernandes & Grimm 2023).';
              citations = 'Grimm (2003); Fernandes & Grimm (2023)';
            } else if (phase === 2) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva acima da média no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Oceano Índico ocidental intensificando o transporte de umidade em baixos níveis.';
              synthesis = 'Início da reativação do escoamento do SALLJ em direção ao SESA, reforçando frentes frias semi-estacionárias.';
              citations = 'Grimm (2003); Liebmann et al. (2004)';
            } else if (phase === 3) {
              impact = 'chuva_extrema';
              impactLabel = 'Pico de extremos no SESA';
              sesaSignal = '+2';
              mjoTrigger = 'Convecção ativa no Oceano Índico central/leste excita padrão de onda PSA com cavado sobre norte da Argentina/SESA.';
              synthesis = 'Máximo de extremos de precipitação no SESA em El Niño. O trem de ondas PSA e o SALLJ canalizam umidade massiva diretamente para o SESA (Fernandes & Grimm 2023).';
              citations = 'Grimm (2003); Fernandes & Grimm (2023)';
            } else if (phase === 4) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva acima da média no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Continente Marítimo; convergência mantida na porção centro-sul da bacia do Prata.';
              synthesis = 'Chuva abundante no SESA sustentada pela combinação de Jato Subtropical acelerado e umidade do SALLJ.';
              citations = 'Grimm (2003); Alvarez et al. (2016)';
            } else if (phase === 5) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva moderada no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Continente Marítimo oriental; divergência em altos níveis em transição.';
              synthesis = 'Condições favoráveis a precipitações acima da média no SESA, com tendência de transição intra-sazonal.';
              citations = 'Grimm (2003)';
            } else if (phase === 6) {
              impact = 'neutro';
              impactLabel = 'Transição / Próximo à média';
              sesaSignal = '0';
              mjoTrigger = 'Convecção avança para o Pacífico ocidental; trem de ondas em fase neutra para a América do Sul.';
              synthesis = 'Chuvas próximas da normalidade climatológica com acumulados pontuais.';
              citations = 'Grimm (2003)';
            } else if (phase === 7) {
              impact = 'neutro';
              impactLabel = 'Transição para o centro-leste';
              sesaSignal = '0';
              mjoTrigger = 'Convecção na Linha de Data; reorganização do fluxo de umidade.';
              synthesis = 'Início de reorganização da teleconexão em direção à porção centro-leste da América do Sul.';
              citations = 'Grimm (2003); Fernandes & Grimm (2023)';
            } else if (phase === 8) {
              impact = 'zcas_favoravel';
              impactLabel = 'Favorecimento gradual da ZCAS';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Pacífico leste; divergência em altos níveis deslocada para o leste.';
              synthesis = 'Precipitação em migração para o centro-leste (ZCAS); SESA com acumulados menores.';
              citations = 'Fernandes & Grimm (2023)';
            }
          } else if (enso === 'la-nina') {
            backgroundSummary = 'La Niña no verão: SESA com tendência acentuada a estiagens; ZCAS e convecção continental frequentemente favorecidas (Grimm 2004).';
            if (phase === 1 || phase === 2) {
              impact = 'seca_moderada';
              impactLabel = 'Déficit de chuva no SESA';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Hemisfério Ocidental/Índico; subsidência e divergência de umidade sobre o SESA.';
              synthesis = 'Estiagem no SESA; frentes frias de passagem rápida e pouco ativas no interior.';
              citations = 'Grimm (2004)';
            } else if (phase === 3) {
              impact = 'chuva_moderada';
              impactLabel = 'Alívio passageiro no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Índico tenta excitar onda ciclônica, gerando alívio temporário do déficit.';
              synthesis = 'Alívio temporário de chuva no SESA; a MJO contrabalança transitoriamente o fundo seco de La Niña.';
              citations = 'Grimm (2004); Alvarez et al. (2016)';
            } else if (phase === 4 || phase === 5) {
              impact = 'neutro';
              impactLabel = 'Próximo à climatologia';
              sesaSignal = '0';
              mjoTrigger = 'Convecção no Continente Marítimo com resposta fraca na circulação subtropical.';
              synthesis = 'Chuvas esparsas de verão com acumulados próximos à média.';
              citations = 'Grimm (2004)';
            } else if (phase === 6) {
              impact = 'seca_moderada';
              impactLabel = 'Início de supressão no SESA';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Pacífico ocidental; início da ativação do padrão PSA de La Niña.';
              synthesis = 'Formação de crista anômala no Sul do Brasil, inibindo frentes e concentrando calor.';
              citations = 'Grimm (2004); Fernandes & Grimm (2023)';
            } else if (phase === 7) {
              impact = 'zcas_favoravel';
              impactLabel = 'ZCAS ativa | Estiagem no SESA';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção na Linha de Data / Pacífico subtropical excita trem de ondas PSA.';
              synthesis = 'Onda PSA drena umidade da Amazônia para a ZCAS, acentuando a seca no SESA.';
              citations = 'Fernandes & Grimm (2023)';
            } else if (phase === 8) {
              impact = 'zcas_favoravel';
              impactLabel = 'Pico na ZCAS (Seca severa no SESA)';
              sesaSignal = '-2';
              mjoTrigger = 'Convecção no Pacífico subtropical centro-leste excita forte trem PSA (fases 7+8).';
              synthesis = 'Pico máximo na ZCAS e máxima divergência de umidade (seca/supressão severa) no SESA em La Niña (Fernandes & Grimm 2023).';
              citations = 'Grimm (2004); Fernandes & Grimm (2023)';
            }
          } else { // neutro
            backgroundSummary = 'Verão Neutro: sem forçamento de TSM no Pacífico; a MJO é o modulador intra-sazonal primário (Grimm 2011).';
            if (phase === 1) {
              impact = 'zcas_favoravel';
              impactLabel = 'Mais chance na ZCAS';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção tropical sobre o Atlântico/África; divergência em altos níveis sobre a ZCAS.';
              synthesis = 'Semana com maior probabilidade de chuvas acima da média na ZCAS e déficit relativo no SESA (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            } else if (phase === 2) {
              impact = 'neutro';
              impactLabel = 'Transição / Climatologia';
              sesaSignal = '0';
              mjoTrigger = 'Convecção no Oceano Índico em propagação.';
              synthesis = 'Condições próximas da média com instabilidades convectivas típicas de verão.';
              citations = 'Grimm (2011)';
            } else if (phase === 3) {
              impact = 'chuva_moderada';
              impactLabel = 'Semana chuvosa no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Índico central; onda PSA favorecendo advecção pelo SALLJ.';
              synthesis = 'Aumento da probabilidade de semana chuvosa no SESA em anos neutros (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            } else if (phase === 4) {
              impact = 'chuva_extrema';
              impactLabel = 'Maior aumento de extremos no SESA';
              sesaSignal = '+2';
              mjoTrigger = 'Convecção no Continente Marítimo associada à subsidência anômala no Pacífico equatorial.';
              synthesis = 'Maior aumento relativo de extremos de precipitação no SESA em anos neutros (Fernandes & Grimm 2023; Alvarez et al. 2016).';
              citations = 'Fernandes & Grimm (2023); Alvarez et al. (2016)';
            } else if (phase === 5) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Continente Marítimo oriental; continuidade de convergência na bacia do Prata.';
              synthesis = 'Chuvas acima da média no SESA em decaimento gradual após o pico da fase 4.';
              citations = 'Grimm (2011)';
            } else if (phase === 6 || phase === 7) {
              impact = 'neutro';
              impactLabel = 'Próximo à climatologia';
              sesaSignal = '0';
              mjoTrigger = 'Pacífico ocidental e Linha de Data; transição de onda.';
              synthesis = 'Período de transição sem predomínio de extremos na bacia do Prata.';
              citations = 'Grimm (2011)';
            } else if (phase === 8) {
              impact = 'zcas_favoravel';
              impactLabel = 'Mais chance na ZCAS';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Pacífico leste excita onda com centro anticiclônico no SESA.';
              synthesis = 'Mais chance de semana chuvosa na ZCAS e convecção suprimida no SESA (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            }
          }
        }

        // 2. SON (Primavera - O Sinal Canônico mais Forte de Alice Grimm)
        else if (season === 'SON') {
          if (enso === 'el-nino') {
            backgroundSummary = 'El Niño na primavera: SINAL MAIS ROBUSTO DO ANO no SESA. Jato Subtropical acelerado em 30°S, alta ciclogênese e SALLJ vigoroso (Grimm et al. 1998, 2000).';
            if (phase === 1 || phase === 2) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva bem acima da média no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Hemisfério Ocidental/Índico; fundo forte do El Niño impulsiona frentes.';
              synthesis = 'Precipitação expressiva no SESA garantida pelo forçamento sazonal de grande escala do El Niño.';
              citations = 'Grimm et al. (1998, 2000); Grimm (2003)';
            } else if (phase === 3 || phase === 4 || phase === 5) {
              impact = 'chuva_extrema';
              impactLabel = 'Extremos severos / Enchentes no SESA';
              sesaSignal = '+2';
              mjoTrigger = 'MJO no Índico/Continente Marítimo amplifica ciclogêneses e intensifica o SALLJ.';
              synthesis = 'REFORÇO CONSTRUTIVO MÁXIMO: Risco crítico de temporais severos, acumulados extremos e cheias históricas no SESA (Grimm et al. 2000; Grimm & Tedeschi 2009).';
              citations = 'Grimm et al. (1998, 2000); Grimm & Tedeschi (2009)';
            } else if (phase === 6 || phase === 7 || phase === 8) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva persistente no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Pacífico; onda MJO atenua ligeiramente, mas fundo do El Niño mantém chuvas.';
              synthesis = 'Acumulados continuam acima da média histórica devido à persistência do Jato Subtropical.';
              citations = 'Grimm et al. (2000)';
            }
          } else if (enso === 'la-nina') {
            backgroundSummary = 'La Niña na primavera: SECA SEVERA E PERSISTENTE no SESA. Jato deslocado para o sul, bloqueios frontais e SALLJ fraco (Grimm et al. 2000; Grimm 2004).';
            if (phase >= 1 && phase <= 6) {
              impact = 'seca_severa';
              impactLabel = 'Estiagem severa no SESA';
              sesaSignal = '-2';
              mjoTrigger = 'Fundo seco de La Niña bloqueia frentes; MJO não consegue reverter o déficit.';
              synthesis = 'Déficit hídrico pronunciado no Sul do Brasil e Uruguai. Frentes frias oceânicas de fraca atividade continental.';
              citations = 'Grimm et al. (2000); Grimm & Tedeschi (2009)';
            } else { // 7 e 8
              impact = 'seca_severa';
              impactLabel = 'Seca extrema no SESA | ZCAS precoce';
              sesaSignal = '-2';
              mjoTrigger = 'Onda PSA de La Niña drena toda a umidade para o centro-leste da América do Sul.';
              synthesis = 'Estiagem crítica no SESA acompanhada de ondas de calor. Toda a instabilidade fica concentrada na ZCAS precoce.';
              citations = 'Grimm et al. (2000); Alvarez et al. (2016)';
            }
          } else { // neutro
            backgroundSummary = 'Primavera Neutra: sem anomalia de TSM equatorial; variabilidade comandada pela MJO e sinótica (Grimm 2011).';
            if (phase === 1) {
              impact = 'chuva_moderada';
              impactLabel = 'Semana chuvosa no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'Convecção no Hemisfério Ocidental induz trem de ondas favorável ao SESA.';
              synthesis = 'Maior probabilidade de semana chuvosa no SESA na primavera neutra (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            } else if (phase === 7 || phase === 8) {
              impact = 'zcas_favoravel';
              impactLabel = 'Semana chuvosa na ZCAS precoce';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Pacífico oeste/Linha de Data favorece divergência sobre a ZCAS.';
              synthesis = 'Maior chance de semana chuvosa na ZCAS e menor atividade frontal no SESA (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            } else {
              impact = 'neutro';
              impactLabel = 'Climatologia de primavera';
              sesaSignal = '0';
              mjoTrigger = 'Convecção no Índico/Continente Marítimo em evolução regular.';
              synthesis = 'Passagens frontais e chuvas convectivas dentro dos padrões normais da estação.';
              citations = 'Grimm (2011)';
            }
          }
        }

        // 3. MAM (Outono - Memória e Transição do ENOS)
        else if (season === 'MAM') {
          if (enso === 'el-nino') {
            backgroundSummary = 'El Niño no outono: memória do evento quente mantém chuvas acima da média no Sul do Brasil (ano +1) até maio (Grimm et al. 2000).';
            if (phase >= 2 && phase <= 4) {
              impact = 'chuva_moderada';
              impactLabel = 'Chuva acima da média no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'MJO no Índico e Jato Subtropical residual sustentam frentes ativas.';
              synthesis = 'Persistência de eventos chuvosos no SESA no outono tardio do El Niño.';
              citations = 'Grimm et al. (2000)';
            } else {
              impact = 'neutro';
              impactLabel = 'Transição outonal no SESA';
              sesaSignal = '0';
              mjoTrigger = 'Enfraquecimento gradual do forçamento interanual.';
              synthesis = 'Acumulados próximos à média com passagens frontais regulares.';
              citations = 'Grimm et al. (2000)';
            }
          } else if (enso === 'la-nina') {
            backgroundSummary = 'La Niña no outono: término precoce das chuvas e persistência de déficit hídrico no SESA (Grimm et al. 2000).';
            if (phase === 7 || phase === 8) {
              impact = 'seca_moderada';
              impactLabel = 'Déficit de chuva no SESA';
              sesaSignal = '-1';
              mjoTrigger = 'Onda de alta pressão subtropical inibe precipitações frontais no SESA.';
              synthesis = 'Outono seco no SESA com entradas antecipadas de ar polar seco.';
              citations = 'Grimm et al. (2000)';
            } else {
              impact = 'neutro';
              impactLabel = 'Transição seca no SESA';
              sesaSignal = '0';
              mjoTrigger = 'MJO em trânsito com pouca amplificação em superfície.';
              synthesis = 'Condições ligeiramente abaixo da média climatológica.';
              citations = 'Grimm et al. (2000)';
            }
          } else { // neutro
            backgroundSummary = 'Outono Neutro: transição climatológica típica com frentes frias migratórias (Grimm 2011).';
            if (phase === 1) {
              impact = 'zcas_favoravel';
              impactLabel = 'Mais chance na ZCAS';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção tropical favorece convecção residual na ZCAS.';
              synthesis = 'Maior chance de semana chuvosa na ZCAS no outono (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            } else {
              impact = 'neutro';
              impactLabel = 'Climatologia de outono';
              sesaSignal = '0';
              mjoTrigger = 'Circulação de transição outonal.';
              synthesis = 'Precipitação em níveis climatológicos normais no SESA.';
              citations = 'Grimm (2011)';
            }
          }
        }

        // 4. JJA (Inverno - Dinâmica de Altos Níveis Dominante)
        else if (season === 'JJA') {
          if (enso === 'el-nino') {
            backgroundSummary = 'El Niño no inverno: Jato Subtropical zonalmente extenso em altos níveis (~27°S); frentes frequentes no RS/Uruguai (Grimm et al. 1998; Alvarez et al. 2013).';
            if (phase >= 2 && phase <= 4) {
              impact = 'chuva_moderada';
              impactLabel = 'Frentes ativas / Chuva no SESA';
              sesaSignal = '+1';
              mjoTrigger = 'MJO no Índico acelera o Jato Subtropical sobre o Rio Grande do Sul.';
              synthesis = 'Passagens frontais mais frequentes e chuvas moderadas no SESA.';
              citations = 'Grimm et al. (1998); Alvarez et al. (2013)';
            } else {
              impact = 'neutro';
              impactLabel = 'Inverno com frentes regulares';
              sesaSignal = '0';
              mjoTrigger = 'Circulação zonal de inverno.';
              synthesis = 'Chuvas dentro da média de inverno no SESA.';
              citations = 'Alvarez et al. (2013)';
            }
          } else if (enso === 'la-nina') {
            backgroundSummary = 'La Niña no inverno: Jato Subtropical mais fraco; massas de ar polar continentais secas (Grimm et al. 1998; Alvarez et al. 2013).';
            if (phase === 7 || phase === 8) {
              impact = 'seca_moderada';
              impactLabel = 'Inverno seco no SESA';
              sesaSignal = '-1';
              mjoTrigger = 'Crista anômala sobre o Atlântico Sul favorece bloqueios temporários.';
              synthesis = 'Menor precipitação frontal no SESA e madrugadas frias com geadas.';
              citations = 'Grimm et al. (1998); Alvarez et al. (2013)';
            } else {
              impact = 'neutro';
              impactLabel = 'Climatologia fria e seca';
              sesaSignal = '0';
              mjoTrigger = 'Dinâmica sinótica de inverno.';
              synthesis = 'Condições normais a ligeiramente secas no SESA.';
              citations = 'Alvarez et al. (2013)';
            }
          } else { // neutro
            backgroundSummary = 'Inverno Neutro: altos níveis dominam a dinâmica atmosférica (Alvarez et al. 2013).';
            if (phase === 8) {
              impact = 'zcas_favoravel';
              impactLabel = 'Mais chance na ZCAS';
              sesaSignal = '-1';
              mjoTrigger = 'Convecção no Pacífico leste excita onda favorável à ZCAS oceânica.';
              synthesis = 'Maior chance de semana chuvosa na ZCAS no inverno (Alvarez et al. 2016).';
              citations = 'Alvarez et al. (2016)';
            } else {
              impact = 'neutro';
              impactLabel = 'Climatologia de inverno';
              sesaSignal = '0';
              mjoTrigger = 'Jato Subtropical em posição climatológica média.';
              synthesis = 'Passagens frontais e chuvas dentro das médias históricas.';
              citations = 'Alvarez et al. (2013)';
            }
          }
        }

        // Verificar se coincide com evento curado ("Eventos de Interesse")
        // Casos como DJF-alvarez-3-4 abrangem fase 3 e 4 no neutro
        let isCurated = false;
        let curatedInfo = null;

        if (CURATED_BENCHMARKS[key]) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS[key];
        } else if (season === 'DJF' && enso === 'neutro' && (phase === 3 || phase === 4)) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS['DJF-alvarez-3-4'];
        } else if (season === 'DJF' && enso === 'neutro' && (phase === 8 || phase === 1)) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS['DJF-alvarez-8-1'];
        } else if (season === 'MAM' && enso === 'neutro' && phase === 1) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS['MAM-alvarez-1'];
        } else if (season === 'JJA' && enso === 'neutro' && phase === 8) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS['JJA-alvarez-8'];
        } else if (season === 'SON' && enso === 'neutro' && (phase === 7 || phase === 8)) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS['SON-alvarez-7-8'];
        } else if (season === 'SON' && enso === 'neutro' && phase === 1) {
          isCurated = true;
          curatedInfo = CURATED_BENCHMARKS['SON-alvarez-1'];
        }

        let signalCategory = 'neutro_climatologia';
        if (sesaSignal === '+2') signalCategory = 'muito_acima';
        else if (sesaSignal === '+1') signalCategory = 'acima';
        else if (sesaSignal === '-1') signalCategory = 'abaixo';
        else if (sesaSignal === '-2') signalCategory = 'muito_abaixo';

        GRIMM_96_MATRIX[key] = {
          id: key,
          key,
          season,
          enso,
          phase,
          phaseName: PHASE_NAMES[phase],
          impact,
          impactLabel,
          sesaSignal,
          signalCategory,
          backgroundSummary,
          mjoTrigger,
          synthesis,
          citations: Array.isArray(citations) ? citations : (typeof citations === 'string' ? citations.split(';').map(s => s.trim()).filter(Boolean) : []),
          isCurated,
          curatedId: curatedInfo ? curatedInfo.id : null,
          curatedTitle: curatedInfo ? curatedInfo.title : null,
          curatedAuthor: curatedInfo ? curatedInfo.author : null,
          curatedDoi: curatedInfo ? curatedInfo.doi : null
        };
      }
    }
  }
})();

function getGrimmPermutation(season, enso, phase) {
  const k = `${season}-${enso}-${Number(phase)}`;
  return GRIMM_96_MATRIX[k] || null;
}

function getGrimmSeasonMatrix(season) {
  const list = [];
  const ENSOS = ['la-nina', 'neutro', 'el-nino'];
  for (let p = 1; p <= 8; p++) {
    for (const e of ENSOS) {
      const item = getGrimmPermutation(season, e, p);
      if (item) list.push(item);
    }
  }
  return list;
}

function getAllGrimmPermutations() {
  return Object.values(GRIMM_96_MATRIX);
}

if (typeof window !== 'undefined') {
  window.GRIMM_96_MATRIX = GRIMM_96_MATRIX;
  window.getGrimmPermutation = getGrimmPermutation;
  window.getGrimmSeasonMatrix = getGrimmSeasonMatrix;
  window.getAllGrimmPermutations = getAllGrimmPermutations;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GRIMM_96_MATRIX,
    getGrimmPermutation,
    getGrimmSeasonMatrix,
    getAllGrimmPermutations
  };
}
