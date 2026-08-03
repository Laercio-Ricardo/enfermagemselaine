import React, { useEffect, useState } from 'react';
import { Activity, Heart, Sparkles, Stethoscope, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  isDemoMode?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDemoMode = false }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isDemoMode) return;

    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish, isDemoMode]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-rose-700 via-rose-800 to-slate-950 text-white flex flex-col items-center justify-between p-8 transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Pulsing Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Badge */}
      <div className="pt-6 animate-fade-in text-center">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-rose-100 shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Plataforma Oficial de Enfermagem</span>
        </div>
      </div>

      {/* Main Center Logo & Title */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 my-auto">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-rose-400 to-rose-300 rounded-3xl blur-md opacity-75 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white text-rose-600 flex items-center justify-center shadow-2xl border-2 border-white/40">
            <Stethoscope className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.2]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white drop-shadow-md">
            Enfermagem <span className="text-amber-300">Pro</span>
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 font-medium max-w-xs leading-relaxed">
            Preparatório e Guia Clínico para Técnica em Enfermagem
          </p>
        </div>

        {/* Loading Spinner Indicator */}
        <div className="flex items-center space-x-2 pt-2">
          <Activity className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-xs font-extrabold text-rose-200 uppercase tracking-wider">
            Inicializando Sistema...
          </span>
        </div>
      </div>

      {/* Footer Dedication Credit */}
      <div className="pb-4 text-center space-y-1.5 animate-fade-in border-t border-white/10 pt-4 w-full max-w-sm">
        <p className="text-xs text-rose-100 font-medium">
          Desenvolvido por <strong className="text-white font-extrabold">Laércio Ricardo</strong>
        </p>
        <div className="inline-flex items-center space-x-1 text-[11px] text-amber-200 font-semibold bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
          <span>Oferecido com amor para</span>
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 inline" />
          <strong className="text-white font-black">Gisselaine</strong>
        </div>
      </div>
    </div>
  );
};
