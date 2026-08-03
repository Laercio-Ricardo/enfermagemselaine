export type ThemeColor = 'rose' | 'teal' | 'indigo' | 'purple' | 'amber';

export interface ThemeOption {
  id: ThemeColor;
  name: string;
  badge: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
  lightBg: string;
  border: string;
  accentHex: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'rose',
    name: 'Rosa Enfermagem (Padrão)',
    badge: 'Carmim & Cuidado',
    primaryBg: 'bg-rose-600',
    primaryHoverBg: 'hover:bg-rose-500',
    primaryText: 'text-rose-600 dark:text-rose-400',
    lightBg: 'bg-rose-50 dark:bg-rose-950/60',
    border: 'border-rose-200 dark:border-rose-800',
    accentHex: '#e11d48',
  },
  {
    id: 'teal',
    name: 'Verde Cirúrgico & Saúde',
    badge: 'Centro Cirúrgico',
    primaryBg: 'bg-teal-600',
    primaryHoverBg: 'hover:bg-teal-500',
    primaryText: 'text-teal-600 dark:text-teal-400',
    lightBg: 'bg-teal-50 dark:bg-teal-950/60',
    border: 'border-teal-200 dark:border-teal-800',
    accentHex: '#0d9488',
  },
  {
    id: 'indigo',
    name: 'Azul Jaleco Hospitalar',
    badge: 'Médico-Cirúrgico',
    primaryBg: 'bg-indigo-600',
    primaryHoverBg: 'hover:bg-indigo-500',
    primaryText: 'text-indigo-600 dark:text-indigo-400',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    border: 'border-indigo-200 dark:border-indigo-800',
    accentHex: '#4f46e5',
  },
  {
    id: 'purple',
    name: 'Roxo Lilás Humanizado',
    badge: 'Urgência & UTI',
    primaryBg: 'bg-purple-600',
    primaryHoverBg: 'hover:bg-purple-500',
    primaryText: 'text-purple-600 dark:text-purple-400',
    lightBg: 'bg-purple-50 dark:bg-purple-950/60',
    border: 'border-purple-200 dark:border-purple-800',
    accentHex: '#9333ea',
  },
  {
    id: 'amber',
    name: 'Âmbar Dourado Energia',
    badge: 'Atenção Primária',
    primaryBg: 'bg-amber-600',
    primaryHoverBg: 'hover:bg-amber-500',
    primaryText: 'text-amber-600 dark:text-amber-400',
    lightBg: 'bg-amber-50 dark:bg-amber-950/60',
    border: 'border-amber-200 dark:border-amber-800',
    accentHex: '#d97706',
  },
];
