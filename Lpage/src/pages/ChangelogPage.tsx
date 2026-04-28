import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Code, Bot, Eye, Globe } from 'lucide-react';
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
    version: 'v0.4.0',
    date: 'April 2026',
    badge: 'new',
    icon: <Bot className="w-5 h-5 text-devmind-purple" />,
    title: 'AI Code Assistant — Beta',
    items: [
      'Introduced multi-line AI completions powered by our fine-tuned code model.',
      'Context-aware suggestions that understand your entire open file.',
      'One-click bug-fix proposals highlighted inline.',
    ],
  },
  {
    version: 'v0.3.2',
    date: 'March 2026',
    badge: 'improvement',
    icon: <Zap className="w-5 h-5 text-devmind-cyan" />,
    title: 'Compiler Performance Upgrades',
    items: [
      'Average compile time reduced from 180ms to under 100ms via edge node expansion.',
      'Introduced warm container pools for Python and Node.js — near-instant cold starts eliminated.',
      'Memory sandbox limit raised to 4 GB on Pro plan.',
    ],
  },
  {
    version: 'v0.3.0',
    date: 'February 2026',
    badge: 'new',
    icon: <Eye className="w-5 h-5 text-devmind-cyan" />,
    title: 'Data Structure Visualizer v2',
    items: [
      'Added graph and adjacency-matrix visualizations.',
      'Stack & queue operations now animate push/pop transitions.',
      'Visualizer panel is now resizable and detachable.',
    ],
  },
  {
    version: 'v0.2.5',
    date: 'January 2026',
    badge: 'new',
    icon: <Globe className="w-5 h-5 text-devmind-purple" />,
    title: 'Language Expansion',
    items: [
      'Added Zig, Elixir, Haskell, and Lua to the execution grid.',
      'Total language support now at 50+.',
      'Language-specific snippets and starter templates added.',
    ],
  },
  {
    version: 'v0.2.0',
    date: 'December 2025',
    badge: 'improvement',
    icon: <Code className="w-5 h-5 text-devmind-cyan" />,
    title: 'Editor Overhaul',
    items: [
      'Migrated editor core to Monaco for VS Code–grade IntelliSense.',
      'Added themes: Dark (default), Monokai, One Dark.',
      'Multi-cursor editing and bracket pair colorization enabled.',
    ],
  },
  {
    version: 'v0.1.0',
    date: 'November 2025',
    badge: 'new',
    icon: <Shield className="w-5 h-5 text-devmind-purple" />,
    title: 'Public Launch',
    items: [
      'Breaking Code is live! Cloud compilation for C, C++, Python, JavaScript, and Java.',
      'Isolated sandboxed containers with AES-256 encryption.',
      'Code snippets vault with cloud sync.',
    ],
  },
];

const badgeStyles: Record<ChangelogEntry['badge'], string> = {
  new: 'bg-devmind-cyan/15 text-devmind-cyan border-devmind-cyan/20',
  improvement: 'bg-devmind-purple/15 text-devmind-purple border-devmind-purple/20',
  fix: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const ChangelogPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-devmind-dark text-white px-6 py-16 relative overflow-x-hidden">
      <div className="react-bits-bg" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-devmind-cyan transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-12 w-auto rounded-xl border border-white/10 object-contain"
            />
            <div>
              <p className="text-devmind-cyan text-xs tracking-[0.3em] uppercase font-medium">
                What's New
              </p>
              <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Every update, fix, and new feature — in one place.
          </p>
        </motion.div>

        {/* Entries */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-devmind-cyan/40 via-white/10 to-transparent" />

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
                <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-devmind-dark border-2 border-devmind-cyan/60" />

                <div className="react-bits-card p-6">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {entry.icon}
                      <span className="font-bold text-white">{entry.version}</span>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${badgeStyles[entry.badge]}`}>
                        {entry.badge}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{entry.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-3">{entry.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {entry.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-devmind-cyan mt-1 shrink-0">—</span>
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
          © 2026 Breaking Code Technologies
        </p>
      </div>
    </div>
  );
};

export default ChangelogPage;
