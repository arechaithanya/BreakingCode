/**
 * User profile management for adaptive learning system
 * 
 * This module provides pure functions for maintaining user skill profiles
 * based on coding events. No side effects, no API calls, fully testable.
 * 
 * Dependencies: None (pure TypeScript)
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CodingEvent {
  topic: string;
  timeMs: number;
  passed: boolean;
  difficulty: Difficulty;
}

export interface UserProfile {
  problemsSolved: number;
  avgTimeMs: number;
  topicScores: Record<string, number>; // 0-1 scale per topic
  recentTopics: string[]; // Last 10 topics attempted
  difficultyHistory: Difficulty[]; // Last 20 difficulties attempted
}

/**
 * Creates a new empty user profile
 * @returns Fresh user profile with default values
 */
export const createEmptyProfile = (): UserProfile => ({
  problemsSolved: 0,
  avgTimeMs: 0,
  topicScores: {},
  recentTopics: [],
  difficultyHistory: []
});

/**
 * Updates user profile based on a coding event
 * @param profile Current user profile
 * @param event Coding event that occurred
 * @returns Updated user profile (immutable)
 */
export const updateProfile = (profile: UserProfile, event: CodingEvent): UserProfile => {
  const newProblemsSolved = profile.problemsSolved + (event.passed ? 1 : 0);
  
  // Update average time (exponential moving average)
  const newAvgTimeMs = profile.avgTimeMs === 0 
    ? event.timeMs 
    : profile.avgTimeMs * 0.9 + event.timeMs * 0.1;
  
  // Update topic score (0-1 scale, weighted by success and time)
  const currentTopicScore = profile.topicScores[event.topic] || 0;
  const timeFactor = Math.max(0.3, Math.min(1, 300000 / event.timeMs)); // Favor faster completion
  const successFactor = event.passed ? 1 : 0.3;
  const newTopicScore = Math.min(1, currentTopicScore * 0.7 + timeFactor * successFactor * 0.3);
  
  // Update recent topics (keep last 10)
  const newRecentTopics = [event.topic, ...profile.recentTopics.slice(0, 9)];
  
  // Update difficulty history (keep last 20)
  const newDifficultyHistory = [event.difficulty, ...profile.difficultyHistory.slice(0, 19)];
  
  return {
    problemsSolved: newProblemsSolved,
    avgTimeMs: newAvgTimeMs,
    topicScores: {
      ...profile.topicScores,
      [event.topic]: newTopicScore
    },
    recentTopics: newRecentTopics,
    difficultyHistory: newDifficultyHistory
  };
};

/**
 * Infers user skill level based on profile metrics
 * @param profile User profile to analyze
 * @returns Inferred skill level
 */
export const inferSkillLevel = (profile: UserProfile): SkillLevel => {
  if (profile.problemsSolved === 0) {
    return 'beginner';
  }
  
  // Calculate weighted score
  let score = 0;
  
  // Topic coverage (0-40 points)
  const topicCount = Object.keys(profile.topicScores).length;
  const avgTopicScore = Object.values(profile.topicScores).reduce((a, b) => a + b, 0) / Math.max(1, topicCount);
  score += Math.min(40, topicCount * 5 + avgTopicScore * 10);
  
  // Success rate (0-30 points)
  const successRate = profile.problemsSolved / Math.max(1, profile.difficultyHistory.length);
  score += successRate * 30;
  
  // Speed efficiency (0-20 points)
  const speedScore = Math.max(0, Math.min(20, (300000 - profile.avgTimeMs) / 15000));
  score += speedScore;
  
  // Difficulty progression (0-10 points)
  const recentDifficulties = profile.difficultyHistory.slice(0, 5);
  const hardCount = recentDifficulties.filter(d => d === 'hard').length;
  const mediumCount = recentDifficulties.filter(d => d === 'medium').length;
  score += hardCount * 4 + mediumCount * 2;
  
  if (score >= 70) return 'advanced';
  if (score >= 40) return 'intermediate';
  return 'beginner';
};

/**
 * Gets topic mastery level for display
 * @param score Topic score (0-1)
 * @returns Human-readable mastery level
 */
export const getTopicMasteryLevel = (score: number): string => {
  if (score >= 0.8) return 'Mastered';
  if (score >= 0.6) return 'Proficient';
  if (score >= 0.4) return 'Developing';
  if (score >= 0.2) return 'Learning';
  return 'New';
};
