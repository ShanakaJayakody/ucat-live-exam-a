import React, { useState } from 'react';
import { useExamStore, Question, ExamSections } from '../store/examStore';

interface Props {
  question: Question;
  sectionKey: keyof ExamSections;
}

export const InterpretingInformationDisplay: React.FC<Props> = ({ question, sectionKey }) => {
  const { answerMultiPartQuestion, answers } = useExamStore();
  const [selectedStatement, setSelectedStatement] = useState<number | null>(null);

  const currentQuestionAnswers = (answers[sectionKey]?.[question.id] as string[]) || [];

  const handleAnswer = (answer: 'True' | 'False' | 'Cannot Tell') => {
    if (selectedStatement !== null) {
      answerMultiPartQuestion(sectionKey, question.id, selectedStatement, answer);
      setSelectedStatement(null);
    }
  };

  return (
    <div className="interpreting-info-question">
      <div className="p-4 bg-gray-50 rounded-md mb-6 border border-gray-200">
        <h3 className="font-semibold mb-2 text-gray-800">Information</h3>
        <div className="whitespace-pre-wrap text-gray-700">
          {question.passage || question.stimulus}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Statements</h4>
          <p className="text-sm text-gray-600">Select a statement, then choose your answer.</p>
        </div>
        <div className="flex space-x-3">
          <button className="drag-button" onClick={() => handleAnswer('True')}>True</button>
          <button className="drag-button" onClick={() => handleAnswer('False')}>False</button>
          <button className="drag-button" onClick={() => handleAnswer('Cannot Tell')}>Cannot Tell</button>
        </div>
      </div>

      <div id="statements-container" className="space-y-3">
        {question.statements?.map((statement, index) => (
          <div
            key={index}
            className={`statement-row flex items-center p-3 border rounded-md ${selectedStatement === index ? 'selected' : 'border-gray-200'}`}
            onClick={() => setSelectedStatement(index)}
          >
            <div className="flex-grow statement-text">
              <span className="font-medium mr-2">{index + 1}.</span> {statement}
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="statement-answer-box w-auto px-3">
                {currentQuestionAnswers[index] || '...'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 