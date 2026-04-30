import React from 'react';
import { motion } from 'framer-motion';
import type { LinkedListStepData } from '../../../utils/codeAnalyzer';

interface Props {
  data: LinkedListStepData;
}

const LinkedListVisualizer: React.FC<Props> = ({ data }) => {
  const { name, nodes, headId, currId, action } = data;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#ff7b72]">{name}</span>
          <span className="text-[10px] text-gray-500">
            [{nodes.length} nodes]
          </span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          action === 'traverse' ? 'bg-cyan-500/20 text-cyan-400' :
          action === 'insert' ? 'bg-green-500/20 text-green-400' :
          action === 'delete' ? 'bg-red-500/20 text-red-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {action === 'init' ? 'Initialized' :
           action === 'traverse' ? 'Traversing' :
           action === 'insert' ? 'Inserted' :
           action === 'delete' ? 'Deleted' : ''}
        </span>
      </div>

      {/* Linked List visualization */}
      <div className="flex-1 flex items-center justify-start overflow-x-auto overflow-y-hidden pb-6 px-2 min-h-[120px]">
        <div className="flex items-center relative">
          {nodes.map((node, idx) => {
            const isHead = node.id === headId;
            const isCurr = node.id === currId;
            const hasNext = !!node.nextId;
            
            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <motion.div
                  layout
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Pointers (head/curr) */}
                  <div className="absolute -top-8 flex flex-col items-center gap-1 w-full">
                    {isHead && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-mono text-[#ff7b72] bg-[#ff7b72]/10 px-1 rounded border border-[#ff7b72]/30"
                      >
                        head
                      </motion.div>
                    )}
                    {isCurr && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1 rounded border border-cyan-500/30"
                      >
                        curr
                      </motion.div>
                    )}
                    {(isHead || isCurr) && (
                      <div className="w-[1px] h-3 bg-gradient-to-b from-transparent to-gray-500" />
                    )}
                  </div>

                  {/* Node UI */}
                  <div className={`flex rounded-md border shadow-lg ${
                    isCurr 
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'border-[#30363d] bg-[#161b22]'
                  }`}>
                    <div className="px-3 py-2 flex items-center justify-center border-r border-[#30363d] min-w-[40px]">
                      <span className={`text-sm font-mono ${isCurr ? 'text-white' : 'text-gray-300'}`}>
                        {node.val}
                      </span>
                    </div>
                    <div className="px-2 py-2 flex items-center justify-center bg-[#0d1117]/50 rounded-r-md">
                      <div className={`w-2 h-2 rounded-full ${
                        hasNext ? (isCurr ? 'bg-cyan-400' : 'bg-gray-500') : 'bg-transparent border border-gray-600'
                      }`} />
                    </div>
                  </div>

                  {/* Node ID label */}
                  <div className="absolute -bottom-5 text-[8px] text-gray-600 font-mono">
                    {node.id}
                  </div>
                </motion.div>

                {/* Arrow to next node */}
                {hasNext && (
                  <motion.div 
                    layout
                    className="flex items-center px-1"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 40 }}
                  >
                    <div className={`h-[2px] w-full relative ${
                      isCurr ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}>
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-[4px] border-transparent ${
                        isCurr ? 'border-l-cyan-500' : 'border-l-gray-600'
                      }`} />
                    </div>
                  </motion.div>
                )}
                
                {/* Null pointer if tail */}
                {!hasNext && (
                  <motion.div 
                    layout
                    className="flex items-center pl-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-[10px] font-mono text-gray-500 ml-2 italic">
                      null
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
