// File: src/components/ExamEngine.tsx (Using questions.json)

import React, { useEffect } from 'react';
import SectionView from './SectionView';
import { useExamStore, Question } from '../store/examStore';
import { SetupScreen } from './SetupScreen';
import { ResultsScreen } from './ResultsScreen';
import { ReviewScreen } from './ReviewScreen';
import { InstructionScreen } from './InstructionScreen';

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
    return <SetupScreen />;
  }

  if (status === 'instruction') {
    return <InstructionScreen />;
  }

  if (status === 'active') {
    return (
      <div id="app-container">
        <SectionView />
      </div>
    );
  }

  if (status === 'review') {
    return <ReviewScreen />;
  }

  if (status === 'finished') {
    return <ResultsScreen />;
  }

  return <div className="text-red-500 text-center mt-10">An unexpected error occurred. Please refresh the page.</div>;
};

export default ExamEngine;