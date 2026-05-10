import React, { useState, useEffect } from 'react';
import {
  BarChart3, FileText, ShieldAlert, UserCheck, Trash2, PlusCircle,
  Save, FolderOpen, FileSpreadsheet, Layers, Target, Scale, Activity,
  Building2, AlertTriangle, Upload, Download, Edit3, Eye, Zap,
  TrendingUp, CheckCircle, Clock, ChevronRight, Menu, X, Settings,
  LogOut, Bell, Search, Filter, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORGANIGRAMA } from './lib/constants';
import { supabase } from './lib/supabase';

// ============================================================================
// COMPONENTES ATÓMICOS & UTILIDADES
// ============================================================================

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

const RiskBadge = ({ title, severity, category, delay = 0 }) => {
  const isCritical = severity === 'critical';
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border flex items-center justify-between group cursor-default transition-all duration-300 ${
        isCritical 
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
      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
        isCritical ? 'border-red-500/30 text-red-400' : 'border-amber-500/30 text-amber-400'
      }`}>
        {severity}
      </div>
    </motion.div>
  );
};

// ============================================================================
// COMPONENTES DE LAYOUT
// ============================================================================

const Sidebar = ({ currentView, onViewChange, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'preview', label: 'Dashboard', icon: BarChart3 },
    { id: 'hierarchy', label: 'Organigrama', icon: Building2 },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'list', label: 'Archivos', icon: FolderOpen },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-500/20">
              <Layers size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter leading-none font-display">GAMEA<span className="text-brand-500">HQ</span></h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">v1.0.4 Command</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${
                  currentView === item.id
                    ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} className={currentView === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} />
                {item.label}
                {currentView === item.id && (
                  <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <UserCheck size={16} />
                </div>
                <div className="text-xs font-bold text-white">Wilfredo Abad</div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">Acceso Nivel 5: Auditoría Estratégica</div>
            </div>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
              <LogOut size={20} className="opacity-40" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const TopBar = ({ title, subtitle, onSave, isSaveActive, onMenuClick }) => (
  <header className="sticky top-0 z-30 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 px-6 lg:px-10 py-4 no-print">
    <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight font-display">{title}</h2>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-2 focus-within:border-brand-500 transition-all">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar reportes..." 
            className="bg-transparent border-none outline-none text-sm px-3 text-white placeholder:text-slate-600 w-48 xl:w-64"
          />
        </div>
        
        <button className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <button
          onClick={onSave}
          className={`ml-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
            isSaveActive
              ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95'
              : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
          disabled={!isSaveActive}
        >
          <Save size={18} /> 
          <span className="hidden sm:inline">Guardar</span>
        </button>
      </div>
    </div>
  </header>
);

// ============================================================================
// VISTAS PRINCIPALES
// ============================================================================

