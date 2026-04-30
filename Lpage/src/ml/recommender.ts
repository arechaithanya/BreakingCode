/**
 * Content-based recommender system for coding problems
 * 
 * This module provides a lightweight recommendation engine that scores problems
 * based on user skill gaps, difficulty matching, and prerequisites.
 * No external ML libraries required - pure algorithmic approach.
 * 
 * Dependencies: userProfile.ts (for UserProfile type)
 */

import type { UserProfile, SkillLevel } from './userProfile';
import { inferSkillLevel } from './userProfile';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  id: string;
  title: string;
  topic: string;
  difficulty: ProblemDifficulty;
  prerequisites: string[];
  description: string;
}

export interface RecommendationScore {
  problem: Problem;
  score: number;
  reasons: string[];
}

/**
 * Hardcoded catalog of 20 coding problems covering various topics
 * Each problem includes metadata for recommendation scoring
 */
export const PROBLEM_CATALOG: Problem[] = [
  // Array problems
  {
    id: 'array-reverse',
    title: 'Reverse Array',
    topic: 'arrays',
    difficulty: 'easy',
    prerequisites: [],
    description: 'Write a function that reverses an array in-place.'
  },
  {
    id: 'array-merge',
    title: 'Merge Sorted Arrays',
    topic: 'arrays',
    difficulty: 'medium',
    prerequisites: ['arrays'],
    description: 'Merge two sorted arrays into a single sorted array.'
  },
  {
    id: 'array-rotation',
    title: 'Array Rotation',
    topic: 'arrays',
    difficulty: 'medium',
    prerequisites: ['arrays'],
    description: 'Rotate an array to the right by k steps.'
  },
  
  // String problems
  {
    id: 'string-palindrome',
    title: 'Palindrome Check',
    topic: 'strings',
    difficulty: 'easy',
    prerequisites: [],
    description: 'Determine if a string is a palindrome.'
  },
  {
    id: 'string-anagram',
    title: 'Valid Anagram',
    topic: 'strings',
    difficulty: 'medium',
    prerequisites: ['strings'],
    description: 'Check if two strings are anagrams of each other.'
  },
  {
    id: 'string-longest',
    title: 'Longest Substring',
    topic: 'strings',
    difficulty: 'hard',
    prerequisites: ['strings'],
    description: 'Find the longest substring without repeating characters.'
  },
  
  // Recursion problems
  {
    id: 'recursion-fibonacci',
    title: 'Fibonacci Sequence',
    topic: 'recursion',
    difficulty: 'easy',
    prerequisites: [],
    description: 'Generate the nth Fibonacci number using recursion.'
  },
  {
    id: 'recursion-factorial',
    title: 'Factorial Calculation',
    topic: 'recursion',
    difficulty: 'easy',
    prerequisites: [],
    description: 'Calculate factorial using recursion.'
  },
  {
    id: 'recursion-tower',
    title: 'Tower of Hanoi',
    topic: 'recursion',
    difficulty: 'hard',
    prerequisites: ['recursion'],
    description: 'Solve the Tower of Hanoi puzzle recursively.'
  },
  
  // Sorting problems
  {
    id: 'sort-bubble',
    title: 'Bubble Sort',
    topic: 'sorting',
    difficulty: 'easy',
    prerequisites: ['arrays'],
    description: 'Implement bubble sort algorithm.'
  },
  {
    id: 'sort-quick',
    title: 'Quick Sort',
    topic: 'sorting',
    difficulty: 'medium',
    prerequisites: ['arrays', 'recursion'],
    description: 'Implement quick sort algorithm.'
  },
  {
    id: 'sort-merge',
    title: 'Merge Sort',
    topic: 'sorting',
    difficulty: 'medium',
    prerequisites: ['arrays', 'recursion'],
    description: 'Implement merge sort algorithm.'
  },
  
  // Tree problems
  {
    id: 'tree-traversal',
    title: 'Binary Tree Traversal',
    topic: 'trees',
    difficulty: 'medium',
    prerequisites: [],
    description: 'Implement inorder, preorder, and postorder traversal.'
  },
  {
    id: 'tree-height',
    title: 'Tree Height',
    topic: 'trees',
    difficulty: 'easy',
    prerequisites: ['trees'],
    description: 'Calculate the height of a binary tree.'
  },
  {
    id: 'tree-bst',
    title: 'Validate BST',
    topic: 'trees',
    difficulty: 'medium',
    prerequisites: ['trees'],
    description: 'Validate if a binary tree is a binary search tree.'
  },
  
  // Graph problems
  {
    id: 'graph-bfs',
    title: 'Breadth-First Search',
    topic: 'graphs',
    difficulty: 'medium',
    prerequisites: [],
    description: 'Implement BFS traversal on a graph.'
  },
  {
    id: 'graph-dfs',
    title: 'Depth-First Search',
    topic: 'graphs',
    difficulty: 'medium',
    prerequisites: [],
    description: 'Implement DFS traversal on a graph.'
  },
  {
    id: 'graph-dijkstra',
    title: 'Dijkstra Algorithm',
    topic: 'graphs',
    difficulty: 'hard',
    prerequisites: ['graphs'],
    description: 'Find shortest path using Dijkstra algorithm.'
  },
  
  // Dynamic Programming problems
  {
    id: 'dp-climbing',
    title: 'Staircase Climbing',
    topic: 'dynamic programming',
    difficulty: 'medium',
    prerequisites: [],
    description: 'Count ways to climb n stairs taking 1 or 2 steps.'
  },
  {
    id: 'dp-knapsack',
    title: 'Knapsack Problem',
    topic: 'dynamic programming',
    difficulty: 'hard',
    prerequisites: ['dynamic programming'],
    description: 'Solve the 0/1 knapsack problem using dynamic programming.'
  }
];

