import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Anchor } from 'lucide-react';
import type { LinkedListStepData } from '../../../utils/codeAnalyzer';

interface Props {
  data: LinkedListStepData;
}

const LinkedListVisualizer: React.FC<Props> = ({ data }) => {
  const { nodes, headId, currId } = data;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Anchor size={16} className="text-[#ff7b72]" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">Linked List: {data.name}</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#ff7b72] rounded-sm" />
          <span className="text-[10px] text-gray-500 uppercase font-bold">Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] text-gray-500 uppercase font-bold">Current Pointer</span>
        </div>
      </div>

      {/* Linked List visualization */}
      <div className="flex-1 flex items-center justify-start overflow-x-auto overflow-y-hidden pb-6 px-2 min-h-[120px]">
        <div className="flex items-center relative">
          {nodes.map((node: any) => {
            const isHead = node.id === headId;
            const isCurr = node.id === currId;
            const hasNext = !!node.nextId;

            return (
              <React.Fragment key={node.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="relative flex flex-col items-center"
                >
                  {/* Node Box */}
                  <motion.div
                    animate={{
                      borderColor: isCurr ? '#10b981' : '#30363d',
                      boxShadow: isCurr ? '0 0 15px rgba(16,185,129,0.3)' : 'none',
                      y: isCurr ? -5 : 0
                    }}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center bg-[#0d1117] relative z-10`}
                  >
                    <span className="text-sm font-mono font-bold text-white">{node.val}</span>
                    
                    {/* Head Label */}
                    {isHead && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#ff7b72] uppercase tracking-tighter">
                        Head
                      </div>
                    )}

                    {/* Current Indicator */}
                    {isCurr && (
                      <motion.div
                        layoutId="curr-pointer"
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter"
                      >
                        Curr
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Node Memory Address (Mock) */}
                  <span className="mt-2 text-[8px] font-mono text-gray-600">
                    0x{node.id.split('-')[1] || 'A1'}
                  </span>
                </motion.div>

                {/* Arrow to Next */}
                {hasNext && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 40 }}
                    className="flex items-center justify-center overflow-hidden"
                  >
                    <div className="h-[2px] bg-[#30363d] flex-1" />
                    <ArrowRight size={12} className="text-[#30363d] -ml-1" />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
          
          {/* Null Terminator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-4 flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-lg border border-dashed border-gray-700 flex items-center justify-center bg-transparent">
              <span className="text-[10px] font-mono font-bold text-gray-700">NULL</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Logic explanation */}
      <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-gray-400">
        <p>The visualizer detects <span className="text-[#ff7b72] font-bold">ListNode</span> patterns and simulates pointer traversals based on execution flow.</p>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
