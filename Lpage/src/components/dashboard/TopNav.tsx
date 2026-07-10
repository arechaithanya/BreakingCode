import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const TopNav: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Dashboard</span>
          <span className="text-gray-700">/</span>
          <span className="text-white font-medium">Overview</span>
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full relative hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00ff88]/30 transition-all placeholder:text-gray-600"
            placeholder="Search challenges, topics, or teammates..."
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500 font-mono">
              <Command size={10} />
              <span>F</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-[#00ff88] transition-all relative group">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#00ff88] rounded-full border-2 border-[#0a0a0a] group-hover:scale-125 transition-transform" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-white/5 rounded-2xl transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00aa66] p-[1px]">
              <div className="w-full h-full rounded-[11px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-[#00ff88]" />
                )}
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-none mb-1">{profile?.displayName || 'User'}</p>
              <p className="text-[10px] text-gray-500 leading-none">{user?.email}</p>
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-56 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
              >
                <Link 
                  to="/profile" 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <User size={16} />
                  Profile Settings
                </Link>
                <Link 
                  to="/settings" 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <Settings size={16} />
                  Account Settings
                </Link>
                <div className="h-[1px] bg-white/5 my-1 mx-2" />
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
