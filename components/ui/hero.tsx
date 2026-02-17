
"use client"
import React, { useEffect, useRef, useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, BookOpen, Brain, Gamepad2, ChevronRight, LogOut, Sparkles, Quote } from "lucide-react"
import ModernLoader from "./ModernLoader"
import { User } from "../../types"
import { getRandomQuote } from "../../services/quoteService"

interface HeroProps {
  onStart: () => void;
  onSignIn: () => void;
  user: User | null;
  onLogout: () => void;
  onOpenDatabase: () => void;
}

const SilverShieldLogo = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    {/* Silver Shield Shape mimic */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 rounded-xl shadow-lg transform rotate-3" />
    <div className="absolute inset-[2px] bg-slate-100 rounded-[10px] flex items-center justify-center overflow-hidden">
      <div className="grid grid-cols-2 gap-1 p-1">
         <BookOpen className="w-4 h-4 text-green-500" />
         <Brain className="w-4 h-4 text-green-500" />
         <Gamepad2 className="w-4 h-4 text-slate-400" />
         <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-sm" />
         </div>
      </div>
    </div>
  </div>
);

export default function ShaderShowcase({ onStart, onSignIn, user, onLogout, onOpenDatabase }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [quote, setQuote] = useState(() => getRandomQuote('educational') as { text: string, author: string });

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote('educational') as { text: string, author: string });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden flex flex-col font-sans">
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
        </defs>
      </svg>

      {/* Fixed: Removed invalid backgroundColor property */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#1e293b", "#334155", "#064e3b", "#14532d"]}
        speed={0.2}
      />
      {/* Fixed: Removed invalid wireframe and backgroundColor properties */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-30"
        colors={["#22c55e", "#ffffff", "#334155"]}
        speed={0.15}
      />

      <header className="relative z-20 flex items-center justify-between p-8 md:px-16">
        <motion.div
          className="flex items-center gap-4 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
           <SilverShieldLogo />
           <span className="text-2xl font-technical font-medium tracking-tight text-white">
             iNTILIQuiz <span className="text-white/60">Lab</span>
           </span>
        </motion.div>

        <div className="relative flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Authorized User</span>
                <span className="text-xs font-technical font-bold text-white uppercase tracking-tighter">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group/logout"
              >
                <LogOut className="w-4 h-4 text-white group-hover/logout:text-red-400" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="px-8 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-green-500 hover:text-white cursor-pointer shadow-xl"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="relative flex-grow z-20 flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-4xl">
          <motion.h1
            className="text-7xl md:text-8xl lg:text-9xl font-technical font-bold text-white mb-8 leading-[0.85] tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="block font-light text-white/90 text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight font-sans"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Master Any Topic
            </motion.span>
            <span className="block text-white">INTELLIGENT</span>
            <span className="block font-light text-white/40 italic">Assessment Lab</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl font-light text-white/60 mb-12 leading-relaxed max-w-2xl font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Synthesize high-fidelity assessments on any subject in seconds. 
            Harness the power of neural-link AI to elevate your knowledge matrix.
          </motion.p>

          <motion.div
            className="flex items-center gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={onStart}
              className="px-14 py-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white font-black text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:scale-105 cursor-pointer shadow-[0_0_40px_rgba(34,197,94,0.3)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user ? 'Open Workspace' : 'Initialize Link'}
            </motion.button>
            <motion.button
              className="px-14 py-6 rounded-2xl bg-transparent border border-white/10 text-white/60 font-bold text-xs uppercase tracking-[0.3em] transition-all duration-300 hover:bg-white/5 hover:text-white cursor-pointer backdrop-blur-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Global Nodes
            </motion.button>
          </motion.div>
        </div>

        {/* Educational Quotes Section */}
        <div className="mt-20 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={quote.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-4"
            >
              <Quote className="text-green-500/40 w-8 h-8 shrink-0 rotate-180" />
              <div>
                <p className="text-xl font-light text-white/80 italic font-sans leading-relaxed">
                  {quote.text}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-px w-8 bg-green-500/40" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-green-500/60">
                    {quote.author}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-20 p-8 md:px-16 flex justify-between items-end">
        <div className="flex flex-col gap-2">
           <span className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-black">iNTILIQuiz Neural Cluster v2.5</span>
           <div className="flex gap-6 items-center">
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-technical">Sync Stable</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white/40 text-[10px] uppercase tracking-widest font-technical">Nodes: 1,024+</span>
             </div>
           </div>
        </div>

        <button 
          onClick={onOpenDatabase}
          className="relative opacity-40 hover:opacity-100 transition-opacity"
          title="Cluster Health"
        >
          <ModernLoader />
        </button>
      </footer>
    </div>
  )
}
