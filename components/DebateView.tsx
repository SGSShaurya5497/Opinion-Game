
import React, { useState, useRef, useEffect } from 'react';
import { DebateTopic, Message } from '../types';
import ChatMessage from './ChatMessage';
import PersuasionScore from './PersuasionScore';

interface DebateViewProps {
    topic: DebateTopic;
    messages: Message[];
    onSendMessage: (message: string) => void;
    isAiTyping: boolean;
    persuasionScore: number;
    onReset: () => void;
    error: string | null;
}

const DebateView: React.FC<DebateViewProps> = ({ topic, messages, onSendMessage, isAiTyping, persuasionScore, onReset, error }) => {
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isAiTyping) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                <div className="text-left">
                    <h2 className="text-lg font-bold text-white">{topic.title}</h2>
                    <p className="text-sm text-gray-400">Debating as: {topic.aiPersona}</p>
                </div>
                <button
                    onClick={onReset}
                    className="bg-gray-700 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    End Debate
                </button>
            </header>
            
            <div className="p-2 flex-shrink-0">
                <PersuasionScore score={persuasionScore} />
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {isAiTyping && <ChatMessage.TypingIndicator />}
                <div ref={chatEndRef} />
            </div>

            {error && <div className="p-4 text-center text-red-400 text-sm">{error}</div>}

            <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center bg-gray-700 rounded-lg">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your argument..."
                            className="w-full bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
                            disabled={isAiTyping}
                        />
                        <button
                            type="submit"
                            disabled={isAiTyping || !inputValue.trim()}
                            className="p-3 text-white disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
};

export default DebateView;
