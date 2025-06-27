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
  isReviewMode: boolean;
}

// FIX: We add `export` here to make this a named export.
export const QuestionDisplay: React.FC<Props> = ({ question, sectionKey, isReviewMode }) => {
  const answerQuestion = useExamStore((state) => state.answerQuestion);
  const currentAnswer = useExamStore((state) => state.answers[sectionKey]?.[question.id]);

  const handleSelectOption = (optionId: string) => {
    if (isReviewMode) return;
    answerQuestion(sectionKey, question.id, optionId);
  };

  return (
    <>
      <h4 className="text-md font-semibold mb-3 sticky top-0 bg-white text-gray-900 pb-1">Question <span id="question-number">{useExamStore.getState().currentQuestionIndex + 1}</span></h4>
      <p id="question-text" className="mb-4 text-gray-900">{question.questionText}</p>
      <div id="options-container" className="space-y-2">
        {question.options?.map((option) => {
          let labelClass = 'option-label ';
          if (isReviewMode) {
            const isCorrectAnswer = question.correctAnswer === option.id;
            const isSelectedAnswer = currentAnswer === option.id;
            if (isCorrectAnswer) {
              labelClass += 'border-green-500 border-2 bg-green-50 ';
            } else if (isSelectedAnswer) {
              labelClass += 'border-red-500 border-2 bg-red-50 ';
            }
          } else {
            if (currentAnswer === option.id) {
              labelClass += 'selected-answer ';
            }
          }
          
          return (
            <label
              key={option.id}
              className={labelClass}
              onClick={() => handleSelectOption(option.id)}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={currentAnswer === option.id}
                onChange={() => handleSelectOption(option.id)}
                disabled={isReviewMode}
                className="hidden"
              />
              <span className="font-bold mr-3">{option.id}.</span>
              {option.text}
            </label>
          );
        })}
      </div>
      {isReviewMode && question.explanation && (
        <div className="explanation-box mt-4">
          <strong className="font-semibold">Explanation:</strong>
          <br />
          {question.explanation}
        </div>
      )}
    </>
  );
};