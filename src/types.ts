export interface Question {
    id: string;
    type: 'table' | 'list';
    section: string; // e.g., "【７】"
    number: string; // e.g., "(1)" or "1."
    question: string; // Japanese text
    hint?: string; // For table questions
    sentence?: string; // For list questions, with blanks
    answer: string; // The correct answer(s)
    userAnswer?: string;
    isCorrect?: boolean;
}

export interface QuizSection {
    title: string;
    questions: Question[];
}

export interface QuizData {
    sourceName: string;
    sections: QuizSection[];
}
