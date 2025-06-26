// File: src/components/QuestionDisplay.tsx (Corrected Version)

import React from 'react';
// FIX: We import the types we need directly from the store file.
import { useExamStore, Question, ExamSections } from '../store/examStore';

// FIX: This is the main correction. We define the type for `sectionKey`
// by referencing the keys of the `ExamSections` interface we already made.
// This is much cleaner and solves the TypeScript errors.
interface Props {
  question: Question;
  sectionKey: keyof ExamSections; 
}

// FIX: We add `export` here to make this a named export.
export const QuestionDisplay: React.FC<Props> = ({ question, sectionKey }) => {
  const answerQuestion = useExamStore((state) => state.answerQuestion);
  const currentAnswer = useExamStore((state) => state.answers[sectionKey]?.[question.id]);

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-md">
      {question.passage && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{question.passage}</p>
        </div>
      )}
      <p className="text-lg font-semibold text-gray-800 mb-4">{question.questionText}</p>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => answerQuestion(sectionKey, question.id, option.id)}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all
                        ${currentAnswer === option.id 
                            ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300' 
                            : 'border-gray-300 bg-white hover:bg-gray-100'
                        }`}
          >
            <span className="font-bold mr-3">{option.id}.</span>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};