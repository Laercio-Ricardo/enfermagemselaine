/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { generateDailyQuestionsAI } from './services/geminiService';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { QuestionsModule } from './components/QuestionsModule';
import { FlashcardsModule } from './components/FlashcardsModule';
import { ScheduleModule } from './components/ScheduleModule';
import { AITutorModule } from './components/AITutorModule';
import { ReportsModule } from './components/ReportsModule';
import { StudyMaterialsModule } from './components/StudyMaterialsModule';
import { DosageCalculatorModule } from './components/DosageCalculatorModule';
import { NursingNotesModule } from './components/NursingNotesModule';
import { SyncBackupModal } from './components/SyncBackupModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { SplashScreen } from './components/SplashScreen';

import { AppState, Question, Flashcard, ScheduleItem, WeeklyReportData, StudyArticle, SubjectCategory } from './types';
import { INITIAL_APP_STATE } from './data/initialData';
import { calculateSM2 } from './utils/sm2';

const LOCAL_STORAGE_KEY = 'enfermagem_pro_app_state_v1';

export default function App() {
  // Load initial state from LocalStorage or Fallback safely
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_APP_STATE,
          ...parsed,
          questions: Array.isArray(parsed.questions) && parsed.questions.length > 0 ? parsed.questions : INITIAL_APP_STATE.questions,
          flashcards: Array.isArray(parsed.flashcards) && parsed.flashcards.length > 0 ? parsed.flashcards : INITIAL_APP_STATE.flashcards,
          articles: Array.isArray(parsed.articles) && parsed.articles.length > 0 ? parsed.articles : INITIAL_APP_STATE.articles,
          schedule: Array.isArray(parsed.schedule) && parsed.schedule.length > 0 ? parsed.schedule : INITIAL_APP_STATE.schedule,
          weeklyReports: Array.isArray(parsed.weeklyReports) && parsed.weeklyReports.length > 0 ? parsed.weeklyReports : INITIAL_APP_STATE.weeklyReports,
          activities: parsed.activities && typeof parsed.activities === 'object' ? parsed.activities : INITIAL_APP_STATE.activities,
          notificationSettings: parsed.notificationSettings || INITIAL_APP_STATE.notificationSettings,
          cloudSync: parsed.cloudSync || INITIAL_APP_STATE.cloudSync,
          lastLocation: parsed.lastLocation || INITIAL_APP_STATE.lastLocation,
        };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return INITIAL_APP_STATE;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Online / Offline listener state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Modals state
  const [isSyncOpen, setIsSyncOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Daily auto update state
  const [isUpdatingDaily, setIsUpdatingDaily] = useState<boolean>(false);
  const [dailyNotificationMsg, setDailyNotificationMsg] = useState<string>('');

  // Function to fetch daily questions automatically or manually
  const fetchDailyQuestions = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setIsUpdatingDaily(true);
    try {
      const questionsData = await generateDailyQuestionsAI(todayStr);
      if (Array.isArray(questionsData) && questionsData.length > 0) {
        const newDailyQs: Question[] = questionsData.map((q: any, i: number) => ({
          id: `q-daily-${Date.now()}-${i}`,
          statement: q.statement,
          options: q.options || [],
          correctIndex: q.correctIndex ?? 0,
          explanation: q.explanation || '',
          subject: q.subject || 'Fundamentos de Enfermagem',
          banca: q.banca || 'VUNESP',
          difficulty: q.difficulty || 'Média',
          isAiGenerated: true,
        }));

        setAppState((prev) => ({
          ...prev,
          questions: [...newDailyQs, ...prev.questions],
          lastDailyUpdateDate: todayStr,
        }));

        setDailyNotificationMsg('✨ 5 Novas questões do dia foram atualizadas automaticamente pela IA!');
        setTimeout(() => setDailyNotificationMsg(''), 7000);
      }
    } catch (err) {
      console.error('Error auto-updating daily questions:', err);
    } finally {
      setIsUpdatingDaily(false);
    }
  };

  // Auto-trigger daily update on mount if today hasn't been updated yet
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (appState.lastDailyUpdateDate !== todayStr) {
      fetchDailyQuestions();
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [appState]);

  // Ensure light theme and sync meta theme-color
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', '#fff1f2');
    localStorage.removeItem('enfermagem_pro_dark_mode');
  }, []);

  // Network online/offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update last study location when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setAppState((prev) => ({
      ...prev,
      lastLocation: {
        tab,
        itemTitle: tab === 'questions' ? 'Banco de Questões de Concurso' : tab === 'flashcards' ? 'Revisão de Flashcards SM-2' : tab === 'schedule' ? 'Cronograma Semanal' : 'Painel de Estudos',
        timestamp: new Date().toISOString(),
      },
    }));
  };

  // Handler: Answer Question
  const handleAnswerQuestion = (questionId: string, selectedOption: number, isCorrect: boolean) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setAppState((prev) => {
      const updatedQuestions = prev.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            userAnswer: selectedOption,
            isCorrect,
            answeredAt: new Date().toISOString(),
          };
        }
        return q;
      });

      const currentDaily = prev.activities[todayStr] || {
        date: todayStr,
        questionsAnswered: 0,
        correctAnswers: 0,
        minutesStudied: 0,
        flashcardsReviewed: 0,
      };

      const updatedDaily = {
        ...currentDaily,
        questionsAnswered: currentDaily.questionsAnswered + 1,
        correctAnswers: currentDaily.correctAnswers + (isCorrect ? 1 : 0),
        minutesStudied: currentDaily.minutesStudied + 2,
      };

      return {
        ...prev,
        questions: updatedQuestions,
        activities: {
          ...prev.activities,
          [todayStr]: updatedDaily,
        },
      };
    });
  };

  // Handler: Toggle Bookmark
  const handleToggleBookmark = (questionId: string) => {
    setAppState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
      ),
    }));
  };

  // Handler: Add AI Generated Question
  const handleAddNewAiQuestion = (newQ: Question) => {
    setAppState((prev) => ({
      ...prev,
      questions: [newQ, ...prev.questions],
    }));
  };

  // Handler: Rate Flashcard (SM-2)
  const handleUpdateFlashcard = (cardId: string, rating: 'Errei' | 'Difícil' | 'Médio' | 'Fácil') => {
    const todayStr = new Date().toISOString().split('T')[0];

    setAppState((prev) => {
      const updatedCards = prev.flashcards.map((f) => {
        if (f.id === cardId) {
          const sm2 = calculateSM2(f, rating);
          return {
            ...f,
            difficultyRating: rating,
            lastReviewed: new Date().toISOString(),
            nextReviewDate: sm2.nextReviewDate,
            intervalDays: sm2.intervalDays,
            repetitions: sm2.repetitions,
            easeFactor: sm2.easeFactor,
          };
        }
        return f;
      });

      const currentDaily = prev.activities[todayStr] || {
        date: todayStr,
        questionsAnswered: 0,
        correctAnswers: 0,
        minutesStudied: 0,
        flashcardsReviewed: 0,
      };

      const updatedDaily = {
        ...currentDaily,
        flashcardsReviewed: currentDaily.flashcardsReviewed + 1,
        minutesStudied: currentDaily.minutesStudied + 1,
      };

      return {
        ...prev,
        flashcards: updatedCards,
        activities: {
          ...prev.activities,
          [todayStr]: updatedDaily,
        },
      };
    });
  };

  // Handler: Add New Flashcards
  const handleAddFlashcards = (newCards: Flashcard[]) => {
    setAppState((prev) => ({
      ...prev,
      flashcards: [...newCards, ...prev.flashcards],
    }));
  };

  // Handler: Toggle Schedule Item
  const handleToggleScheduleItem = (itemId: string) => {
    setAppState((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s) =>
        s.id === itemId ? { ...s, completed: !s.completed } : s
      ),
    }));
  };

  // Handler: Add Schedule Item
  const handleAddScheduleItem = (newItem: ScheduleItem) => {
    setAppState((prev) => ({
      ...prev,
      schedule: [...prev.schedule, newItem],
    }));
  };

  // Handler: Add New Study Article
  const handleAddArticle = (newArt: StudyArticle) => {
    setAppState((prev) => ({
      ...prev,
      articles: [newArt, ...(prev.articles || [])],
    }));
  };

  // Handler: Add New Weekly Report
  const handleAddNewReport = (newReport: WeeklyReportData) => {
    setAppState((prev) => ({
      ...prev,
      weeklyReports: [newReport, ...prev.weeklyReports],
    }));
  };

  // Handler: Resume Last Study Location
  const handleResumeLastStudy = () => {
    const targetTab = appState.lastLocation.tab || 'questions';
    setActiveTab(targetTab);
  };

  return (
    <div className="relative min-h-screen bg-rose-50/40 text-slate-900 font-sans transition-colors duration-200 flex flex-col">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOnline={isOnline}
        streakDays={7}
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Floating Daily Auto-Update Notification Banner */}
      {dailyNotificationMsg && (
        <div className="bg-rose-600 text-white text-xs font-bold py-2.5 px-4 text-center shadow-md animate-fade-in flex items-center justify-center space-x-2">
          <span>{dailyNotificationMsg}</span>
          <button
            onClick={() => setDailyNotificationMsg('')}
            className="ml-3 underline hover:opacity-80 text-[11px]"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            state={appState}
            setActiveTab={handleTabChange}
            onResumeLastStudy={handleResumeLastStudy}
          />
        )}

        {activeTab === 'calculator' && <DosageCalculatorModule />}

        {activeTab === 'nursing-notes' && <NursingNotesModule />}

        {activeTab === 'studies' && (
          <StudyMaterialsModule
            articles={appState.articles || []}
            onAddArticle={handleAddArticle}
            onGoToQuestionsWithSubject={() => setActiveTab('questions')}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionsModule
            questions={appState.questions}
            onAnswerQuestion={handleAnswerQuestion}
            onToggleBookmark={handleToggleBookmark}
            onAddNewAiQuestion={handleAddNewAiQuestion}
            onTriggerDailyUpdate={fetchDailyQuestions}
            isUpdatingDaily={isUpdatingDaily}
            lastDailyUpdateDate={appState.lastDailyUpdateDate}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsModule
            flashcards={appState.flashcards}
            onUpdateFlashcard={handleUpdateFlashcard}
            onAddFlashcards={handleAddFlashcards}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleModule
            schedule={appState.schedule}
            onToggleScheduleItem={handleToggleScheduleItem}
            onAddScheduleItem={handleAddScheduleItem}
          />
        )}

        {activeTab === 'tutor' && <AITutorModule />}

        {activeTab === 'reports' && (
          <ReportsModule state={appState} onAddNewReport={handleAddNewReport} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white py-6 text-center text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-800">
            ⚡ <strong className="font-extrabold text-slate-900">Enfermagem Pro</strong> - Plataforma Especializada para Técnica em Enfermagem & Concursos.
          </p>
          <p className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-1.5">
            <span>Criado com carinho por <strong className="font-extrabold text-slate-900">Laércio Ricardo</strong></span>
            <span>•</span>
            <span className="inline-flex items-center space-x-1 text-rose-600 font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
              <span>Oferecido especialmente para <strong className="font-extrabold text-rose-600">Gisselaine</strong></span>
            </span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <SyncBackupModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        state={appState}
        onImportData={(newState) => setAppState(newState)}
        onToggleAutoBackup={(val) =>
          setAppState((prev) => ({
            ...prev,
            cloudSync: { ...prev.cloudSync, autoBackup: val },
          }))
        }
        isOnline={isOnline}
      />

      <NotificationSettingsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        settings={appState.notificationSettings}
        onUpdateSettings={(newSettings) =>
          setAppState((prev) => ({
            ...prev,
            notificationSettings: newSettings,
          }))
        }
      />

    </div>
  );
}
