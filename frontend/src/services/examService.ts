// File: src/components/ExamEngine.tsx (New Version)

import React, { useEffect } from 'react';
import SectionView from './SectionView';
import { useExamStore, Question } from '../store'; // Import the store and Question type
import { fetchExamQuestions } from '../services/examService'; // <-- Import your new AI-generated function

// Helper function to group the flat array of questions into sections
// This is needed because your questions.json is a single flat list
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
  // Get state and actions from our global Zustand store
  const status = useExamStore((state) => state.status);
  const setQuestions = useExamStore((state) => state.setQuestions);
  const startExam = useExamStore((state) => state.startExam);

  // This `useEffect` hook runs once when the component first loads.
  // Its job is to fetch the exam data from Firestore.
  useEffect(() => {
    const loadExam = async () => {
      try {
        // 1. Call the function from your examService to get the questions
        const flatQuestionsArray = await fetchExamQuestions();

        // 2. Group the questions into sections using our helper function
        const groupedQuestions = groupQuestionsBySection(flatQuestionsArray);

        // 3. Update the global store with the structured questions
        setQuestions(groupedQuestions);

      } catch (error) {
        console.error("Failed to load exam:", error);
        // Here you would set a global error state to show a message to the user
      }
    };

    // We only want to fetch if the status is 'loading' to prevent re-fetching
    if (status === 'loading') {
      loadExam();
    }
  }, [status, setQuestions]); // Dependencies for the hook

  // --- Render different UI based on the exam's status ---

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
                onClick={startExam} // This function is from our store
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
        {/* We will build out the real exam view here in the next step */}
        <SectionView />
      </main>
    );
  }

  // A fallback for any other state, like an error
  return <div className="text-red-500 text-center mt-10">An unexpected error occurred. Please refresh the page.</div>;
};

export default ExamEngine;