
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ShieldAlert, Wifi, Globe, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { User, Quiz } from '../types';
import ProfileDropdown from './ProfileDropdown';

interface StudentWorkspaceProps {
  user: User;
  onBack: () => void;
  onJoinQuiz: (quiz: Quiz, sessionId: string) => void;
  onViewHistory: () => void;
}

const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({ user, onBack, onJoinQuiz, onViewHistory }) => {
  const [quizId, setQuizId] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setError(null);
    setLoading(true);
    
    try {
        const session = await authService.getSession(quizId, code);
        setLoading(false);
        onJoinQuiz(session.quiz_data as Quiz, session.id);
    } catch (err: any) {
        setLoading(false);
        if (err.message === "SIGNAL_NOT_FOUND") {
            setError("SIGNAL_NOT_FOUND: Broadcast ID or Cipher is invalid.");
        } else {
            setError("LINK_FAILURE: Could not connect to the Supabase cloud.");
        }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <Radio className="w-8 h-8 text-cyan-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Contender_Portal</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">Identity: {user.name} // Status: Linked</p>
          </div>
        </div>
        <ProfileDropdown user={user} onLogout={onBack} onViewHistory={onViewHistory} />
      </header>

      <main className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
             <h2 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-400" /> JOIN_ACTIVE_BROADCAST
             </h2>
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] text-white/30 uppercase tracking-widest mb-2 block">BROADCAST_ID</label>
                   <input 
                      type="text" 
                      value={quizId}
                      onChange={(e) => {setQuizId(e.target.value.toUpperCase()); setError(null);}}
                      placeholder="e.g. QZ-A2B1"
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-center font-black tracking-[0.5em] text-cyan-400 outline-none focus:border-cyan-500 transition-all placeholder:tracking-normal placeholder:font-light"
                   />
                </div>
                <div>
                   <label className="text-[10px] text-white/30 uppercase tracking-widest mb-2 block">4_DIGIT_ACCESS_CIPHER</label>
                   <input 
                      type="text" 
                      value={code}
                      maxLength={4}
                      onChange={(e) => {setCode(e.target.value); setError(null);}}
                      placeholder="0000"
                      className="w-full bg-black border border-white/10 rounded-xl p-4 text-center text-4xl font-black tracking-[0.5em] outline-none focus:border-cyan-500 transition-all placeholder:tracking-normal placeholder:font-light"
                   />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                    >
                       <AlertCircle className="text-red-500 shrink-0" size={16} />
                       <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                   onClick={handleJoin}
                   disabled={loading || quizId.length < 4 || code.length < 4}
                   className="w-full py-5 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                >
                   {loading ? <><Loader2 className="animate-spin" size={18} /> Validating_Signal...</> : "Sync_Signal"}
                </button>
             </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
             <ShieldAlert className="w-5 h-5 text-orange-500" />
             <p className="text-[10px] text-orange-500/80 leading-tight uppercase font-bold">
                Contender identity must remain stable during assessment.
             </p>
          </div>
        </motion.div>

        <div className="mt-20 flex justify-center opacity-10">
            <Globe className="w-24 h-24 animate-spin-slow" />
        </div>
      </main>
    </div>
  );
};

export default StudentWorkspace;
