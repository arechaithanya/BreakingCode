import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import type { UserProfile, CodingEvent, Difficulty } from '../ml/userProfile';
import { createEmptyProfile, updateProfile } from '../ml/userProfile';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  recordEvent: (topic: string, timeMs: number, passed: boolean, difficulty: Difficulty) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK USER FOR DEMO MODE
const MOCK_USER = {
  id: 'demo-user-id',
  email: 'tester@breakingcode.com',
  user_metadata: { display_name: 'Beta Tester' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const MOCK_PROFILE = createEmptyProfile('demo-user-id', 'tester@breakingcode.com', 'Beta Tester');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    if (userId === 'demo-user-id') {
      setProfile(MOCK_PROFILE);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const newProfile = createEmptyProfile(
              userData.user.id,
              userData.user.email || '',
              userData.user.user_metadata.display_name || userData.user.email?.split('@')[0] || 'User'
            );
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([newProfile]);
              
            if (insertError) throw insertError;
            setProfile(newProfile);
          }
        } else {
          throw error;
        }
      } else {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load user profile');
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Check for Demo Mode first
    const isDemo = localStorage.getItem('breaking_code_demo_mode') === 'true';
    if (isDemo) {
      setUser(MOCK_USER);
      setProfile(MOCK_PROFILE);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // If we are in demo mode, ignore auth changes unless it's a sign out
      if (localStorage.getItem('breaking_code_demo_mode') === 'true' && !session) {
         localStorage.removeItem('breaking_code_demo_mode');
      }
      
      if (localStorage.getItem('breaking_code_demo_mode') === 'true') return;

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const recordEvent = useCallback(async (topic: string, timeMs: number, passed: boolean, difficulty: Difficulty) => {
    if (!profile || !user) return;

    const event: CodingEvent = { topic, timeMs, passed, difficulty };
    const updatedProfile = updateProfile(profile, event);

    setProfile(updatedProfile);

    if (user.id === 'demo-user-id') return; // Don't persist demo events

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error persisting profile:', err);
    }
  }, [profile, user]);

  const signOut = useCallback(async () => {
    localStorage.removeItem('breaking_code_demo_mode');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    recordEvent,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
