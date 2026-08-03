import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Sparkles,
  UserCheck,
  Activity,
  Droplet,
  HeartPulse,
  Send,
  Loader2,
  BookOpen,
  Search,
  Bookmark,
  Save,
  Trash2,
  Plus,
  HelpCircle,
  FolderPlus
} from 'lucide-react';
import { askTutorAI } from '../services/geminiService';

interface TechTerm {
  term: string;
  definition: string;
  category: 'Geral' | 'Sinais Vitais' | 'Dispositivos & Acessos' | 'Pele & Feridas' | 'Sistemas';
}

const NURSING_DICTIONARY: TechTerm[] = [
  { term: 'Algidez', definition: 'Frieza intensa das extremidades e superfície corporal devido à vasoconstrição ou hipotermia.', category: 'Sinais Vitais' },
  { term: 'Anúria', definition: 'Ausência total de urina ou volume urinário inferior a 100 mL nas 24 horas.', category: 'Sistemas' },
  { term: 'Disúria', definition: 'Sensação de dor, ardor ou queimação durante a micção.', category: 'Sistemas' },
  { term: 'Epistaxe', definition: 'Hemorragia nasal por rompimento de vasos da mucosa nasal.', category: 'Sistemas' },
  { term: 'Paresia', definition: 'Perda parcial ou diminuição moderada da força muscular.', category: 'Sistemas' },
  { term: 'Plegia', definition: 'Perda total da força muscular (paralisia completa).', category: 'Sistemas' },
  { term: 'SVD', definition: 'Sonda Vesical de Demora (cateterismo urinário de alívio contínuo com balão).', category: 'Dispositivos & Acessos' },
  { term: 'SNG / SNE', definition: 'Sonda Nasogástrica / Sonda Nasoentérica (utilizada para alimentação, drenagem ou descompressão).', category: 'Dispositivos & Acessos' },
  { term: 'AVP / CVC', definition: 'Acesso Venoso Periférico / Cateter Venoso Central.', category: 'Dispositivos & Acessos' },
  { term: 'Taquipneia', definition: 'Frequência respiratória acelerada (superior a 20 irpm em adultos).', category: 'Sinais Vitais' },
  { term: 'Bradipneia', definition: 'Frequência respiratória lentificada (inferior a 12 irpm em adultos).', category: 'Sinais Vitais' },
  { term: 'Eupneia', definition: 'Respiração normal, ritmada e sem esforço (12 a 20 irpm em adulto).', category: 'Sinais Vitais' },
  { term: 'Taquicardia', definition: 'Frequência cardíaca elevada (superior a 100 bpm em adulto).', category: 'Sinais Vitais' },
  { term: 'Bradicardia', definition: 'Frequência cardíaca lentificada (inferior a 60 bpm em adulto).', category: 'Sinais Vitais' },
  { term: 'Melena', definition: 'Evacuação de sangue digerido, de cor escura (aspecto de borra de café) e odor extremamente fétido.', category: 'Sistemas' },
  { term: 'Turgor Cutâneo', definition: 'Elasticidade e grau de hidratação da pele (avaliado por prega cutânea).', category: 'Pele & Feridas' },
  { term: 'Sinais Flogísticos', definition: 'Sinais clássicos da inflamação: Dor, Calor, Rubor (vermelhidão), Edema (inchaço) e Perda de Função.', category: 'Pele & Feridas' },
  { term: 'Exantema', definition: 'Erupção cutânea eritematosa (vermelhidão generalizada na pele).', category: 'Pele & Feridas' },
  { term: 'Enantema', definition: 'Erupção ou lesão avermelhada localizada em mucosas.', category: 'Pele & Feridas' },
  { term: 'Hematêmese', definition: 'Vômito acompanhado de sangue vivo proveniente do trato gastrointestinal alto.', category: 'Sistemas' },
  { term: 'Hemoptise', definition: 'Eliminação de sangue vindo das vias aéreas inferiores durante a tosse.', category: 'Sistemas' },
  { term: 'Icterícia', definition: 'Coloração amarelada da pele, mucosas e escleras ocular por aumento de bilirrubina.', category: 'Pele & Feridas' },
  { term: 'Cianose', definition: 'Coloração azulada/arroxeada da pele ou extremidades devido à oxigenação insuficiente (hipóxia).', category: 'Sinais Vitais' },
  { term: 'Disfagia', definition: 'Dificuldade para deglutir/engolir alimentos ou líquidos.', category: 'Sistemas' },
  { term: 'Odinofagia', definition: 'Sensação de dor ao engolir/deglutir.', category: 'Sistemas' },
  { term: 'Oligúria', definition: 'Diminuição do débito urinário (entre 100 mL e 500 mL em 24h).', category: 'Sistemas' },
  { term: 'Poliúria', definition: 'Produção excessiva e anormal de urina (superior a 2.500 mL em 24h).', category: 'Sistemas' },
  { term: 'Ortopneia', definition: 'Dificuldade respiratória intensa na posição deitada, aliviada ao se sentar ou elevar a cabeceira.', category: 'Sinais Vitais' },
  { term: 'Nictúria', definition: 'Necessidade frequente de acordar durante a noite para urinar.', category: 'Sistemas' },
  { term: 'Prurido', definition: 'Sensação desagradável na pele que provoca o desejo de coçar (coceira).', category: 'Pele & Feridas' },
  { term: 'Precórdio', definition: 'Região da parede torácica correspondente à projeção anatômica do coração.', category: 'Geral' },
  { term: 'Decúbito', definition: 'Posição do corpo deitado (ex: Decúbito Dorsal, Decúbito Lateral Direiro/Esquerdo, Decúbito Ventral).', category: 'Geral' }
];

