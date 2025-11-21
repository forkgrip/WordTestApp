import type { QuizData, QuizSection, Question } from '../types';

export const parseMarkdown = (text: string, sourceName: string): QuizData => {
    const lines = text.split('\n');
    const sections: QuizSection[] = [];
    let currentSection: QuizSection | null = null;
    let isAnswerSection = false;

    // Temporary storage for questions to map answers later
    const allQuestions: Question[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('## ')) {
            const title = line.replace('## ', '').trim();
            if (title.includes('解答')) {
                isAnswerSection = true;
                // Find the corresponding question section
                const questionTitle = title.replace('解答', '').trim();
                currentSection = sections.find(s => s.title === questionTitle || s.title.startsWith(questionTitle)) || null;
            } else {
                isAnswerSection = false;
                currentSection = {
                    title,
                    questions: []
                };
                sections.push(currentSection);
            }
            continue;
        }

        if (!currentSection) continue;

        if (!isAnswerSection) {
            // Parsing Questions
            if (line.startsWith('|') && !line.includes('---') && !line.includes('番号')) {
                // Table format: | (1) | Japanese | Hint |
                const parts = line.split('|').map(p => p.trim()).filter(p => p);
                if (parts.length >= 3) {
                    const number = parts[0];
                    const questionText = parts[1];
                    const hint = parts[2];
                    const question: Question = {
                        id: `${sourceName}-${currentSection.title}-${number}`,
                        type: 'table',
                        section: currentSection.title,
                        number,
                        question: questionText,
                        hint,
                        answer: '' // To be filled later
                    };
                    currentSection.questions.push(question);
                    allQuestions.push(question);
                }
            } else if (line.match(/^\d+\./)) {
                // List format: 1. Japanese
                // Next lines might contain the English sentence
                const number = line.match(/^\d+\./)?.[0] || '';
                const questionText = line.replace(/^\d+\.\s*/, '').trim();

                // Look ahead for the English sentence
                let sentence = '';
                let j = i + 1;
                while (j < lines.length && !lines[j].trim().match(/^\d+\./) && !lines[j].startsWith('##')) {
                    const nextLine = lines[j].trim();
                    if (nextLine.includes('**') && nextLine.match(/[a-zA-Z]/)) {
                        sentence = nextLine.replace(/\*\*/g, ''); // Remove bold markers
                        break;
                    }
                    j++;
                }

                if (sentence) {
                    const question: Question = {
                        id: `${sourceName}-${currentSection.title}-${number}`,
                        type: 'list',
                        section: currentSection.title,
                        number,
                        question: questionText,
                        sentence,
                        answer: '' // To be filled later
                    };
                    currentSection.questions.push(question);
                    allQuestions.push(question);
                }
            }
        } else {
            // Parsing Answers
            if (line.startsWith('|') && !line.includes('---') && !line.includes('番号')) {
                // Table Answer: | (1) | answer |
                const parts = line.split('|').map(p => p.trim()).filter(p => p);
                if (parts.length >= 2) {
                    const number = parts[0];
                    const answer = parts[1];
                    // Find question
                    const question = currentSection.questions.find(q => q.number === number);
                    if (question) {
                        question.answer = answer;
                    }
                }
            } else if (line.match(/^\d+\./)) {
                // List Answer: 1. **answer / answer**
                const number = line.match(/^\d+\./)?.[0] || '';
                const answerContent = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();

                // Find question
                const question = currentSection.questions.find(q => q.number === number);
                if (question) {
                    question.answer = answerContent;
                }
            }
        }
    }

    return {
        sourceName,
        sections
    };
};
