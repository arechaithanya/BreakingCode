import React from 'react';
import { motion } from 'framer-motion';
import type { ArrayStepData } from '../../utils/codeAnalyzer';

interface Props {
  data: ArrayStepData;
}

const ArrayVisualizer: React.FC<Props> = ({ data }) => {
  const { name, values, highlightIndices, swapIndices, action } = data;
  const maxVal = Math.max(...values, 1);

  const getBarColor = (idx: number): string => {
    if (swapIndices && (idx === swapIndices[0] || idx === swapIndices[1])) {
      return 'bg-gradient-to-t from-red-500 to-orange-400';
    }
    if (highlightIndices.includes(idx)) {
      if (action === 'compare') return 'bg-gradient-to-t from-yellow-500 to-amber-300';
      if (action === 'access') return 'bg-gradient-to-t from-cyan-500 to-cyan-300';
      return 'bg-gradient-to-t from-green-500 to-emerald-300';
    }
    return 'bg-gradient-to-t from-[#58a6ff] to-[#79c0ff]';
  };

  const getActionLabel = (): string => {
    switch (action) {
      case 'init': return 'Initialized';
      case 'compare': return 'Comparing';
      case 'swap': return 'Swapping';
      case 'access': return 'Accessing';
      case 'push': return 'Pushed';
      case 'pop': return 'Popped';
      case 'set': return 'Updated';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#58a6ff]">{name}</span>
          <span className="text-[10px] text-gray-500">
            [{values.length} elements]
          </span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          action === 'swap' ? 'bg-red-500/20 text-red-400' :
          action === 'compare' ? 'bg-yellow-500/20 text-yellow-400' :
          action === 'access' ? 'bg-cyan-500/20 text-cyan-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {getActionLabel()}
        </span>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 flex items-end gap-1 min-h-0">
        {values.map((val, idx) => {
          const heightPercent = Math.max((val / maxVal) * 100, 8);
          return (
            <motion.div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end gap-1"
              layout
            >
              {/* Value label */}
              <motion.span
                className={`text-[10px] font-mono ${
                  highlightIndices.includes(idx) ? 'text-white font-bold' : 'text-gray-500'
                }`}
                animate={{
                  scale: highlightIndices.includes(idx) ? 1.2 : 1,
                  color: highlightIndices.includes(idx) ? '#ffffff' : '#6b7280',
                }}
                transition={{ duration: 0.2 }}
              >
                {val}
              </motion.span>

              {/* Bar */}
              <motion.div
                className={`w-full rounded-t-sm ${getBarColor(idx)} relative`}
                initial={false}
                animate={{
                  height: `${heightPercent}%`,
                  opacity: 1,
                  scaleX: swapIndices && (idx === swapIndices[0] || idx === swapIndices[1]) ? 1.1 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: 0.3,
                }}
                style={{ minHeight: '4px' }}
              >
                {/* Glow effect on highlighted bars */}
                {highlightIndices.includes(idx) && (
                  <motion.div
                    className="absolute inset-0 rounded-t-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{
                      boxShadow: action === 'swap'
                        ? '0 0 12px rgba(239, 68, 68, 0.5)'
                        : action === 'compare'
                        ? '0 0 12px rgba(234, 179, 8, 0.5)'
                        : '0 0 12px rgba(88, 166, 255, 0.5)',
                    }}
                  />
                )}
              </motion.div>

              {/* Index label */}
              <span className={`text-[9px] font-mono ${
                highlightIndices.includes(idx) ? 'text-gray-300' : 'text-gray-600'
              }`}>
                [{idx}]
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Array representation */}
      <div className="mt-2 flex gap-0.5 justify-center">
        {values.map((val, idx) => (
          <motion.div
            key={idx}
            className={`px-1.5 py-0.5 text-[9px] font-mono border rounded ${
              highlightIndices.includes(idx)
                ? 'border-[#58a6ff] bg-[#58a6ff]/10 text-white'
                : 'border-[#30363d] text-gray-500'
            }`}
            animate={{
              borderColor: highlightIndices.includes(idx) ? '#58a6ff' : '#30363d',
              backgroundColor: highlightIndices.includes(idx) ? 'rgba(88,166,255,0.1)' : 'transparent',
            }}
            transition={{ duration: 0.2 }}
          >
            {val}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ArrayVisualizer;
