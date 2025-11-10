
import React, { useState } from 'react';
import { DebateTopic } from '../types';

interface TopicSelectorProps {
    topics: DebateTopic[];
    onStartDebate: (topic: DebateTopic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, onStartDebate }) => {
    const [selectedKey, setSelectedKey] = useState<string>(topics[0]?.key || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedTopic = topics.find(t => t.key === selectedKey);
        if (selectedTopic) {
            onStartDebate(selectedTopic);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">Choose Your Topic</h2>
            <p className="text-gray-400 mb-8 max-w-md">Select a subject to debate with our AI. Can you change its mind... or will it change yours?</p>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                >
                    {topics.map(topic => (
                        <option key={topic.key} value={topic.key}>
                            {topic.title}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-transform transform hover:scale-105"
                >
                    Start Debate
                </button>
            </form>
        </div>
    );
};

export default TopicSelector;
