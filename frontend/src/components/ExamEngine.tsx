import React, { useEffect } from 'react';
import useExamStore from '../store/examStore';
import { Section } from '../types';

const ExamEngine: React.FC = () => {
  const { sections, setSections, currentSectionIndex } = useExamStore();

  useEffect(() => {
    // Mock data for demonstration
    const mockSections: Section[] = [
      {
        id: '1',
        name: 'Verbal Reasoning',
        questions: [{ id: 'q1', text: 'Question 1', options: ['a', 'b'], correctAnswer: 'a' }],
        time: 600,
      },
      {
        id: '2',
        name: 'Quantitative Reasoning',
        questions: [{ id: 'q2', text: 'Question 2', options: ['a', 'b'], correctAnswer: 'b' }],
        time: 600,
      },
    ];
    setSections(mockSections);
  }, [setSections]);

  return (
    <div>
      <h1>Exam Engine</h1>
      <p>Current Section: {sections[currentSectionIndex]?.name}</p>
    </div>
  );
};

export default ExamEngine; 