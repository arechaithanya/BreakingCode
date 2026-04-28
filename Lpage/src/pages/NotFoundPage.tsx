import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Terminal } from 'lucide-react';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-devmind-dark flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="react-bits-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(160,32,240,0.08)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-lg"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_0_40px_rgba(90,255,188,0.1)] backdrop-blur-md">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>

        {/* Error code */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-devmind-cyan text-sm tracking-[0.3em] uppercase mb-4 font-medium"
        >
          Error 404
        </motion.p>

        <h1 className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-4 tracking-tighter">
          404
        </h1>

        {/* Terminal-style message */}
        <div className="react-bits-card p-4 mb-8 font-mono text-left text-sm">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-widest">stderr</span>
          </div>
          <p className="text-red-400">Segmentation fault (core dumped)</p>
          <p className="text-gray-500 mt-1">
            <span className="text-yellow-400">Page</span> at address{' '}
            <span className="text-devmind-cyan">0x{Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}</span>{' '}
            does not exist.
          </p>
          <p className="text-gray-600 mt-1">
            <span className="text-green-400">$</span> Program exited with status: 404
          </p>
        </div>

        <p className="text-gray-400 mb-8">
          This page got lost in the heap. Let's get you back somewhere safe.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-devmind-cyan text-black font-bold rounded-full hover:bg-white transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 glass rounded-full text-white hover:border-devmind-cyan/40 hover:text-devmind-cyan transition-all"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
