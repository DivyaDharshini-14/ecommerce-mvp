import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthModalOpen: false,
  isLoading: true,
  
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  
  initializeAuth: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      set({ user: session?.user || null, isLoading: false });
      
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      console.error('Error checking auth session:', error);
      set({ isLoading: false });
    }
  },
  
  signInWithEmail: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ isAuthModalOpen: false });
      toast.success('Successfully signed in!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error };
    }
  },
  
  signUpWithEmail: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      set({ isAuthModalOpen: false });
      toast.success('Sign up successful! Please check your email to verify.');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Failed to sign up');
      return { success: false, error };
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error.message || 'Error signing out');
    }
  }
}));
