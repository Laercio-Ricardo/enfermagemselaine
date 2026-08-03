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
  Library,
  Image as ImageIcon,
  Calculator,
  FileCheck2,
  Palette
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOnline: boolean;
  streakDays: number;
  onOpenSync: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  streakDays,
  onOpenSync,
  onOpenNotifications,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: BarChart3 },
    { id: 'calculator', label: 'Cálculos', icon: Calculator },
    { id: 'nursing-notes', label: 'Anotações', icon: FileCheck2 },
    { id: 'studies', label: 'Apostilas', icon: Library },
    { id: 'questions', label: 'Questões', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'schedule', label: 'Cronograma', icon: Calendar },
    { id: 'tutor', label: 'Tutor IA', icon: Bot },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:bg-rose-500 transition-colors">
              +
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 font-display">
                  Enfermagem Pro
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
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
                      : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
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
            
            {/* Streak Counter */}
            <div
              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold"
              title="Dias consecutivos de estudo"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>{streakDays}d</span>
            </div>

            {/* Offline/Online Status */}
            <div
              className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-xl border ${
                isOnline
                  ? 'bg-rose-50 text-slate-700 border-rose-200'
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
              title={isOnline ? 'Sincronizado na nuvem' : 'Modo Offline - Estude sem internet'}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-red-600" />
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-rose-50 transition-colors"
              title="Lembretes de estudo"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Cloud Sync Button */}
            <button
              onClick={onOpenSync}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-rose-50 transition-colors"
              title="Sincronização entre dispositivos"
            >
              <CloudCheck className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden border-t border-rose-100 py-1.5 flex justify-around overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-1 px-2 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'text-rose-600 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
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

