export type SubjectCategory =
  | 'Fundamentos de Enfermagem'
  | 'Farmacologia'
  | 'Saúde Pública & SUS'
  | 'Enfermagem Médico-Cirúrgica & Urgência'
  | 'Saúde da Mulher e da Criança'
  | 'Ética e Legislação de Enfermagem'
  | 'Imunização & PNI';

export type BancaType = 'VUNESP' | 'CESPE/Cebraspe' | 'FGV' | 'IBFC' | 'AOCP' | 'Consulplan' | 'Geral';

export interface Question {
  id: string;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: SubjectCategory;
  banca: BancaType;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  userAnswer?: number;
  isCorrect?: boolean;
  answeredAt?: string;
  isBookmarked?: boolean;
  isAiGenerated?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: SubjectCategory;
  difficultyRating?: 'Fácil' | 'Médio' | 'Difícil' | 'Errei';
  lastReviewed?: string;
  nextReviewDate: string; // ISO format string
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
  isAiGenerated?: boolean;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  timeSlot: string; // ex: "09:00 - 10:30"
  subject: SubjectCategory;
  topic: string;
  completed: boolean;
  notes?: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  questionsAnswered: number;
  correctAnswers: number;
  minutesStudied: number;
  flashcardsReviewed: number;
}

export interface WeeklyReportData {
  id: string;
  generatedAt: string;
  statsSummary: {
    totalQuestions: number;
    accuracy: number;
    minutesStudied: number;
    flashcardsReviewed: number;
  };
  diagnostic: string;
  prioritySubjects: string[];
  tips: string[];
  recommendedScheduleFocus: string;
}

export interface StudyArticle {
  id: string;
  title: string;
  subject: SubjectCategory;
  summary: string;
  keyPoints: string[];
  cofenNorm?: string;
  mnemonic?: string;
  contentMarkdown: string;
  readTimeMinutes: number;
  isAiGenerated?: boolean;
}

export interface AppState {
  questions: Question[];
  flashcards: Flashcard[];
  articles?: StudyArticle[];
  schedule: ScheduleItem[];
  activities: Record<string, DailyActivity>; // key: YYYY-MM-DD
  bookmarks: string[]; // question ids
  lastDailyUpdateDate?: string; // YYYY-MM-DD
  lastLocation: {
    tab: string;
    itemTitle?: string;
    timestamp: string;
  };
  notificationSettings: {
    enabled: boolean;
    reminderTime: string; // "20:00"
    frequency: 'daily' | 'weekdays' | 'custom';
    pushPermissionGranted: boolean;
  };
  cloudSync: {
    autoBackup: boolean;
    lastSyncedAt?: string;
    syncCode: string;
  };
  weeklyReports: WeeklyReportData[];
}
