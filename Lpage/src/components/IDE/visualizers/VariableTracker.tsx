import React from 'react';
import { motion } from 'framer-motion';
import type { VariableStepData } from '../../utils/codeAnalyzer';

interface Props {
  data: VariableStepData;
}

const VariableTracker: React.FC<Props> = ({ data }) => {
  const { variables } = data;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-emerald-400">Variables</span>
        <span className="text-[10px] text-gray-500">
          {variables.length} tracked
        </span>
      </div>

      {/* Variable table */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="space-y-1">
          {/* Table header */}
          <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-gray-500 uppercase tracking-wider">
            <span className="w-20">Name</span>
            <span className="flex-1">Value</span>
            <span className="w-12 text-right">Status</span>
          </div>

          {/* Variable rows */}
          {variables.map((v, idx) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md relative ${
                v.changed
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-[#21262d]/50'
              }`}
            >
              {/* Glow pulse on change */}
              {v.changed && (
                <motion.div
                  className="absolute inset-0 rounded-md bg-emerald-500/5"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                />
              )}

              {/* Name */}
              <span className={`w-20 text-xs font-mono truncate ${
                v.changed ? 'text-emerald-400 font-medium' : 'text-gray-400'
              }`}>
                {v.name}
              </span>

              {/* Value */}
              <motion.span
                className={`flex-1 text-xs font-mono truncate ${
                  v.changed ? 'text-white' : 'text-gray-400'
                }`}
                animate={v.changed ? {
                  color: ['#10b981', '#ffffff'],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {v.value}
              </motion.span>

              {/* Status indicator */}
              <div className="w-12 flex justify-end">
                {v.changed ? (
                  <motion.span
                    className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    NEW
                  </motion.span>
                ) : (
                  <span className="text-[9px] text-gray-600">●</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariableTracker;
