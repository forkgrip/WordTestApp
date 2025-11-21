import { BookOpen, ArrowRight } from 'lucide-react';

interface HomeProps {
    onSelectSource: (id: string) => void;
    sources: { id: string; name: string; content: string }[];
}

const Home: React.FC<HomeProps> = ({ onSelectSource, sources }) => {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">Welcome to WordTest</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select a quiz source below to start practicing.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {sources.map((source) => (
                    <button
                        key={source.id}
                        onClick={() => onSelectSource(source.id)}
                        className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all text-left flex flex-col gap-4"
                    >
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit group-hover:bg-blue-100 transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{source.name}</h3>
                            <p className="text-gray-500 text-sm">Click to start quiz</p>
                        </div>
                        <div className="absolute bottom-6 right-6 text-gray-300 group-hover:text-blue-600 transition-colors">
                            <ArrowRight size={24} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
