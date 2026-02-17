
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MeshGradient } from "@paper-design/shaders-react";
import { 
  Loader2, ArrowLeft, GraduationCap, School, Eye, EyeOff, ShieldAlert, WifiOff
} from 'lucide-react';
import { authService } from '../services/authService';
import { UserRole, User } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('contender');
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, type: 'collision' | 'auth' | 'network' | 'generic'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await authService.login(email, password);
      } else {
        user = await authService.signup(email, name, password, role);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("unique constraint") || msg.includes("already exists")) {
        setError({ message: "Neural signature collision: Email already registered.", type: 'collision' });
      } else if (msg.includes("Invalid credentials")) {
        setError({ message: "Link rejected: Incorrect credentials.", type: 'auth' });
      } else if (msg.includes("Failed to fetch") || msg.includes("network")) {
        setError({ message: "Sync failure: Database cluster unreachable.", type: 'network' });
      } else {
        setError({ message: msg || "Identity establishment failed.", type: 'generic' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container transition-colors duration-500 ${isDarkMode ? "dark" : "light"}`}>
      <div className="absolute inset-0 w-full h-full -z-10">
        <MeshGradient
          className="w-full h-full"
          colors={role === 'contender' 
            ? ["#000000", "#06b6d4", "#0891b2", "#164e63", "#000000"] 
            : ["#000000", "#f97316", "#ea580c", "#7c2d12", "#000000"]
          }
          speed={0.4}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card w-full max-w-[480px] p-10"
      >
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 mb-8">
          <ArrowLeft size={14} /> Back to Lab
        </button>

        <div className="role-selector relative flex p-1 bg-white/5 rounded-2xl border border-white/10 mb-8 overflow-hidden">
          <motion.div 
            className="absolute top-1 bottom-1 left-1 w-[48%] rounded-xl bg-gradient-to-r from-cyan-500 to-orange-500"
            animate={{ x: role === 'contender' ? '0%' : '104%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button 
            type="button"
            onClick={() => setRole('contender')}
            className={`relative z-10 w-1/2 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${role === 'contender' ? 'text-white' : 'text-white/40'}`}
          >
            <GraduationCap size={14} /> I am Contender
          </button>
          <button 
            type="button"
            onClick={() => setRole('curator')}
            className={`relative z-10 w-1/2 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${role === 'curator' ? 'text-white' : 'text-white/40'}`}
          >
            <School size={14} /> I am Quiz Curator
          </button>
        </div>

        <div className="login-header mb-8">
          <h1 className="text-4xl font-black tracking-tighter italic">
            {isLogin ? "Neural_Link" : "System_Registry"}
          </h1>
          <p className="text-sm text-white/40 uppercase tracking-widest">
            Role: <span className={role === 'contender' ? 'text-cyan-400' : 'text-orange-500'}>{role}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className={`form-field ${name ? "active" : ""}`}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <label>Identity Name</label>
            </div>
          )}
          <div className={`form-field ${email ? "active" : ""}`}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Neural Email</label>
          </div>
          <div className={`form-field ${password ? "active" : ""}`}>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <label>Security Key</label>
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  error.type === 'network' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                {error.type === 'network' ? <WifiOff className="text-orange-500 shrink-0" size={16} /> : <ShieldAlert className="text-red-500 shrink-0" size={16} />}
                <p className={`text-[11px] font-bold tracking-tight uppercase ${error.type === 'network' ? 'text-orange-500' : 'text-red-500'}`}>
                  {error.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="login-button h-14" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (isLogin ? "Establish Connection" : "Initialize Identity")}
          </button>
        </form>

        <p className="signup-prompt mt-8">
          {isLogin ? "No registry found? " : "Already linked? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-orange-500 font-bold hover:underline">
            {isLogin ? "Register Node" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthView;
