import React, { useState } from 'react';
import { generateReportAI } from '../services/geminiService';
import {
  FileText,
  Sparkles,
  Award,
  TrendingUp,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Loader2,
  Calendar
} from 'lucide-react';
import { AppState, WeeklyReportData } from '../types';

interface ReportsModuleProps {
  state: AppState;
  onAddNewReport: (report: WeeklyReportData) => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  state,
  onAddNewReport,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Compute current stats
  const totalQuestions = state.questions.filter((q) => q.userAnswer !== undefined).length;
  const correctCount = state.questions.filter((q) => q.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleGenerateWeeklyReport = async () => {
    setIsGenerating(true);
    try {
      const weakTopics = ['Saúde da Mulher (Regra de Nägele)', 'Farmacologia (Diluições)'];
      const statsObj = {
        totalQuestions,
        accuracy,
        minutesStudied: 270,
        flashcardsReviewed: state.flashcards.length,
      };

      const repData = await generateReportAI(statsObj, weakTopics);
      if (repData && (repData.diagnostic || repData.tips)) {
        const newReport: WeeklyReportData = {
          id: `rep-${Date.now()}`,
          generatedAt: new Date().toISOString(),
          statsSummary: statsObj,
          diagnostic: repData.diagnostic || 'Ótimo progresso na semana!',
          prioritySubjects: repData.prioritySubjects || weakTopics,
          tips: repData.tips || ['Revise os pontos fracos diariamente.'],
          recommendedScheduleFocus: repData.recommendedScheduleFocus || 'Mantenha 30 minutos diários de questões.',
        };
        onAddNewReport(newReport);
      } else {
        alert('Erro ao gerar relatório.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar à IA para relatórios.');
    } finally {
      setIsGenerating(false);
    }
  };

  const latestReport = state.weeklyReports[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Relatórios Semanais de Desempenho</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Análises diagnósticas com Recomendações Estratégicas geradas por Inteligência Artificial.
          </p>
        </div>

        <button
          onClick={handleGenerateWeeklyReport}
          disabled={isGenerating}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
          <span>Gerar Relatório Semanal via IA</span>
        </button>
      </div>

      {/* Latest Report Detail Box */}
      {latestReport ? (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Relatório Diagnóstico da Semana
              </h2>
            </div>
            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Gerado em: {new Date(latestReport.generatedAt).toLocaleDateString('pt-BR')}</span>
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Questões Resolvidas</p>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white">{latestReport.statsSummary.totalQuestions}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Precisão Geral</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{latestReport.statsSummary.accuracy}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Minutos de Estudo</p>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white">{latestReport.statsSummary.minutesStudied} min</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Flashcards SM-2</p>
              <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{latestReport.statsSummary.flashcardsReviewed}</p>
            </div>
          </div>

          {/* Diagnostic Text */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Diagnóstico da IA</span>
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              {latestReport.diagnostic}
            </p>
          </div>

          {/* Priority Focus Subjects */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Tópicos com Necessidade de Reforço</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {latestReport.prioritySubjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold"
                >
                  ⚠️ {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Strategic Tips */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Dicas de Estudo e Memorização</span>
            </h3>
            <ul className="space-y-2">
              {latestReport.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Schedule Focus */}
          <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80 text-xs text-cyan-900 dark:text-cyan-200">
            <strong className="font-bold">Recomendação para a próxima semana: </strong>
            {latestReport.recommendedScheduleFocus}
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          Nenhum relatório gerado ainda. Clique no botão acima para gerar o primeiro!
        </div>
      )}

      {/* Historical Reports Accordion */}
      {state.weeklyReports.length > 1 && (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Histórico de Relatórios Anteriores</h3>
          <div className="space-y-2">
            {state.weeklyReports.slice(1).map((rep) => (
              <div key={rep.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Relatório de {new Date(rep.generatedAt).toLocaleDateString('pt-BR')}</span>
                <span className="font-bold text-emerald-600">{rep.statsSummary.accuracy}% de precisão</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
