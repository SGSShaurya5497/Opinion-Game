
import React, { useState, useEffect, useCallback } from 'react';
import { DebateTopic, Message, Role } from './types';
import { DEBATE_TOPICS } from './constants';
import TopicSelector from './components/TopicSelector';
import DebateView from './components/DebateView';
import { getDebatePoint, getPersuasionScore } from './services/geminiService';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<'topicSelection' | 'inDebate'>('topicSelection');
    const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [persuasionScore, setPersuasionScore] = useState(50); // 50 is neutral
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedState = localStorage.getItem('opinionGameState');
        if (savedState) {
            try {
                const { gameState, selectedTopic, messages, persuasionScore } = JSON.parse(savedState);
                if (gameState === 'inDebate' && selectedTopic && messages) {
                    setGameState(gameState);
                    setSelectedTopic(selectedTopic);
                    setMessages(messages);
                    setPersuasionScore(persuasionScore);
                }
            } catch (e) {
                console.error("Failed to parse saved state", e);
                localStorage.removeItem('opinionGameState');
            }
        }
    }, []);

    useEffect(() => {
        if (gameState === 'inDebate' && selectedTopic) {
            const stateToSave = JSON.stringify({ gameState, selectedTopic, messages, persuasionScore });
            localStorage.setItem('opinionGameState', stateToSave);
        } else {
            localStorage.removeItem('opinionGameState');
        }
    }, [gameState, selectedTopic, messages, persuasionScore]);

    const handleStartDebate = (topic: DebateTopic) => {
        setSelectedTopic(topic);
        setMessages([{
            id: crypto.randomUUID(),
            role: Role.AI,
            content: topic.initialMessage,
        }]);
        setPersuasionScore(50);
        setGameState('inDebate');
    };
    
    const handleReset = () => {
      setGameState('topicSelection');
      setSelectedTopic(null);
      setMessages([]);
      setPersuasionScore(50);
      setIsAiTyping(false);
      setError(null);
      localStorage.removeItem('opinionGameState');
    }

    const handleSendMessage = useCallback(async (content: string) => {
        if (!selectedTopic || isAiTyping) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: Role.USER,
            content,
        };
        
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsAiTyping(true);
        setError(null);

        try {
            const [scoreResponse, aiPoint] = await Promise.all([
                getPersuasionScore(selectedTopic, updatedMessages),
                getDebatePoint(selectedTopic, updatedMessages),
            ]);
            
            if (scoreResponse) {
                const newScore = Math.max(0, Math.min(100, persuasionScore + scoreResponse.score_shift));
                setPersuasionScore(newScore);
            }

            if (aiPoint) {
                const aiMessage: Message = {
                    id: crypto.randomUUID(),
                    role: Role.AI,
                    content: aiPoint,
                };
                setMessages(prev => [...prev, aiMessage]);
            }

        } catch (e) {
            console.error("Error communicating with AI:", e);
            setError("Sorry, I encountered an error. Please try again.");
            const errorMessage: Message = {
              id: crypto.randomUUID(),
              role: Role.AI,
              content: "I seem to be having trouble connecting. Please check your connection or API key and try again."
            }
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsAiTyping(false);
        }
    }, [selectedTopic, isAiTyping, messages, persuasionScore]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        The Opinion Game
                    </h1>
                    <p className="text-gray-400 mt-2">Debate the AI and shift the balance of persuasion.</p>
                </header>
                
                <main className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full h-[75vh] flex flex-col">
                    {gameState === 'topicSelection' ? (
                        <TopicSelector topics={DEBATE_TOPICS} onStartDebate={handleStartDebate} />
                    ) : selectedTopic && (
                        <DebateView
                            topic={selectedTopic}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isAiTyping={isAiTyping}
                            persuasionScore={persuasionScore}
                            onReset={handleReset}
                            error={error}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
