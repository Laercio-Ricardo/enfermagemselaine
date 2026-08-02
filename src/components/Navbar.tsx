import React from 'react';
import {
  BookOpen,
  Layers,
  Calendar,
  BarChart3,
  Bot,
  FileText,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  CloudCheck,
  Flame,
  Bell,
  Smartphone,
  Library
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isOnline: boolean;
  streakDays: number;
  onOpenSync: () => void;
  onOpenNotifications: () => void;
  onOpenAppInstallGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  isOnline,
  streakDays,
  onOpenSync,
  onOpenNotifications,
  onOpenAppInstallGuide,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: BarChart3 },
    { id: 'studies', label: 'Apostilas', icon: Library },
    { id: 'questions', label: 'Questões', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'schedule', label: 'Cronograma', icon: Calendar },
    { id: 'tutor', label: 'Tutor IA', icon: Bot },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:bg-rose-500 transition-colors">
              +
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                  Enfermagem Pro
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Técnica & Concursos
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Settings */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Install App Button */}
            <button
              onClick={onOpenAppInstallGuide}
              className="bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center space-x-1.5 shadow-2xs"
              title="Como baixar/instalar como aplicativo no celular"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">Baixar App</span>
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 text-xs font-bold"
              title="Dias consecutivos de estudo"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>{streakDays}d</span>
            </div>

            {/* Offline/Online Status */}
            <div
              className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-xl border ${
                isOnline
                  ? 'bg-rose-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-rose-200 dark:border-slate-700'
                  : 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-300'
              }`}
              title={isOnline ? 'Sincronizado na nuvem' : 'Modo Offline - Estude sem internet'}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-600" />
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Lembretes de estudo"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Cloud Sync Button */}
            <button
              onClick={onOpenSync}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Sincronização entre dispositivos"
            >
              <CloudCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Modo Claro' : 'Modo Noturno'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden border-t border-rose-100 dark:border-slate-800 py-1.5 flex justify-around overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

