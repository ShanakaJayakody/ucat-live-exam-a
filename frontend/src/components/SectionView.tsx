// File: src/components/SectionView.tsx (New Version)

import React from 'react';
import { useExamStore } from '../store/examStore';
import QuestionDisplay from './QuestionDisplay';

const SectionView: React.FC = () => {
  const { sections, currentSectionIndex } = useExamStore();
  const currentSection = sections[currentSectionIndex];

  if (!currentSection) {
    return <div>Loading section...</div>;
  }

  return (
    <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">{currentSection.name}</h2>
      {/* For simplicity, we'll just show the first question of the section */}
      {currentSection.questions.length > 0 ? (
        <QuestionDisplay question={currentSection.questions[0]} />
      ) : (
        <p>No questions in this section.</p>
      )}
      {/* Navigation would go here */}
    </div>
  );
};

export default SectionView;