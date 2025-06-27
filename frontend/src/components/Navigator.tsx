import React from 'react';
import { useExamStore } from '../store/examStore';

interface Props {
  onClose: () => void;
}

export const Navigator: React.FC<Props> = ({ onClose }) => {
  const { 
    sections, 
    sectionOrder, 
    currentSectionIndex, 
    currentQuestionIndex,
    goToQuestion,
    answers,
    flagged 
  } = useExamStore();

  const sectionKey = sectionOrder[currentSectionIndex];
  const questions = sections[sectionKey] || [];
  const currentAnswers = answers[sectionKey] || {};
  const currentFlags = flagged[sectionKey] || {};

  const handleQuestionSelect = (index: number) => {
    goToQuestion(index);
    onClose();
  };

  return (
    <div className="modal flex" id="navigator-modal" onClick={onClose}>
      <div className="modal-content bg-white p-6 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Question Navigator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Click a number to jump. Green: answered, Yellow border: flagged.</p>
        <div id="navigator-grid" className="grid grid-cols-5 md:grid-cols-8 gap-3">
          {questions.map((question, index) => {
            const isAnswered = currentAnswers[question.id] !== undefined;
            const isFlagged = currentFlags[question.id];
            const isCurrent = index === currentQuestionIndex;

            let buttonClass = 'py-2 px-1 border border-gray-300 rounded-md text-center transition duration-150 ease-in-out text-sm hover:bg-gray-100 ';
            if (isAnswered) buttonClass += 'nav-answered ';
            if (isFlagged) buttonClass += 'nav-flagged ';
            if (isCurrent) buttonClass += 'nav-current ';

            return (
              <button
                key={question.id}
                className={buttonClass}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 