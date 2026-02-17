
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, Loader2, Radio, ShieldCheck, ListOrdered, Settings2, AlertTriangle, RefreshCw } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { authService } from '../services/authService';
import { Quiz, User } from '../types';
import ProfileDropdown from './ProfileDropdown';

interface TutorWorkspaceProps {
  user: User;
  onBack: () => void;
  onStartQuiz: (quiz: Quiz, sessionId: string) => void;
  onViewHistory: () => void;
}

const TutorWorkspace: React.FC<TutorWorkspaceProps> = ({ user, onBack, onStartQuiz, onViewHistory }) => {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<{ id: string, code: string } | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const quiz = await generateQuiz(topic, difficulty, questionCount);
      const sessionID = `QZ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      
      await authService.createSession({
        id: sessionID,
        quiz_data: quiz,
        curator_id: user.id,
        code: code
      });

      setGeneratedQuiz(quiz);
      setSessionInfo({ id: sessionID, code });
    } catch (err: any) {
      setError(err.message || "NEURAL_LINK_FAILED: Could not synchronize the assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <Radio className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Curator_Workspace</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">User: {user.name} // Status: Neural Overseer</p>
          </div>
        </div>
        <ProfileDropdown user={user} onLogout={onBack} onViewHistory={onViewHistory} />
      </header>

      <main className="max-w-4xl mx-auto">
        {!sessionInfo ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <BrainCircuit className="text-orange-500" /> Construct_Live_Session
              </h2>
              
              <div className="space-y-8">
                <div>
                   <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 block">Assessment Vector</label>
                   <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Quantum Computing, European Art, Civil Engineering..."
                      className="w-full bg-black border border-white/10 rounded-xl p-4 focus:border-orange-500 outline-none transition-colors text-lg"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 block">Neural Complexity</label>
                      <div className="grid grid-cols-2 gap-2">
                         {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                            <button
                               key={level}
                               onClick={() => setDifficulty(level)}
                               className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                  difficulty === level 
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
                                  : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                               }`}
                            >
                               {level}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 block">Data Point Count: <span className="text-white">{questionCount}</span></label>
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-xl">
                         <input 
                            type="range" 
                            min="5" 
                            max="20" 
                            step="1"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                            className="flex-grow accent-orange-500 bg-white/10 h-1 rounded-lg cursor-pointer"
                         />
                      </div>
                      <div className="flex justify-between mt-2 px-1">
                         <span className="text-[9px] text-white/20">MIN_05</span>
                         <span className="text-[9px] text-white/20">MAX_20</span>
                      </div>
                   </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-4"
                    >
                       <div className="flex items-center gap-3">
                          <AlertTriangle className="text-red-500" size={20} />
                          <h4 className="text-xs font-black uppercase text-red-500">Broadcasting_Error</h4>
                       </div>
                       <p className="text-[11px] text-red-500/80 uppercase font-bold tracking-tight">{error}</p>
                       <button onClick={handleGenerate} className="flex items-center gap-2 text-[9px] font-black uppercase text-white bg-red-500 px-4 py-2 rounded-lg self-start">
                          <RefreshCw size={12} /> Retry_Synthesis
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  onClick={handleGenerate}
                  disabled={loading || !topic}
                  className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Initialize_Broadcast</>}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-orange-500/10 border border-orange-500/30 p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">Access_Token</span>
                <ShieldCheck className="text-orange-500" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1 uppercase">Quiz_ID</div>
                <div className="text-5xl font-black italic text-white tracking-tighter">{sessionInfo.id}</div>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1 uppercase">Security_Code</div>
                <div className="text-5xl font-black italic text-orange-500 tracking-tighter">{sessionInfo.code}</div>
              </div>
              <div className="pt-4 border-t border-orange-500/20">
                 <div className="text-[10px] text-white/30 uppercase mb-2">Subject_Parameters</div>
                 <div className="flex gap-4">
                    <span className="text-[11px] font-bold text-orange-500 flex items-center gap-1"><Settings2 size={12}/> {difficulty}</span>
                    <span className="text-[11px] font-bold text-orange-500 flex items-center gap-1"><ListOrdered size={12}/> {questionCount} Nodes</span>
                 </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Neural_Traffic
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center animate-pulse">
                      <span className="text-xs text-white/60">Broadcast Live on Supabase Cluster</span>
                      <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />
                   </div>
                </div>
              </div>
              <button 
                onClick={() => generatedQuiz && sessionInfo && onStartQuiz(generatedQuiz, sessionInfo.id)}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-orange-500 hover:text-white transition-all"
              >
                Launch_Proctor_Console
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TutorWorkspace;
