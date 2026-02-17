
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppView, Quiz, User } from './types';
import ShaderShowcase from './components/ui/hero';
import AuthView from './components/AuthView';
import TutorWorkspace from './components/TutorWorkspace';
import StudentWorkspace from './components/StudentWorkspace';
import QuizViewer from './components/QuizViewer';
import DatabaseDashboard from './components/DatabaseDashboard';
import HistoryView from './components/HistoryView';
import Leaderboard from './components/Leaderboard';
import { authService } from './services/authService';
import { Radio, Users, Activity, BarChart2, ShieldCheck, ArrowLeft, Trophy, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    authService.init();
    const savedUser = authService.getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setView(u.role === 'curator' ? 'tutor-workspace' : 'student-workspace');
  };

  const handleStart = () => {
    if (user) {
      setView(user.role === 'curator' ? 'tutor-workspace' : 'student-workspace');
    } else {
      setView('auth');
    }
  };

  const ProctorView = () => {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
      if (!currentSessionId) return;

      // Load existing
      authService.getInitialResults(currentSessionId).then(setResults);

      // Subscribe to real-time updates
      const subscription = authService.subscribeToResults(currentSessionId, (newResult) => {
        setResults(prev => [...prev, newResult]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, []);

    const averageScore = results.length > 0 
      ? (results.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / results.length * 100).toFixed(0)
      : 0;

    return (
      <div className="min-h-screen bg-black text-white p-12 font-mono overflow-y-auto">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white/5 p-8 border border-white/10 rounded-3xl backdrop-blur-xl">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
                     <Activity className="w-10 h-10 text-orange-500 animate-pulse" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black italic tracking-tighter uppercase">Proctor_Console</h2>
                     <p className="text-white/40 text-xs uppercase tracking-widest">Broadcasting: {currentQuiz?.title} // ID: {currentSessionId}</p>
                  </div>
               </div>
               <button onClick={() => setView('tutor-workspace')} className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-500 border border-orange-500/30 px-4 py-2 rounded-xl hover:bg-orange-500 hover:text-white transition-all">
                  <ArrowLeft size={14} /> Terminate_Session
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <Users className="text-cyan-400" />
                  <span className="text-3xl font-black italic">{results.length}</span>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Contenders Finished</span>
               </div>
               <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <BarChart2 className="text-orange-500" />
                  <span className="text-3xl font-black italic">{averageScore}%</span>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Class Efficiency</span>
               </div>
               <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <ShieldCheck className="text-green-500" />
                  <span className="text-3xl font-black italic">ACTIVE</span>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Signal Status</span>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl">
               <Leaderboard results={results} title="Live Curator Leaderboard" />
            </div>
         </motion.div>
      </div>
    );
  };

  const handleGoBack = () => {
    if (!user) {
      setView('landing');
      return;
    }
    setView(user.role === 'curator' ? 'tutor-workspace' : 'student-workspace');
  };

  return (
    <div className="w-full h-full min-h-screen bg-black">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <ShaderShowcase 
            onStart={handleStart} 
            onSignIn={() => setView('auth')}
            user={user}
            onLogout={() => { authService.logout(); setUser(null); setView('landing'); }}
            onOpenDatabase={() => setView('database')}
          />
        )}
        {view === 'auth' && (
          <AuthView onAuthSuccess={handleAuthSuccess} onBack={() => setView('landing')} />
        )}
        {view === 'tutor-workspace' && user && (
          <TutorWorkspace 
            user={user} 
            onBack={() => setView('landing')} 
            onStartQuiz={(q, sid) => { setCurrentQuiz(q); setCurrentSessionId(sid); setView('live-quiz'); }} 
            onViewHistory={() => setView('history')}
          />
        )}
        {view === 'student-workspace' && user && (
          <StudentWorkspace 
            user={user} 
            onBack={() => setView('landing')} 
            onJoinQuiz={(q, sid) => { setCurrentQuiz(q); setCurrentSessionId(sid); setView('live-quiz'); }} 
            onViewHistory={() => setView('history')}
          />
        )}
        {view === 'live-quiz' && currentQuiz && user && (
          user.role === 'curator' 
            ? <ProctorView /> 
            : <QuizViewer 
                quiz={currentQuiz} 
                sessionId={currentSessionId || ''} 
                userName={user.name} 
                onRestart={() => setView('student-workspace')} 
                onComplete={() => {}} 
              />
        )}
        {view === 'database' && (
          <DatabaseDashboard onBack={() => setView('landing')} />
        )}
        {view === 'history' && user && (
          <HistoryView user={user} onBack={handleGoBack} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
