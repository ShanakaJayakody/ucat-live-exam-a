// File: src/components/QuestionDisplay.tsx (New Version)

import React from 'react';
import { Question } from '../types';

interface Props {
  question: Question;
}

const QuestionDisplay: React.FC<Props> = ({ question }) => {
  if (!question) {
    return <div>No question selected.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <p className="text-lg font-semibold mb-4">{question.text}</p>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              name={`question_${question.id}`}
              id={`option_${index}`}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <label htmlFor={`option_${index}`} className="ml-3 text-gray-700">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;