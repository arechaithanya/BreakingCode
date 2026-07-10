import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Trophy, Zap, Code2, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, delta, icon }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-[#00ff88]/10 transition-colors">
        {React.cloneElement(icon as React.ReactElement<any>, { 
          className: "text-white group-hover:text-[#00ff88] transition-colors" 
        })}
      </div>
      <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
        <ArrowUpRight size={18} />
      </button>
    </div>

    <div>
      <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white tracking-tight font-mono">{value}</span>
        {delta && (
          <span className="text-[10px] font-bold mb-1.5 px-2 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88]">
            {delta}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const StatCards: React.FC = () => {
  const { profile } = useAuth();

  const solvedCount = profile?.solvedProblems?.length || 0;
  const totalAttempts = profile?.difficultyHistory?.length || 0;
  const accuracy = totalAttempts > 0 
    ? Math.min(100, Math.round((solvedCount / totalAttempts) * 100)) 
    : (solvedCount > 0 ? 100 : 0);

  const rank = solvedCount > 0 
    ? Math.max(1, 1542 - solvedCount * 12) 
    : undefined;

  const stats = [
    { 
      title: 'Challenges Solved', 
      value: solvedCount, 
      delta: solvedCount > 0 ? '+1' : 'Ready', 
      icon: <Trophy size={20} />, 
      color: 'emerald' 
    },
    { 
      title: 'Current Streak', 
      value: `${profile?.currentStreak || 0} days`, 
      delta: profile?.currentStreak && profile.currentStreak > 5 ? 'Fire!' : 'Start!', 
      icon: <Zap size={20} />, 
      color: 'orange' 
    },
    { 
      title: 'Rank', 
      value: rank ? `#${rank}` : '---', 
      delta: rank ? 'Top Tier' : 'Unranked', 
      icon: <Globe size={20} />, 
      color: 'purple' 
    },
    { 
      title: 'Accuracy', 
      value: `${accuracy}%`, 
      delta: undefined, 
      icon: <Code2 size={20} />, 
      color: 'blue' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <StatCard 
          key={i}
          title={stat.title}
          value={stat.value}
          delta={stat.delta}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatCards;
