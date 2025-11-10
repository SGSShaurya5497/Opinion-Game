
export enum Role {
    USER = 'user',
    AI = 'ai',
}

export interface Message {
    id: string;
    role: Role;
    content: string;
}

export interface DebateTopic {
    key: string;
    title: string;
    aiPersona: string;
    initialMessage: string;
}

export interface PersuasionScoreResponse {
    score_shift: number;
    reasoning: string;
}
