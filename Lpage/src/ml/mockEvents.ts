/**
 * Mock Events for Development and Demo
 * 
 * This module provides sample coding events to demonstrate the adaptive learning
 * system functionality during development. These are NOT for production use.
 * 
 * Dependencies: userProfile.ts (for types)
 */

import type { CodingEvent, Difficulty } from './userProfile';

/**
 * Array of 5 mock coding events representing a typical learning session
 * These events demonstrate progression from beginner to intermediate topics
 */
export const DEMO_EVENTS: CodingEvent[] = [
  {
    topic: 'arrays',
    timeMs: 120000, // 2 minutes
    passed: true,
    difficulty: 'easy' as Difficulty
  },
  {
    topic: 'strings',
    timeMs: 180000, // 3 minutes
    passed: true,
    difficulty: 'easy' as Difficulty
  },
  {
    topic: 'arrays',
    timeMs: 300000, // 5 minutes
    passed: false,
    difficulty: 'medium' as Difficulty
  },
  {
    topic: 'recursion',
    timeMs: 420000, // 7 minutes
    passed: true,
    difficulty: 'medium' as Difficulty
  },
  {
    topic: 'sorting',
    timeMs: 360000, // 6 minutes
    passed: true,
    difficulty: 'medium' as Difficulty
  }
];

/**
 * Simulates a coding session by recording events with delays
 * This function is ONLY for development/demo purposes
 * 
 * @param recordEvent Function to record events (from UserProfileContext)
 * @param events Optional custom events array, defaults to DEMO_EVENTS
 * @returns Promise that resolves when all events are recorded
 */
export const simulateSession = async (
  recordEvent: (topic: string, timeMs: number, passed: boolean, difficulty: Difficulty) => void,
  events: CodingEvent[] = DEMO_EVENTS
): Promise<void> => {
  console.log('Starting mock session simulation...');
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    
    // Record the event
    recordEvent(event.topic, event.timeMs, event.passed, event.difficulty);
    
    console.log(`Recorded event ${i + 1}/${events.length}: ${event.topic} (${event.passed ? 'passed' : 'failed'})`);
    
    // Wait 200ms between events for visual effect
    if (i < events.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log('Mock session simulation completed!');
};

/**
 * Extended demo events for more comprehensive testing
 * Includes failures and various difficulty levels
 */
export const EXTENDED_DEMO_EVENTS: CodingEvent[] = [
  ...DEMO_EVENTS,
  {
    topic: 'trees',
    timeMs: 480000, // 8 minutes
    passed: false,
    difficulty: 'medium' as Difficulty
  },
  {
    topic: 'graphs',
    timeMs: 600000, // 10 minutes
    passed: true,
    difficulty: 'hard' as Difficulty
  },
  {
    topic: 'dynamic programming',
    timeMs: 720000, // 12 minutes
    passed: false,
    difficulty: 'hard' as Difficulty
  },
  {
    topic: 'strings',
    timeMs: 150000, // 2.5 minutes
    passed: true,
    difficulty: 'medium' as Difficulty
  },
  {
    topic: 'recursion',
    timeMs: 240000, // 4 minutes
    passed: true,
    difficulty: 'easy' as Difficulty
  }
];

/**
 * Quick demo events for rapid testing
 * Only 3 events for fast demonstration
 */
export const QUICK_DEMO_EVENTS: CodingEvent[] = [
  {
    topic: 'arrays',
    timeMs: 90000, // 1.5 minutes
    passed: true,
    difficulty: 'easy' as Difficulty
  },
  {
    topic: 'strings',
    timeMs: 120000, // 2 minutes
    passed: true,
    difficulty: 'easy' as Difficulty
  },
  {
    topic: 'recursion',
    timeMs: 300000, // 5 minutes
    passed: false,
    difficulty: 'medium' as Difficulty
  }
];

/**
 * Utility function to create a custom event
 * Useful for testing specific scenarios
 */
export const createMockEvent = (
  topic: string,
  timeMs: number,
  passed: boolean,
  difficulty: Difficulty
): CodingEvent => ({
  topic,
  timeMs,
  passed,
  difficulty
});

/**
 * Predefined scenarios for testing different user profiles
 */
export const SCENARIOS = {
  beginner: [
    createMockEvent('arrays', 180000, true, 'easy'),
    createMockEvent('strings', 240000, true, 'easy'),
    createMockEvent('arrays', 300000, false, 'medium')
  ],
  
  intermediate: [
    createMockEvent('arrays', 120000, true, 'easy'),
    createMockEvent('strings', 150000, true, 'easy'),
    createMockEvent('recursion', 300000, true, 'medium'),
    createMockEvent('sorting', 360000, true, 'medium'),
    createMockEvent('trees', 480000, false, 'medium')
  ],
  
  advanced: [
    createMockEvent('arrays', 60000, true, 'medium'),
    createMockEvent('recursion', 180000, true, 'medium'),
    createMockEvent('sorting', 240000, true, 'hard'),
    createMockEvent('graphs', 300000, true, 'hard'),
    createMockEvent('dynamic programming', 420000, true, 'hard')
  ]
};
