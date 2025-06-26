import React from 'react';
import { useExamStore } from '../store/examStore';

const formatTimeMilliseconds = (milliseconds: number | undefined) => {
  if (!milliseconds || milliseconds < 0) return "N/A";
  return `${(milliseconds / 1000).toFixed(1)}s`;
};

export const ResultsScreen: React.FC = () => {
  const { sections, answers, sectionOrder, questionTimes } = useExamStore();

  let totalQuestions = 0;
  let correctAnswers = 0;
  let correctTimeTotal = 0;
  let correctCount = 0;
  let incorrectTimeTotal = 0;
  let incorrectCount = 0;

  sectionOrder.forEach(sectionKey => {
    const section = sections[sectionKey];
    if (section) {
      totalQuestions += section.length;
      section.forEach(question => {
        const isCorrect = answers[sectionKey]?.[question.id] === question.correctAnswer;
        const timeSpent = questionTimes[sectionKey]?.[question.id] || 0;

        if (isCorrect) {
          correctAnswers++;
          correctTimeTotal += timeSpent;
          correctCount++;
        } else if (answers[sectionKey]?.[question.id] !== undefined) { // incorrect
          incorrectTimeTotal += timeSpent;
          incorrectCount++;
        }
      });
    }
  });
  
  const avgCorrectTime = correctCount > 0 ? correctTimeTotal / correctCount : undefined;
  const avgIncorrectTime = incorrectCount > 0 ? incorrectTimeTotal / incorrectCount : undefined;

  const { setReviewQuestion } = useExamStore.getState();

  const handleRevisitQuestion = (index: number) => {
    setReviewQuestion(index);
  };
  
  // Create a flat list of all questions to map over for the results grid
  const allQuestions = sectionOrder.flatMap(key => sections[key] || []);

  return (
    <div id="results-screen" className="p-4 md:p-8 flex-col h-full overflow-y-auto w-full">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Exam Results</h2>
          <p className="text-gray-600 mt-2">Here's a breakdown of your performance.</p>
        </div>

        <div className="card p-8 mb-8 text-center">
          <p className="text-lg text-gray-600 mb-2">Your Score</p>
          <p className="text-6xl font-bold text-gray-900">
            <span id="score">{correctAnswers}</span>
            <span className="text-4xl text-gray-500"> / <span id="total-questions-results">{totalQuestions}</span></span>
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2 space-y-8">
                <div className="card p-6">
                    <h4 className="text-lg font-semibold mb-3 text-center text-gray-800">Time Analysis</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex justify-between"><span>Avg. time (Correct):</span> <span className="font-bold text-green-600">{formatTimeMilliseconds(avgCorrectTime)}</span></p>
                      <p className="flex justify-between"><span>Avg. time (Incorrect):</span> <span className="font-bold text-red-600">{formatTimeMilliseconds(avgIncorrectTime)}</span></p>
                    </div>
                </div>
                <div className="card p-6">
                    <h4 className="text-lg font-semibold mb-3 text-center text-gray-800">Performance by Type</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="text-center">Coming soon...</p>
                    </div>
                </div>
            </div>
             <div className="md:col-span-3 card p-6">
                 <h3 className="text-lg font-semibold mb-1 text-gray-800">Detailed Results</h3>
                 <p className="text-sm text-gray-500 mb-4">Click a box to review the question.</p>
                 <div id="results-grid-container">
                    {allQuestions.map((question, index) => {
                        const sectionKey = question.section as keyof typeof sections;
                        const isCorrect = answers[sectionKey]?.[question.id] === question.correctAnswer;
                        const isFlagged = useExamStore.getState().flagged[sectionKey]?.[question.id];
                        const timeSpent = questionTimes[sectionKey]?.[question.id] || 0;
                        
                        let boxClass = 'result-box ';
                        if (isCorrect) boxClass += 'result-box-correct ';
                        else if (answers[sectionKey]?.[question.id] !== undefined) boxClass += 'result-box-incorrect ';
                        if (isFlagged) boxClass += 'result-box-flagged';

                        return (
                            <div key={`${sectionKey}-${question.id}`} onClick={() => handleRevisitQuestion(index)} className="cursor-pointer">
                                <div className={boxClass} title={`Click to review Question ${index + 1}`}>
                                    <div className="time-spent">{formatTimeMilliseconds(timeSpent)}s</div>
                                </div>
                                <div className="question-num-label">{`Q${index + 1}`}</div>
                            </div>
                        );
                    })}
                 </div>
            </div>
        </div>

        <div className="text-center flex justify-center items-center space-x-4">
          <button onClick={() => window.location.reload()} className="secondary-button-new">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}; 