import { useState } from 'react';
import { Menu, X, BarChart2, Home as HomeIcon } from 'lucide-react';
import { parseMarkdown } from './utils/parser';
import type { QuizData } from './types';
import source1Raw from './assets/data/Source1.md?raw';
import source2Raw from './assets/data/Source2.md?raw';

// Components (placeholders for now)
import Home from './components/Home';
import Quiz from './components/Quiz';
import Analysis from './components/Analysis';

type View = 'home' | 'quiz' | 'analysis';

function App() {
  const [view, setView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const sources = [
    { id: 'source1', name: 'Source 1', content: source1Raw },
    { id: 'source2', name: 'Source 2', content: source2Raw },
  ];

  const handleSelectSource = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (source) {
      const data = parseMarkdown(source.content, source.name);
      setQuizData(data);
      setSelectedSource(sourceId);
      setView('quiz');
      setIsMenuOpen(false);
    }
  };

  const handleGoHome = () => {
    setView('home');
    setIsMenuOpen(false);
  };

  const handleGoAnalysis = () => {
    setView('analysis');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              単語テストアプリ
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {view !== 'home' && (
              <button onClick={handleGoHome} className="p-2 text-gray-600 hover:text-blue-600">
                <HomeIcon size={20} />
              </button>
            )}
            <button onClick={handleGoAnalysis} className="p-2 text-gray-600 hover:text-blue-600">
              <BarChart2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">問題集</div>
              {sources.map(source => (
                <button
                  key={source.id}
                  onClick={() => handleSelectSource(source.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedSource === source.id && view === 'quiz'
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  {source.name}
                </button>
              ))}

              <div className="border-t my-4"></div>

              <button
                onClick={handleGoAnalysis}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${view === 'analysis' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'
                  }`}
              >
                <BarChart2 size={18} />
                分析
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {view === 'home' && <Home onSelectSource={handleSelectSource} sources={sources} />}
        {view === 'quiz' && quizData && <Quiz data={quizData} />}
        {view === 'analysis' && <Analysis />}
      </main>
    </div>
  );
}

export default App;
