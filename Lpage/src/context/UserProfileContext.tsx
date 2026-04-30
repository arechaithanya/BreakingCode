/**
 * React Context for User Profile management
 * 
 * This context provides a global state for user profile data and
 * event recording functionality. No persistence, no API calls.
 * 
 * Dependencies: userProfile.ts (for types and updateProfile function)
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, CodingEvent, Difficulty } from '../ml/userProfile';
import { createEmptyProfile, updateProfile } from '../ml/userProfile';

export interface UserProfileContextValue {
  profile: UserProfile;
  recordEvent: (topic: string, timeMs: number, passed: boolean, difficulty: Difficulty) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export interface UserProfileProviderProps {
  children: ReactNode;
}

/**
 * Provider component for user profile context
 * Initializes with empty profile and provides event recording functionality
 */
export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(createEmptyProfile());

  /**
   * Records a coding event and updates the user profile
   * @param topic The topic practiced (e.g., 'arrays', 'recursion')
   * @param timeMs Time taken in milliseconds
   * @param passed Whether the problem was solved successfully
   * @param difficulty Difficulty level of the problem
   */
  const recordEvent = useCallback((topic: string, timeMs: number, passed: boolean, difficulty: Difficulty) => {
    const event: CodingEvent = {
      topic,
      timeMs,
      passed,
      difficulty
    };
    
    setProfile(currentProfile => updateProfile(currentProfile, event));
  }, []);

  /**
   * Resets the user profile to initial empty state
   */
  const resetProfile = useCallback(() => {
    setProfile(createEmptyProfile());
  }, []);

  const contextValue: UserProfileContextValue = {
    profile,
    recordEvent,
    resetProfile
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

/**
 * Hook to use the user profile context
 * @throws Error if used outside of UserProfileProvider
 * @returns User profile context value
 */
export const useUserProfile = (): UserProfileContextValue => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

/**
 * Hook to get just the profile data (read-only)
 * @returns Current user profile
 */
export const useUserProfileData = (): UserProfile => {
  const { profile } = useUserProfile();
  return profile;
};
