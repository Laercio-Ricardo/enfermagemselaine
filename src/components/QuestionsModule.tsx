import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  HelpCircle,
  Award,
  Loader2
} from 'lucide-react';
import { Question, SubjectCategory, BancaType } from '../types';

interface QuestionsModuleProps {
  questions: Question[];
  onAnswerQuestion: (questionId: string, selectedOption: number, isCorrect: boolean) => void;
  onToggleBookmark: (questionId: string) => void;
  onAddNewAiQuestion: (newQuestion: Question) => void;
  onTriggerDailyUpdate?: () => void;
  isUpdatingDaily?: boolean;
  lastDailyUpdateDate?: string;
}

export const QuestionsModule: React.FC<QuestionsModuleProps> = ({
  questions,
  onAnswerQuestion,
  onToggleBookmark,
  onAddNewAiQuestion,
  onTriggerDailyUpdate,
  isUpdatingDaily,
  lastDailyUpdateDate,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [selectedBanca, setSelectedBanca] = useState<string>('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Todas');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // AI Generator state
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSubjectInput, setAiSubjectInput] = useState<SubjectCategory>('Fundamentos de Enfermagem');
  const [aiBancaInput, setAiBancaInput] = useState<BancaType>('VUNESP');
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== 'Todas' && q.subject !== selectedSubject) return false;
    if (selectedBanca !== 'Todas' && q.banca !== selectedBanca) return false;
    if (selectedDifficulty !== 'Todas' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleOptionSelect = (optionIdx: number) => {
    if (currentQ && currentQ.userAnswer !== undefined) return; // already answered
    setSelectedOption(optionIdx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    onAnswerQuestion(currentQ.id, selectedOption, isCorrect);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleGenerateAiQuestion = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: aiSubjectInput,
          banca: aiBancaInput,
          difficulty: 'Média',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newQ: Question = {
          id: `q-ai-${Date.now()}`,
          statement: data.data.statement,
          options: data.data.options,
          correctIndex: data.data.correctIndex,
          explanation: data.data.explanation,
          subject: data.data.subject || aiSubjectInput,
          banca: data.data.banca || aiBancaInput,
          difficulty: 'Média',
          isAiGenerated: true,
        };
        onAddNewAiQuestion(newQ);
        setShowAiModal(false);
        // Switch filter to show all
        setSelectedSubject('Todas');
        setSelectedBanca('Todas');
        setCurrentIndex(questions.length); // point to new
      } else {
        alert('Erro ao gerar questão. Verifique a API Key.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com a IA.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Auto Daily Updates Status Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-rose-500">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-white/20 text-white border border-white/30 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white font-display">
                Atualização Diária Automática por IA
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold border border-white/30">
                Ativa
              </span>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              {lastDailyUpdateDate
                ? `Banco de questões renovado automaticamente hoje (${lastDailyUpdateDate}).`
                : 'A IA busca e adiciona novas questões de concursos diariamente ao abrir a plataforma.'}
            </p>
          </div>
        </div>

        {onTriggerDailyUpdate && (
          <button
            onClick={onTriggerDailyUpdate}
            disabled={isUpdatingDaily}
            className="shrink-0 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isUpdatingDaily ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                <span>Buscando Lote Diário...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                <span>Atualizar Banco Agora</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-rose-100 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center space-x-2 font-display">
            <BookOpen className="w-6 h-6 text-rose-600" />
            <span>Banco de Questões de Concurso</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pratique com questões simuladas de bancas do Brasil e crie novas usando Inteligência Artificial.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Gerar Questão Inédita via IA</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-rose-100 dark:border-slate-700 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
          <Filter className="w-4 h-4 text-rose-600" />
          <span>Filtros:</span>
        </div>

        {/* Matéria */}
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setCurrentIndex(0);
          }}
          className="bg-rose-50/50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-rose-100 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500"
        >
          <option value="Todas">Todas as Matérias</option>
          <option value="Fundamentos de Enfermagem">Fundamentos de Enfermagem</option>
          <option value="Farmacologia">Farmacologia</option>
          <option value="Saúde Pública & SUS">Saúde Pública & SUS</option>
          <option value="Enfermagem Médico-Cirúrgica & Urgência">Urgência & Cirúrgica</option>
          <option value="Saúde da Mulher e da Criança">Saúde Mulher & Criança</option>
          <option value="Ética e Legislação de Enfermagem">Ética e Legislação</option>
          <option value="Imunização & PNI">Imunização & PNI</option>
        </select>

        {/* Banca */}
        <select
          value={selectedBanca}
          onChange={(e) => {
            setSelectedBanca(e.target.value);
            setCurrentIndex(0);
          }}
          className="bg-rose-50/50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-rose-100 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500"
        >
          <option value="Todas">Todas as Bancas</option>
          <option value="VUNESP">VUNESP</option>
          <option value="CESPE/Cebraspe">CESPE / Cebraspe</option>
          <option value="FGV">FGV</option>
          <option value="IBFC">IBFC</option>
          <option value="AOCP">AOCP</option>
          <option value="Consulplan">Consulplan</option>
        </select>

        {/* Dificuldade */}
        <select
          value={selectedDifficulty}
          onChange={(e) => {
            setSelectedDifficulty(e.target.value);
            setCurrentIndex(0);
          }}
          className="bg-rose-50/50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-rose-100 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500"
        >
          <option value="Todas">Todas as Dificuldades</option>
          <option value="Fácil">Fácil</option>
          <option value="Média">Média</option>
          <option value="Difícil">Difícil</option>
        </select>
      </div>

      {/* Main Question Display */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Nenhuma questão encontrada para este filtro
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tente alterar os filtros acima ou utilize a ferramenta de Inteligência Artificial para gerar uma nova questão sobre este assunto!
          </p>
          <button
            onClick={() => {
              setSelectedSubject('Todas');
              setSelectedBanca('Todas');
              setSelectedDifficulty('Todas');
            }}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-8 space-y-6">
          
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200">
                {currentQ.subject}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                Banca: {currentQ.banca}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
                {currentQ.difficulty}
              </span>
              {currentQ.isAiGenerated && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Inédita via IA</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Questão {currentIndex + 1} de {filteredQuestions.length}
              </span>

              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors text-amber-500"
                title="Salvar Questão nos Favoritos"
              >
                {currentQ.isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 fill-amber-400 text-amber-500" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Statement */}
          <div className="text-slate-800 dark:text-slate-100 text-base leading-relaxed font-medium">
            {currentQ.statement}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isAnswered = currentQ.userAnswer !== undefined;
              const isSelected = selectedOption === idx || currentQ.userAnswer === idx;
              const isCorrectOption = idx === currentQ.correctIndex;

              let optionStyle = 'border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 bg-rose-50/20 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200';

              if (isAnswered) {
                if (isCorrectOption) {
                  optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 font-semibold ring-2 ring-rose-400';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'border-red-500 bg-red-50 dark:bg-red-950/80 text-red-900 dark:text-red-200';
                }
              } else if (isSelected) {
                optionStyle = 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold ring-2 ring-rose-500';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 text-sm ${optionStyle}`}
                >
                  <div className="mt-0.5">
                    {isAnswered ? (
                      isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                      )
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                          isSelected
                            ? 'border-rose-600 bg-rose-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    )}
                  </div>
                  <span className="flex-1 leading-snug">{option}</span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <div>
              {currentQ.userAnswer === undefined ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className={`w-full sm:w-auto font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-2xs ${
                    selectedOption !== null
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Responder Questão
                </button>
              ) : (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showExplanation ? 'Ocultar Fundamentação' : 'Ver Comentário do Professor'}</span>
                </button>
              )}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors ${
                  currentIndex === 0
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors ${
                  currentIndex === filteredQuestions.length - 1
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Detailed Explanation Box */}
          {(showExplanation || currentQ.userAnswer !== undefined) && (
            <div className="mt-4 p-5 rounded-xl bg-rose-50/50 dark:bg-slate-900/80 border border-rose-100 dark:border-slate-700 space-y-2 animate-fade-in">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center space-x-1.5 font-display">
                <Award className="w-4 h-4" />
                <span>Comentário Técnico & Legislação Aplicada</span>
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {currentQ.explanation}
              </p>
            </div>
          )}

        </div>
      )}

      {/* AI Question Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 dark:border-slate-700 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center space-x-2 font-display">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Gerar Questão Inédita por IA</span>
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O motor de IA criará uma questão inédita com enunciado, alternativas e fundamentação com base no modelo das bancas brasileiras de concursos públicos.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Matéria de Enfermagem:
                </label>
                <select
                  value={aiSubjectInput}
                  onChange={(e) => setAiSubjectInput(e.target.value as SubjectCategory)}
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Fundamentos de Enfermagem">Fundamentos de Enfermagem</option>
                  <option value="Farmacologia">Farmacologia</option>
                  <option value="Saúde Pública & SUS">Saúde Pública & SUS</option>
                  <option value="Enfermagem Médico-Cirúrgica & Urgência">Urgência & Cirúrgica</option>
                  <option value="Saúde da Mulher e da Criança">Saúde da Mulher e da Criança</option>
                  <option value="Ética e Legislação de Enfermagem">Ética e Legislação</option>
                  <option value="Imunização & PNI">Imunização & PNI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estilo da Banca:
                </label>
                <select
                  value={aiBancaInput}
                  onChange={(e) => setAiBancaInput(e.target.value as BancaType)}
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                >
                  <option value="VUNESP">VUNESP</option>
                  <option value="CESPE/Cebraspe">CESPE / Cebraspe</option>
                  <option value="FGV">FGV</option>
                  <option value="IBFC">IBFC</option>
                  <option value="AOCP">AOCP</option>
                  <option value="Consulplan">Consulplan</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateAiQuestion}
                disabled={isGeneratingAi}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center space-x-2 shadow-md disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Elaborando Questão...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Gerar Agora</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
