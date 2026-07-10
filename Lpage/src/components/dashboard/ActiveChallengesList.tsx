import React, { useMemo } from 'react';
import { Plus, ChevronRight, Terminal, Globe, Cpu, Database, Braces, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ALL_CHALLENGES = [
  { id: '1', name: 'LRU Cache Implementation', difficulty: 'Hard', icon: <Cpu size={16} />, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: '2', name: 'Dynamic Graph Router', difficulty: 'Medium', icon: <Globe size={16} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: '3', name: 'Red-Black Tree Balance', difficulty: 'Hard', icon: <Braces size={16} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: '4', name: 'Query Optimizer', difficulty: 'Medium', icon: <Database size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: '5', name: 'Concurrent Hash Map', difficulty: 'Hard', icon: <Terminal size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

const ActiveChallengesList: React.FC = () => {
  const { profile } = useAuth();

  // Filter out challenges the user has already solved
  const activeChallenges = useMemo(() => {
    return ALL_CHALLENGES.filter(c => !profile?.solvedProblems?.some(p => p.id === c.id)).slice(0, 4);
  }, [profile]);

  return (
    <div className="glass p-6 rounded-3xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold">Recommended for You</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#00ff88]/10 text-gray-400 hover:text-[#00ff88] rounded-lg text-xs font-bold transition-all border border-white/5">
          <Plus size={14} />
          <span>Browse</span>
        </button>
      </div>

      <div className="flex-1 space-y-3">
        {activeChallenges.length > 0 ? (
          activeChallenges.map((challenge, i) => (
            <Link key={challenge.id} to="/ide">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 mb-3 last:mb-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${challenge.bg} ${challenge.color} group-hover:scale-110 transition-transform shadow-lg`}>
                    {challenge.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#00ff88] transition-colors">{challenge.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold ${challenge.color}`}>{challenge.difficulty}</span>
                      <span className="text-[10px] text-gray-600">•</span>
                      <span className="text-[10px] text-gray-500">Pick up where you left</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="p-4 rounded-full bg-[#00ff88]/10 text-[#00ff88] mb-4">
              <Sparkles size={32} />
            </div>
            <h4 className="text-white font-bold text-sm">All caught up!</h4>
            <p className="text-gray-500 text-xs mt-2">You've solved all your active challenges. Time to find new ones!</p>
          </div>
        )}
      </div>

      <Link to="/ide" className="w-full mt-6">
        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white rounded-xl transition-all border border-white/5">
          Go to IDE
        </button>
      </Link>
    </div>
  );
};

export default ActiveChallengesList;
