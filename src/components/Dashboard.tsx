import React from 'react';
import {
  BookOpen,
  Layers,
  Calendar,
  Bot,
  Flame,
  Award,
  Clock,
  TrendingUp,
  ArrowRight,
  Zap,
  Smartphone,
  CheckCircle2,
  Download,
  Calculator,
  FileCheck2
} from 'lucide-react';
import { AppState } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DashboardProps {
  state: AppState;
  setActiveTab: (tab: string) => void;
  onResumeLastStudy: () => void;
  onOpenAppInstallGuide: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  setActiveTab,
  onResumeLastStudy,
  onOpenAppInstallGuide,
}) => {
  // Compute overall stats
  const totalQuestionsAnswered = state.questions.filter((q) => q.userAnswer !== undefined).length;
  const correctQuestions = state.questions.filter((q) => q.isCorrect).length;
  const accuracy = totalQuestionsAnswered > 0 ? Math.round((correctQuestions / totalQuestionsAnswered) * 100) : 0;

  const dueFlashcardsCount = state.flashcards.filter((f) => {
    return new Date(f.nextReviewDate) <= new Date();
  }).length;

  // Compute daily chart data for last 7 days
  const chartData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
    const activity = state.activities[dateStr] || { questionsAnswered: 0, minutesStudied: 0, correctAnswers: 0 };
    chartData.push({
      date: dayName.toUpperCase(),
      questions: activity.questionsAnswered,
      minutes: activity.minutesStudied,
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Refined Modern Header Section */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 border border-rose-500 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <span>Plataforma Oficial de Enfermagem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Sua Aprovação em Concursos
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Questões atualizadas diariamente, apostilas teóricas, revisão espaçada SM-2 e tutoria técnica 24h para Enfermagem.
            </p>
          </div>

          {/* Resume Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 md:w-80 shadow-sm">
            <div className="flex items-center justify-between text-xs text-rose-100 font-bold">
              <span className="flex items-center space-x-1.5 text-white">
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Último Acesso</span>
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md">Nuvem Ok</span>
            </div>
            <div>
              <p className="text-[11px] text-rose-100">Sessão salva:</p>
              <p className="text-sm font-bold text-white truncate">
                {state.lastLocation.itemTitle || 'Simulado de Fundamentos'}
              </p>
            </div>
            <button
              onClick={onResumeLastStudy}
              className="w-full bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Continuar Estudos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* App Installation Promo Banner */}
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Instalar como Aplicativo no Celular (Android / iPhone)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Transforme esta plataforma em um App nativo no seu smartphone sem precisar de lojas de aplicativos.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAppInstallGuide}
          className="shrink-0 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Ver Passo a Passo de Instalação</span>
        </button>
      </div>

      {/* Clean Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Questões Respondidas */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questões</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {totalQuestionsAnswered}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="text-rose-600 dark:text-rose-400 font-bold">{accuracy}% de acerto</span>
            </p>
          </div>
        </div>

        {/* Flashcards SM-2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Flashcards</span>
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {dueFlashcardsCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Para revisão hoje
            </p>
          </div>
        </div>

        {/* Sequência Diária */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ofensiva</span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-500">
              <Flame className="w-4 h-4 fill-red-500 text-red-500" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              7 Dias
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Foco contínuo
            </p>
          </div>
        </div>

        {/* Tempo de Estudo */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Horas</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              4.5 h
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Esta semana
            </p>
          </div>
        </div>

      </div>

      {/* Main Content Area: Chart & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Desempenho Diário Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 font-display">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <span>Atividade nos Últimos 7 Dias</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Volume diário de resoluções e estudos
              </p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
            >
              <span>Relatório Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#f43f5e',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="questions" name="Questões Resolvidas" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === chartData.length - 1 ? '#e11d48' : '#fda4af'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rendimento por Matéria */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 font-display">
            <Award className="w-4 h-4 text-rose-600" />
            <span>Domínio por Matéria</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aproveitamento percentual por disciplina
          </p>

          <div className="space-y-3 pt-1">
            {[
              { subject: 'Fundamentos de Enfermagem', pct: 85 },
              { subject: 'Farmacologia', pct: 70 },
              { subject: 'Saúde Pública & SUS', pct: 90 },
              { subject: 'Enfermagem Médico-Cirúrgica', pct: 78 },
              { subject: 'Saúde da Mulher e Criança', pct: 65 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="truncate pr-2">{item.subject}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">{item.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-rose-600" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Clean Quick Access Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div
          onClick={() => setActiveTab('calculator')}
          className="bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-5 border border-rose-100 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Calculator className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 dark:text-white font-display">Calculadora de Doses</h3>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Prático</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gotejamento de soro, regra de três, penicilina cristalina, IMC e SSVV com fórmulas.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('nursing-notes')}
          className="bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-5 border border-rose-100 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 dark:text-white font-display">Anotações COFEN</h3>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Pro</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gerador de relatórios e evolução de enfermagem com terminologia técnica e revisão por IA.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('studies')}
          className="bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-5 border border-rose-100 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 dark:text-white font-display">Apostilas & Resumos</h3>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">Novo</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resumos teóricos para concursos, procedimentos COFEN, mnemônicos e gerador por IA.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('questions')}
          className="bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-slate-200 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white font-display">Banco de Questões</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Questões das bancas (VUNESP, CESPE, FGV) e atualizações automáticas diárias.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('flashcards')}
          className="bg-white dark:bg-slate-900 hover:border-pink-400 dark:hover:border-pink-500 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-slate-200 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white font-display">Flashcards SM-2</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Memorização otimizada por repetição espaçada sem sobrecarga.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('schedule')}
          className="bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-slate-200 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white font-display">Cronograma Semanal</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento de disciplinas com integração ao Google Agenda.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('tutor')}
          className="bg-white dark:bg-slate-900 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-slate-200 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white font-display">Professor Lalá</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tutoria técnica 24h para cálculos de medicação, sondagem e legislação.
          </p>
        </div>

      </div>

    </div>
  );
};
