// File: src/components/SectionView.tsx (Updated with Timer)

import React, { useState } from 'react';
import { useExamStore } from '../store/examStore';
import { QuestionDisplay } from './QuestionDisplay';
import { Timer } from './Timer';
import { Navigator } from './Navigator'; // This will be created next
import { Calculator } from './Calculator'; // Import Calculator
import { SyllogismQuestionDisplay } from './SyllogismQuestionDisplay'; // Import Syllogism display
import { InterpretingInformationDisplay } from './InterpretingInformationDisplay'; // Import new component

// UCAT Section times in seconds for easy reference
const sectionTimes: Record<string, number> = {
    verbal_reasoning: 22 * 60,
    decision_making: 37 * 60,
    quantitative_reasoning: 26 * 60,
    abstract_reasoning: 13 * 60,
    situational_judgement: 26 * 60,
};

export const SectionView: React.FC = () => {
    const {
        sections,
        sectionOrder,
        currentSectionIndex,
        currentQuestionIndex,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        flagged,
        toggleFlag,
        reviewExam,
        completeSection,
        reviewQuestionIndex,
    } = useExamStore();

    const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false); // State for calculator

    const sectionKey = sectionOrder[currentSectionIndex];
    const currentSection = sections[sectionKey];
    const question = currentSection?.[currentQuestionIndex];
    const totalQuestions = currentSection?.length || 0;
    const isReviewMode = reviewQuestionIndex !== null;
    const isFlagged = question ? flagged[sectionKey]?.[question.id] || false : false;

    if (!question) {
        return <div>Loading...</div>;
    }

    const handleFlag = () => {
        if (!isReviewMode) {
            toggleFlag(sectionKey, question.id);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex === totalQuestions - 1) {
            completeSection();
        } else {
            nextQuestion();
        }
    };
    
    const sectionName = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const isDecisionMaking = sectionKey === 'decision_making';

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header Bar */}
            <header className="header-bar">
                <span className="font-semibold">{sectionName}</span>
                <div className="flex items-center space-x-4">
                    <Timer
                        key={sectionKey}
                        durationInSeconds={sectionTimes[sectionKey] || 0}
                        onComplete={completeSection}
                    />
                    <span className="text-sm">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    {!isDecisionMaking && (
                        <button
                            onClick={handleFlag}
                            className={`text-sm font-medium border border-white rounded px-2 py-1 transition-colors duration-150 ${isFlagged ? 'flagged' : ''}`}
                            id="flag-button"
                            disabled={isReviewMode}
                        >
                            {isFlagged ? 'Unflag' : 'Flag for Review'}
                        </button>
                    )}
                </div>
            </header>

            {/* Secondary Toolbar for Decision Making */}
            {isDecisionMaking && (
                <div className="secondary-toolbar">
                    <div>
                        <button className="secondary-toolbar-button" onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}>
                            Calculator
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleFlag}
                            className={`secondary-toolbar-button ${isFlagged ? 'flagged' : ''}`}
                            id="flag-button"
                            disabled={isReviewMode}
                        >
                            {isFlagged ? 'Unflag' : 'Flag for Review'}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="main-content-area">
                {isDecisionMaking ? (
                    <div className="question-column w-full">
                         {question.questionType === 'syllogism' ? (
                            <SyllogismQuestionDisplay question={question} sectionKey={sectionKey} />
                        ) : question.questionType === 'interpreting_information' ? (
                            <InterpretingInformationDisplay question={question} sectionKey={sectionKey} />
                        ) : (
                            <QuestionDisplay question={question} sectionKey={sectionKey} isReviewMode={isReviewMode} />
                        )}
                    </div>
                ) : (
                    <>
                        <div className="passage-column resizable-text">
                             <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-white text-gray-900 pb-1">
                                Passage
                            </h3>
                            <div className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
                                {question.passage || "No passage for this question."}
                            </div>
                        </div>
                        <div className="w-1.5 bg-gray-200"></div>
                        <div className="question-column resizable-text">
                            <QuestionDisplay question={question} sectionKey={sectionKey} isReviewMode={isReviewMode} />
                        </div>
                    </>
                )}
            </main>
            
            {/* Calculator Component */}
            <Calculator isVisible={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />

            {/* Footer Bar */}
            <footer className="footer-bar">
                <button onClick={reviewExam}>End Exam</button>
                <div className="flex items-center space-x-2 ml-auto">
                    <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                        ← Previous
                    </button>
                    <button onClick={() => setIsNavigatorOpen(true)}>Navigator</button>
                    <button onClick={handleNext} id="next-button">
                        {currentQuestionIndex === totalQuestions - 1 ? 'Finish Section' : 'Next →'}
                    </button>
                </div>
            </footer>

            {isNavigatorOpen && <Navigator onClose={() => setIsNavigatorOpen(false)} />}
        </div>
    );
};

export default SectionView;