import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';
import StatCards from '../components/dashboard/StatCards';
import ActivityAnalytics from '../components/dashboard/ActivityAnalytics';
import RemindersPanel from '../components/dashboard/RemindersPanel';
import ActiveChallengesList from '../components/dashboard/ActiveChallengesList';
import TeamCollaboration from '../components/dashboard/TeamCollaboration';
import ProblemProgressChart from '../components/dashboard/ProblemProgressChart';
import TimeTracker from '../components/dashboard/TimeTracker';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-black tracking-tight"
                >
                  Welcome back, {profile?.displayName || 'User'}
                </motion.h1>
                <p className="text-gray-500 mt-1">Here's your real-time performance overview for today.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all flex items-center gap-2 text-sm">
                  <span className="text-lg leading-none">+</span>
                  New Challenge
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all text-sm">
                  Export Stats
                </button>
              </div>
            </div>

            {/* Summary Stats - Now Data Driven */}
            <StatCards />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - 8 spans */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                  <ActivityAnalytics />
                  <RemindersPanel />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TeamCollaboration />
                  <ProblemProgressChart />
                </div>
              </div>

              {/* Right Column - 4 spans */}
              <div className="lg:col-span-4 space-y-6">
                <ActiveChallengesList />
                <div className="h-72">
                  <TimeTracker />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
