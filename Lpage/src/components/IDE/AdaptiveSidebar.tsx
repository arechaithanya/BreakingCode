/**
 * Adaptive Learning Sidebar Component
 * 
 * This component displays user skill level, topic scores visualization,
 * and personalized problem recommendations. Self-contained with minimal coupling.
 * 
 * Dependencies: UserProfileContext, userProfile.ts, recommender.ts
 */

import React, { useMemo } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import { inferSkillLevel, getTopicMasteryLevel } from '../../ml/userProfile';
import { recommendProblems, explainRecommendation } from '../../ml/recommender';
import type { Problem } from '../../ml/recommender';

/**
 * Simple SVG bar chart component for topic scores
 * No external chart library required
 */
const TopicScoreChart: React.FC<{ topicScores: Record<string, number> }> = ({ topicScores }) => {
  const topics = Object.entries(topicScores).slice(0, 6); // Show top 6 topics
  
  if (topics.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-4">
        No topic data yet. Start solving problems!
      </div>
    );
  }

  const maxScore = Math.max(...topics.map(([, score]) => score), 1);

  return (
    <div className="space-y-2">
      {topics.map(([topic, score]) => (
        <div key={topic} className="flex items-center gap-2">
          <div className="w-20 text-xs text-gray-400 truncate">
            {topic}
          </div>
          <div className="flex-1 h-4 bg-gray-700 rounded relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-devmind-cyan to-blue-500 transition-all duration-300"
              style={{ width: `${(score / maxScore) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {Math.round(score * 100)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skill level badge component with color coding
 */
const SkillLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const getBadgeStyles = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'intermediate':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'advanced':
        return 'bg-purple-900 text-purple-200 border-purple-700';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getBadgeStyles(level)}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </div>
  );
};

/**
 * Problem card component for recommendations
 */
const ProblemCard: React.FC<{ problem: Problem; explanation: string }> = ({ problem, explanation }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-800 text-green-200';
      case 'medium':
        return 'bg-amber-800 text-amber-200';
      case 'hard':
        return 'bg-red-800 text-red-200';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const handleCardClick = () => {
    // Dispatch custom event for loose coupling
    const event = new CustomEvent('problem-selected', {
      detail: problem
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-devmind-cyan transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-white truncate flex-1">
          {problem.title}
        </h4>
        <span className={`ml-2 px-2 py-0.5 text-xs rounded ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
          {problem.topic}
        </span>
      </div>
      
      <p className="text-xs text-gray-400 line-clamp-2 mb-2">
        {problem.description}
      </p>
      
      <div className="text-xs text-devmind-cyan font-medium">
        {explanation}
      </div>
    </div>
  );
};

/**
 * Main AdaptiveSidebar component
 */
const AdaptiveSidebar: React.FC = () => {
  const { profile } = useUserProfile();

  const skillLevel = useMemo(() => inferSkillLevel(profile), [profile]);
  
  const recommendations = useMemo(() => {
    return recommendProblems(profile, 3);
  }, [profile]);

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto h-full">
      <div className="space-y-6">
        {/* Skill Level Badge */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Your Progress</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Level</span>
            <SkillLevelBadge level={skillLevel} />
          </div>
        </div>

        {/* Topic Scores Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Topic Mastery</h4>
          <TopicScoreChart topicScores={profile.topicScores} />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-devmind-cyan">
              {profile.problemsSolved}
            </div>
            <div className="text-xs text-gray-400">Problems Solved</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(profile.avgTimeMs / 1000)}s
            </div>
            <div className="text-xs text-gray-400">Avg Time</div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Recommended</h4>
            <span className="text-xs text-gray-500">
              Based on your progress
            </span>
          </div>
          
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map(({ problem, score }) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  explanation={explainRecommendation(problem, profile)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              Start solving problems to get recommendations!
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {profile.recentTopics.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Topics</h4>
            <div className="flex flex-wrap gap-2">
              {profile.recentTopics.slice(0, 5).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveSidebar;