interface UserTemplate {
  id: string;
  name: string;
  patientInitials: string;
  bedNumber: string;
  consciousness: string;
  respiration: string;
  pa: string;
  fc: string;
  fr: string;
  temp: string;
  spo2: string;
  access: string;
  diet: string;
  elimination: string;
  skin: string;
  complaints: string;
  interventions: string;
}

export const NursingNotesModule: React.FC = () => {
  // Form fields
  const [patientInitials, setPatientInitials] = useState<string>('J.S.');
  const [bedNumber, setBedNumber] = useState<string>('Leito 12B');
  const [consciousness, setConsciousness] = useState<string>('Consciente, orientado em tempo e espaço');
  const [respiration, setRespiration] = useState<string>('Eupneico em ar ambiente');
  
  // Vitals
  const [pa, setPa] = useState<string>('120x80');
  const [fc, setFc] = useState<string>('78');
  const [fr, setFr] = useState<string>('18');
  const [temp, setTemp] = useState<string>('36.5');
  const [spo2, setSpo2] = useState<string>('98');

  // Care
  const [access, setAccess] = useState<string>('Acesso venoso periférico em MSE salinizado sem sinais flogísticos');
  const [diet, setDiet] = useState<string>('Dieta oral bem aceita');
  const [elimination, setElimination] = useState<string>('Diurese presente e espontânea, evacuação ausente');
  const [skin, setSkin] = useState<string>('Pele íntegra, corada e hidratada');
  const [complaints, setComplaints] = useState<string>('Sem queixas álgicas no momento');
  const [interventions, setInterventions] = useState<string>('Realizada medicação prescrita, mantidos cuidados de enfermagem e grades elevadas.');

  // Professional Signature Details
  const [nurseName, setNurseName] = useState<string>('Enf. Laercio Ricardo');
  const [corenId, setCorenId] = useState<string>('COREN-SP 123.456-ENF');
  const [hospitalName, setHospitalName] = useState<string>('Hospital das Clínicas / Unidade de Internação');

  // Generated Text State
  const [generatedNote, setGeneratedNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [aiReview, setAiReview] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Dictionary State
  const [dictSearch, setDictSearch] = useState<string>('');
  const [selectedDictCat, setSelectedDictCat] = useState<string>('Todas');
  const [showDictionary, setShowDictionary] = useState<boolean>(false);

  // Custom User Templates State
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('enfermagem_user_templates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);
  const [newTemplateName, setNewTemplateName] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('enfermagem_user_templates', JSON.stringify(userTemplates));
    } catch (err) {
      console.error(err);
    }
  }, [userTemplates]);

  const handleSaveUserTemplate = () => {
    if (!newTemplateName.trim()) return;
    const newTpl: UserTemplate = {
      id: `tpl-${Date.now()}`,
      name: newTemplateName.trim(),
      patientInitials,
      bedNumber,
      consciousness,
      respiration,
      pa,
      fc,
      fr,
      temp,
      spo2,
      access,
      diet,
      elimination,
      skin,
      complaints,
      interventions,
    };
    setUserTemplates((prev) => [...prev, newTpl]);
    setNewTemplateName('');
    setShowSaveTemplateModal(false);
  };

  const applyUserTemplate = (tpl: UserTemplate) => {
    setPatientInitials(tpl.patientInitials);
    setBedNumber(tpl.bedNumber);
    setConsciousness(tpl.consciousness);
    setRespiration(tpl.respiration);
    setPa(tpl.pa);
    setFc(tpl.fc);
    setFr(tpl.fr);
    setTemp(tpl.temp);
    setSpo2(tpl.spo2);
    setAccess(tpl.access);
    setDiet(tpl.diet);
    setElimination(tpl.elimination);
    setSkin(tpl.skin);
    setComplaints(tpl.complaints);
    setInterventions(tpl.interventions);
  };

  const handleDeleteUserTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const applyPreset = (preset: 'admission' | 'postop' | 'handoff' | 'routine') => {
    if (preset === 'admission') {
      setPatientInitials('M.R.');
      setBedNumber('Leito 04A - Clínica Médica');
      setConsciousness('Consciente, orientado em tempo e espaço, vígil');
      setRespiration('Eupneico em ar ambiente, sem esforço respiratório');
      setPa('120x80');
      setFc('76');
      setFr('16');
      setTemp('36.6');
      setSpo2('98');
      setAccess('Puncionado AVP em MSE com abocath 20G salinizado sem sinais flogísticos');
      setDiet('Jejum para exames admissionais');
      setElimination('Diurese espontânea e clara, evacuação ausente hoje');
      setSkin('Pele íntegra, corada, turgor e elasticidade preservados');
      setComplaints('Refere leve ansiedade em virtude do internamento');
      setInterventions('Instalada pulseira de identificação, orientados paciente e acompanhante quanto às normas da unidade e risco de queda.');
    } else if (preset === 'postop') {
      setPatientInitials('A.S.');
      setBedNumber('Leito 12 - RPA / Pós-Operatório');
      setConsciousness('Sonolento porém responsivo ao chamado verbal, orientado');
      setRespiration('Eupneico sob cateter nasal de O2 a 2 L/min');
      setPa('110x70');
      setFc('82');
      setFr('18');
      setTemp('36.2');
      setSpo2('99');
      setAccess('AVP em MSD com Soro Fisiológico 0.9% 500mL em curso a 21 gtt/min');
      setDiet('Jejum absoluto pós-operatório');
      setElimination('Diurese presente via SVD (Sonda Vesical de Demora) aspecto colúrico, 350mL no coletor');
      setSkin('Curativo operatório em abdome limpo, seco e oclusivo sem sangramento ativo');
      setComplaints('Queixa dor moderada em FO (EVA = 4/10)');
      setInterventions('Administrado analgésico conforme prescrição médica às 14h. Mantido aquecido com manta térmica, monitorização contínua e grades elevadas.');
    } else if (preset === 'handoff') {
      setPatientInitials('C.E.');
      setBedNumber('Leito 08 - Enfermaria');
      setConsciousness('Consciente, calmo, orientado');
      setRespiration('Eupneico em ar ambiente');
      setPa('130x85');
      setFc('74');
      setFr('17');
      setTemp('36.5');
      setSpo2('97');
      setAccess('AVP em MIE salinizado, permeável, sem edema');
      setDiet('Dieta branda com boa aceitação aceita mais de 80%');
      setElimination('Diurese e evacuação presentes e de aspecto normal');
      setSkin('Pele corada, sem lesões por pressão');
      setComplaints('Sem queixas álgicas no momento');
      setInterventions('Passagem de plantão sem intercorrências no período. Cuidados gerais de enfermagem mantidos.');
    } else if (preset === 'routine') {
      setPatientInitials('J.S.');
      setBedNumber('Leito 12B');
      setConsciousness('Consciente, orientado em tempo e espaço');
      setRespiration('Eupneico em ar ambiente');
      setPa('120x80');
      setFc('78');
      setFr('18');
      setTemp('36.5');
      setSpo2('98');
      setAccess('Acesso venoso periférico em MSE salinizado sem sinais flogísticos');
      setDiet('Dieta oral bem aceita');
      setElimination('Diurese presente e espontânea, evacuação ausente');
      setSkin('Pele íntegra, corada e hidratada');
      setComplaints('Sem queixas álgicas no momento');
      setInterventions('Realizada medicação prescrita, mantidos cuidados de enfermagem e grades elevadas.');
    }
  };

  const handleGenerate = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateToday = new Date().toLocaleDateString('pt-BR');
    const noteText = `[${dateToday} - ${timeNow}h] UNIDADE: ${hospitalName}\nPATIENTE: ${patientInitials} | ${bedNumber}\n\nANOTAÇÃO DE ENFERMAGEM:\n${timeNow}h - Paciente ${patientInitials} (${bedNumber}), ${consciousness}, ${respiration}. SSVV: PA=${pa} mmHg, FC=${fc} bpm, FR=${fr} irpm, T=${temp} ºC, SpO2=${spo2}%. ${access}. ${diet}. ${elimination}. ${skin}. ${complaints}. ${interventions}\n\n_______________________________________\nAssinatura Profissional: ${nurseName}\nRegistro Profissional: ${corenId}`;
    
    setGeneratedNote(noteText);
    setCopied(false);
    setAiReview('');
  };

  const handleCopy = () => {
    if (!generatedNote) return;
    navigator.clipboard.writeText(generatedNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAiReview = async () => {
    if (!generatedNote || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const prompt = `Por favor, atue como Enfermeiro Mestre e revise esta Anotação de Enfermagem quanto ao padrão legal COFEN/COREN, terminologia técnica médica, clareza e precisão:\n\n"${generatedNote}"\n\nDê feedback construtivo e, se necessário, sugira a versão aprimorada.`;
      const reply = await askTutorAI(prompt, []);
      setAiReview(reply);
    } catch (err) {
      setAiReview('Tivemos um problema ao conectar com a IA para revisão. Verifique sua conexão.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Gerador e Padronizador COFEN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Gerador de Anotação de Enfermagem
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              Monte prontuários e evoluções de enfermagem padronizados com termos técnicos adequados em segundos. Exporte, imprima ou solicite revisão pedagógica da IA.
            </p>
          </div>
        </div>
      </div>

      {/* Action Header & Tools Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDictionary(!showDictionary)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              showDictionary
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Dicionário de Termos & Siglas ({NURSING_DICTIONARY.length})</span>
          </button>

          <button
            onClick={() => setShowSaveTemplateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Bookmark className="w-4 h-4 text-rose-600" />
            <span>💾 Salvar como Meu Modelo</span>
          </button>
        </div>

        {userTemplates.length > 0 && (
          <span className="text-xs text-slate-500 font-semibold">
            {userTemplates.length} modelo(s) personalizado(s) salvo(s)
          </span>
        )}
      </div>

      {/* Dictionary Drawer/Panel */}
      {showDictionary && (
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-300 shadow-xl space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-rose-600" />
                <span>Dicionário Rápido de Nomenclaturas & Siglas em Enfermagem</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consulte definições para embasar suas anotações ou tire dúvidas de termos clínicos.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                placeholder="Buscar termo ou sigla (ex: SVD, anuria)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['Todas', 'Geral', 'Sinais Vitais', 'Dispositivos & Acessos', 'Pele & Feridas', 'Sistemas'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedDictCat(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  selectedDictCat === cat
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {NURSING_DICTIONARY.filter((item) => {
              if (selectedDictCat !== 'Todas' && item.category !== selectedDictCat) return false;
              if (
                dictSearch.trim() &&
                !item.term.toLowerCase().includes(dictSearch.toLowerCase()) &&
                !item.definition.toLowerCase().includes(dictSearch.toLowerCase())
              ) {
                return false;
              }
              return true;
            }).map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-rose-50/50 hover:bg-rose-100/60 rounded-2xl border border-rose-100 transition-all space-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-rose-900 text-xs">{item.term}</span>
                    <span className="text-[10px] bg-rose-200/60 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{item.definition}</p>
                </div>
                
                <button
                  onClick={() => {
                    setComplaints((prev) => (prev ? `${prev} | ${item.term}` : item.term));
                  }}
                  className="mt-2 text-[10px] font-bold text-rose-700 hover:text-rose-900 underline text-left"
                >
                  + Inserir em Queixas/Obs
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-rose-100 shadow-xl space-y-5">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-rose-600" />
                <span>Dados Clínicos do Paciente</span>
              </span>
            </h3>
            
            {/* Quick Preset Buttons & User Templates */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Preenchimentos Prontos:</span>
              <button
                type="button"
                onClick={() => applyPreset('admission')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-all shadow-2xs"
              >
                🏥 Admissão
              </button>
              <button
                type="button"
                onClick={() => applyPreset('postop')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-all shadow-2xs"
              >
                🔪 Pós-Operatório
              </button>
              <button
                type="button"
                onClick={() => applyPreset('handoff')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-all shadow-2xs"
              >
                🔄 Passagem
              </button>
              <button
                type="button"
                onClick={() => applyPreset('routine')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-all shadow-2xs"
              >
                💚 Enfermaria
              </button>

              {/* User Templates Pills */}
              {userTemplates.map((tpl) => (
                <div key={tpl.id} className="inline-flex items-center bg-amber-50 border border-amber-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => applyUserTemplate(tpl)}
                    className="px-2 py-1 text-amber-900 text-[11px] font-extrabold hover:bg-amber-100"
                  >
                    ⭐ {tpl.name}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteUserTemplate(tpl.id, e)}
                    className="px-1.5 py-1 text-amber-700 hover:text-red-700 hover:bg-amber-200 text-xs"
                    title="Excluir Modelo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div>
              <label className="block mb-1">Nome do Enfermeiro(a)</label>
              <input
                type="text"
                value={nurseName}
                onChange={(e) => setNurseName(e.target.value)}
                placeholder="Ex: Enf. Laercio Ricardo"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Registro COREN</label>
              <input
                type="text"
                value={corenId}
                onChange={(e) => setCorenId(e.target.value)}
                placeholder="Ex: COREN-SP 123.456-ENF"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div>
              <label className="block mb-1">Iniciais do Paciente</label>
              <input
                type="text"
                value={patientInitials}
                onChange={(e) => setPatientInitials(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Leito / Setor</label>
              <input
                type="text"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Vitals */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center space-x-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Sinais Vitais (SSVV)</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1">PA (mmHg)</label>
                <input
                  type="text"
                  value={pa}
                  onChange={(e) => setPa(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-center text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">FC (bpm)</label>
                <input
                  type="text"
                  value={fc}
                  onChange={(e) => setFc(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-center text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">FR (irpm)</label>
                <input
                  type="text"
                  value={fr}
                  onChange={(e) => setFr(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-center text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Temp (ºC)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-center text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">SpO2 (%)</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-center text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-xs font-bold text-slate-700 dark:text-slate-300">
            <div>
              <label className="block mb-1">Nível de Consciência</label>
              <input
                type="text"
                value={consciousness}
                onChange={(e) => setConsciousness(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1">Padrão Respiratório</label>
              <input
                type="text"
                value={respiration}
                onChange={(e) => setRespiration(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1">Acesso Venoso / Dispositivos</label>
              <input
                type="text"
                value={access}
                onChange={(e) => setAccess(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Dieta</label>
                <input
                  type="text"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Eliminações Fisiológicas</label>
                <input
                  type="text"
                  value={elimination}
                  onChange={(e) => setElimination(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Pele & Integridade Cutânea</label>
              <input
                type="text"
                value={skin}
                onChange={(e) => setSkin(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1">Queixas e Procedimentos / Intervenções</label>
              <textarea
                value={interventions}
                onChange={(e) => setInterventions(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Gerar Anotação Padronizada COFEN</span>
          </button>
        </div>

        {/* Output Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <span>Anotação Gerada</span>
              </h3>

              {generatedNote && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1"
                    title="Copiar texto"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                    title="Imprimir"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {generatedNote ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                  {generatedNote}
                </div>

                <button
                  onClick={handleAiReview}
                  disabled={isAiLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center space-x-2"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Revisar com Tutor IA (Professor Lalá)</span>
                </button>

                {aiReview && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                    <p className="font-bold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Análise Técnica do Professor Lalá:</span>
                    </p>
                    <p className="leading-relaxed whitespace-pre-line">{aiReview}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 text-xs font-bold space-y-2">
                <FileText className="w-8 h-8 mx-auto opacity-40 text-rose-600" />
                <p>Preencha os dados do paciente ao lado e clique em "Gerar Anotação Padronizada COFEN".</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-rose-600" />
                <span>Salvar Modelo Personalizado</span>
              </h3>
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Digite um nome para identificar este modelo (ex: "Minha Anotação Pediatria", "SADT Curativo Complexo"). Os dados atuais do formulário serão salvos.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Modelo</label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Ex: Anotação Padrão UTI Adulto"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUserTemplate}
                disabled={!newTemplateName.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                Salvar Modelo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
