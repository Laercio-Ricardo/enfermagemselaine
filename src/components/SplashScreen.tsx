import React, { useEffect, useState } from 'react';
import { Activity, Heart, Sparkles, Stethoscope, ShieldCheck, Flame, Syringe, Pill, CheckCircle2, X } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  isDemoMode?: boolean;
}

const NURSING_LOADING_STEPS = [
  "Iniciando Protocolos COFEN 2026...",
  "Calibrando Calculadora de Doses e Gotejamento...",
  "Carregando Questões de Concursos & Prática...",
  "Conectando ao Tutor de Enfermagem com IA...",
  "Sincronizando Sistema..."
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDemoMode = false }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(10);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 18;
      });
    }, 400);

    // Message rotation
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % NURSING_LOADING_STEPS.length);
    }, 500);

    // Fadeout timer
    const finishTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3200);

    const closeTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3800);

    return () => {
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
      className={`fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Gradient Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose-600/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-red-700/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Controls */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 pt-2">
        <div className="inline-flex items-center space-x-2 bg-rose-950/60 border border-rose-500/30 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-200">
            Enfermagem Pro • App Nativo
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all flex items-center space-x-1"
        >
          <span>Pular</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-7 my-auto w-full max-w-md">
        
        {/* Animated ECG Heartbeat Monitor Box */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Concentric Outer Glow */}
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-rose-600/30 animate-ping opacity-30" />
          <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-rose-500/20 animate-pulse" />

          {/* Main Shield Icon Badge */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 p-1 shadow-2xl shadow-rose-900/80">
            <div className="w-full h-full rounded-[22px] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
              
              {/* Floating Medical Icons Background */}
              <Stethoscope className="w-14 h-14 text-rose-400 opacity-90 stroke-[2.2] drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
              
              <div className="absolute -bottom-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-t-lg font-black text-[10px] uppercase tracking-wider shadow-md">
                COFEN 100%
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic ECG Line Graphic */}
        <div className="w-full max-w-xs h-12 relative flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full text-rose-500" viewBox="0 0 300 50" fill="none">
            {/* Background ECG line */}
            <path
              d="M 0 25 L 70 25 L 80 10 L 90 40 L 100 5 L 110 45 L 120 25 L 180 25 L 190 15 L 200 35 L 210 25 L 300 25"
              stroke="rgba(244, 63, 94, 0.2)"
              strokeWidth="2"
            />
            {/* Animated Glowing ECG line */}
            <path
              d="M 0 25 L 70 25 L 80 10 L 90 40 L 100 5 L 110 45 L 120 25 L 180 25 L 190 15 L 200 35 L 210 25 L 300 25"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0px 0px 8px #f59e0b)',
              }}
            />
          </svg>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white drop-shadow-lg">
            Enfermagem <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-rose-400">Pro</span>
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/80 font-medium max-w-xs mx-auto leading-relaxed">
            Assistente Clínico & Guia de Estudos para Prática e Concursos
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2.5 pt-2">
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-rose-200/90 px-1">
            <span className="flex items-center space-x-1.5 truncate max-w-[260px]">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
              <span className="truncate">{NURSING_LOADING_STEPS[stepIndex]}</span>
            </span>
            <span className="font-mono text-amber-300 shrink-0">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Bottom Dedication Banner (Laércio Ricardo & Gisselaine) */}
      <div className="w-full max-w-md z-10">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center space-y-1">
          <p className="text-xs text-slate-300 font-medium">
            Desenvolvido por <strong className="text-white font-black">Laércio Ricardo</strong>
          </p>
          <div className="inline-flex items-center space-x-1.5 text-xs text-rose-300 font-bold bg-rose-950/60 border border-rose-500/30 px-3 py-1 rounded-full">
            <span>Oferecido com carinho para</span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
            <strong className="text-white font-extrabold">Gisselaine</strong>
          </div>
        </div>
      </div>

    </div>
  );
};
