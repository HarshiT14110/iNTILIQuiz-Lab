
import React from 'react';
import { motion } from 'framer-motion';

const ModernLoader: React.FC = () => {
  const bars = [0, 1, 2, 3];
  
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl animate-pulse" />
      
      {/* Glass Container */}
      <div className="relative z-10 w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center gap-1.5 overflow-hidden">
        {bars.map((i) => (
          <motion.div
            key={i}
            className="w-1.5 bg-gradient-to-t from-cyan-500 to-orange-500 rounded-full"
            animate={{
              height: ["20%", "70%", "20%"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Decorative corner light */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 blur-sm rounded-full -mr-2 -mt-2" />
      </div>
      
      {/* Small status dot */}
      <motion.div 
        className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-black z-20"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
};

export default ModernLoader;
