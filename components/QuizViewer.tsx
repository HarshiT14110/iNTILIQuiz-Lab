
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCw, UserCheck, MessageSquareQuote, LayoutList } from 'lucide-react';
import { Quiz } from '../types';
import { authService } from '../services/authService';
import { getRandomQuote } from '../services/quoteService';
import Leaderboard from './Leaderboard';

interface QuizViewerProps {
  quiz: Quiz;
  sessionId: string;
  userName: string;
  onComplete: (score: number, total: number) => void;
  onRestart: () => void;
}

const QuizViewer: React.FC<QuizViewerProps> = ({ quiz, sessionId, userName, onComplete, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [appreciationQuote] = useState(() => getRandomQuote('appreciation') as string);
  const [allResults, setAllResults] = useState<any[]>([]);

  const currentQuestion = quiz.questions[currentIndex];

  useEffect(() => {
    if (showResult) {
      // Fetch initial and subscribe for real-time leaderboard
      authService.getInitialResults(sessionId).then(setAllResults);
      const sub = authService.subscribeToResults(sessionId, (newRes) => {
        setAllResults(prev => [...prev, newRes]);
      });
      return () => sub.unsubscribe();
    }
  }, [showResult, sessionId]);

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedId(id);
  };

  const handleNext = async () => {
    const isCorrect = selectedId === currentQuestion.correctOptionId;
    const newScore = isCorrect ? score + 1 : score;

    if (currentIndex < quiz.questions.length - 1) {
      setScore(newScore);
      setCurrentIndex(currentIndex + 1);
      setSelectedId(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      setScore(newScore);
      await authService.submitResult(sessionId, userName, newScore, quiz.questions.length);
      onComplete(newScore, quiz.questions.length);
    }
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    setIsAnswered(true);
  };

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[64px] opacity-20" />
               <Trophy className="w-24 h-24 text-orange-500 relative z-10" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl font-black mb-2 uppercase italic tracking-tighter">Mission <span className="text-cyan-400">Complete</span></h2>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl italic text-sm text-white/70">
                <MessageSquareQuote className="text-cyan-400 shrink-0" size={20} />
                "{appreciationQuote}"
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-all" />
               <div className="text-7xl font-black text-white mb-2">{percentage}%</div>
               <div className="text-sm text-white/40 uppercase tracking-[0.3em] font-black">Efficiency Metric</div>
               <div className="mt-8 h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${percentage}%` }}
                     className="h-full bg-gradient-to-r from-cyan-500 to-orange-500"
                  />
               </div>
               <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-4 py-2 rounded-xl">
                    <UserCheck size={12} /> Sync_Stable: {userName}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-orange-400 font-bold uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-xl">
                    <LayoutList size={12} /> Nodes: {score}/{quiz.questions.length}
                  </div>
               </div>
            </div>

            <button 
              onClick={onRestart}
              className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-2xl hover:bg-cyan-500 hover:text-white transition-all group"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              New Data Stream
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl"
          >
            <Leaderboard results={allResults} highlightName={userName} title="Neural Leaderboard" />
          </motion.div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-500/10 blur-[150px] -z-10" />

      <div className="w-full max-w-3xl space-y-8">
        <header className="flex justify-between items-end mb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-1 block">Question {currentIndex + 1} of {quiz.questions.length}</span>
            <h3 className="text-2xl font-bold">{quiz.title}</h3>
          </div>
          <div className="text-right">
             <span className="text-4xl font-black italic opacity-20">{String(currentIndex + 1).padStart(2, '0')}</span>
          </div>
        </header>

        <div className="h-1.5 w-full bg-white/5 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-medium leading-tight text-white">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedId === option.id;
              const isCorrect = isAnswered && option.id === currentQuestion.correctOptionId;
              const isWrong = isAnswered && isSelected && option.id !== currentQuestion.correctOptionId;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`relative p-6 rounded-2xl text-left transition-all border group ${
                    isSelected ? 'ring-2 ring-cyan-500/50' : ''
                  } ${
                    isCorrect ? 'bg-green-500/20 border-green-500 text-green-100' :
                    isWrong ? 'bg-red-500/20 border-red-500 text-red-100' :
                    isSelected ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{option.text}</span>
                  {isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-400" />}
                  {isWrong && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-400" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <h4 className="text-sm font-black uppercase tracking-widest text-white/40 mb-2">Analysis</h4>
              <p className="text-white/80 leading-relaxed italic">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end pt-8">
          {!isAnswered ? (
            <button
              disabled={!selectedId}
              onClick={handleConfirm}
              className="px-12 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Verify Signal
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-4 rounded-xl bg-cyan-500 text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              Next Vector <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;
