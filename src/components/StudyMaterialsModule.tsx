import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { generateStudySummaryAI } from '../services/geminiService';
import {
  BookOpen,
  Search,
  Sparkles,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Bookmark,
  Share2,
  Lightbulb,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { StudyArticle, SubjectCategory } from '../types';

interface StudyMaterialsModuleProps {
  articles: StudyArticle[];
  onAddArticle: (article: StudyArticle) => void;
  onGoToQuestionsWithSubject?: (subject: SubjectCategory) => void;
}

export const StudyMaterialsModule: React.FC<StudyMaterialsModuleProps> = ({
  articles,
  onAddArticle,
  onGoToQuestionsWithSubject,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<StudyArticle | null>(
    articles.length > 0 ? articles[0] : null
  );

  // AI Generator state
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genError, setGenError] = useState<string>('');

  const subjects = [
    'Todas',
    'Fundamentos de Enfermagem',
    'Farmacologia',
    'Saúde Pública & SUS',
    'Ética e Legislação de Enfermagem',
    'Enfermagem Médico-Cirúrgica & Urgência',
    'Saúde da Mulher e da Criança',
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSubject = selectedSubject === 'Todas' || art.subject === selectedSubject;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyPoints.some((kp) => kp.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleGenerateCustomSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopicInput.trim()) return;

    setIsGenerating(true);
    setGenError('');

    try {
      const subjectParam = selectedSubject !== 'Todas' ? selectedSubject : 'Fundamentos de Enfermagem';
      const articleData = await generateStudySummaryAI(customTopicInput, subjectParam);

      if (articleData && (articleData.title || articleData.contentMarkdown)) {
        const newArt: StudyArticle = {
          id: `art-ai-${Date.now()}`,
          title: articleData.title || customTopicInput,
          subject: (articleData.subject as SubjectCategory) || 'Fundamentos de Enfermagem',
          summary: articleData.summary || 'Resumo gerado por IA especialista em enfermagem.',
          keyPoints: articleData.keyPoints || [],
          cofenNorm: articleData.cofenNorm,
          mnemonic: articleData.mnemonic,
          readTimeMinutes: articleData.readTimeMinutes || 5,
          contentMarkdown: articleData.contentMarkdown || '# Conteúdo indisponível',
          isAiGenerated: true,
        };

        onAddArticle(newArt);
        setSelectedArticle(newArt);
        setCustomTopicInput('');
      } else {
        setGenError('Erro ao gerar o resumo.');
      }
    } catch (err: any) {
      setGenError('Falha de conexão ao gerar o resumo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Clean Professional Design */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 border border-rose-500 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Apostilas & Guias Práticos de Enfermagem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Materiais de Estudo Teórico
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
              Resumos focados em concursos públicos, normas do COFEN, mnemônicos e guias passo a passo de procedimentos técnicos.
            </p>
          </div>

          {/* AI Generator Box */}
          <form
            onSubmit={handleGenerateCustomSummary}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:w-96 shadow-sm space-y-2.5"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Gerar Resumo Teórico por IA</span>
            </div>
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="Ex: Escala de Braden, Passagem de SNG, RCP Adulto..."
              className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300 font-medium"
            />
            {genError && <p className="text-[11px] text-red-200 font-semibold">{genError}</p>}
            <button
              type="submit"
              disabled={isGenerating || !customTopicInput.trim()}
              className="w-full bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-xs"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                  <span>Gerando Resumo Completo...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-rose-600" />
                  <span>Gerar Apostila / Resumo Agora</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid: Sidebar List + Article Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Article Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-rose-100 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar resumo ou tema..."
                className="w-full bg-rose-50/50 dark:bg-slate-800 border border-rose-100 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Subject Pill Filters */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`text-[11px] font-bold py-1 px-2.5 rounded-lg transition-all ${
                    selectedSubject === sub
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-rose-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {sub === 'Todas' ? 'Todas as Matérias' : sub}
                </button>
              ))}
            </div>
          </div>

          {/* Article Items List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">Nenhum resumo encontrado.</p>
                <p className="text-[11px] text-slate-400 mt-1">Use a barra acima para gerar um resumo por IA.</p>
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                      <span>{art.subject}</span>
                      <span className="flex items-center space-x-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{art.readTimeMinutes} min</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display line-clamp-1">
                      {art.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {art.summary}
                    </p>

                    {art.cofenNorm && (
                      <div className="mt-2 text-[10px] bg-rose-50 dark:bg-slate-800 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md inline-block font-semibold">
                        {art.cofenNorm}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Article Reader View (8 cols) */}
        <div className="lg:col-span-8">
          {selectedArticle ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
              
              {/* Top Meta info */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 dark:text-rose-300 border border-rose-200 text-xs font-bold">
                    {selectedArticle.subject}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Leitura recomendada: {selectedArticle.readTimeMinutes} minutos</span>
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                  {selectedArticle.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedArticle.summary}
                </p>

                {selectedArticle.cofenNorm && (
                  <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 flex items-center space-x-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Regulamentação Oficial: <strong>{selectedArticle.cofenNorm}</strong></span>
                  </div>
                )}
              </div>

              {/* Mnemonic Box if available */}
              {selectedArticle.mnemonic && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-red-800 dark:text-red-300">
                    <Lightbulb className="w-4 h-4 text-red-500" />
                    <span>Mnemônico de Ouro para Provas & Concursos</span>
                  </div>
                  <p className="text-xs font-semibold text-red-900 dark:text-red-200">
                    {selectedArticle.mnemonic}
                  </p>
                </div>
              )}

              {/* Concurso Key Points */}
              {selectedArticle.keyPoints && selectedArticle.keyPoints.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-50/30 dark:bg-slate-950 border border-rose-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 font-display">
                    <Award className="w-4 h-4 text-rose-600" />
                    <span>Pontos Mais Cobrados em Provas</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {selectedArticle.keyPoints.map((kp, idx) => (
                      <li key={idx} className="flex items-start space-x-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-rose-100 dark:border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main Content Markdown Render */}
              <div className="markdown-content text-slate-800 dark:text-slate-100 text-sm leading-relaxed space-y-3 pt-2 [&_strong]:font-bold [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:my-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-rose-100 dark:[&_h2]:border-slate-800 [&_h2]:pb-1 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_hr]:my-4 [&_hr]:border-rose-200 dark:[&_hr]:border-slate-800">
                <Markdown>{selectedArticle.contentMarkdown}</Markdown>
              </div>

              {/* Bottom Actions */}
              {onGoToQuestionsWithSubject && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Pronto para testar seus conhecimentos neste assunto?
                  </span>
                  <button
                    onClick={() => onGoToQuestionsWithSubject(selectedArticle.subject)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center space-x-2"
                  >
                    <span>Praticar Questões de {selectedArticle.subject}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum resumo selecionado</h3>
              <p className="text-xs text-slate-500 mt-1">Selecione uma apostila ao lado para iniciar a leitura.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
