import React, { useState } from 'react';
import {
  Calculator,
  Droplet,
  Pill,
  Activity,
  Heart,
  FileCheck2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const DosageCalculatorModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drip' | 'dilution' | 'penicillin' | 'vitals' | 'formulas'>('drip');

  // --- 1. Drip Rate State ---
  const [volume, setVolume] = useState<string>('500'); // mL
  const [time, setTime] = useState<string>('8'); // Horas
  const [timeUnit, setTimeUnit] = useState<'hours' | 'minutes'>('hours');
  const [equipmentType, setEquipmentType] = useState<'macrogotas' | 'microgotas'>('macrogotas');

  // --- 2. Redilution State ---
  const [availableMg, setAvailableMg] = useState<string>('500'); // ex: 500 mg
  const [availableMl, setAvailableMl] = useState<string>('5'); // em 5 mL
  const [prescribedMg, setPrescribedMg] = useState<string>('250'); // Prescrição: 250 mg

  // --- 3. Penicillin State ---
  const [vialType, setVialType] = useState<'5m' | '10m'>('5m'); // 5M ou 10M UI
  const [waterVolume, setWaterVolume] = useState<string>('8'); // 8 mL
  const [prescribedUi, setPrescribedUi] = useState<string>('2000000'); // 2.000.000 UI

  // --- 4. Vitals & BMI State ---
  const [sys, setSys] = useState<string>('120');
  const [dia, setDia] = useState<string>('80');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('1.70');

  // --- Calculations ---

  // 1. Drip Calculation
  const calculateDrip = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time);

    if (isNaN(v) || isNaN(t) || v <= 0 || t <= 0) return null;

    if (timeUnit === 'hours') {
      if (equipmentType === 'macrogotas') {
        const result = v / (3 * t); // gtt/min
        return {
          rate: Math.round(result * 10) / 10,
          rounded: Math.round(result),
          formula: 'Gotas/min = Volume (mL) ÷ (3 × Tempo em horas)',
          explanation: `Para correr ${v} mL em ${t} horas em equipo macrogotas, ajuste o gotejamento para aproximadamente ${Math.round(result)} gotas por minuto.`
        };
      } else {
        const result = v / t; // mcgtt/min
        return {
          rate: Math.round(result * 10) / 10,
          rounded: Math.round(result),
          formula: 'Microgotas/min = Volume (mL) ÷ Tempo em horas',
          explanation: `Para correr ${v} mL em ${t} horas em equipo microgotas, ajuste para ${Math.round(result)} microgotas por minuto.`
        };
      }
    } else {
      // Minutes
      if (equipmentType === 'macrogotas') {
        const result = (v * 20) / t;
        return {
          rate: Math.round(result * 10) / 10,
          rounded: Math.round(result),
          formula: 'Gotas/min = (Volume × 20) ÷ Tempo em minutos',
          explanation: `Para correr ${v} mL em ${t} minutos em equipo macrogotas, ajuste para ${Math.round(result)} gotas por minuto.`
        };
      } else {
        const result = (v * 60) / t;
        return {
          rate: Math.round(result * 10) / 10,
          rounded: Math.round(result),
          formula: 'Microgotas/min = (Volume × 60) ÷ Tempo em minutos',
          explanation: `Para correr ${v} mL em ${t} minutos em equipo microgotas, ajuste para ${Math.round(result)} microgotas por minuto.`
        };
      }
    }
  };

  // 2. Redilution Calculation
  const calculateRedilution = () => {
    const availM = parseFloat(availableMg);
    const availV = parseFloat(availableMl);
    const prescM = parseFloat(prescribedMg);

    if (isNaN(availM) || isNaN(availV) || isNaN(prescM) || availM <= 0 || availV <= 0 || prescM <= 0) return null;

    // Regra de três: (prescM * availV) / availM
    const resultMl = (prescM * availV) / availM;

    return {
      volumeToAdminister: Math.round(resultMl * 100) / 100,
      formula: `${availM} mg -------- ${availV} mL\n${prescM} mg -------- X mL`,
      explanation: `Aspire exatamente ${Math.round(resultMl * 100) / 100} mL da solução diluída para cumprir a prescrição médica de ${prescM} mg.`
    };
  };

  // 3. Penicillin Calculation
  const calculatePenicillin = () => {
    const pUi = parseFloat(prescribedUi);
    const wVol = parseFloat(waterVolume) || 8;

    if (isNaN(pUi) || pUi <= 0) return null;

    // 5M UI tem 2 mL de pó (volume total = wVol + 2)
    // 10M UI tem 4 mL de pó (volume total = wVol + 4)
    const powderVol = vialType === '5m' ? 2 : 4;
    const totalVialUi = vialType === '5m' ? 5000000 : 10000000;
    const totalSolVol = wVol + powderVol;

    // Regra de três
    const resultMl = (pUi * totalSolVol) / totalVialUi;

    return {
      resultMl: Math.round(resultMl * 100) / 100,
      totalSolVol,
      powderVol,
      formula: `${totalVialUi.toLocaleString()} UI -------- ${totalSolVol} mL (${wVol}mL AD + ${powderVol}mL pó)\n${pUi.toLocaleString()} UI -------- X mL`,
      explanation: `Ao adicionar ${wVol} mL de Água Destilada ao frasco de ${vialType === '5m' ? '5.000.000' : '10.000.000'} UI (que tem ${powderVol} mL de pó), o volume total fica ${totalSolVol} mL. Para aplicar ${pUi.toLocaleString()} UI, aspire ${Math.round(resultMl * 100) / 100} mL.`
    };
  };

  // 4. Vitals & BMI
  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;

    const bmi = w / (h * h);
    let category = '';

    if (bmi < 18.5) category = 'Abaixo do Peso';
    else if (bmi < 24.9) category = 'Eutrófico (Peso Normal)';
    else if (bmi < 29.9) category = 'Sobrepeso (Pré-obesidade)';
    else if (bmi < 34.9) category = 'Obesidade Grau I';
    else if (bmi < 39.9) category = 'Obesidade Grau II';
    else category = 'Obesidade Grau III (Mórbida)';

    return {
      bmi: Math.round(bmi * 10) / 10,
      category
    };
  };

  const classifyBP = () => {
    const s = parseInt(sys, 10);
    const d = parseInt(dia, 10);

    if (isNaN(s) || isNaN(d)) return null;

    if (s < 120 && d < 80) return { classification: 'Ótima / Normal', color: 'text-emerald-600 dark:text-emerald-400' };
    if (s <= 129 && d <= 84) return { classification: 'Normotensa', color: 'text-teal-600 dark:text-teal-400' };
    if (s <= 139 || d <= 89) return { classification: 'Pré-hipertensão / Limítrofe', color: 'text-amber-600 dark:text-amber-400' };
    if (s <= 159 || d <= 99) return { classification: 'Hipertensão Estágio 1', color: 'text-orange-600 dark:text-orange-400' };
    if (s <= 179 || d <= 109) return { classification: 'Hipertensão Estágio 2', color: 'text-red-600 dark:text-red-400' };
    return { classification: 'Crise Hipertensiva (Estágio 3 / Emergência)', color: 'text-red-700 dark:text-red-500' };
  };

  const dripResult = calculateDrip();
  const redilutionResult = calculateRedilution();
  const penicillinResult = calculatePenicillin();
  const bmiResult = calculateBMI();
  const bpResult = classifyBP();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Ferramenta Clínica Prática</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Calculadora de Medicamentos & Doses
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              Cálculo exato de gotejamento de soro, regra de três, rediluição de ampolas e frasco de penicilina cristalina com passo a passo didático para provas e prática clínica.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-2 rounded-2xl border border-rose-100 shadow-2xs">
        <button
          onClick={() => setActiveTab('drip')}
          className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'drip'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Gotejamento</span>
        </button>

        <button
          onClick={() => setActiveTab('dilution')}
          className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'dilution'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Regra de 3</span>
        </button>

        <button
          onClick={() => setActiveTab('penicillin')}
          className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'penicillin'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Penicilina</span>
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'vitals'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>IMC & Vitais</span>
        </button>

        <button
          onClick={() => setActiveTab('formulas')}
          className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1.5 col-span-2 sm:col-span-1 ${
            activeTab === 'formulas'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Escalas & Fórmulas</span>
        </button>
      </div>

      {/* Tab 1: Drip Calculator */}
      {activeTab === 'drip' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-rose-600" />
              <span>Cálculo de Gotejamento de Soro</span>
            </h3>

            <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              {/* Volume */}
              <div>
                <label className="block mb-1">Volume da Solução (mL)</label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Time & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Tempo de Infusão</label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Ex: 8"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Unidade de Tempo</label>
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-bold"
                  >
                    <option value="hours">Horas (h)</option>
                    <option value="minutes">Minutos (min)</option>
                  </select>
                </div>
              </div>

              {/* Equipo Type */}
              <div>
                <label className="block mb-1">Tipo de Equipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEquipmentType('macrogotas')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all ${
                      equipmentType === 'macrogotas'
                        ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-600 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Macrogotas (Gotas/min)
                  </button>

                  <button
                    type="button"
                    onClick={() => setEquipmentType('microgotas')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all ${
                      equipmentType === 'microgotas'
                        ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-600 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Microgotas (mcgtt/min)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Resultado do Cálculo</span>
            </h4>

            {dripResult ? (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-rose-50 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Velocidade de Infusão</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-rose-600 dark:text-rose-400 font-display">
                    {dripResult.rounded}{' '}
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {equipmentType === 'macrogotas' ? 'gotas/min' : 'microgotas/min'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    (Valor exato calculado: {dripResult.rate})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-white flex items-center space-x-1">
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    <span>Fórmula Utilizada:</span>
                  </p>
                  <code className="block bg-slate-200 dark:bg-slate-800 p-2 rounded-lg font-mono text-slate-800 dark:text-slate-200 font-bold">
                    {dripResult.formula}
                  </code>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {dripResult.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs font-bold">
                Preencha o volume e tempo válidos para calcular o gotejamento.
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
              💡 <strong>Dica COFEN:</strong> 1 gota é igual a exatamente 3 microgotas (1 gtt = 3 mcgtt).
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Redilution / Rule of Three */}
      {activeTab === 'dilution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Pill className="w-5 h-5 text-rose-600" />
              <span>Regra de Três & Rediluição de Ampola</span>
            </h3>

            <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Dose Disponível (mg/g/UI)</label>
                  <input
                    type="number"
                    value={availableMg}
                    onChange={(e) => setAvailableMg(e.target.value)}
                    placeholder="Ex: 500"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block mb-1">Volume de Diluição (mL)</label>
                  <input
                    type="number"
                    value={availableMl}
                    onChange={(e) => setAvailableMl(e.target.value)}
                    placeholder="Ex: 5"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Dose Prescrita pelo Médico (mg/g/UI)</label>
                <input
                  type="number"
                  value={prescribedMg}
                  onChange={(e) => setPrescribedMg(e.target.value)}
                  placeholder="Ex: 250"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Volume a Aspirar na Seringa</span>
            </h4>

            {redilutionResult ? (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-rose-50 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Volume Exato a Aspirar</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-rose-600 dark:text-rose-400 font-display">
                    {redilutionResult.volumeToAdminister}{' '}
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">mL</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-white">Montagem da Regra de 3:</p>
                  <pre className="bg-slate-200 dark:bg-slate-800 p-3 rounded-lg font-mono text-slate-800 dark:text-slate-200 font-bold whitespace-pre-line">
                    {redilutionResult.formula}
                  </pre>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {redilutionResult.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs font-bold">
                Preencha as dosagens para calcular o volume exato a aspirar.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Penicillin */}
      {activeTab === 'penicillin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>Cálculo de Penicilina Cristalina (Frasco-Ampola)</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Importante: O pó da Penicilina ocupa volume no frasco! <strong>5.000.000 UI = 2 mL de pó</strong>. <strong>10.000.000 UI = 4 mL de pó</strong>.
            </p>

            <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1">Apresentação do Frasco-Ampola</label>
                <select
                  value={vialType}
                  onChange={(e) => setVialType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
                >
                  <option value="5m">5.000.000 UI (2 mL de pó)</option>
                  <option value="10m">10.000.000 UI (4 mL de pó)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Volume de Água Destilada Injetada (AD em mL)</label>
                <input
                  type="number"
                  value={waterVolume}
                  onChange={(e) => setWaterVolume(e.target.value)}
                  placeholder="Ex: 8 mL de AD (gera 10mL no frasco)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block mb-1">Prescrição Médica (UI)</label>
                <input
                  type="number"
                  value={prescribedUi}
                  onChange={(e) => setPrescribedUi(e.target.value)}
                  placeholder="Ex: 2000000"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Resultado Penicilina</span>
            </h4>

            {penicillinResult ? (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-rose-50 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Aspirar do Frasco</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-rose-600 dark:text-rose-400 font-display">
                    {penicillinResult.resultMl}{' '}
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">mL</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Volume total da solução no frasco: {penicillinResult.totalSolVol} mL ({penicillinResult.powderVol} mL de pó)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <p className="font-extrabold text-slate-900 dark:text-white">Cálculo:</p>
                  <pre className="bg-slate-200 dark:bg-slate-800 p-3 rounded-lg font-mono text-slate-800 dark:text-slate-200 font-bold whitespace-pre-line">
                    {penicillinResult.formula}
                  </pre>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {penicillinResult.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs font-bold">
                Preencha os dados do frasco para calcular a penicilina.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Vitals & BMI */}
      {activeTab === 'vitals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BP Class */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-600" />
              <span>Classificação de Pressão Arterial (PA)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1">Sistólica PAS (mmHg)</label>
                <input
                  type="number"
                  value={sys}
                  onChange={(e) => setSys(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Diastólica PAD (mmHg)</label>
                <input
                  type="number"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {bpResult && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <p className="text-xs font-bold text-slate-500">Classificação Geral (Diretrizes SBC):</p>
                <p className={`text-xl font-extrabold ${bpResult.color}`}>
                  {bpResult.classification}
                </p>
              </div>
            )}
          </div>

          {/* BMI */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>Calculadora de IMC (Índice de Massa Corporal)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Altura (m, ex: 1.70)</label>
                <input
                  type="number"
                  step="0.01"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {bmiResult && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <p className="text-xs font-bold text-slate-500">Resultado IMC:</p>
                <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-display">
                  {bmiResult.bmi} kg/m²
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {bmiResult.category}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Formulas & Reference Scales */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gotejamento & Conversões */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-rose-600" />
                <span>Resumo de Fórmulas de Gotejamento</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">1. Em HORAS (Macrogotas/min):</p>
                  <p className="text-slate-700 font-mono mt-1 font-bold">Gotas/min = Volume (mL) ÷ (3 × Tempo em horas)</p>
                </div>

                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">2. Em HORAS (Microgotas/min):</p>
                  <p className="text-slate-700 font-mono mt-1 font-bold">Microgotas/min = Volume (mL) ÷ Tempo em horas</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="font-extrabold text-slate-800">3. Em MINUTOS:</p>
                  <p className="text-slate-600 font-mono mt-1">Macrogotas = (Volume × 20) ÷ Tempo em min</p>
                  <p className="text-slate-600 font-mono mt-0.5">Microgotas = (Volume × 60) ÷ Tempo em min</p>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-semibold">
                  <p className="font-extrabold text-amber-950">💡 Equivalências de Ouro para Provas:</p>
                  <p className="mt-1">1 mL = 20 macrogotas = 60 microgotas</p>
                  <p>1 macrogota = 3 microgotas</p>
                </div>
              </div>
            </div>

            {/* Penicilina Cristalina */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Pill className="w-5 h-5 text-rose-600" />
                <span>Penicilina Cristalina (Soluto/Solvente)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">Frasco de 5.000.000 UI:</p>
                  <p className="text-slate-700 mt-1">O pó (soluto) equivale a <strong>2 mL</strong>. Ao adicionar 8 mL de AD (solvente), obtém-se o volume total de <strong>10 mL</strong>.</p>
                </div>

                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">Frasco de 10.000.000 UI:</p>
                  <p className="text-slate-700 mt-1">O pó (soluto) equivale a <strong>4 mL</strong>. Ao adicionar 6 mL de AD (solvente), obtém-se o volume total de <strong>10 mL</strong>.</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-semibold">
                  <p className="font-extrabold text-emerald-950">✅ Regra Prática de Cálculo:</p>
                  <p className="mt-1 font-mono text-[11px]">5.000.000 UI ------ 10 mL (Volume Final)</p>
                  <p className="font-mono text-[11px]">Dose Prescrita ------ X mL</p>
                </div>
              </div>
            </div>

          </div>

          {/* Escala de Coma de Glasgow & Regra dos 9 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Glasgow */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-rose-600" />
                <span>Escala de Coma de Glasgow (3 a 15)</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-rose-700">Abertura Ocular (1-4):</strong> Espontânea (4), Ao comando (3), À dor (2), Ausente (1).
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-rose-700">Resposta Verbal (1-5):</strong> Orientado (5), Confuso (4), Palavras desconexas (3), Sons incompreensíveis (2), Ausente (1).
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-rose-700">Resposta Motora (1-6):</strong> Obedece comandos (6), Localiza dor (5), Flexão normal/retirada (4), Flexão anormal/decorticação (3), Extensão/descerebração (2), Ausente (1).
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold">
                  <span>Reatividade Pupilar (-2 a 0): Ambas reagem (0), Uma reage (-1), Nenhuma reage (-2).</span>
                </div>
              </div>
            </div>

            {/* Sinais Vitais Referência */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <span>Valores de Referência de SSVV (Adulto)</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">Pressão Arterial (PA)</p>
                  <p className="text-slate-700 font-bold mt-0.5">Ótima: &lt; 120 / 80 mmHg</p>
                  <p className="text-slate-500 text-[10px]">Normotenso / Hipertenso</p>
                </div>

                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">Frequência Cardíaca (FC)</p>
                  <p className="text-slate-700 font-bold mt-0.5">60 a 100 bpm (Normocardia)</p>
                  <p className="text-slate-500 text-[10px]">Bradicardia &lt; 60 | Taquicardia &gt; 100</p>
                </div>

                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">Frequência Respiratória</p>
                  <p className="text-slate-700 font-bold mt-0.5">12 a 20 irpm (Eupneico)</p>
                  <p className="text-slate-500 text-[10px]">Bradipneico &lt; 12 | Taquipneico &gt; 20</p>
                </div>

                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200">
                  <p className="font-extrabold text-rose-900">Temperatura (T)</p>
                  <p className="text-slate-700 font-bold mt-0.5">36,1 ºC a 37,2 ºC (Afebril)</p>
                  <p className="text-slate-500 text-[10px]">Subfebril 37,3-37,7 | Febril ≥ 37,8 ºC</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
