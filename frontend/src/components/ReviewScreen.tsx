import React from 'react';
import { useExamStore } from '../store/examStore';

export const ReviewScreen: React.FC = () => {
    const {
        sections,
        sectionOrder,
        currentSectionIndex,
        answers,
        flagged,
        finishExam,
        goToQuestion,
    } = useExamStore();

    const sectionKey = sectionOrder[currentSectionIndex];
    const currentSection = sections[sectionKey];

    if (!currentSection) {
        return <div>Loading section...</div>;
    }

    // This is a simplified version of going back to a question.
    // A full implementation would need to change the status back to 'active'.
    const handleReviewQuestion = (index: number) => {
        // For now, just logging. A real implementation would need more logic.
        console.log("Reviewing question", index + 1);
        // goToQuestion(index); 
        // useExamStore.setState({ status: 'active' });
    };

    return (
        <div id="review-screen" className="p-6 md:p-8 flex-col items-center h-full overflow-y-auto bg-gray-50">
            <div className="w-full max-w-3xl mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Review Your Answers</h2>
                {/* <button id="filter-flagged-button" className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-100">Show Flagged Only</button> */}
            </div>
            <p className="text-center text-gray-600 mb-6">Click on a question number to review it. Green indicates answered, Yellow border indicates flagged.</p>
            <div id="review-grid" className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 mb-6 w-full max-w-3xl">
                {currentSection.map((question, index) => {
                    const isAnswered = answers[sectionKey]?.[question.id] !== undefined;
                    const isFlagged = flagged[sectionKey]?.[question.id] || false;

                    let buttonClass = 'review-grid-button ';
                    if (isAnswered) buttonClass += 'review-grid-button-answered ';
                    else buttonClass += 'review-grid-button-unanswered ';
                    
                    if (isFlagged) buttonClass += 'review-flagged ';

                    return (
                        <button
                            key={`${sectionKey}-${question.id}`}
                            onClick={() => handleReviewQuestion(index)}
                            className={buttonClass}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
            <div className="mt-auto pt-6">
                <button onClick={finishExam} className="bg-red-600 text-white hover:bg-red-700 text-lg px-8 py-3 rounded-md">
                    End Exam & See Results
                </button>
            </div>
        </div>
    );
}; 