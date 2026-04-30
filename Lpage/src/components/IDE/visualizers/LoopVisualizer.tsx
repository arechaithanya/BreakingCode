import React from 'react';
import { motion } from 'framer-motion';
import type { LoopStepData } from '../../utils/codeAnalyzer';

interface Props {
  data: LoopStepData;
}

const LoopVisualizer: React.FC<Props> = ({ data }) => {
  const { loopType, variable, current, total, iterationValues } = data;
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-sky-400">{loopType} loop</span>
          <span className="text-[10px] text-gray-500">
            ({variable})
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {current + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-gray-600 font-mono">0</span>
          <span className="text-[9px] text-sky-400 font-mono font-medium">
            {Math.round(progress)}%
          </span>
          <span className="text-[9px] text-gray-600 font-mono">{total}</span>
        </div>
      </div>

      {/* Iteration circles */}
      <div className="flex-1 min-h-0">
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: total }).map((_, idx) => {
            const isDone = idx < current;
            const isCurrent = idx === current;
            const isPending = idx > current;

            return (
              <motion.div
                key={idx}
                className={`relative flex items-center justify-center rounded-md border
                  ${isCurrent
                    ? 'border-sky-400 bg-sky-500/20 w-10 h-10'
                    : isDone
                    ? 'border-sky-600/50 bg-sky-500/10 w-8 h-8'
                    : 'border-[#30363d] bg-[#21262d]/30 w-8 h-8'
                  }`}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  borderColor: isCurrent ? '#38bdf8' : isDone ? 'rgba(56,189,248,0.3)' : '#30363d',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className={`text-[10px] font-mono ${
                  isCurrent ? 'text-sky-300 font-bold' :
                  isDone ? 'text-sky-500' :
                  'text-gray-600'
                }`}>
                  {iterationValues[idx] ?? idx}
                </span>

                {/* Active pulse */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-md border border-sky-400"
                    animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Done checkmark */}
                {isDone && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sky-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {isPending && null}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current iteration info */}
      <div className="mt-3 bg-[#21262d] rounded-lg p-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-sky-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-gray-400">
            {variable} = <span className="text-sky-300 font-medium">{iterationValues[current] ?? current}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoopVisualizer;
