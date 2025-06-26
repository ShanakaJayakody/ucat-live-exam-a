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
    prevQuestion,
    answers
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

  const sectionName = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const currentAnswer = answers[sectionKey]?.[question.id];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{sectionName}</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
              <span className="text-sm">📝</span>
              <span className="text-sm">Explain Answer</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
              <span className="text-sm">🧮</span>
              <span className="text-sm">Calculator</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">
            {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <button className="flex items-center space-x-2 px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            <span className="text-sm">🏳️</span>
            <span className="text-sm">Flag for Review</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Passage */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">
          {question.passage && (
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {question.passage}
              </div>
            </div>
          )}
        </div>

        {/* Blue Vertical Divider */}
        <div className="w-1 bg-blue-600"></div>

        {/* Right Panel - Question */}
        <div className="flex-1 p-6 bg-white overflow-y-auto">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {question.questionText}
              </p>
            </div>
            
            <div className="space-y-3 flex-1">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => useExamStore.getState().answerQuestion(sectionKey, question.id, option.id)}
                  className={`w-full p-4 text-left border rounded-lg transition-all text-sm
                              ${currentAnswer === option.id 
                                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-300' 
                                  : 'border-gray-300 bg-white hover:bg-gray-50'
                              }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                                    ${currentAnswer === option.id 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : 'border-gray-400'
                                    }`}>
                      {currentAnswer === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">{option.id}.</span>
                      <span className="ml-2 text-gray-800">{option.text}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-blue-600 px-6 py-3 flex items-center justify-between">
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          🏁 End Exam
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:bg-blue-800 disabled:opacity-50 hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <span>◀</span>
            <span>Previous</span>
          </button>
          
          <button className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors">
            ⚙️ Navigator
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:bg-blue-800 disabled:opacity-50 hover:bg-blue-800 transition-colors flex items-center space-x-2"
          >
            <span>Next</span>
            <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionView;