
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, Activity, ArrowLeft, RefreshCw, Cpu, Globe, Loader2, Key } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';
import { MeshGradient } from "@paper-design/shaders-react";

interface DatabaseDashboardProps {
  onBack: () => void;
}

const DatabaseDashboard: React.FC<DatabaseDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await authService.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden font-mono">
      <div className="absolute inset-0 w-full h-full -z-10 opacity-40">
        {/* Fixed: Removed invalid backgroundColor property */}
        <MeshGradient
          className="w-full h-full"
          colors={["#000000", "#164e63", "#0891b2", "#1e1b4b", "#000000"]}
          speed={0.2}
        />
      </div>

      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK_TO_HUB
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">Supabase <span className="text-orange-500">Neural_Console</span></h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">Project ID: iuqovth... // Mode: Production</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={fetchUsers}
            disabled={loading}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs uppercase font-bold tracking-widest">Refresh_Data</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        Stored_Identities
                    </h2>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md border border-cyan-500/30">
                        {users.length} NODES_ACTIVE
                    </span>
                </div>
                
                <div className="overflow-x-auto min-h-[300px] flex flex-col">
                    {loading ? (
                      <div className="flex-grow flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                        <p className="text-white/40 text-xs tracking-widest animate-pulse">QUERYING_SUPABASE_CLUSTER...</p>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                          <thead>
                              <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/10">
                                  <th className="px-6 py-4 font-black">IDENTITY_NAME</th>
                                  <th className="px-6 py-4 font-black">NEURAL_EMAIL</th>
                                  <th className="px-6 py-4 font-black">SYSTEM_ROLE</th>
                                  <th className="px-6 py-4 font-black">SECURITY</th>
                                  <th className="px-6 py-4 font-black">STATUS</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                              {users.map((user) => (
                                  <tr key={user.id} className="text-sm group hover:bg-white/5 transition-colors">
                                      <td className="px-6 py-5 font-bold">{user.name}</td>
                                      <td className="px-6 py-5 text-white/50">{user.email}</td>
                                      <td className={`px-6 py-5 uppercase text-[10px] font-black ${user.role === 'curator' ? 'text-orange-500' : 'text-cyan-400'}`}>
                                          {user.role}
                                      </td>
                                      <td className="px-6 py-5">
                                          <div className="flex items-center gap-2 text-white/30 italic text-xs">
                                              <Key size={12} className="text-orange-500" />
                                              <span>ENC_VAULT</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-5">
                                          <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Linked</span>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    )}
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
                <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Security_Protocol</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/40">Auth_Mode</span>
                            <span className="text-xs font-bold text-cyan-400">SUPABASE_AUTH</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/40">Encryption</span>
                            <span className="text-xs font-bold text-cyan-400">SSL/TLS AES-256</span>
                        </div>
                        <p className="text-[10px] text-white/20 italic mt-4">Security Keys are required for all neural link establishments.</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DatabaseDashboard;
