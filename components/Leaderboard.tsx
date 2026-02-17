
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, User, Star } from 'lucide-react';

interface LeaderboardEntry {
  contender_name: string;
  score: number;
  total: number;
  id?: string;
}

interface LeaderboardProps {
  results: LeaderboardEntry[];
  highlightName?: string;
  title?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ results, highlightName, title = "Neural Rankings" }) => {
  // Sort results by score descending
  const sorted = [...results].sort((a, b) => {
    const scoreA = (a.score / a.total);
    const scoreB = (b.score / b.total);
    return scoreB - scoreA;
  });

  const getCrownColor = (index: number) => {
    if (index === 0) return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]";
    if (index === 1) return "text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]";
    if (index === 2) return "text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.6)]";
    return "text-white/20";
  };

  return (
    <div className="w-full space-y-4 font-mono">
      <div className="flex items-center justify-between px-2 mb-6">
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2">
          <Star size={14} className="animate-spin-slow" /> {title}
        </h3>
        <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{sorted.length} Contenders</span>
      </div>

      <div className="space-y-3">
        {sorted.map((entry, index) => {
          const isHighlighted = highlightName === entry.contender_name;
          const isBlurred = highlightName && !isHighlighted;
          const percentage = Math.round((entry.score / entry.total) * 100);

          return (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden group rounded-2xl border transition-all duration-500 ${
                isHighlighted 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-orange-500/20 border-white/30 scale-[1.02] z-10 shadow-2xl shadow-cyan-500/10' 
                  : 'bg-white/5 border-white/5'
              } ${isBlurred ? 'blur-[4px] opacity-40 grayscale pointer-events-none scale-95' : ''}`}
            >
              {isHighlighted && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-orange-500/10 animate-pulse" />
              )}
              
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg ${getCrownColor(index)}`}>
                    {index < 3 ? <Crown size={24} /> : `#${index + 1}`}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black uppercase tracking-tighter ${isHighlighted ? 'text-white' : 'text-white/70'}`}>
                        {entry.contender_name}
                      </span>
                      {isHighlighted && <span className="text-[8px] bg-cyan-500 text-black px-1 rounded font-black uppercase">YOU</span>}
                    </div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                      Stability: Stable
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-xl font-black italic ${isHighlighted ? 'text-white' : 'text-white/60'}`}>
                      {entry.score}<span className="text-xs opacity-40 font-normal">/{entry.total}</span>
                    </div>
                    <div className="text-[9px] text-white/20 uppercase font-bold">Vector Score</div>
                  </div>
                  
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="20" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeDasharray="126" 
                        strokeDashoffset={126 - (126 * percentage) / 100} 
                        className={isHighlighted ? "text-cyan-500" : "text-white/20"} 
                      />
                    </svg>
                    <span className="absolute text-[8px] font-black text-white">{percentage}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
