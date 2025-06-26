// File: src/components/SectionView.tsx (Corrected and Final Version)

// A comment to trigger re-linting
import React, { useState, useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';
import { QuestionDisplay } from './QuestionDisplay';
import { Navigator } from './Navigator';
import Timer from './Timer';

export const SectionView: React.FC = () => {
  const {
    sections,
    sectionOrder,
    currentSectionIndex,
    currentQuestionIndex,
    nextQuestion,
    prevQuestion,
    flagged,
    toggleFlag,
    reviewExam,
    finishExam,
    addQuestionTime,
    reviewQuestionIndex,
    setReviewQuestion,
  } = useExamStore();

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const questionStartTime = useRef<number>(Date.now());
  
  const sectionKey = sectionOrder[currentSectionIndex];
  const currentSection = sections[sectionKey];
  const question = currentSection?.[currentQuestionIndex];
  const totalQuestions = currentSection?.length || 0;
  
  const isReviewMode = reviewQuestionIndex !== null;

  useEffect(() => {
    if (!currentSection || isReviewMode) return;

    const previousQuestionId = currentSection[currentQuestionIndex > 0 ? currentQuestionIndex - 1 : 0].id;
    const timeSpent = Date.now() - questionStartTime.current;
    
    if (currentQuestionIndex > 0) {
      addQuestionTime(sectionKey, previousQuestionId, timeSpent);
    }

    questionStartTime.current = Date.now();

    return () => {
      if (currentSection) {
        const currentQuestionId = currentSection[currentQuestionIndex].id;
        const finalTimeSpent = Date.now() - questionStartTime.current;
        addQuestionTime(sectionKey, currentQuestionId, finalTimeSpent);
      }
    };
  }, [currentQuestionIndex, sectionKey, addQuestionTime, currentSection, isReviewMode]);

  const handleFlag = () => {
    if (isReviewMode || !question) return;
    toggleFlag(sectionKey, question.id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigatorOpen || document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (isReviewMode || !question) return;

      if (e.altKey || e.metaKey) {
        if (e.key.toLowerCase() === 'n' && currentQuestionIndex < totalQuestions - 1) {
          e.preventDefault();
          nextQuestion();
        }
        if (e.key.toLowerCase() === 'p' && currentQuestionIndex > 0) {
          e.preventDefault();
          prevQuestion();
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          handleFlag();
        }
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        const option = question.options.find(opt => opt.id.toLowerCase() === e.key.toLowerCase());
        if (option) {
          useExamStore.getState().answerQuestion(sectionKey, question.id, option.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isNavigatorOpen, isReviewMode, nextQuestion, prevQuestion, handleFlag, question, sectionKey, totalQuestions, currentQuestionIndex]);

  if (!currentSection) {
    return <div>Loading section...</div>;
  }

  if (!question) {
    return <div>Loading question...</div>;
  }
  
  const sectionName = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const isFlagged = flagged[sectionKey]?.[question.id] || false;
  
  return (
    <div id="exam-screen" className="flex flex-col h-full">
      <div className="header-bar">
        <span id="exam-title" className="font-semibold">{sectionName}</span>
        <div className="flex items-center space-x-4">
          {isReviewMode && <span className="font-semibold">Reviewing Question</span>}
          {!isReviewMode && <Timer initialTime={21 * 60} onTimeout={finishExam} />}
          <span className="text-sm">Question <span id="question-number-info">{currentQuestionIndex + 1}</span> of {totalQuestions}</span>
          <button id="flag-button" onClick={handleFlag} disabled={isReviewMode} className={`text-sm font-medium border border-white rounded px-2 py-1 transition-colors duration-150 ${isFlagged ? 'flagged' : ''}`}>
            {isFlagged ? 'Unflag' : 'Flag for Review'}
          </button>
        </div>
      </div>
      <div className="main-content-area">
        <div className="passage-column resizable-text">
          <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white text-gray-900 pb-1">Passage</h3>
          <div id="passage-text" className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
            {question.passage || question.stimulus}
          </div>
        </div>
        <div className="w-1.5 bg-blue-500"></div>
        <div className="question-column resizable-text">
          <QuestionDisplay question={question} sectionKey={sectionKey} isReviewMode={isReviewMode} />
        </div>
      </div>
      <div className="footer-bar">
        {isReviewMode ? (
          <button onClick={() => setReviewQuestion(null)} className="secondary-button-new">← Back to Results</button>
        ) : (
          <>
            <button id="end-exam-button-footer" onClick={reviewExam}>End Exam</button>
            <div className="flex items-center space-x-2 ml-auto">
              <button id="prev-button" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>← Previous</button>
              <button id="navigator-button" onClick={() => setIsNavigatorOpen(true)}>Navigator</button>
              <button id="next-button" onClick={nextQuestion}>
                {currentQuestionIndex === totalQuestions - 1 ? 'Next Section' : 'Next →'}
              </button>
            </div>
          </>
        )}
      </div>
      {isNavigatorOpen && <Navigator onClose={() => setIsNavigatorOpen(false)} />}
    </div>
  );
};

export default SectionView;