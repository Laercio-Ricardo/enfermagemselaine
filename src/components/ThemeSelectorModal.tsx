import React from 'react';
import { Palette, Check, X, Sparkles } from 'lucide-react';
import { THEME_OPTIONS, ThemeColor } from '../lib/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  setTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                Personalizar Cores do App
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Escolha o tema visual que mais combina com seu estilo de estudos!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="space-y-3">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/40 dark:bg-slate-800/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-xl shadow-md flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.accentHex }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {theme.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {theme.badge}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs transition-all shadow-md"
          >
            Salvar Preferências
          </button>
        </div>

      </div>
    </div>
  );
};
