import React from 'react';
import { motion } from 'framer-motion';
import DitherBackground from './DitherBackground';
import breakingCodeLogo from '../assets/breaking-code-logo.jpeg';

const HeroSection: React.FC = () => {
  return (
    <DitherBackground>
      <section id="home" className="flex flex-col items-center justify-center px-6 relative w-full h-screen text-white">
      
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center z-10 w-full max-w-4xl px-4"
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_0_40px_rgba(90,255,188,0.15)] backdrop-blur-md">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-20 w-auto object-contain md:h-28"
            />
          </div>
        </motion.div>

        <motion.p 
          className="text-devmind-cyan text-sm tracking-[0.3em] uppercase mb-6 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Intelligence in every byte
        </motion.p>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight text-white drop-shadow-2xl">
          A compiler is where <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-devmind-cyan to-devmind-purple text-glow-cyan">
            logic becomes reality.
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Experience the next generation of cloud compilation. Fast, intuitive, and powered by advanced code visualization.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-devmind-cyan transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Start Coding Now
          </button>
          <button className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-all">
            See Documentation
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-devmind-cyan to-transparent" />
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
    </DitherBackground>
  );
};

export default HeroSection;
