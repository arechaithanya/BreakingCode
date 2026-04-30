import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CallStackStepData } from '../../utils/codeAnalyzer';

interface Props {
  data: CallStackStepData;
}

const CallStackVisualizer: React.FC<Props> = ({ data }) => {
  const { frames, action } = data;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-purple-400">Call Stack</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          action === 'push' ? 'bg-purple-500/20 text-purple-400' :
          action === 'pop' ? 'bg-orange-500/20 text-orange-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {action === 'push' ? '↓ Push' : action === 'pop' ? '↑ Pop' : 'Idle'}
        </span>
      </div>

      {/* Depth indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-500">Depth:</span>
        <div className="flex gap-0.5">
          {Array.from({ length: Math.max(frames.length, 1) }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                backgroundColor: i < frames.length
                  ? `hsl(${270 - i * 20}, 70%, ${60 - i * 5}%)`
                  : '#374151',
              }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            />
          ))}
        </div>
        <span className="text-[10px] text-gray-500 font-mono">{frames.length}</span>
      </div>

      {/* Stack frames */}
      <div className="flex-1 flex flex-col-reverse gap-1 overflow-auto min-h-0">
        <AnimatePresence mode="popLayout">
          {frames.map((frame, idx) => {
            const isTop = idx === frames.length - 1;
            const hue = 270 - frame.depth * 15;
            const borderColor = `hsl(${hue}, 60%, 50%)`;
            const bgColor = `hsla(${hue}, 60%, 50%, 0.08)`;
            const glowColor = `hsla(${hue}, 70%, 50%, 0.3)`;

            return (
              <motion.div
                key={`${frame.name}-${frame.depth}`}
                initial={{ opacity: 0, x: -20, scaleY: 0.8 }}
                animate={{
                  opacity: frame.returning ? 0.5 : 1,
                  x: 0,
                  scaleY: 1,
                }}
                exit={{ opacity: 0, x: 30, scaleY: 0.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative rounded-lg border px-3 py-2"
                style={{
                  borderColor: frame.returning ? '#4b5563' : borderColor,
                  backgroundColor: frame.returning ? 'transparent' : bgColor,
                  marginLeft: `${frame.depth * 8}px`,
                  boxShadow: isTop && !frame.returning ? `0 0 12px ${glowColor}` : 'none',
                }}
              >
                {/* Frame content */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-mono w-4">
                      {frame.depth}
                    </span>
                    <span className={`text-xs font-mono font-medium ${
                      frame.returning ? 'text-gray-500 line-through' : 'text-white'
                    }`}>
                      {frame.name}
                      <span className="text-gray-400">({frame.args})</span>
                    </span>
                  </div>

                  {isTop && !frame.returning && (
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}

                  {frame.returning && (
                    <motion.span
                      className="text-[9px] text-orange-400 font-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      returning
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {frames.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">
            Stack empty
          </div>
        )}
      </div>

      {/* Stack base */}
      <div className="mt-2 border-t-2 border-dashed border-[#30363d] pt-1">
        <span className="text-[9px] text-gray-600 font-mono">── stack base ──</span>
      </div>
    </div>
  );
};

export default CallStackVisualizer;
