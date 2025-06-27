import React from 'react';
import { useExamStore } from '../store/examStore';
import { Timer } from './Timer';

const instructionTimes: Record<string, number> = {
    verbal_reasoning: 1 * 60 + 30, // 1 min 30 sec
    decision_making: 1 * 60 + 30, // 1 min 30 sec
    quantitative_reasoning: 2 * 60, // 2 min
};

// A simple map for section-specific details. This can be expanded.
const sectionDetails = {
    verbal_reasoning: { title: "Verbal Reasoning", time: "22 minutes", questions: "44 questions" },
    decision_making: { title: "Decision Making", time: "37 minutes", questions: "35 questions" },
    quantitative_reasoning: { title: "Quantitative Reasoning", time: "26 minutes", questions: "36 questions" },
};

export const InstructionScreen: React.FC = () => {
    const { startCurrentSection, sectionOrder, currentSectionIndex } = useExamStore();
    
    const sectionKey = sectionOrder[currentSectionIndex];
    const details = sectionDetails[sectionKey as keyof typeof sectionDetails] || { title: "Next Section", time: "N/A", questions: "N/A" };
    const instructionTime = instructionTimes[sectionKey] || 90;

    return (
        <div id="setup-screen" className="p-4 md:p-8 flex flex-col justify-center items-center h-full w-full">
            <div className="w-full max-w-lg text-center">
                <div className="card p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{details.title}</h1>
                    <p className="text-gray-600 mt-2 text-lg mb-4">You will have {instructionTime / 60} minute(s) to read the instructions.</p>
                    <div className="flex justify-center mb-6">
                        <Timer key={`${sectionKey}-instruction`} durationInSeconds={instructionTime} onComplete={startCurrentSection} />
                    </div>
                    <div className="text-left space-y-3 mb-8 bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                        <p className="text-sm text-gray-800"><strong className="font-semibold">Section Time Limit:</strong> {details.time}</p>
                        <p className="text-sm text-gray-800"><strong className="font-semibold">Number of Questions:</strong> {details.questions}</p>
                    </div>

                    <div className="mt-10">
                        <button onClick={startCurrentSection} className="primary-button-new w-full text-lg">
                            Start Section Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 