import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  Trophy, 
  Terminal, 
  History, 
  Settings, 
  HelpCircle, 
  LogOut,
  Zap,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import breakingCodeLogo from '../../assets/breaking-code-logo.jpeg';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { signOut } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Challenges', icon: <Code2 size={20} />, path: '/challenges' },
    { name: 'Leaderboard', icon: <Trophy size={20} />, path: '/leaderboard' },
    { name: 'IDE', icon: <Terminal size={20} />, path: '/ide' },
    { name: 'Changelog', icon: <History size={20} />, path: '/changelog' },
  ];

  const generalItems = [
    { name: 'Settings', icon: <Settings size={20} />, path: '/profile' },
    { name: 'Help', icon: <HelpCircle size={20} />, path: '/help' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-[#050505] border-r border-white/5 flex flex-col z-50 sticky top-0"
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <img 
                src={breakingCodeLogo} 
                alt="Breaking Code Logo" 
                className="w-10 h-10 rounded-xl object-cover border border-white/5 shadow-[0_0_15px_rgba(0,255,136,0.1)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-bold text-lg text-white tracking-tight">Breaking Code</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {/* Menu Section */}
        <div>
          <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Menu'}
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-[#00ff88]/10 text-[#00ff88] shadow-[inset_0_0_10px_rgba(0,255,136,0.05)]' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* General Section */}
        <div>
          <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'General'}
          </p>
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-[#00ff88]/10 text-[#00ff88]' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
              </NavLink>
            ))}
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* Pro Promotion */}
      {!isCollapsed && (
        <div className="p-4 m-4 bg-gradient-to-br from-[#00ff88]/20 to-[#00ff88]/5 border border-[#00ff88]/20 rounded-2xl">
          <div className="w-8 h-8 bg-[#00ff88] rounded-lg flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
            <Zap size={16} className="text-black" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Unlock Pro</h3>
          <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">AI-powered hints and unlimited submissions.</p>
          <button className="w-full py-2 bg-white text-black text-[11px] font-bold rounded-lg hover:bg-[#00ff88] transition-colors">
            Upgrade Now
          </button>
        </div>
      )}
      
      {isCollapsed && (
        <div className="p-4 flex flex-col items-center gap-4 border-t border-white/5 mt-auto mb-4">
          <div className="w-8 h-8 bg-[#00ff88]/10 rounded-lg flex items-center justify-center text-[#00ff88] cursor-pointer hover:bg-[#00ff88]/20 transition-colors">
            <Zap size={16} />
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
