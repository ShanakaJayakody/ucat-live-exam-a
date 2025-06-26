import React from 'react';
import { useExamStore } from '../store/examStore';

export const SetupScreen: React.FC = () => {
    const startExam = useExamStore((state) => state.startExam);

    // Hardcoded for now, will be dynamic later
    const questionCount = 44; 
    const timeLimit = "21 minutes";

    return (
        <div id="setup-screen" className="p-4 md:p-8 flex flex-col justify-center items-center h-full w-full">
            <div className="w-full max-w-lg text-center">
                <div className="card p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Verbal Reasoning Practice</h1>
                    <p className="text-gray-600 mt-2 text-lg mb-8">Sharpen your skills for the UCAT VR section.</p>
                    <div className="text-left space-y-3 mb-8 bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                        <p className="text-sm text-gray-800"><strong className="font-semibold">Questions:</strong> <span id="setup-question-count">{questionCount}</span></p>
                        <p className="text-sm text-gray-800"><strong className="font-semibold">Time Limit:</strong> <span id="setup-time-limit">{timeLimit}</span></p>
                    </div>

                    <div className="mt-10">
                        <button id="start-button" onClick={startExam} className="primary-button-new w-full text-lg">
                            Start Exam
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 