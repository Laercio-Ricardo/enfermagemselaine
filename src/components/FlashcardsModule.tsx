import React, { useState } from 'react';
import { generateFlashcardsAI } from '../services/geminiService';
import {
  Layers,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Loader2,
  Brain,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';
import { Flashcard, SubjectCategory } from '../types';
import { calculateSM2 } from '../utils/sm2';

interface FlashcardsModuleProps {
  flashcards: Flashcard[];
  onUpdateFlashcard: (cardId: string, rating: 'Errei' | 'Difícil' | 'Médio' | 'Fácil') => void;
  onAddFlashcards: (newCards: Flashcard[]) => void;
}

export const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({
  flashcards,
  onUpdateFlashcard,
  onAddFlashcards,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // AI Creator Modal State
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [topicInput, setTopicInput] = useState<string>('Farmacologia em Enfermagem');
  const [amountInput, setAmountInput] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Manual Card Creator State
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualFront, setManualFront] = useState<string>('');
  const [manualBack, setManualBack] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<SubjectCategory>('Fundamentos de Enfermagem');

  // Filter cards
  const filteredCards = flashcards.filter((f) => {
    if (selectedCategory !== 'Todas' && f.category !== selectedCategory) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleRateCard = (rating: 'Errei' | 'Difícil' | 'Médio' | 'Fácil') => {
    if (!currentCard) return;
    onUpdateFlashcard(currentCard.id, rating);
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handleGenerateAiFlashcards = async () => {
    setIsGenerating(true);
    try {
      const cardsData = await generateFlashcardsAI(topicInput, amountInput);
      if (Array.isArray(cardsData) && cardsData.length > 0) {
        const created: Flashcard[] = cardsData.map((fc: any, i: number) => ({
          id: `fc-ai-${Date.now()}-${i}`,
          front: fc.front,
          back: fc.back,
          category: (fc.category as SubjectCategory) || 'Fundamentos de Enfermagem',
          nextReviewDate: new Date().toISOString(),
          intervalDays: 1,
          repetitions: 0,
          easeFactor: 2.5,
          isAiGenerated: true,
        }));
        onAddFlashcards(created);
        setShowAiModal(false);
        setSelectedCategory('Todas');
      } else {
        alert('Erro ao gerar flashcards.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na requisição para a IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManualCard = () => {
    if (!manualFront.trim() || !manualBack.trim()) return;
    const newCard: Flashcard = {
      id: `fc-m-${Date.now()}`,
      front: manualFront,
      back: manualBack,
      category: manualCategory,
      nextReviewDate: new Date().toISOString(),
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5,
    };
    onAddFlashcards([newCard]);
    setManualFront('');
    setManualBack('');
    setShowManualModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-rose-100 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center space-x-2 font-display">
            <Layers className="w-6 h-6 text-rose-600" />
            <span>Flashcards com Repetição Espaçada (SM-2)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Revisão ativa otimizada para memorização de termos, cálculos e diretrizes do COFEN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-rose-50 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-slate-600 text-rose-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center space-x-1.5 border border-rose-200 dark:border-slate-600"
          >
            <Plus className="w-4 h-4 text-rose-600" />
            <span>Criar Cartão</span>
          </button>

          <button
            onClick={() => setShowAiModal(true)}
            className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Gerar Baralho por IA</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {['Todas', 'Fundamentos de Enfermagem', 'Farmacologia', 'Saúde Pública & SUS', 'Enfermagem Médico-Cirúrgica & Urgência', 'Saúde da Mulher e da Criança', 'Imunização & PNI'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-rose-100 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Flashcard Interactive Area */}
      {!currentCard ? (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <Brain className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            Nenhum cartão neste baralho ainda
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Crie cartões manualmente ou peça para a Inteligência Artificial gerar um baralho completo de estudos!
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            <span>Cartão {currentIndex + 1} de {filteredCards.length}</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">{currentCard.category}</span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] sm:min-h-[300px] bg-white dark:bg-slate-800/90 rounded-3xl border border-rose-100 dark:border-slate-700 shadow-xl p-8 flex flex-col justify-between cursor-pointer transition-all hover:border-rose-400 dark:hover:border-rose-500 relative group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="uppercase tracking-wider">
                {isFlipped ? 'Resposta / Explicação' : 'Frente (Pergunta / Conceito)'}
              </span>
              <span className="flex items-center space-x-1 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Clique para virar</span>
              </span>
            </div>

            {/* Card Content Text */}
            <div className="my-auto py-6 text-center">
              <p className={`text-lg sm:text-xl font-bold leading-relaxed transition-all ${
                isFlipped ? 'text-rose-800 dark:text-rose-300 font-semibold' : 'text-slate-800 dark:text-white'
              }`}>
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Próxima revisão em: {currentCard.intervalDays || 1} dia(s)</span>
              {currentCard.isAiGenerated && (
                <span className="text-pink-600 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Gerado via IA</span>
                </span>
              )}
            </div>
          </div>

          {/* SM-2 Self Evaluation Rating Bar (Visible when flipped or ready) */}
          <div className="space-y-2">
            <p className="text-center text-xs font-bold text-slate-600 dark:text-slate-300">
              Como foi a sua lembrança deste conceito?
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleRateCard('Errei')}
                className="bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/80 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-bold py-3 px-3 rounded-xl text-xs flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <span>🔴 Errei</span>
                <span className="text-[10px] font-normal opacity-80">Rever amanhã</span>
              </button>

              <button
                onClick={() => handleRateCard('Difícil')}
                className="bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-bold py-3 px-3 rounded-xl text-xs flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <span>🟠 Difícil</span>
                <span className="text-[10px] font-normal opacity-80">Rever em 2 dias</span>
              </button>

              <button
                onClick={() => handleRateCard('Médio')}
                className="bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/80 border border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200 font-bold py-3 px-3 rounded-xl text-xs flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <span>🟢 Médio</span>
                <span className="text-[10px] font-normal opacity-80">Rever em 4 dias</span>
              </button>

              <button
                onClick={() => handleRateCard('Fácil')}
                className="bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 border border-rose-300 text-rose-900 font-bold py-3 px-3 rounded-xl text-xs flex flex-col items-center justify-center space-y-1 transition-all"
              >
                <span>🔵 Fácil</span>
                <span className="text-[10px] font-normal opacity-80">Rever em 7+ dias</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* AI Flashcard Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 dark:border-slate-700 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center space-x-2 font-display">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Gerar Baralho via IA</span>
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tema ou Assunto Específico:
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="ex: Cálculo de Penicilina Cristalina, Escala de Braden..."
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantidade de Cartões:
                </label>
                <select
                  value={amountInput}
                  onChange={(e) => setAmountInput(Number(e.target.value))}
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                >
                  <option value={5}>5 Flashcards Rápido</option>
                  <option value={10}>10 Flashcards Completo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Cancelar
              </button>
              <button
                onClick={handleGenerateAiFlashcards}
                disabled={isGenerating}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center space-x-2 shadow-md disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />}
                <span>Gerar Cartões</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Card Creator Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 dark:border-slate-700 space-y-4 animate-scale-up">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display">Criar Flashcard Personalizado</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Frente (Pergunta/Conceito):
                </label>
                <textarea
                  value={manualFront}
                  onChange={(e) => setManualFront(e.target.value)}
                  rows={2}
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Verso (Resposta/Mnemônico):
                </label>
                <textarea
                  value={manualBack}
                  onChange={(e) => setManualBack(e.target.value)}
                  rows={3}
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Categoria:
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as SubjectCategory)}
                  className="w-full bg-rose-50/50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Fundamentos de Enfermagem">Fundamentos de Enfermagem</option>
                  <option value="Farmacologia">Farmacologia</option>
                  <option value="Saúde Pública & SUS">Saúde Pública & SUS</option>
                  <option value="Enfermagem Médico-Cirúrgica & Urgência">Urgência & Cirúrgica</option>
                  <option value="Saúde da Mulher e da Criança">Saúde Mulher & Criança</option>
                  <option value="Ética e Legislação de Enfermagem">Ética e Legislação</option>
                  <option value="Imunização & PNI">Imunização & PNI</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button onClick={() => setShowManualModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Cancelar
              </button>
              <button
                onClick={handleAddManualCard}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md"
              >
                Salvar Cartão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
