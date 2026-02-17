
import { supabase } from './supabaseClient';
import { User, UserRole, Quiz } from '../types';

const CURRENT_USER_KEY = 'intelliquiz_current_user';

export const authService = {
  init: async () => {
    console.log('Supabase Neural Link Initialized');
  },

  signup: async (email: string, name: string, password: string, role: UserRole): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { id: `usr_${Math.random().toString(36).substr(2, 9)}`, name, email, password, role }
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    const newUser = data as User;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) throw new Error('Invalid credentials. Check your email and security key.');
    
    const user = data as User;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => localStorage.removeItem(CURRENT_USER_KEY),
  
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  updateProfileImage: async (userId: string, avatarUrl: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .update({ avatarUrl })
      .eq('id', userId);
    
    if (error) throw error;

    // Update local storage
    const user = authService.getCurrentUser();
    if (user && user.id === userId) {
      user.avatarUrl = avatarUrl;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as User[];
  },

  getUserResults: async (name: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('contender_name', name)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  },

  createSession: async (session: { id: string, quiz_data: Quiz, curator_id: string, code: string }): Promise<void> => {
    const { error } = await supabase
      .from('live_sessions')
      .insert([session]);
    if (error) throw error;
  },

  getSession: async (sessionId: string, code: string): Promise<any> => {
    const { data, error } = await supabase
      .from('live_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('code', code)
      .single();
    
    if (error) throw new Error("SIGNAL_NOT_FOUND");
    return data;
  },

  submitResult: async (sessionId: string, name: string, score: number, total: number): Promise<void> => {
    const { error } = await supabase
      .from('quiz_results')
      .insert([{ session_id: sessionId, contender_name: name, score, total }]);
    if (error) console.error("Error submitting result:", error);
  },

  subscribeToResults: (sessionId: string, onUpdate: (payload: any) => void) => {
    return supabase
      .channel(`results-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'quiz_results', filter: `session_id=eq.${sessionId}` },
        (payload) => onUpdate(payload.new)
      )
      .subscribe();
  },

  getInitialResults: async (sessionId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) return [];
    return data;
  }
};
