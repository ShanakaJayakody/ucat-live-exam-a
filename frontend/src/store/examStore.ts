// File: src/store/examStore.ts (Corrected and Final Version)

import { create } from 'zustand';
import { StateCreator } from 'zustand';

// Define the types for our data for TypeScript
export interface Question {
    id: string;
    section: string;
    questionText: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    passage?: string; 
    stimulus?: string;
    explanation?: string; 
}

export interface ExamSections {
    verbal_reasoning: Question[];
    decision_making: Question[];
    quantitative_reasoning: Question[];
    abstract_reasoning: Question[];
    situational_judgement: Question[];
}

// This is the interface the error is about
interface ExamState {
  sections: Partial<ExamSections>;
  sectionOrder: (keyof ExamSections)[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, Record<string, any>>;
  status: 'loading' | 'ready' | 'active' | 'finished' | 'error';
  // FIX IS HERE: We are defining `setQuestions` so TypeScript knows it exists.
  setQuestions: (groupedQuestions: Partial<ExamSections>) => void; 
  startExam: () => void;
  answerQuestion: (sectionKey: string, questionId: string, answer: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (questionIndex: number) => void;
  completeSection: () => void;
}

const sectionOrder: (keyof ExamSections)[] = [
    "verbal_reasoning",
    "decision_making",
    "quantitative_reasoning",
    "abstract_reasoning",
    "situational_judgement"
];

const examStateCreator: StateCreator<ExamState> = (set, get) => ({
  sections: {},
  sectionOrder: sectionOrder,
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  status: 'loading',

  // FIX IS HERE: We are implementing the `setQuestions` function.
  setQuestions: (groupedQuestions) => set({ sections: groupedQuestions, status: 'ready' }),
  startExam: () => set({ status: 'active' }),

  answerQuestion: (sectionKey, questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [sectionKey]: {
          ...state.answers[sectionKey],
          [questionId]: answer,
        },
      },
    })),

  nextQuestion: () => {
    const sectionKey = get().sectionOrder[get().currentSectionIndex];
    const currentSectionLength = get().sections[sectionKey]?.length || 0;
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, currentSectionLength - 1),
    }));
  },

  prevQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    }));
  },
  
  goToQuestion: (questionIndex: number) => {
    set({ currentQuestionIndex: questionIndex });
  },

  completeSection: () => {
    const { currentSectionIndex, sectionOrder } = get();
    if (currentSectionIndex < sectionOrder.length - 1) {
      set({
        currentSectionIndex: currentSectionIndex + 1,
        currentQuestionIndex: 0,
      });
    } else {
      set({ status: 'finished' });
    }
  },
});

export const useExamStore = create(examStateCreator);