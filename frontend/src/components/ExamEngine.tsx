// File: src/components/ExamEngine.tsx (Using questions.json)

import React, { useEffect } from 'react';
import SectionView from './SectionView';
import { useExamStore, Question } from '../store/examStore';

// Helper function to group questions by section
const groupQuestionsBySection = (questions: Question[]) => {
  return questions.reduce((acc, question) => {
    const sectionKey = question.section;
    if (!acc[sectionKey]) {
      acc[sectionKey] = [];
    }
    acc[sectionKey].push(question);
    return acc;
  }, {} as Record<string, Question[]>);
};

const ExamEngine: React.FC = () => {
  const status = useExamStore((state) => state.status);
  const setQuestions = useExamStore((state) => state.setQuestions);
  const startExam = useExamStore((state) => state.startExam);

  useEffect(() => {
    const loadExam = async () => {
      try {
        // Fetch questions from the JSON file in the public directory
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const questions: Question[] = await response.json();
        
        // Group the questions by section
        const groupedQuestions = groupQuestionsBySection(questions);
        setQuestions(groupedQuestions);
      } catch (error) {
        console.error("Failed to load exam:", error);
      }
    };

    if (status === 'loading') {
      loadExam();
    }
  }, [status, setQuestions]);

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
    return <SectionView />;
  }

  return <div className="text-red-500 text-center mt-10">An unexpected error occurred. Please refresh the page.</div>;
};

export default ExamEngine;