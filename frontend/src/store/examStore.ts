// File: src/store/examStore.ts (Corrected and Fully-Typed Version)

import { create } from 'zustand';
import { ExamState } from '../types';

// ... (Your Question and ExamSections interfaces are good, keep them)
export interface Question {
    id: string;
    section: string;
    questionText: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    passage?: string;
    explanation?: string;
}

export interface ExamSections {
    verbal_reasoning: Question[];
    decision_making: Question[];
    quantitative_reasoning: Question[];
    abstract_reasoning: Question[];
    situational_judgement: Question[];
}

export const useExamStore = create<ExamState>((set) => ({
  status: 'loading',
  currentSectionIndex: 0,
  sections: [],
  answers: {},
  sectionTimers: {},
  setSections: (sections) => set({ sections, status: 'ready' }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),
  setSectionTimer: (sectionId, time) =>
    set((state) => ({
      sectionTimers: {
        ...state.sectionTimers,
        [sectionId]: time,
      },
    })),
  startExam: () => set({ status: 'active' }),
  setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
}));