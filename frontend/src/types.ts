export type ExamStatus = 'loading' | 'ready' | 'active' | 'finished';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Section {
  id: string;
  name: string;
  questions: Question[];
  time: number;
}

export interface ExamState {
  status: ExamStatus;
  currentSectionIndex: number;
  sections: Section[];
  answers: { [questionId: string]: string };
  sectionTimers: { [sectionId: string]: number };
  setCurrentSectionIndex: (index: number) => void;
  setSections: (sections: Section[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setSectionTimer: (sectionId: string, time: number) => void;
  startExam: () => void;
} 