import React from 'react';
import { motion } from 'framer-motion';

const FuturisticGauge = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-5 group">
    <div className="relative w-36 h-36">
      {/* Glow effect behind */}
      <div
        className="absolute inset-4 rounded-full opacity-20 blur-xl transition-all duration-700 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      ></div>

      <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray="263.89"
          initial={{ strokeDashoffset: 263.89 }}
          animate={{ strokeDashoffset: 263.89 - (263.89 * value) / 100 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-4xl font-black text-white tracking-tighter font-display">{value}%</span>
        <div className="w-8 h-1 bg-white/10 rounded-full mt-1"></div>
      </div>
    </div>
    <div className="text-[11px] font-black text-slate-400 text-center uppercase tracking-[0.25em] max-w-[140px] leading-relaxed transition-colors group-hover:text-white">
      {label}
    </div>
  </div>
);

export default FuturisticGauge;
