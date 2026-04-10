import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DataStructuresSection: React.FC = () => {
  const [activeDS, setActiveDS] = useState(0);

  const dsData = [
    {
      title: "Dynamic Arrays",
      description: "Fast random access and contiguous memory allocation with automatic resizing.",
      component: <ArrayVisualizer />
    },
    {
      title: "Linked Lists",
      description: "Non-contiguous memory nodes connected via pointers for efficient insertion.",
      component: <LinkedListVisualizer />
    },
    {
      title: "Binary Trees",
      description: "Hierarchical data structure with recursive relationships and logarithmic traversal.",
      component: <TreeVisualizer />
    }
  ];

  return (
    <section id="about" className="snap-section flex flex-col items-center justify-center bg-black overflow-hidden py-20 px-6">
      <div className="max-w-7xl w-full">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Visualize <span className="text-devmind-cyan">Structures</span>
          </h2>
          <p className="text-gray-400 max-w-xl">
            See how your code manipulates data in real-time with our revolutionary spatial visualizer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex flex-col gap-4">
            {dsData.map((ds, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDS(idx)}
                className={`text-left p-6 rounded-2xl transition-all duration-300 ${
                  activeDS === idx 
                  ? 'react-bits-card border-devmind-cyan/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]' 
                  : 'hover:bg-white/5 opacity-40 hover:opacity-100'
                }`}
              >
                <h3 className={`text-xl font-bold mb-2 ${activeDS === idx ? 'text-devmind-cyan' : 'text-white'}`}>
                  {ds.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {ds.description}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 react-bits-card h-[400px] flex items-center justify-center overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDS}
                initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateX: 20 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="w-full h-full"
              >
                {dsData[activeDS].component}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const ArrayVisualizer = () => {
  const [items, setItems] = useState([45, 12, 89, 34, 67, 23]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        const j = Math.floor(Math.random() * next.length);
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-3 items-center justify-center h-full">
      {items.map((val, idx) => (
        <motion.div
          key={val}
          layout
          className="w-12 h-20 md:w-16 md:h-24 glass flex flex-col items-center justify-center rounded-lg border-devmind-cyan/30"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="text-xl font-mono font-bold text-devmind-cyan">{val}</span>
          <span className="text-[10px] text-gray-500 mt-2">[{idx}]</span>
        </motion.div>
      ))}
    </div>
  );
};

const LinkedListVisualizer = () => {
  const nodes = [1, 2, 3, 4];
  return (
    <div className="flex items-center justify-center gap-8 h-full">
      {nodes.map((n, i) => (
        <React.Fragment key={n}>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            className="w-16 h-16 rounded-full glass flex items-center justify-center border-devmind-purple/50 relative"
          >
            <span className="font-mono text-devmind-purple font-bold">Node {n}</span>
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="w-8 h-[2px] bg-gradient-to-r from-devmind-purple to-devmind-cyan origin-left"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const TreeVisualizer = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <motion.div className="w-14 h-14 rounded-full glass border-devmind-cyan flex items-center justify-center">Root</motion.div>
      <div className="flex gap-16">
        <div className="flex flex-col items-center gap-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full glass border-devmind-purple flex items-center justify-center"
          >
            L
          </motion.div>
          <div className="flex gap-8">
             <div className="w-10 h-10 rounded-full glass border-gray-600 flex items-center justify-center text-xs opacity-50">LL</div>
             <div className="w-10 h-10 rounded-full glass border-gray-600 flex items-center justify-center text-xs opacity-50">LR</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="w-12 h-12 rounded-full glass border-devmind-purple flex items-center justify-center"
          >
            R
          </motion.div>
          <div className="flex gap-8">
             <div className="w-10 h-10 rounded-full glass border-gray-600 flex items-center justify-center text-xs opacity-50">RL</div>
             <div className="w-10 h-10 rounded-full glass border-gray-600 flex items-center justify-center text-xs opacity-50">RR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStructuresSection;
