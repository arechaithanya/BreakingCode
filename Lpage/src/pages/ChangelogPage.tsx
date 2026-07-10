import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Code, Bot, Eye, Globe, LayoutDashboard } from 'lucide-react';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

interface ChangelogEntry {
  version: string;
  date: string;
  badge: 'new' | 'improvement' | 'fix';
  icon: React.ReactNode;
  title: string;
  items: string[];
}

const entries: ChangelogEntry[] = [
  {
    version: 'v1.5.0',
    date: 'May 2026 (Current)',
    badge: 'new',
    icon: <LayoutDashboard className="w-5 h-5 text-[#00ff88]" />,
    title: 'Integrated Auth & Dashboard',
    items: [
      'Full migration to Supabase Auth for secure, persistent user accounts.',
      'Launched the AntiGravity-themed dashboard with real-time analytics and problem tracking.',
      'Implemented "Demo Mode" with bypass credentials (tester@breakingcode.com) for instant access.',
      'Added 3D Session Time Tracker using React Three Fiber.',
    ],
  },
  {
    version: 'v1.4.0',
    date: 'April 2026',
    badge: 'improvement',
    icon: <Bot className="w-5 h-5 text-purple-400" />,
    title: 'AI Logic Analyzer Upgrade',
    items: [
      'Updated Gemini engine to gemini-flash-latest for 2x faster code explanations.',
      'Integrated AI-powered syntax error analysis with one-click automated fixes.',
      'Enhanced Live Visualizer support for Linked Lists and Recursion stacks.',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'April 2026',
    badge: 'new',
    icon: <Eye className="w-5 h-5 text-[#00ff88]" />,
    title: 'Interactive Algorithm Suite',
    items: [
      'Added interactive sorting animations for Bubble, Selection, Insertion, Merge, and Quick Sort.',
      'Real-time visualization of array swaps and comparisons during execution.',
      'Integrated visualization gating with confidence-based rendering (threshold > 0.8).',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'March 2026',
    badge: 'improvement',
    icon: <Code className="w-5 h-5 text-blue-400" />,
    title: 'IDE Infrastructure Overhaul',
    items: [
      'Migrated to Monaco Editor core for professional-grade IntelliSense and bracket pairing.',
      'Optimized Judge0 integration to support sandboxed execution for 50+ languages.',
      'Refined sidebar navigation and removed legacy adaptive components for better performance.',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'February 2026',
    badge: 'improvement',
    icon: <Shield className="w-5 h-5 text-orange-400" />,
    title: 'Security & Persistence',
    items: [
      'Implemented Row Level Security (RLS) policies for user profile data.',
      'Added persistent coding session tracking and history syncing.',
      'Hardened sandboxing for code execution to prevent environment leakage.',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'January 2026',
    badge: 'new',
    icon: <Globe className="w-5 h-5 text-[#00ff88]" />,
    title: 'Public Beta Launch',
    items: [
      'Initial release of Breaking Code landing page and core IDE environment.',
      'Basic support for C, C++, Python, and JavaScript compilation.',
      'Introduced "Intelligence in Every Byte" design system.',
    ],
  },
];

const badgeStyles: Record<ChangelogEntry['badge'], string> = {
  new: 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/20',
  improvement: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  fix: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const ChangelogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#00ff88] transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-12 w-auto rounded-xl border border-white/10 object-contain shadow-[0_0_20px_rgba(0,255,136,0.1)]"
            />
            <div>
              <p className="text-[#00ff88] text-xs tracking-[0.3em] uppercase font-medium">
                System Updates
              </p>
              <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Tracing every commit, feature, and architectural evolution of Breaking Code.
          </p>
        </motion.div>

        {/* Entries */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[#00ff88]/40 via-white/10 to-transparent" />

          <div className="flex flex-col gap-10 pl-8">
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-[#0a0a0a] border-2 border-[#00ff88]/60 shadow-[0_0_10px_rgba(0,255,136,0.3)]" />

                <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:border-[#00ff88]/20 transition-all group">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {entry.icon}
                      <span className="font-bold text-white tracking-tight">{entry.version}</span>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${badgeStyles[entry.badge]}`}>
                        {entry.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-600 font-mono">{entry.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-3 group-hover:text-[#00ff88] transition-colors">{entry.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {entry.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-[#00ff88] mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#00ff88]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-14 pb-8">
          © 2026 Breaking Code — All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ChangelogPage;
