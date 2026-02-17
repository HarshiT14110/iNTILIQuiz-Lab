
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, ArrowLeft, Trophy, Calendar, CheckCircle2, Loader2, BrainCircuit
} from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface HistoryViewProps {
  user: User;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ user, onBack }) => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await authService.getUserResults(user.name);
      setAttempts(data);
      setLoading(false);
    };
    fetchHistory();
  }, [user.name]);

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12 font-mono relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-500/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/10 blur-[120px] -z-10" />

      <header className="max-w-4xl mx-auto mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 group text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Neural_Return
        </button>
        <div className="flex items-center gap-6">
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
            <History className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Assessment_History</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">User: {user.name} // Cluster: Live_Records</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-white/20 text-[10px] uppercase tracking-widest">Retrieving_Past_Vectors...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
            <BrainCircuit className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h2 className="text-white/40 text-sm font-bold uppercase tracking-widest">No Records Found</h2>
            <p className="text-white/20 text-xs mt-2">Begin your first assessment to initialize history stream.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt, idx) => {
              const percentage = Math.round((attempt.score / attempt.total) * 100);
              const date = new Date(attempt.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });
              
              return (
                <motion.div 
                  key={attempt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/10 transition-all hover:border-white/20"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Trophy size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1 font-black">Broadcast_Session: {attempt.session_id}</div>
                      <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">Performance Synthesis</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-white/20" />
                      <span className="text-[10px] text-white/40 uppercase font-bold">{date}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black italic text-orange-500">{attempt.score}/{attempt.total}</div>
                      <div className="text-[9px] text-white/20 uppercase font-bold">Raw Score</div>
                    </div>
                    <div className="w-16 h-16 relative flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="176" strokeDashoffset={176 - (176 * percentage) / 100} className="text-cyan-500" />
                       </svg>
                       <span className="absolute text-[10px] font-black text-white">{percentage}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryView;
