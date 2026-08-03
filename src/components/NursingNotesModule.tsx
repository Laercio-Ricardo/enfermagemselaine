import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { askTutorAI } from '../services/geminiService';

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

  // Generated Text State
  const [generatedNote, setGeneratedNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [aiReview, setAiReview] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleGenerate = () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const noteText = `${timeNow}h - Paciente ${patientInitials} (${bedNumber}), ${consciousness}, ${respiration}. SSVV: PA=${pa} mmHg, FC=${fc} bpm, FR=${fr} irpm, T=${temp} ºC, SpO2=${spo2}%. ${access}. ${diet}. ${elimination}. ${skin}. ${complaints}. ${interventions} ----- Enfermagem Pro.`;
    
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-slate-800 shadow-xl space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-rose-600" />
            <span>Dados Clínicos do Paciente</span>
          </h3>

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

    </div>
  );
};