const PreviewView = ({ data, indicadores, estadisticas, riesgos }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-10"
  >
    {/* HERO SECTION */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
      <div className="relative bg-slate-900 border border-white/5 p-10 lg:p-14 rounded-[2rem] overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform rotate-12">
          <Building2 size={240} />
        </div>
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-full text-[11px] font-black text-brand-400 uppercase tracking-[0.2em]">
                {data.secretaria}
              </span>
              <div className="h-1.5 w-1.5 bg-slate-700 rounded-full"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {data.direccion}
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] font-display max-w-4xl">
                {data.titulo}
              </h2>
              <p className="text-slate-400 text-xl font-medium max-w-3xl leading-relaxed">{data.subtitulo}</p>
            </div>
            
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400 border border-white/5">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Actualizado</div>
                  <div className="text-sm font-bold text-slate-200">{data.fecha}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5">
                  <Target size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Estatus</div>
                  <div className="text-sm font-bold text-emerald-400">AUDITORÍA ACTIVA</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:min-w-[400px] grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Responsable</div>
              <div className="text-sm font-bold text-white mb-1">{data.acreditado}</div>
              <div className="text-[10px] text-brand-400 font-bold uppercase">Auditor Jefe</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Autoridad</div>
              <div className="text-sm font-bold text-white mb-1 truncate">{data.alcalde}</div>
              <div className="text-[10px] text-indigo-400 font-bold uppercase">Alcalde Electo</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* DASHBOARD GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: MAIN KPIS */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Zap size={20} className="text-brand-400" />
            Métricas Críticas de Transición
          </h3>
          <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]"></div>
             <div className="w-2 h-2 rounded-full bg-slate-800"></div>
             <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indicadores.map((ind, idx) => (
            <div 
              key={ind.id}
              className="glass-card p-10 flex items-center justify-center"
            >
              <FuturisticGauge value={ind.value} label={ind.label} color={ind.color} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Matriz de Riesgos</h4>
                <ShieldAlert size={18} className="text-amber-500" />
              </div>
              <div className="space-y-3">
                {riesgos.map((r, i) => (
                  <RiskBadge key={i} title={r.title} severity={r.imp === 3 ? 'critical' : 'high'} category={r.cat} delay={i * 0.1} />
                ))}
              </div>
           </div>

           <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                  <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Alertas de Bloqueo</h4>
                </div>
                <p className="text-slate-300 font-medium leading-relaxed mb-8">{data.alerta}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.bloqueos.map(b => (
                  <span key={b} className="text-[10px] font-black text-red-400 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
                    {b}
                  </span>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT: SECONDARY STATS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Estadísticas</h3>
          <TrendingUp size={18} className="text-emerald-500" />
        </div>
        
        {estadisticas.map((s, i) => (
          <StatCard key={i} icon={Activity} label={s.label} value={s.val} trend={s.trend} color="#38abf8" delay={i * 0.1} />
        ))}

        <div className="glass-card p-8 bg-gradient-to-br from-brand-600/20 to-indigo-600/20 border-brand-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-widest">Base Legal</div>
              <div className="text-lg font-bold text-brand-200">{data.ley}</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
            Todos los indicadores están alineados con los marcos normativos de control gubernamental vigentes en el Estado Plurinacional de Bolivia.
          </p>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all uppercase text-[10px] tracking-[0.2em] border border-white/10">
            Consultar Normativa
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const HierarchyView = () => {
  const [expandedSec, setExpandedSec] = useState(null);
  const [expandedDir, setExpandedDir] = useState(null);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight font-display">Estructura Orgánica GAMEA</h3>
          <p className="text-slate-500 font-medium mt-2">Navegación jerárquica de Secretarías, Direcciones y Unidades.</p>
        </div>
        <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
          <Building2 size={32} />
        </div>
      </div>

      <div className="grid gap-4">
        {ORGANIGRAMA.map((sec, idx) => (
          <div key={sec.id} className="group">
            <button
              onClick={() => {
                setExpandedSec(expandedSec === sec.id ? null : sec.id);
                setExpandedDir(null);
              }}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between group ${
                expandedSec === sec.id 
                  ? 'bg-brand-600 border-brand-500 shadow-2xl shadow-brand-600/20 text-white' 
                  : 'glass-card border-white/5 text-slate-300 hover:border-brand-500/50'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                  expandedSec === sec.id ? 'bg-white/20 text-white' : 'bg-brand-500/10 text-brand-400'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${expandedSec === sec.id ? 'text-brand-200' : 'text-slate-500'}`}>
                    Secretaría Municipal
                  </div>
                  <div className="text-lg font-black tracking-tight">{sec.name}</div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSec === sec.id ? 90 : 0 }}
                className={expandedSec === sec.id ? 'text-white' : 'text-slate-600'}
              >
                <ChevronRight size={24} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSec === sec.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-8 px-6 space-y-3">
                    {sec.direcciones.map((dir) => (
                      <div key={dir.id} className="relative">
                        <button
                          onClick={() => setExpandedDir(expandedDir === dir.id ? null : dir.id)}
                          className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between group/dir ${
                            expandedDir === dir.id 
                              ? 'bg-slate-800 border-white/20 text-white shadow-xl' 
                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              expandedDir === dir.id ? 'bg-brand-500 text-white' : 'bg-white/5 text-slate-500'
                            }`}>
                              <Target size={16} />
                            </div>
                            <span className="text-sm font-bold tracking-wide">{dir.name}</span>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedDir === dir.id ? 90 : 0 }}
                            className="opacity-40 group-hover/dir:opacity-100"
                          >
                            <ChevronRight size={18} />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedDir === dir.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-black/20 rounded-b-xl border-x border-b border-white/5">
                                {dir.unidades.map((uni, uIdx) => (
                                  <motion.div
                                    key={uIdx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: uIdx * 0.05 }}
                                    className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-brand-500/30 hover:bg-white/10 transition-all flex items-center gap-3 group/uni"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)] group-hover/uni:scale-150 transition-transform"></div>
                                    <span className="text-[11px] font-bold text-slate-400 group-hover/uni:text-white transition-colors uppercase tracking-wider">{uni}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditorView = ({ 
  data, setData, indicadores, setIndicadores, onImport, onDownloadCSV,
  secretarias, direcciones, unidades,
  selectedSec, setSelectedSec,
  selectedDir, setSelectedDir,
  selectedUni, setSelectedUni
}) => {
  const isSelectionComplete = selectedSec && selectedDir && selectedUni;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT PANEL: SELECTION & CONFIG */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-8 rounded-3xl border-brand-500/20">
          <h3 className="text-lg font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
            <Building2 size={20} className="text-brand-400" />
            Ubicación Institucional
          </h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Secretaría Municipal</label>
              <select
                value={selectedSec}
                onChange={e => { setSelectedSec(e.target.value); setSelectedDir(''); setSelectedUni(''); }}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 outline-none appearance-none"
              >
                <option value="">Seleccione Secretaría...</option>
                {secretarias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Dirección</label>
              <select
                value={selectedDir}
                onChange={e => { setSelectedDir(e.target.value); setSelectedUni(''); }}
                disabled={!selectedSec}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 outline-none appearance-none disabled:opacity-30"
              >
                <option value="">Seleccione Dirección...</option>
                {direcciones.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Unidad</label>
              <select
                value={selectedUni}
                onChange={e => setSelectedUni(e.target.value)}
                disabled={!selectedDir}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 outline-none appearance-none disabled:opacity-30"
              >
                <option value="">Seleccione Unidad...</option>
                {unidades.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>

        {isSelectionComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl"
          >
            <h3 className="text-lg font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
              <Settings size={20} className="text-brand-400" />
              General
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Título del Reporte', key: 'titulo' },
                { label: 'Subtítulo / Contexto', key: 'subtitulo' },
                { label: 'Nombre del Responsable', key: 'acreditado' },
                { label: 'Alcalde Electo', key: 'alcalde' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">{field.label}</label>
                  <input
                    type="text"
                    value={data[field.key]}
                    onChange={e => setData({...data, [field.key]: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Alerta Principal</label>
                <textarea
                  value={data.alerta}
                  onChange={e => setData({...data, alerta: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="text-[10px] font-black text-slate-500 block mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Upload size={14} /> Subir Información / Evidencia
                </label>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-brand-500/50 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <Upload size={24} className="text-slate-600 group-hover:text-brand-400 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Click para subir archivos</span>
                  <input id="file-upload" type="file" className="hidden" multiple />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isSelectionComplete && (
          <div className="glass-card p-8 rounded-3xl bg-brand-500/5 border-brand-500/20">
            <h4 className="text-sm font-black text-white mb-2 uppercase tracking-wider">Gestión de Datos</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Automatiza la carga de indicadores mediante archivos CSV estructurados.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onDownloadCSV} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                <Download size={16} /> Plantilla
              </button>
              <button onClick={() => document.getElementById('csv-input').click()} className="px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
                <Upload size={16} /> Importar
              </button>
              <input id="csv-input" type="file" accept=".csv" onChange={onImport} className="hidden" />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: INDICATORS */}
      <div className="lg:col-span-8">
        {!isSelectionComplete ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-2 border-white/5">
            <Layers size={48} className="text-slate-800 mb-6" />
            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Editor Bloqueado</h4>
            <p className="text-slate-500 font-medium text-center max-w-sm">
              Debe seleccionar una **Secretaría, Dirección y Unidad** para habilitar los campos de edición y carga de información.
            </p>
          </div>
        ) : (
          <div className="glass-card p-8 rounded-3xl h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                  <Activity size={20} className="text-brand-400" />
                  Editor de Indicadores
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Personaliza las métricas visuales del dashboard.</p>
              </div>
              <button
                onClick={() => setIndicadores([...indicadores, { id: Date.now(), label: 'NUEVO INDICADOR', value: 50, color: '#38abf8' }])}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-600/20 hover:scale-105"
              >
                <PlusCircle size={16} /> Añadir
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
              {indicadores.map(ind => (
                <div key={ind.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      value={ind.label}
                      onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? {...x, label: e.target.value.toUpperCase()} : x))}
                      className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                    />
                    <button
                      onClick={() => setIndicadores(indicadores.filter(x => x.id !== ind.id))}
                      className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <input
                        type="range"
                        value={ind.value}
                        onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? {...x, value: parseInt(e.target.value)} : x))}
                        min="0"
                        max="100"
                        className="flex-1 accent-brand-500"
                      />
                      <span className="text-xl font-black text-white min-w-[3rem] text-right font-display">{ind.value}%</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="relative group/color">
                        <input
                          type="color"
                          value={ind.color}
                          onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? {...x, color: e.target.value} : x))}
                          className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                        />
                        <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/10"></div>
                      </div>
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{ width: `${ind.value}%`, backgroundColor: ind.color, boxShadow: `0 0 15px ${ind.color}66` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ListViewComponent = ({ reports, onSelect, onDelete, onCreate }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between px-2">
      <div>
        <h3 className="text-2xl font-black text-white tracking-tight font-display">Archivo de Reportes</h3>
        <p className="text-sm text-slate-500 font-medium">Gestión histórica de auditorías estratégicas.</p>
      </div>
      <button 
        onClick={onCreate}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-brand-600/20"
      >
        <PlusCircle size={18} /> Nuevo Reporte
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {reports.map((r, i) => (
        <motion.div 
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-8 flex flex-col group relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors"></div>
          
          <div className="flex items-start justify-between mb-8">
            <div className="p-3 rounded-2xl bg-white/5 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
              <FileText size={24} />
            </div>
            <div className="flex gap-1">
              <button onClick={() => onDelete(r.id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-brand-500/10 text-[9px] font-black text-brand-400 uppercase tracking-widest rounded-md border border-brand-500/20">
                {r.direccion}
              </span>
              <span className="text-[10px] text-slate-600 font-bold">{r.fecha}</span>
            </div>
            <h4 className="text-xl font-black text-white mb-2 font-display leading-tight">{r.titulo}</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{r.secretaria}</p>
          </div>

          <button
            onClick={() => onSelect(r)}
            className="w-full mt-auto py-4 bg-white/5 hover:bg-brand-600 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 border border-white/5 group-hover:border-brand-500/30"
          >
            <FolderOpen size={18} /> Abrir Reporte
          </button>
        </motion.div>
      ))}

      {reports.length === 0 && (
        <div className="col-span-full py-20 flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-2">
           <Layers size={48} className="text-slate-700 mb-4" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No hay reportes archivados</p>
           <button onClick={onCreate} className="mt-6 text-brand-500 font-black text-xs uppercase tracking-widest hover:underline">Crear el primero ahora</button>
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const App = () => {
  const [view, setView] = useState('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [currentReportId, setCurrentReportId] = useState(null);

  const initialData = {
    titulo: 'CONTROL DE TRANSICIÓN ESTRATÉGICA',
    subtitulo: 'HUD de Inteligencia Municipal El Alto - Auditoría de Sistemas y Patrimonio Institucional.',
    fecha: new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' }),
    acreditado: 'Wilfredo Abad Mancilla Terán',
    alcalde: 'Elieser Roca Tancara',
    secretaria: 'Sec. Mun. de Administración y Finanzas',
    direccion: 'UASI',
    alerta: 'Se detectó retención crítica de credenciales de administrador y opacidad severa en la conciliación de bases de datos financieras (SIGEP).',
    bloqueos: ['Tesorería', 'Recursos Humanos', 'Activos Fijos', 'Sistemas'],
    ley: 'Ley 1178 (SAFCO) y Ley 482'
  };

  const initialIndicadores = [
    { id: 1, label: 'NORMATIVA Y LEGAL', value: 85, color: '#38abf8' },
    { id: 2, label: 'ACTIVOS Y PATRIMONIO', value: 32, color: '#ef4444' },
    { id: 3, label: 'INFRAESTRUCTURA IT', value: 12, color: '#f59e0b' }
  ];

  const initialEstadisticas = [
    { label: 'CUMPLIMIENTO PISLEA', val: 94, trend: 'up' },
    { label: 'VERIFICACIÓN PISI', val: 68, trend: 'down' },
    { label: 'CONCILIACIÓN PIGE', val: 15, trend: 'flat' }
  ];

  const initialRiesgos = [
    { id: 1, title: 'Inconsistencia de Inventarios', imp: 3, cat: 'Patrimonial' },
    { id: 2, title: 'Bloqueo de Firmas Digitales', imp: 3, cat: 'Legal' },
    { id: 3, title: 'Vulnerabilidad en Servidores', imp: 2, cat: 'Técnica' }
  ];

  const [data, setData] = useState(initialData);
  const [indicadores, setIndicadores] = useState(initialIndicadores);
  const [estadisticas] = useState(initialEstadisticas);
  const [riesgos] = useState(initialRiesgos);

  // SUPABASE STATE
  const [secretarias, setSecretarias] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [selectedSec, setSelectedSec] = useState('');
  const [selectedDir, setSelectedDir] = useState('');
  const [selectedUni, setSelectedUni] = useState('');

  // FETCH SECRETARIAS
  useEffect(() => {
    const fetchSecretarias = async () => {
      const { data, error } = await supabase.from('secretarias').select('*').order('nombre');
      if (!error) setSecretarias(data);
    };
    fetchSecretarias();
  }, []);

  // FETCH DIRECCIONES
  useEffect(() => {
    if (!selectedSec) {
      setDirecciones([]);
      return;
    }
    const fetchDirecciones = async () => {
      const { data, error } = await supabase.from('direcciones').select('*').eq('secretaria_id', selectedSec).order('nombre');
      if (!error) setDirecciones(data);
    };
    fetchDirecciones();
  }, [selectedSec]);

  // FETCH UNIDADES
  useEffect(() => {
    if (!selectedDir) {
      setUnidades([]);
      return;
    }
    const fetchUnidades = async () => {
      const { data, error } = await supabase.from('unidades').select('*').eq('direccion_id', selectedDir).order('nombre');
      if (!error) setUnidades(data);
    };
    fetchUnidades();
  }, [selectedDir]);

  // PERSISTENCIA
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gamea-reports-v2');
      if (saved) setReports(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading reports:', e);
    }
  }, []);

  const saveReports = (newReports) => {
    setReports(newReports);
    localStorage.setItem('gamea-reports-v2', JSON.stringify(newReports));
  };

  const handleSave = async () => {
    try {
      const reportData = {
        secretaria_id: selectedSec,
        direccion_id: selectedDir,
        unidad_id: selectedUni,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        acreditado: data.acreditado,
        alcalde_electo: data.alcalde,
        alerta_principal: data.alerta,
        updated_at: new Date().toISOString()
      };

      let reportId = currentReportId;

      if (reportId) {
        // Update existing report
        const { error } = await supabase.from('reports').update(reportData).eq('id', reportId);
        if (error) throw error;
      } else {
        // Insert new report
        const { data: newReport, error } = await supabase.from('reports').insert([reportData]).select().single();
        if (error) throw error;
        reportId = newReport.id;
        setCurrentReportId(reportId);
      }

      // Sync Indicators
      // First delete old indicators for this report to simplify sync
      await supabase.from('indicadores').delete().eq('report_id', reportId);
      
      const indicatorsToInsert = indicadores.map(ind => ({
        report_id: reportId,
        label: ind.label,
        value: ind.value,
        color: ind.color
      }));

      const { error: indError } = await supabase.from('indicadores').insert(indicatorsToInsert);
      if (indError) throw indError;

      // Update local state and archive
      const newReports = [...reports];
      const reportToSave = { ...data, id: reportId, indicadores, updatedAt: new Date().toISOString() };
      
      const idx = newReports.findIndex(r => r.id === reportId);
      if (idx !== -1) {
        newReports[idx] = reportToSave;
      } else {
        newReports.push(reportToSave);
      }
      
      saveReports(newReports);
      alert('✅ Reporte sincronizado con Supabase exitosamente');
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      alert('❌ Error al guardar en la nube: ' + error.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este reporte?')) {
      saveReports(reports.filter(r => r.id !== id));
      if (currentReportId === id) {
        setData(initialData);
        setIndicadores(initialIndicadores);
        setCurrentReportId(null);
      }
    }
  };

  const handleSelect = (r) => {
    setData(r);
    setIndicadores(r.indicadores || initialIndicadores);
    setCurrentReportId(r.id);
    setSelectedSec(r.secretaria_id || '');
    setSelectedDir(r.direccion_id || '');
    setSelectedUni(r.unidad_id || '');
    setView('preview');
  };

  const downloadCSV = () => {
    const csv = "Tipo,Etiqueta,Valor,Color\nIND,NORMATIVA,90,#3b82f6\nIND,ACTIVOS,45,#ef4444\nIND,FINANZAS,60,#10b981";
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_gamea.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim());
      const newInds = [];
      lines.slice(1).forEach((line, i) => {
        const [type, label, val, color] = line.split(',').map(s => s.trim());
        if (type === 'IND') {
          newInds.push({ id: Date.now() + i, label: label.toUpperCase(), value: parseInt(val) || 0, color: color || '#38abf8' });
        }
      });
      if (newInds.length > 0) {
        setIndicadores(newInds);
        setView('preview');
      }
    };
    reader.readAsText(file);
  };

  const viewTitles = {
    preview: 'Auditoría en Tiempo Real',
    hierarchy: 'Estructura Institucional',
    editor: 'Editor de Reporte',
    list: 'Repositorio de Auditorías',
    settings: 'Configuración del Sistema'
  };

  const viewSubtitles = {
    preview: 'Visualización de métricas y riesgos de la transición municipal.',
    hierarchy: 'Explora la jerarquía administrativa de la Alcaldía de El Alto.',
    editor: 'Modifica los datos y parámetros del reporte actual.',
    list: 'Consulta y gestiona el historial de reportes guardados.',
    settings: 'Preferencias globales y gestión de la plataforma.'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500/30">
      <Sidebar 
        currentView={view} 
        onViewChange={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <div className="lg:pl-72 flex flex-col min-h-screen">
        <TopBar 
          title={viewTitles[view]} 
          subtitle={viewSubtitles[view]} 
          onSave={handleSave} 
          isSaveActive={true}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 px-6 lg:px-10 py-10 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'preview' && (
                <PreviewView data={data} indicadores={indicadores} estadisticas={estadisticas} riesgos={riesgos} />
              )}
              {view === 'hierarchy' && (
                <HierarchyView />
              )}
              {view === 'editor' && (
                <EditorView 
                  data={data} 
                  setData={setData} 
                  indicadores={indicadores} 
                  setIndicadores={setIndicadores} 
                  onImport={handleImport} 
                  onDownloadCSV={downloadCSV}
                  secretarias={secretarias}
                  direcciones={direcciones}
                  unidades={unidades}
                  selectedSec={selectedSec}
                  setSelectedSec={setSelectedSec}
                  selectedDir={selectedDir}
                  setSelectedDir={setSelectedDir}
                  selectedUni={selectedUni}
                  setSelectedUni={setSelectedUni}
                />
              )}
              {view === 'list' && (
                <ListViewComponent
                  reports={reports}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                  onCreate={() => {
                    setData(initialData);
                    setIndicadores(initialIndicadores);
                    setCurrentReportId(null);
                    setView('editor');
                  }}
                />
              )}
              {view === 'settings' && (
                <div className="py-20 flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-2">
                   <Settings size={48} className="text-slate-700 mb-4" />
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Configuración del Sistema en Desarrollo</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 lg:px-10 py-8 border-t border-white/5 bg-slate-950/40 no-print mt-auto">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Sistemas Operativos
               </div>
               <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Conexión Supabase
               </div>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              &copy; 2026 GAMEA - Auditoría de Transición Estratégica. Todos los derechos reservados.
            </div>
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border border-white/10"
            >
              Exportar Reporte PDF
            </button>
          </div>
        </footer>
      </div>

      {/* Decorative Scanline */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-20 no-print">
        <div className="w-full h-1 bg-brand-500/20 absolute top-0 animate-[scan_6s_linear_infinite]"></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default App;
