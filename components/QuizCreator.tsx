
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { Quiz } from '../types';

interface QuizCreatorProps {
  onQuizGenerated: (quiz: Quiz) => void;
  onBack: () => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onQuizGenerated, onBack }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const quiz = await generateQuiz(topic, difficulty);
      onQuizGenerated(quiz);
    } catch (err) {
      setError('Failed to generate quiz. Please check your connection or topic.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6 shadow-2xl"
          >
            <BrainCircuit className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <h2 className="text-4xl font-black tracking-tight mb-2 uppercase italic">Initialize <span className="text-orange-500">Subject</span></h2>
          <p className="text-white/50 font-light">Enter any topic and our AI will build a custom learning path.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantum Physics, Roman History, React Hooks..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-md transition-all placeholder:text-white/20"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  difficulty === level 
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            disabled={loading || !topic}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-orange-500 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Subject...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Construct Quiz
              </>
            )}
          </button>
        </form>

        <button 
          onClick={onBack}
          className="mt-8 w-full text-white/40 hover:text-white text-sm transition-colors uppercase tracking-widest font-bold"
        >
          Cancel Operation
        </button>
      </motion.div>
    </div>
  );
};

export default QuizCreator;
