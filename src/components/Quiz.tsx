import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Save } from 'lucide-react';
import type { QuizData } from '../types';

interface QuizProps {
    data: QuizData;
}

interface QuizResult {
    date: string;
    sourceName: string;
    score: number;
    total: number;
    details: {
        questionId: string;
        question: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }[];
}

const Quiz: React.FC<QuizProps> = ({ data }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        // Reset state when data changes
        setAnswers({});
        setIsSubmitted(false);
        setScore(0);

        // Calculate total questions
        let total = 0;
        data.sections.forEach(section => {
            total += section.questions.length;
        });
        setTotalQuestions(total);
    }, [data]);

    const normalizeAnswer = (str: string) => {
        return str
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            })
            .toLowerCase()
            .trim();
    };

    const handleInputChange = (questionId: string, value: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = () => {
        if (isSubmitted) return;

        let correctCount = 0;
        const resultDetails: QuizResult['details'] = [];

        data.sections.forEach(section => {
            section.questions.forEach(q => {
                const userAnswer = (answers[q.id] || '');
                const correctAnswer = q.answer;

                const normalizedUser = normalizeAnswer(userAnswer);
                const normalizedCorrect = normalizeAnswer(correctAnswer);

                const isCorrect = normalizedCorrect !== '' && normalizedUser === normalizedCorrect;

                if (isCorrect) correctCount++;

                resultDetails.push({
                    questionId: q.id,
                    question: q.question,
                    userAnswer,
                    correctAnswer,
                    isCorrect
                });
            });
        });

        setScore(correctCount);
        setIsSubmitted(true);

        // Save to localStorage
        const result: QuizResult = {
            date: new Date().toISOString(),
            sourceName: data.sourceName,
            score: correctCount,
            total: totalQuestions,
            details: resultDetails
        };

        const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
        history.push(result);
        localStorage.setItem('quiz_history', JSON.stringify(history));
    };

    return (
        <div className="space-y-8 pb-32">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.sourceName}</h2>
                <p className="text-gray-500">
                    {totalQuestions} 問
                    {isSubmitted && <span className="ml-4 font-bold text-blue-600">スコア: {score} / {totalQuestions}</span>}
                </p>
            </div>

            {data.sections.map((section) => (
                <div key={section.title} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">{section.title}</h3>

                    <div className="grid gap-6">
                        {section.questions.map((q) => {
                            const userAnswer = answers[q.id] || '';
                            const isCorrect = isSubmitted ? (normalizeAnswer(q.answer) !== '' && normalizeAnswer(userAnswer) === normalizeAnswer(q.answer)) : null;

                            return (
                                <div key={q.id} className={`bg-white p-6 rounded-xl shadow-sm border transition-colors ${isSubmitted
                                    ? isCorrect
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-red-500 bg-red-50'
                                    : 'border-gray-200'
                                    }`}>
                                    <div className="flex flex-col md:flex-row gap-4 md:items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                            {q.number.replace(/[\(\)\.]/g, '')}
                                        </div>

                                        <div className="flex-grow space-y-4">
                                            <div className="text-lg font-medium text-gray-900">
                                                {q.question}
                                            </div>

                                            {q.type === 'table' && q.hint && (
                                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                                    <HelpCircle size={16} />
                                                    ヒント: {q.hint}
                                                </div>
                                            )}

                                            {q.type === 'list' && q.sentence && (
                                                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg font-mono text-sm">
                                                    {q.sentence.split('(　　　　)').map((part, i, arr) => (
                                                        <span key={i}>
                                                            {part}
                                                            {i < arr.length - 1 && (
                                                                <span className="inline-block w-16 border-b-2 border-gray-300 mx-1"></span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={userAnswer}
                                                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                                                    disabled={isSubmitted}
                                                    placeholder="回答を入力..."
                                                    className={`w-full p-3 rounded-lg border outline-none ${isSubmitted
                                                        ? isCorrect
                                                            ? 'border-green-500 bg-white text-green-700'
                                                            : 'border-red-500 bg-white text-red-700'
                                                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                        }`}
                                                />

                                                {isSubmitted && !isCorrect && (
                                                    <div className="text-sm text-red-600 font-medium flex items-center gap-2">
                                                        <XCircle size={16} />
                                                        正解: {q.answer}
                                                    </div>
                                                )}
                                                {isSubmitted && isCorrect && (
                                                    <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                                                        <CheckCircle size={16} />
                                                        正解！
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {!isSubmitted && (
                <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-30">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-lg flex items-center gap-3"
                    >
                        <Save size={20} />
                        採点する
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
