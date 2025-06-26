import React from 'react';
import { useExamStore } from '../store/examStore';

// A simple map for section-specific details. This can be expanded.
const sectionDetails = {
    verbal_reasoning: { title: "Verbal Reasoning", time: "21 minutes", questions: "44 questions" },
    decision_making: { title: "Decision Making", time: "31 minutes", questions: "29 questions" },
    quantitative_reasoning: { title: "Quantitative Reasoning", time: "24 minutes", questions: "36 questions" },
};

export const InstructionScreen: React.FC = () => {
    const { startCurrentSection, sectionOrder, currentSectionIndex } = useExamStore();
    
    const sectionKey = sectionOrder[currentSectionIndex];
    const details = sectionDetails[sectionKey] || { title: "Next Section", time: "N/A", questions: "N/A" };

    return (
        <div id="setup-screen" className="p-4 md:p-8 flex flex-col justify-center items-center h-full w-full">
            <div className="w-full max-w-lg text-center">
                <div className="card p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{details.title}</h1>
                    <p className="text-gray-600 mt-2 text-lg mb-8">Instructions for the upcoming section.</p>
                    <div className="text-left space-y-3 mb-8 bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                        <p className="text-sm text-gray-800"><strong className="font-semibold">Questions:</strong> {details.questions}</p>
                        <p className="text-sm text-gray-800"><strong className="font-semibold">Time Limit:</strong> {details.time}</p>
                    </div>

                    <div className="mt-10">
                        <button onClick={startCurrentSection} className="primary-button-new w-full text-lg">
                            Start Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 