/**
 * Recommendation scoring algorithm
 * 
 * Scoring logic:
 * - Knowledge gap bonus: +3 if topic score < 0.5 (user needs practice)
 * - Difficulty matching: +2 if difficulty matches user skill level
 * - Avoid repetition: -2 if topic is in recent topics
 * - Prerequisite scaffolding: +1 per satisfied prerequisite
 * - Recent success bonus: +1 if recent success rate > 70%
 * 
 * @param profile User profile to base recommendations on
 * @param count Number of recommendations to return
 * @returns Array of scored recommendations sorted by score descending
 */
export const recommendProblems = (profile: UserProfile, count: number = 3): RecommendationScore[] => {
  const userSkillLevel = inferSkillLevel(profile);
  const recentSuccessRate = profile.difficultyHistory.length > 0 
    ? profile.problemsSolved / profile.difficultyHistory.length 
    : 0;
  
  const scoredProblems = PROBLEM_CATALOG.map(problem => {
    let score = 0;
    const reasons: string[] = [];
    
    // Knowledge gap bonus
    const topicScore = profile.topicScores[problem.topic] || 0;
    if (topicScore < 0.5) {
      score += 3;
      reasons.push('Knowledge gap - needs practice');
    }
    
    // Difficulty matching
    const difficultyMatch = (
      (userSkillLevel === 'beginner' && problem.difficulty === 'easy') ||
      (userSkillLevel === 'intermediate' && problem.difficulty === 'medium') ||
      (userSkillLevel === 'advanced' && problem.difficulty === 'hard')
    );
    if (difficultyMatch) {
      score += 2;
      reasons.push('Matches current skill level');
    }
    
    // Avoid repetition
    if (profile.recentTopics.includes(problem.topic)) {
      score -= 2;
      reasons.push('Recently practiced this topic');
    }
    
    // Prerequisite scaffolding
    const satisfiedPrereqs = problem.prerequisites.filter(prereq => {
      const prereqScore = profile.topicScores[prereq] || 0;
      return prereqScore >= 0.6; // Consider satisfied if score >= 60%
    });
    score += satisfiedPrereqs.length;
    if (satisfiedPrereqs.length > 0) {
      reasons.push(`${satisfiedPrereqs.length} prerequisites satisfied`);
    }
    
    // Recent success bonus
    if (recentSuccessRate > 0.7) {
      score += 1;
      reasons.push('High recent success rate');
    }
    
    return {
      problem,
      score,
      reasons
    };
  });
  
  // Sort by score descending and return top N
  return scoredProblems
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
};

/**
 * Generates a human-readable explanation for why a problem was recommended
 * @param problem The problem to explain
 * @param profile User profile context
 * @returns Explanation string
 */
export const explainRecommendation = (problem: Problem, profile: UserProfile): string => {
  const topicScore = profile.topicScores[problem.topic] || 0;
  const userSkillLevel = inferSkillLevel(profile);
  
  if (topicScore < 0.3) {
    return `You haven't practiced ${problem.topic} yet - great place to start!`;
  }
  
  if (topicScore < 0.6) {
    return `Your ${problem.topic} skills are developing - this will help improve.`;
  }
  
  if (profile.recentTopics.includes(problem.topic)) {
    return `Reinforce your recent ${problem.topic} practice with this problem.`;
  }
  
  if (problem.difficulty === userSkillLevel as ProblemDifficulty) {
    return `Perfect difficulty match for your current ${userSkillLevel} level.`;
  }
  
  const satisfiedPrereqs = problem.prerequisites.filter(prereq => {
    const prereqScore = profile.topicScores[prereq] || 0;
    return prereqScore >= 0.6;
  });
  
  if (satisfiedPrereqs.length > 0) {
    return `Build on your knowledge of ${satisfiedPrereqs.join(' and ')}.`;
  }
  
  return `Good next step to expand your problem-solving skills.`;
};

/**
 * Gets problems by topic for filtering
 * @param topic Topic to filter by
 * @returns Array of problems in the specified topic
 */
export const getProblemsByTopic = (topic: string): Problem[] => {
  return PROBLEM_CATALOG.filter(problem => problem.topic === topic);
};

/**
 * Gets all available topics
 * @returns Array of unique topic names
 */
export const getAllTopics = (): string[] => {
  return [...new Set(PROBLEM_CATALOG.map(problem => problem.topic))];
};
