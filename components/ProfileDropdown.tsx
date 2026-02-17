
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle2, ShieldHalf, User, History, LogOut, X, Camera, Info, ShieldCheck, Mail, Lock
} from 'lucide-react';
import { User as UserType } from '../types';
import { authService } from '../services/authService';

interface ProfileDropdownProps {
  user: UserType;
  onLogout: () => void;
  onViewHistory: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user: initialUser, onLogout, onViewHistory }) => {
  const [user, setUser] = useState(initialUser);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await authService.updateProfileImage(user.id, base64String);
        setUser(prev => ({ ...prev, avatarUrl: base64String }));
      } catch (err) {
        console.error("Failed to sync neural portrait:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-black">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user.role === 'curator' ? <ShieldHalf className="text-orange-500 w-5 h-5" /> : <UserCircle2 className="text-cyan-500 w-5 h-5" />
          )}
        </div>
        <div className="hidden md:block pr-3 text-left">
          <div className="text-[10px] font-black uppercase text-white/40 leading-none mb-1 tracking-tighter">
            {user.role === 'curator' ? 'Neural_Overseer' : 'Neural_Contender'}
          </div>
          <div className="text-xs font-bold text-white truncate max-w-[100px]">{user.name}</div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl z-50 overflow-hidden font-mono"
          >
            <div className="p-4 border-b border-white/5 bg-white/5">
              <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Identity_Link</div>
              <div className="text-xs font-bold text-white truncate">{user.email}</div>
            </div>
            
            <div className="p-2">
              <button 
                onClick={() => { setShowModal(true); setIsOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs uppercase font-bold tracking-tighter"
              >
                <User size={16} className="text-cyan-400" /> Your Info
              </button>
              <button 
                onClick={() => { onViewHistory(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs uppercase font-bold tracking-tighter"
              >
                <History size={16} className="text-orange-500" /> History
              </button>
              <div className="h-px bg-white/5 my-1" />
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 text-red-500 transition-all text-xs uppercase font-black tracking-tighter"
              >
                <LogOut size={16} /> Logout_Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden font-mono"
            >
              <div className="p-8 pb-4 flex justify-between items-center">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Identity_Protocol</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              <div className="px-8 pb-10 space-y-8">
                {/* Image Upload Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 p-1 flex items-center justify-center group-hover:border-cyan-500 transition-all bg-white/5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center relative">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Portrait" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-10 h-10 text-white/10" />
                        )}
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                        >
                          <Camera className="text-white w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Neural_Portrait_Upload</p>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-start gap-3 max-w-[280px]">
                      <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <p className="text-[9px] text-cyan-400 leading-normal font-bold uppercase text-left">
                        Instruction: Image should be with full face not covered with anything for biometric synchronization.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <User size={18} className="text-cyan-400" />
                      </div>
                      <div className="flex-grow">
                        <label className="text-[9px] text-white/30 uppercase tracking-widest block mb-0.5">Full_Name</label>
                        <div className="text-sm font-bold text-white">{user.name}</div>
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Mail size={18} className="text-orange-500" />
                      </div>
                      <div className="flex-grow">
                        <label className="text-[9px] text-white/30 uppercase tracking-widest block mb-0.5">Neural_Address</label>
                        <div className="text-sm font-bold text-white">{user.email}</div>
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Lock size={18} className="text-purple-500" />
                      </div>
                      <div className="flex-grow">
                        <label className="text-[9px] text-white/30 uppercase tracking-widest block mb-0.5">Access_Key</label>
                        <div className="text-sm font-bold text-white tracking-widest">********</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2">
                    <ShieldCheck className="text-green-500" size={16} />
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Linked_to_Supabase_Cluster</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
