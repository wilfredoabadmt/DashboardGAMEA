import React from 'react';
import { motion } from 'framer-motion';

const RiskBadge = ({ title, severity, category, delay = 0 }) => {
  const isCritical = severity === 'critical';
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border flex items-center justify-between group cursor-default transition-all duration-300 ${isCritical
        ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.05)]'
        : 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`relative w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}>
          {isCritical && <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{title}</div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{category}</div>
        </div>
      </div>
      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${isCritical ? 'border-red-500/30 text-red-400' : 'border-amber-500/30 text-amber-400'
        }`}>
        {severity}
      </div>
    </motion.div>
  );
};

export default RiskBadge;
