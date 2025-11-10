
import React from 'react';

interface PersuasionScoreProps {
    score: number; // 0-100, where 50 is neutral
}

const PersuasionScore: React.FC<PersuasionScoreProps> = ({ score }) => {
    const aiScore = 100 - score;

    return (
        <div className="w-full my-2">
            <div className="flex justify-between items-center text-sm font-semibold mb-1 px-1">
                <span className="text-purple-400">You ({Math.round(score)}%)</span>
                <span className="text-gray-400">Persuasion</span>
                <span className="text-pink-400">AI ({Math.round(aiScore)}%)</span>
            </div>
            <div className="w-full h-3 bg-pink-500 rounded-full overflow-hidden flex">
                <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
};

export default PersuasionScore;
