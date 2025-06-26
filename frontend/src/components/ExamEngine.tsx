import React, { useEffect } from 'react';
import SectionView from './SectionView';
import { useExamStore } from '../store/examStore';
import { fetchExamDocument } from '../services/examService';
import { Section } from '../types';

const ExamEngine: React.FC = () => {
  const status = useExamStore((state) => state.status);
  const setSections = useExamStore((state) => state.setSections);
  const startExam = useExamStore((state) => state.startExam);
  const sections = useExamStore((state) => state.sections);
  const currentSectionIndex = useExamStore((state) => state.currentSectionIndex);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const sectionsData = await fetchExamDocument('main-exam-id'); // Using a placeholder ID
        setSections(sectionsData);
      } catch (error) {
        console.error("Failed to load exam:", error);
        // Here you could set an error status in the store
      }
    };

    if (status === 'loading') {
      loadExam();
    }
  }, [status, setSections]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold animate-pulse">Loading Exam...</h1>
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
        <div className="text-center bg-white p-10 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold mb-4">UCAT Mock Exam</h1>
          <p className="text-lg text-gray-700 mb-8">You are ready to begin. The exam will start as soon as you click the button below. Good luck.</p>
          <button
            onClick={startExam}
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg text-xl hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (status === 'active') {
    return (
      <main className="flex flex-col items-center min-h-screen bg-gray-100 p-4 md:p-8 space-y-6">
        <p>Current Section: {sections[currentSectionIndex]?.name}</p>
        <SectionView />
      </main>
    );
  }

  return <div className="text-red-500 text-center mt-10">An unexpected error occurred. Please refresh the page.</div>;
};

export default ExamEngine; 