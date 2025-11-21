import { useState, useEffect } from 'react';
import { Trash2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

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

const Analysis = () => {
    const [history, setHistory] = useState<QuizResult[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('quiz_history');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Sort by date descending
                setHistory(parsed.reverse());
            } catch (e) {
                console.error('Failed to parse history', e);
            }
        }
    }, []);

    const clearHistory = () => {
        if (confirm('すべての履歴を削除してもよろしいですか？')) {
            localStorage.removeItem('quiz_history');
            setHistory([]);
        }
    };

    const averageScore = history.length > 0
        ? Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / history.length)
        : 0;

    // Aggregate wrong answers
    const wrongAnswers = history.flatMap(h => h.details.filter(d => !d.isCorrect));
    const wrongCounts = wrongAnswers.reduce((acc, curr) => {
        acc[curr.question] = (acc[curr.question] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topWrong = Object.entries(wrongCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance Analysis</h2>
                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={18} />
                        履歴を削除
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No quiz history yet. Take a quiz to see your analysis!</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Average Score</div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{averageScore}%</div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Total Attempts</div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{history.length}</div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Mistakes Made</div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{wrongAnswers.length}</div>
                        </div>
                    </div>

                    {/* Top Mistakes */}
                    {topWrong.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Common Mistakes</h3>
                            <div className="space-y-4">
                                {topWrong.map(([question, count]) => (
                                    <div key={question} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                                        <div className="font-medium text-gray-800 truncate flex-1 mr-4">{question}</div>
                                        <div className="text-red-600 font-bold whitespace-nowrap">{count} times</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {history.map((item, i) => (
                                <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium text-gray-900">{item.sourceName}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${(item.score / item.total) >= 0.8 ? 'bg-green-500' :
                                                    (item.score / item.total) >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${(item.score / item.total) * 100}%` }}
                                            />
                                        </div>
                                        <div className="font-bold text-gray-700 w-16 text-right">
                                            {item.score}/{item.total}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analysis;
