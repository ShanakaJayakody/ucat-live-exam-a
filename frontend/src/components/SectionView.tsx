// File: src/components/SectionView.tsx (Corrected and Final Version)

import React from 'react';
import { QuestionDisplay } from './QuestionDisplay';
import { useExamStore } from '../store/examStore'; // Ensure path is correct

const SectionView: React.FC = () => {
  // Get all the state and actions we need from the store
  const {
    sections,
    sectionOrder,
    currentSectionIndex,
    currentQuestionIndex,
    nextQuestion,
    prevQuestion
  } = useExamStore();

  // --- THIS IS THE FIX ---
  // Step 1: Get the section name (e.g., "verbal_reasoning") using the index number.
  const sectionKey = sectionOrder[currentSectionIndex];

  // Step 2: Use the section name to get the actual section data from the object.
  const currentSection = sections[sectionKey];
  // -------------------------

  // Handle the brief moment before the section data is loaded
  if (!currentSection) {
    return <div>Loading section...</div>;
  }

  const question = currentSection[currentQuestionIndex];
  const totalQuestions = currentSection.length;

  // Handle case where a question might not exist (shouldn't happen in normal flow)
  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-4 z-10 border-b">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {sectionKey.replace(/_/g, ' ')}
          </h2>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
      </div>

      <QuestionDisplay question={question} sectionKey={sectionKey} />

      <div className="flex justify-between mt-8">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg disabled:bg-gray-300 hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SectionView;