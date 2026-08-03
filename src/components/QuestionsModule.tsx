import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { generateQuestionAI } from '../services/geminiService';
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
  Loader2,
  Clock,
  Timer,
  Trophy,
  Play,
  CheckSquare,
  RotateCcw,
  Scissors,
  Edit3,
  Eye,
  EyeOff,
  Keyboard,
  Check,
  Flame,
  Zap,
  Volume2
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

  // Simulado Mode State
  const [isSimuladoActive, setIsSimuladoActive] = useState<boolean>(false);
  const [simuladoTimer, setSimuladoTimer] = useState<number>(600); // 10 min
  const [simuladoInitialTime, setSimuladoInitialTime] = useState<number>(600);
  const [simuladoAnswers, setSimuladoAnswers] = useState<Record<string, number>>({});
  const [isSimuladoFinished, setIsSimuladoFinished] = useState<boolean>(false);

  // Interactive Enhancements
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, number[]>>({});
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({});
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [readingComfortMode, setReadingComfortMode] = useState<boolean>(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);
  const [correctStreak, setCorrectStreak] = useState<number>(0);
  const [streakToast, setStreakToast] = useState<string | null>(null);

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedSubject !== 'Todas' && q.subject !== selectedSubject) return false;
    if (selectedBanca !== 'Todas' && q.banca !== selectedBanca) return false;
    if (selectedDifficulty !== 'Todas' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside input/textarea/select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Number keys 1-5 or A-E
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const optionIdx = parseInt(key, 10) - 1;
        handleOptionSelect(optionIdx);
      } else if (['a', 'b', 'c', 'd', 'e'].includes(key)) {
        const charCode = key.charCodeAt(0) - 97; // 'a' = 0
        handleOptionSelect(charCode);
      } else if (key === 'enter') {
        e.preventDefault();
        handleConfirmAnswer();
      } else if (key === 'arrowright' || key === 'n') {
        handleNext();
      } else if (key === 'arrowleft' || key === 'p') {
        handlePrev();
      } else if (key === 'm') {
        setReadingComfortMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedOption, filteredQuestions]);

  useEffect(() => {
    let interval: any = null;
    if (isSimuladoActive && !isSimuladoFinished && simuladoTimer > 0) {
      interval = setInterval(() => {
        setSimuladoTimer((prev) => {
          if (prev <= 1) {
            setIsSimuladoFinished(true);
            setIsSimuladoActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimuladoActive, isSimuladoFinished, simuladoTimer]);

  const startSimulado = (minutes: number = 10) => {
    setSimuladoTimer(minutes * 60);
    setSimuladoInitialTime(minutes * 60);
    setSimuladoAnswers({});
    setIsSimuladoFinished(false);
    setIsSimuladoActive(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const finishSimulado = () => {
    setIsSimuladoFinished(true);
    setIsSimuladoActive(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (currentQ && currentQ.userAnswer !== undefined) return; // already answered
    setSelectedOption(optionIdx);
  };

  const toggleEliminateOption = (optionIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentQ) return;
    setEliminatedOptions((prev) => {
      const currentList = prev[currentQ.id] || [];
      const updated = currentList.includes(optionIdx)
        ? currentList.filter((idx) => idx !== optionIdx)
        : [...currentList, optionIdx];
      return { ...prev, [currentQ.id]: updated };
    });
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    onAnswerQuestion(currentQ.id, selectedOption, isCorrect);
    setShowExplanation(true);

    if (isCorrect) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      if (newStreak >= 2) {
        setStreakToast(`🔥 Sequência de ${newStreak} acertos seguidos! Mandou muito bem!`);
        setTimeout(() => setStreakToast(null), 3000);
      } else {
        setStreakToast(`✅ Resposta Correta! Excelente raciocínio clínico.`);
        setTimeout(() => setStreakToast(null), 2500);
      }
    } else {
      setCorrectStreak(0);
      setStreakToast(`❌ Ops! Leia o comentário do professor para entender o gabarito.`);
      setTimeout(() => setStreakToast(null), 3000);
    }
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
      const qData = await generateQuestionAI(aiSubjectInput, aiBancaInput, 'Média');
      if (qData && qData.statement) {
        const newQ: Question = {
          id: `q-ai-${Date.now()}`,
          statement: qData.statement,
          options: qData.options || [],
          correctIndex: qData.correctIndex ?? 0,
          explanation: qData.explanation || '',
          subject: qData.subject || aiSubjectInput,
          banca: qData.banca || aiBancaInput,
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
                <span>Baixando Lote de Questões...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                <span>Baixar questões e atualizar</span>
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

        {/* Simulado Cronometrado Button */}
        <div className="ml-auto flex items-center space-x-2">
          {!isSimuladoActive && !isSimuladoFinished && (
            <button
              onClick={() => startSimulado(15)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Timer className="w-4 h-4" />
              <span>Iniciar Simulado Cronometrado (15 min)</span>
            </button>
          )}

          {isSimuladoActive && (
            <button
              onClick={finishSimulado}
              className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Entregar e Finalizar Prova</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulado Active Timer Bar */}
      {isSimuladoActive && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs font-mono font-black text-lg">
              {formatTimer(simuladoTimer)}
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                ⏱️ SIMULADO EM ANDAMENTO (CRONÔMETRO ATIVO)
              </p>
              <p className="text-[11px] text-amber-800">
                Questão {currentIndex + 1} de {filteredQuestions.length} | O gabarito e os comentários serão revelados ao entregar a prova.
              </p>
            </div>
          </div>
          <button
            onClick={finishSimulado}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
          >
            Finalizar Prova
          </button>
        </div>
      )}

      {/* Simulado Finished Screen */}
      {isSimuladoFinished && (
        <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-2xl space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 font-display">
              Simulado Concluído com Sucesso!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Confira abaixo o seu desempenho geral no teste simulado de enfermagem.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <span className="text-2xl font-black text-rose-700 block">
                {Math.round(
                  (Object.keys(simuladoAnswers).filter(
                    (qId) =>
                      simuladoAnswers[qId] === questions.find((q) => q.id === qId)?.correctIndex
                  ).length /
                    (filteredQuestions.length || 1)) *
                    100
                )}%
              </span>
              <span className="text-[11px] font-bold text-rose-900">Aproveitamento</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-2xl font-black text-emerald-700 block">
                {
                  Object.keys(simuladoAnswers).filter(
                    (qId) =>
                      simuladoAnswers[qId] === questions.find((q) => q.id === qId)?.correctIndex
                  ).length
                }
              </span>
              <span className="text-[11px] font-bold text-emerald-900">Acertos</span>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <span className="text-2xl font-black text-red-700 block">
                {
                  filteredQuestions.length -
                    Object.keys(simuladoAnswers).filter(
                      (qId) =>
                        simuladoAnswers[qId] === questions.find((q) => q.id === qId)?.correctIndex
                    ).length
                }
              </span>
              <span className="text-[11px] font-bold text-red-900">Erros / Não resp.</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-2xl font-black text-slate-700 block font-mono">
                {formatTimer(simuladoInitialTime - simuladoTimer)}
              </span>
              <span className="text-[11px] font-bold text-slate-600">Tempo Gasto</span>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setIsSimuladoFinished(false);
                setIsSimuladoActive(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Revisar Respostas</span>
            </button>
            <button
              onClick={() => startSimulado(15)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
            >
              <Play className="w-4 h-4" />
              <span>Novo Simulado</span>
            </button>
          </div>
        </div>
      )}

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
        <div
          className={`rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 transition-all relative ${
            readingComfortMode
              ? 'bg-[#FAF8F5] text-slate-900 border-amber-200/80 shadow-amber-900/5'
              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800'
          }`}
        >
          {/* Streak Toast Floating Banner */}
          {streakToast && (
            <div className="bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce border border-slate-700 mx-auto w-max">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{streakToast}</span>
            </div>
          )}

          {/* Question Top Interactive Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {currentQ.subject}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Banca: {currentQ.banca}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
                {currentQ.difficulty}
              </span>
              {currentQ.isAiGenerated && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Inédita via IA</span>
                </span>
              )}
            </div>

            {/* Reading Mode & Interactive Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {correctStreak > 0 && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center space-x-1 border border-amber-300">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>{correctStreak} em sequência</span>
                </span>
              )}

              <button
                onClick={() => setReadingComfortMode(!readingComfortMode)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                  readingComfortMode
                    ? 'bg-amber-200 text-amber-900 border-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Modo Leitura Confortável (Atalho M)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Leitura Soft</span>
              </button>

              <button
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                title="Atalhos do Teclado"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowScratchpad(!showScratchpad)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                  showScratchpad
                    ? 'bg-teal-600 text-white border-teal-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Rascunho / Bloco de Notas para Cálculos"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Rascunho</span>
              </button>

              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className="p-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors text-amber-500 border border-transparent hover:border-amber-200"
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

          {/* Keyboard Shortcuts Popover / Legend */}
          {showKeyboardHelp && (
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-700 text-xs space-y-2 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-amber-400 flex items-center space-x-1.5">
                  <Keyboard className="w-4 h-4" />
                  <span>Atalhos de Teclado Ativos (Navegação Rápida)</span>
                </span>
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-slate-800 rounded-xl">
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">1 - 5</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">A - E</kbd>: Selecionar alternativa
                </div>
                <div className="p-2 bg-slate-800 rounded-xl">
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">Enter</kbd>: Confirmar gabarito
                </div>
                <div className="p-2 bg-slate-800 rounded-xl">
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">→</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">N</kbd>: Próxima questão
                </div>
                <div className="p-2 bg-slate-800 rounded-xl">
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono font-bold text-amber-300">P</kbd>: Questão anterior
                </div>
              </div>
            </div>
          )}

          {/* Scratchpad Collapsible Area */}
          {showScratchpad && (
            <div className="bg-amber-50/90 dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 space-y-2 animate-fade-in shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  <span>Bloco de Rascunho / Cálculos de Doses da Questão</span>
                </span>
                <span className="text-[10px] text-amber-700">Anotações salvas localmente</span>
              </div>
              <textarea
                value={questionNotes[currentQ.id] || ''}
                onChange={(e) =>
                  setQuestionNotes({ ...questionNotes, [currentQ.id]: e.target.value })
                }
                placeholder="Rascunhe regras de três, conversões de mL/h ou observações para esta questão..."
                rows={3}
                className="w-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}

          {/* Statement */}
          <div className="text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-semibold">
            {currentQ.statement}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D, E
              const isAnswered = currentQ.userAnswer !== undefined;
              const isSelected = selectedOption === idx || currentQ.userAnswer === idx;
              const isCorrectOption = idx === currentQ.correctIndex;
              const isEliminated = (eliminatedOptions[currentQ.id] || []).includes(idx);

              let optionStyle = readingComfortMode
                ? 'border-stone-200 bg-white/80 hover:border-teal-400 text-stone-800'
                : 'border-slate-200 dark:border-slate-800 hover:border-teal-500 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200';

              if (isEliminated && !isAnswered) {
                optionStyle = 'border-slate-200 bg-slate-100/60 dark:bg-slate-800/20 text-slate-400 line-through opacity-60';
              } else if (isAnswered) {
                if (isCorrectOption) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/80 text-rose-950 dark:text-rose-100 font-bold';
                }
              } else if (isSelected) {
                optionStyle = 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/60 text-teal-950 dark:text-teal-100 font-bold ring-2 ring-teal-500 shadow-md';
              }

              return (
                <div
                  key={idx}
                  onClick={() => !isAnswered && handleOptionSelect(idx)}
                  className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start space-x-3 text-sm sm:text-base ${optionStyle}`}
                >
                  {/* Option Badge */}
                  <div className="mt-0.5 flex items-center space-x-2">
                    <span
                      className={`w-7 h-7 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : isAnswered && isCorrectOption
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {optionLetter}
                    </span>
                  </div>

                  <span className="flex-1 leading-snug pt-0.5">{option}</span>

                  {/* Eliminate Button (Riscar Alternativa) */}
                  {!isAnswered && (
                    <button
                      type="button"
                      onClick={(e) => toggleEliminateOption(idx, e)}
                      className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold flex items-center space-x-1 ${
                        isEliminated
                          ? 'opacity-100 text-rose-600 bg-rose-50 border border-rose-200'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                      }`}
                      title={isEliminated ? 'Restaurar alternativa' : 'Riscar alternativa (Eliminar hipótese)'}
                    >
                      <Scissors className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <div>
              {currentQ.userAnswer === undefined ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className={`w-full sm:w-auto font-extrabold text-xs py-3 px-7 rounded-2xl transition-all shadow-md ${
                    selectedOption !== null
                      ? 'bg-teal-700 hover:bg-teal-600 text-white shadow-teal-900/20 active:scale-98'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar e Responder (Enter)
                </button>
              ) : (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center space-x-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>{showExplanation ? 'Ocultar Comentário' : '📖 Ver Comentário Técnico do Professor'}</span>
                </button>
              )}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-400 mr-2">
                {currentIndex + 1} / {filteredQuestions.length}
              </span>

              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`p-2.5 rounded-xl border transition-colors ${
                  currentIndex === 0
                    ? 'border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800'
                }`}
                title="Questão Anterior (← ou P)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className={`p-2.5 rounded-xl border transition-colors ${
                  currentIndex === filteredQuestions.length - 1
                    ? 'border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800'
                }`}
                title="Próxima Questão (→ ou N)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Detailed Explanation Box */}
          {(showExplanation || currentQ.userAnswer !== undefined) && (
            <div className="mt-4 p-5 rounded-2xl bg-teal-50/60 dark:bg-slate-900/90 border border-teal-200/80 dark:border-teal-900/60 space-y-2 animate-fade-in shadow-xs">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-teal-900 dark:text-teal-300 flex items-center space-x-1.5 font-display">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Fundamentação Técnica & Legislação Aplicada</span>
              </h4>
              <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed [&_strong]:font-bold [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-0.5">
                <Markdown>{currentQ.explanation}</Markdown>
              </div>
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
