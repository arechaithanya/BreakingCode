import React from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RemindersPanel: React.FC = () => {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-[#00ff88]/10 text-[#00ff88] rounded-xl">
            <Calendar size={18} />
          </div>
          <h3 className="text-white font-bold">Upcoming</h3>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white leading-tight group-hover:text-[#00ff88] transition-colors">
            Monthly Algo-Sprint Contest
          </h2>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
            <Clock size={14} />
            <span>Tomorrow : 02.00 pm - 04.00 pm</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.2)] flex items-center justify-center gap-2 group/btn transition-all"
        >
          Join Challenge
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

export default RemindersPanel;
