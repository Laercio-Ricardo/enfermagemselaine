import React, { useEffect, useState } from 'react';
import {
  Activity,
  Heart,
  Sparkles,
  ShieldCheck,
  Syringe,
  CheckCircle2,
  X,
  BookOpen,
  Check,
  Plus
} from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  isDemoMode?: boolean;
}

const NURSING_STEPS = [
  { id: 1, label: 'Carregando Diretrizes COFEN & Guia de Plantão 2026', icon: ShieldCheck },
  { id: 2, label: 'Sincronizando Calculadoras de Dose & Drenagem', icon: Syringe },
  { id: 3, label: 'Indexando Questões de Concursos & Casos Clínicos', icon: BookOpen },
  { id: 4, label: 'Ativando Tutor de Enfermagem com Inteligência Artificial', icon: Sparkles },
  { id: 5, label: 'Ambiente de Estudos e Prática Pronto!', icon: CheckCircle2 }
];

const NURSING_QUOTES = [
  "A Enfermagem é a arte de cuidar fundamentada na ciência e na compaixão.",
  "Cada plantão é uma oportunidade de salvar vidas e transformar histórias.",
  "O conhecimento técnico traz segurança; o cuidado humano traz a cura."
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(15);
  const [activeStep, setActiveStep] = useState(0);
  const [bpm, setBpm] = useState(72);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * NURSING_QUOTES.length));

  useEffect(() => {
    // BPM heartbeat fluctuation simulation
    const bpmInterval = setInterval(() => {
      setBpm(Math.floor(72 + Math.random() * 8));
    }, 800);

    // Smooth Progress timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 12;
      });
    }, 320);

    // Step switching timer
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < NURSING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    // Auto finish transitions
    const finishTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    const closeTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4200);

    return () => {
      clearInterval(bpmInterval);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(finishTimer);
      clearTimeout(closeTimer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-rose-50 via-rose-100 to-rose-200 text-slate-900 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Glowing Light Pink Ambient Spheres */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-300/50 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 -left-28 w-[400px] h-[400px] bg-rose-400/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-28 -right-20 w-[450px] h-[450px] bg-rose-300/40 rounded-full blur-[130px] pointer-events-none" />

      {/* Grid Monitor Background Pattern in Rose */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(225,29,72,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(225,29,72,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Controls & Live Vitals Monitor */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 pt-2">
        {/* Vital Monitor Badge on Light Rose/White */}
        <div className="inline-flex items-center space-x-3 bg-white/90 border border-rose-200 px-3.5 py-1.5 rounded-2xl backdrop-blur-md shadow-lg shadow-rose-900/5">
          <div className="flex items-center space-x-1.5 text-rose-600 font-extrabold text-xs font-mono">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
            <span>{bpm} <span className="text-[10px] text-rose-700 font-sans">BPM</span></span>
          </div>
          <span className="w-px h-3 bg-rose-200" />
          <div className="flex items-center space-x-1 text-emerald-600 font-extrabold text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>SpO2 99%</span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-extrabold text-rose-900 hover:text-rose-950 bg-white/90 hover:bg-white border border-rose-200 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all flex items-center space-x-1.5 shadow-md active:scale-95"
        >
          <span>Pular</span>
          <X className="w-3.5 h-3.5 text-rose-600" />
        </button>
      </div>

      {/* Main Content Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 my-auto w-full max-w-md">
        
        {/* System Medical Shield Badge with Soft Pulsing Rose Rings */}
        <div className="relative flex items-center justify-center my-2">
          {/* External Pulsing Rings */}
          <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-rose-400/30 animate-ping opacity-60" />
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-rose-400/40 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-rose-300/30" />

          {/* Core Medical Icon Shield */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-400 p-1.5 shadow-2xl shadow-rose-600/30 transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[20px] bg-white backdrop-blur-2xl flex flex-col items-center justify-center relative overflow-hidden border border-rose-100">
              
              {/* Internal Soft Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-rose-100/60 to-transparent pointer-events-none" />
              
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-600/40 mb-1">
                <Plus className="w-8 h-8 stroke-[3.5]" />
              </div>
              
              <div className="absolute -bottom-0.5 bg-rose-600 text-white px-2.5 py-0.5 rounded-t-md font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>COFEN 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Cardiac Trace Curve Graphic */}
        <div className="w-full max-w-xs h-10 relative flex items-center justify-center overflow-hidden bg-white/90 rounded-xl border border-rose-200 p-1 shadow-md">
          <svg className="w-full h-full text-rose-500" viewBox="0 0 300 40" fill="none">
            {/* Base ECG Grid Trace */}
            <path
              d="M 0 20 L 60 20 L 70 8 L 80 32 L 90 2 L 100 38 L 110 20 L 170 20 L 180 10 L 190 30 L 200 20 L 300 20"
              stroke="rgba(225, 29, 72, 0.2)"
              strokeWidth="1.5"
            />
            {/* Animated Dynamic Beat Curve in Bright Rose */}
            <path
              d="M 0 20 L 60 20 L 70 8 L 80 32 L 90 2 L 100 38 L 110 20 L 170 20 L 180 10 L 190 30 L 200 20 L 300 20"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0px 0px 6px rgba(225,29,72,0.6))'
              }}
            />
          </svg>
        </div>

        {/* Title & Description with Dark Slate & Vibrant Rose Typography */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900 drop-shadow-sm">
            Enfermagem <span className="text-rose-600">Pro</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold max-w-xs mx-auto leading-relaxed">
            Sua Plataforma Nativa de Estudos & Prática Clínica
          </p>
        </div>

        {/* Inspirational Quote Card */}
        <div className="px-4 py-2.5 rounded-2xl bg-white/90 border border-rose-200 text-center max-w-xs backdrop-blur-md shadow-md">
          <p className="text-[11px] text-rose-950 italic font-medium leading-tight">
            "{NURSING_QUOTES[quoteIndex]}"
          </p>
        </div>

        {/* Progress & Step-by-Step Checklists */}
        <div className="w-full space-y-3 pt-1">
          {/* Main Progress Bar with Rose Gradient */}
          <div className="w-full h-2.5 bg-rose-200/80 rounded-full overflow-hidden p-0.5 border border-rose-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(225,29,72,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-extrabold text-slate-800 px-1">
            <span className="flex items-center space-x-1.5 truncate max-w-[280px]">
              <Activity className="w-4 h-4 text-rose-600 animate-spin shrink-0" />
              <span className="truncate text-rose-950">{NURSING_STEPS[activeStep].label}</span>
            </span>
            <span className="font-mono text-rose-700 shrink-0">{progress}%</span>
          </div>

          {/* Interactive Checkmark Step List in Light Rose Theme */}
          <div className="grid grid-cols-1 gap-1.5 text-left pt-1">
            {NURSING_STEPS.map((step, idx) => {
              const isDone = idx <= activeStep;
              const isCurrent = idx === activeStep;
              const IconComp = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-[11px] transition-all border ${
                    isCurrent
                      ? 'bg-rose-600 border-rose-600 text-white font-extrabold shadow-lg shadow-rose-600/30'
                      : isDone
                      ? 'bg-white/90 border-rose-200 text-slate-800 font-medium'
                      : 'bg-white/40 border-rose-100 text-rose-950/40'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <IconComp
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCurrent
                          ? 'text-white animate-pulse'
                          : isDone
                          ? 'text-emerald-600'
                          : 'text-rose-400/50'
                      }`}
                    />
                    <span className="truncate">{step.label}</span>
                  </div>

                  {isDone && (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-2 border ${
                        isCurrent
                          ? 'bg-white/20 border-white/40'
                          : 'bg-emerald-100 border-emerald-300'
                      }`}
                    >
                      <Check
                        className={`w-2.5 h-2.5 stroke-[3] ${
                          isCurrent ? 'text-white' : 'text-emerald-700'
                        }`}
                      />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Special Dedication Banner (Laércio Ricardo & Gisselaine) */}
      <div className="w-full max-w-md z-10 pt-2">
        <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-200 backdrop-blur-xl shadow-xl text-center space-y-1">
          <p className="text-xs text-slate-700 font-medium">
            Desenvolvido por <strong className="text-slate-900 font-black">Laércio Ricardo</strong>
          </p>
          <div className="inline-flex items-center space-x-1.5 text-xs text-white font-black bg-rose-600 border border-rose-500 px-4 py-1.5 rounded-full shadow-md">
            <span>Oferecido com carinho para</span>
            <Heart className="w-4 h-4 fill-white text-white animate-bounce" />
            <strong className="text-white font-black tracking-wide">Gisselaine</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
