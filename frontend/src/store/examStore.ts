import { create } from 'zustand';
import { ExamState } from '../types';

const useExamStore = create<ExamState>((set) => ({
  currentSectionIndex: 0,
  sections: [],
  answers: {},
  sectionTimers: {},
  setCurrentSectionIndex: (index) => set({ currentSectionIndex: index }),
  setSections: (sections) => set({ sections }),
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
}));

export default useExamStore; 