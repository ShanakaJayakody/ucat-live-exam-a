// File: src/store/examStore.ts (Corrected and Final Version)

import { create } from 'zustand';
import { StateCreator } from 'zustand';

// Define the types for our data for TypeScript
export interface Question {
    id: string;
    section: string;
    questionText?: string; // Optional for syllogisms
    options?: { id: string; text: string }[]; // Optional for syllogisms
    correctAnswer?: string; // Optional for syllogisms
    passage?: string; 
    stimulus?: string;
    explanation?: string;
    // New properties for Syllogism questions
    questionType?: 'standard' | 'syllogism' | 'interpreting_information';
    premises?: string[];
    statements?: string[];
    correctAnswers?: string[]; // Generic for multi-part answers
}

export interface ExamSections {
    verbal_reasoning: Question[];
    decision_making: Question[];
    quantitative_reasoning: Question[];
}

// This is the interface the error is about
interface ExamState {
  sections: Partial<ExamSections>;
  sectionOrder: (keyof ExamSections)[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, Record<string, any>>;
  flagged: Record<string, Record<string, boolean>>;
  questionTimes: Record<string, Record<string, number>>;
  reviewQuestionIndex: number | null;
  status: 'loading' | 'ready' | 'active' | 'review' | 'finished' | 'error' | 'instruction';
  // FIX IS HERE: We are defining `setQuestions` so TypeScript knows it exists.
  setQuestions: (groupedQuestions: Partial<ExamSections>) => void; 
  startExam: () => void;
  startCurrentSection: () => void;
  reviewExam: () => void;
  finishExam: () => void;
  answerQuestion: (sectionKey: string, questionId: string, answer: any) => void;
  answerMultiPartQuestion: (sectionKey: string, questionId: string, statementIndex: number, answer: string) => void;
  addQuestionTime: (sectionKey: string, questionId: string, time: number) => void;
  setReviewQuestion: (index: number | null) => void;
  toggleFlag: (sectionKey: string, questionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (questionIndex: number) => void;
  completeSection: () => void;
}

const sectionOrder: (keyof ExamSections)[] = [
    "verbal_reasoning",
    "decision_making",
    "quantitative_reasoning",
];

const examStateCreator: StateCreator<ExamState> = (set, get) => ({
  sections: {},
  sectionOrder: sectionOrder,
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  flagged: {},
  questionTimes: {},
  reviewQuestionIndex: null,
  status: 'loading',

  // FIX IS HERE: We are implementing the `setQuestions` function.
  setQuestions: (groupedQuestions) => set({ sections: groupedQuestions, status: 'ready' }),
  startExam: () => set({ status: 'instruction', currentSectionIndex: 0, reviewQuestionIndex: null }),
  startCurrentSection: () => set({ status: 'active', currentQuestionIndex: 0 }),
  reviewExam: () => set({ status: 'review' }),
  finishExam: () => set({ status: 'finished', reviewQuestionIndex: null }),

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

  answerMultiPartQuestion: (sectionKey, questionId, statementIndex, answer) =>
    set((state) => {
      const newAnswers = { ...state.answers };
      if (!newAnswers[sectionKey]) {
        newAnswers[sectionKey] = {};
      }
      const questionAnswers = (newAnswers[sectionKey][questionId] as string[] | undefined) || [];
      questionAnswers[statementIndex] = answer;
      newAnswers[sectionKey][questionId] = questionAnswers;
      return { answers: newAnswers };
    }),

  setReviewQuestion: (index) => {
    if (index !== null) {
      set({ status: 'active', currentQuestionIndex: index, reviewQuestionIndex: index });
    } else {
      set({ status: 'finished', reviewQuestionIndex: null });
    }
  },

  addQuestionTime: (sectionKey, questionId, time) =>
    set((state) => ({
      questionTimes: {
        ...state.questionTimes,
        [sectionKey]: {
          ...state.questionTimes[sectionKey],
          [questionId]: (state.questionTimes[sectionKey]?.[questionId] || 0) + time,
        },
      },
    })),

  toggleFlag: (sectionKey, questionId) =>
    set((state) => ({
      flagged: {
        ...state.flagged,
        [sectionKey]: {
          ...state.flagged[sectionKey],
          [questionId]: !state.flagged[sectionKey]?.[questionId],
        },
      },
    })),

  nextQuestion: () => {
    const { sections, currentSectionIndex, sectionOrder, currentQuestionIndex } = get();
    const sectionKey = sectionOrder[currentSectionIndex];
    const currentSectionLength = sections[sectionKey]?.length || 0;
    
    if (currentQuestionIndex < currentSectionLength - 1) {
        set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
        if (currentSectionIndex < sectionOrder.length - 1) {
            set({ status: 'instruction', currentSectionIndex: currentSectionIndex + 1 });
        } else {
            set({ status: 'finished' });
        }
    }
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
        status: 'instruction',
      });
    } else {
      set({ status: 'finished' });
    }
  },
});

export const useExamStore = create(examStateCreator);