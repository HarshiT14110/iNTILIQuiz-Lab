
export type UserRole = 'contender' | 'curator';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface LiveSession {
  id: string;
  quizId: string;
  securityCode: string;
  tutorId: string;
  status: 'lobby' | 'active' | 'finished';
  quizData: Quiz;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export type AppView = 'landing' | 'auth' | 'tutor-workspace' | 'student-workspace' | 'live-quiz' | 'database' | 'history';
