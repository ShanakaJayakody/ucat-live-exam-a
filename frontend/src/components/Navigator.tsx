import React from 'react';
import { useExamStore } from '../store/examStore';

interface NavigatorProps {
  onClose: () => void;
}

export const Navigator: React.FC<NavigatorProps> = ({ onClose }) => {
  const {
    sections,
    sectionOrder,
    currentSectionIndex,
    currentQuestionIndex,
    answers,
    flagged,
    goToQuestion,
  } = useExamStore();

  const sectionKey = sectionOrder[currentSectionIndex];
  const currentSection = sections[sectionKey];

  if (!currentSection) {
    return null;
  }
  
  const handleQuestionSelect = (index: number) => {
    goToQuestion(index);
    onClose();
  };

  return (
    <div id="navigator-modal" className="modal flex">
      <div className="modal-content bg-white p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Question Navigator</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Click a number to jump. Green: answered, Yellow border: flagged.</p>
        <div id="navigator-grid" className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {currentSection.map((question, index) => {
            const isAnswered = answers[sectionKey]?.[question.id] !== undefined;
            const isFlagged = flagged[sectionKey]?.[question.id] || false;
            const isCurrent = index === currentQuestionIndex;

            let buttonClass = 'review-grid-button ';
            if (isAnswered) buttonClass += 'nav-answered ';
            if (isFlagged) buttonClass += 'nav-flagged ';
            if (isCurrent) buttonClass += 'nav-current ';

            return (
              <button
                key={`${sectionKey}-${question.id}`}
                onClick={() => handleQuestionSelect(index)}
                className={buttonClass}
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