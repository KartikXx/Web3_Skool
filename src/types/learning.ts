// Type definitions for interactive learning quests

export interface LearningContent {
  id: string;
  title: string;
  content: string; // Can include HTML markup
  imageUrl?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  explanation?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  content: LearningContent;
  questions: Question[];
} 