import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="glass-card p-6 rounded-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-2 -translate-y-2 group-hover:scale-125 transition-transform duration-700">
      <Icon size={80} />
    </div>

    <div className="flex items-start justify-between mb-6 relative z-10">
      <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5 group-hover:border-blue-500/50 transition-colors">
        <Icon size={24} style={{ color }} className="opacity-90" />
      </div>
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400'}`}>
        {trend === 'up' ? <TrendingUp size={12} /> : <Activity size={12} />}
        <span>{trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{value}%</span>
      </div>
    </div>

    <div className="relative z-10">
      <div className="text-[11px] text-slate-500 uppercase tracking-widest font-black mb-1.5">{label}</div>
      <div className="text-3xl font-black text-white tracking-tight font-display">{value}%</div>
    </div>
  </motion.div>
);

export default StatCard;
