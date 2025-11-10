
import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> & { TypingIndicator: React.FC } = ({ message }) => {
    const isUser = message.role === Role.USER;

    const bubbleClasses = isUser
        ? 'bg-purple-600 text-white self-end'
        : 'bg-gray-600 text-white self-start';
    
    const containerClasses = isUser
        ? 'flex justify-end'
        : 'flex justify-start';

    return (
        <div className={containerClasses}>
            <div className={`max-w-md md:max-w-lg p-3 rounded-2xl shadow-md ${bubbleClasses}`}>
                <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
};

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="bg-gray-600 text-white p-3 rounded-2xl shadow-md inline-flex items-center space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
        </div>
    </div>
);

ChatMessage.TypingIndicator = TypingIndicator;

export default ChatMessage;
