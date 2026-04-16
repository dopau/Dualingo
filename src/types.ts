export type Language = 'Spanish' | 'French' | 'German' | 'Japanese';

export interface UserStats {
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  lastActive: string;
  isOffline: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'translation' | 'multiple-choice' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  context?: string;
}

export interface CourseUnit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isLocked: boolean;
}

export interface Course {
  id: Language;
  name: string;
  flag: string;
  units: CourseUnit[];
}
