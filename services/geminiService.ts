
import { GoogleGenAI, Type } from "@google/genai";
import { DebateTopic, Message, PersuasionScoreResponse, Role } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const formatHistoryForPrompt = (history: Message[]): string => {
    return history.map(msg => `${msg.role === Role.USER ? 'User' : 'AI'}: ${msg.content}`).join('\n');
};

export const getDebatePoint = async (topic: DebateTopic, history: Message[]): Promise<string> => {
    const prompt = `
        You are a skilled debater with the persona of ${topic.aiPersona}.
        The debate topic is: "${topic.title}".
        Your goal is to argue persuasively against the user's position, pushing the conversation forward.
        Keep your response concise and impactful, ideally 2-3 sentences.
        Directly address the user's last point and present a compelling counter-argument.

        Debate History:
        ${formatHistoryForPrompt(history)}

        Your Turn:
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
};

export const getPersuasionScore = async (topic: DebateTopic, history: Message[]): Promise<PersuasionScoreResponse | null> => {
    const userArgument = history[history.length - 1].content;
    const prompt = `
        You are an impartial debate judge.
        The debate topic is: "${topic.title}".
        Analyze the user's latest argument in the context of the debate history.
        Argument to analyze: "${userArgument}"

        Based on its logical soundness, rhetorical strength, and relevance to the topic, how much did this argument shift the persuasion in the user's favor?
        
        Debate History:
        ${formatHistoryForPrompt(history.slice(0, -1))}

        Provide a score shift from -10 (major point for the AI) to +10 (major point for the user), where 0 is neutral.
        Also provide a brief reasoning for your score.
    `;

    const scoreSchema = {
        type: Type.OBJECT,
        properties: {
            score_shift: {
                type: Type.NUMBER,
                description: 'A number from -10 to 10 representing the shift in persuasion. Positive favors the user, negative favors the AI.',
            },
            reasoning: {
                type: Type.STRING,
                description: 'A brief explanation for the score shift, which will not be displayed.',
            },
        },
        required: ['score_shift', 'reasoning'],
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: scoreSchema,
            }
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as PersuasionScoreResponse;

    } catch (error) {
        console.error("Error getting persuasion score:", error);
        // Fallback to a neutral score if JSON parsing or API fails
        return { score_shift: 0, reasoning: "Could not determine score." };
    }
};
