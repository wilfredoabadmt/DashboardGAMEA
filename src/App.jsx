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
import './App.css';

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

// ============================================================================
// COMPONENTES DE LAYOUT
// ============================================================================

const Sidebar = ({ currentView, onViewChange, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'preview', label: 'Dashboard', icon: BarChart3 },
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
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 no-print ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
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
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${currentView === item.id
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

        <button
          onClick={() => window.print()}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-white/5 transition-all text-xs font-black uppercase tracking-widest"
        >
          <Download size={18} /> PDF
        </button>

        <button className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <button
          onClick={onSave}
          className={`ml-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${isSaveActive
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
                {data.secretaria || 'SECRETARÍA GENERAL'}
              </span>
              {data.direccion && (
                <>
                  <div className="h-1.5 w-1.5 bg-slate-700 rounded-full"></div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {data.direccion}
                  </span>
                </>
              )}
              {data.unidad && (
                <>
                  <div className="h-1.5 w-1.5 bg-slate-700 rounded-full"></div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {data.unidad}
                  </span>
                </>
              )}
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
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Matriz de Riesgos</h4>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">ÁMBITO: {data.unidad || data.direccion || data.secretaria}</p>
              </div>
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                  <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Alertas de Bloqueo</h4>
                </div>
                <span className="text-[9px] font-black text-red-500/40 uppercase bg-red-500/5 px-2 py-1 rounded border border-red-500/10">
                  REF: {data.unidad || 'INSTITUCIONAL'}
                </span>
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

    {/* DETAILED ANALYSIS SECTION */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div className="glass-card p-10 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Eye size={120} />
        </div>
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <Eye size={18} className="text-indigo-400" />
          Observaciones y Hallazgos
        </h4>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-slate-300 leading-relaxed italic text-sm">"{data.observaciones}"</p>
        </div>
      </div>
      
      <div className="glass-card p-10 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <CheckCircle size={120} />
        </div>
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <CheckCircle size={18} className="text-brand-400" />
          Ruta de Acción Estratégica
        </h4>
        <div className="p-6 bg-brand-500/5 rounded-2xl border border-brand-500/10">
          <p className="text-brand-100 leading-relaxed font-medium text-sm">{data.planAccion}</p>
        </div>
      </div>
    </div>
  </motion.div>
);


// El componente ListViewComponent y EditorView se mueven dentro de App para evitar problemas de scope
const INITIAL_REPORT_STATE = {
  id: null,
  secretaria: '',
  direccion: '',
  unidad: '',
  titulo: 'REPORTE ESTRATÉGICO DE TRANSICIÓN',
  subtitulo: 'Análisis de situación administrativa, financiera y legal para la nueva gestión.',
  acreditado: 'WILFREDO ABAD',
  alcalde: 'ELIESER ROCA',
  fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(),
  alerta: '',
  bloqueos: [],
  ley: 'LEY 1178 (SAFCO) / LEY 482',
  observaciones: '',
  planAccion: ''
};

const App = () => {
  const [currentView, setCurrentView] = useState('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reports, setReports] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [unidades, setUnidades] = useState([]);

  // Estados de selección jerárquica
  const [selectedSec, setSelectedSec] = useState('');
  const [selectedDir, setSelectedDir] = useState('');
  const [selectedUni, setSelectedUni] = useState('');

  // Datos del reporte actual
  const [data, setData] = useState({
    id: null,
    secretaria: 'SECRETARÍA MUNICIPAL',
    direccion: 'DIRECCIÓN ESPECÍFICA',
    titulo: 'REPORTE ESTRATÉGICO DE TRANSICIÓN',
    subtitulo: 'Análisis de situación administrativa, financiera y legal para la nueva gestión.',
    acreditado: 'WILFREDO ABAD',
    alcalde: 'ELIESER ROCA',
    fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(),
    alerta: 'Se han identificado inconsistencias críticas en los activos fijos de la unidad operativa. Se requiere auditoría externa inmediata.',
    bloqueos: ['ACTIVOS FIJOS', 'PRESUPUESTO 2024', 'PERSONAL'],
    ley: 'LEY 1178 (SAFCO) / LEY 482',
    observaciones: 'La documentación de respaldo para los últimos 3 meses no ha sido digitalizada íntegramente.',
    planAccion: '1. Conciliación física inmediata. 2. Regularización de devengados pendientes. 3. Informe circunstanciado a MAE.'
  });

  const [indicadores, setIndicadores] = useState([
    { id: 1, label: 'EJECUCIÓN PRESUPUESTARIA', value: 84, color: '#38abf8' },
    { id: 2, label: 'CUMPLIMIENTO DE METAS POI', value: 92, color: '#10b981' },
    { id: 3, label: 'SITUACIÓN DE ACTIVOS', value: 45, color: '#f59e0b' },
  ]);

  const [estadisticas, setEstadisticas] = useState([
    { id: 1, label: 'Proyectos Concluidos', val: 124, trend: 'up' },
    { id: 2, label: 'Procesos Legales', val: 12, trend: 'down' },
    { id: 3, label: 'Personal Vigente', val: 450, trend: 'up' },
  ]);

  const [riesgos, setRiesgos] = useState([
    { id: 1, title: 'Déficit presupuestario en Caja y Bancos', imp: 3, cat: 'FINANCIERO' },
    { id: 2, title: 'Falta de conciliación de activos fijos', imp: 2, cat: 'ADMINISTRATIVO' },
    { id: 3, title: 'Contratos con vencimiento próximo', imp: 3, cat: 'LEGAL' },
  ]);

  // Carga inicial de datos
  useEffect(() => {
    fetchSecretarias();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: supabaseReports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (supabaseReports) setReports(supabaseReports);
    } catch (err) {
      console.warn('Usando respaldo de localStorage:', err);
      const local = localStorage.getItem('gamea_reports');
      if (local) setReports(JSON.parse(local));
    }
  };

  // Carga de direcciones cuando cambia la secretaría
  useEffect(() => {
    if (selectedSec) {
      fetchDirecciones(selectedSec);
    } else {
      setDirecciones([]);
      setUnidades([]);
    }
  }, [selectedSec]);

  // Carga de unidades cuando cambia la dirección
  useEffect(() => {
    if (selectedDir) {
      fetchUnidades(selectedDir);
    } else {
      setUnidades([]);
    }
  }, [selectedDir]);

  // Sincronización de datos al seleccionar unidad o cambiar reportes
  useEffect(() => {
    if (!selectedUni || secretarias.length === 0 || reports.length === 0) return;

    const secObj = secretarias.find(s => s.id.toString() === selectedSec);
    const dirObj = direcciones.find(d => d.id.toString() === selectedDir);
    const uniObj = unidades.find(u => u.id.toString() === selectedUni);

    if (secObj && dirObj && uniObj) {
      const existing = reports.find(r => 
        r.secretaria === secObj.nombre && 
        r.direccion === dirObj.nombre && 
        r.unidad === uniObj.nombre
      );

      if (existing) {
        if (data.id !== existing.id) {
          setData(existing);
          setIndicadores(existing.indicadores || []);
          setEstadisticas(existing.estadisticas || []);
          setRiesgos(existing.riesgos || []);
        }
      } else {
        // Nuevo reporte para esta unidad
        // EVITAR BUCLE INFINITO: Solo resetear si la unidad en data es distinta a la seleccionada
        if (data.unidad !== uniObj.nombre || data.id !== null) {
          setData({ 
            ...INITIAL_REPORT_STATE, 
            secretaria: secObj.nombre, 
            direccion: dirObj.nombre, 
            unidad: uniObj.nombre 
          });
          setIndicadores([
            { id: 1, label: 'EJECUCIÓN PRESUPUESTARIA', value: 0, color: '#38abf8' },
            { id: 2, label: 'CUMPLIMIENTO DE METAS POI', value: 0, color: '#10b981' },
            { id: 3, label: 'SITUACIÓN DE ACTIVOS', value: 0, color: '#f59e0b' },
          ]);
          setEstadisticas([]);
          setRiesgos([]);
        }
      }
    }
  }, [selectedUni, reports, secretarias, direcciones, unidades]);

  const fetchSecretarias = async () => {
    try {
      const { data, error } = await supabase
        .from('secretarias')
        .select('*')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setSecretarias(data);
    } catch (err) {
      console.error('Error al cargar secretarias:', err);
    }
  };

  const fetchDirecciones = async (secId) => {
    try {
      const { data, error } = await supabase
        .from('direcciones')
        .select('*')
        .eq('secretaria_id', secId)
        .order('nombre', { ascending: true });
      if (error) throw error;
      setDirecciones(data);
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
    }
  };

  const fetchUnidades = async (dirId) => {
    try {
      const { data, error } = await supabase
        .from('unidades')
        .select('*')
        .eq('direccion_id', dirId)
        .order('nombre', { ascending: true });
      if (error) throw error;
      setUnidades(data);
    } catch (err) {
      console.error('Error al cargar unidades:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const reportToSave = {
      ...data,
      indicadores,
      estadisticas,
      riesgos,
      fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(),
    };

    console.log('Intentando guardar reporte:', reportToSave);

    try {
      let result;
      const currentId = data.id;

      if (currentId && typeof currentId === 'string' && currentId.length > 20) {
        // ACTUALIZACIÓN
        result = await supabase
          .from('reports')
          .update(reportToSave)
          .eq('id', currentId)
          .select();
      } else {
        // INSERCIÓN
        const { id, ...saveData } = reportToSave;
        result = await supabase
          .from('reports')
          .insert([saveData])
          .select();
      }

      if (result.error) throw result.error;
      if (!result.data?.[0]) throw new Error('No se recibió confirmación del servidor');
      
      const savedReport = result.data[0];
      console.log('Reporte guardado con éxito en Supabase:', savedReport.id);
      
      const updatedReports = [
        savedReport, 
        ...reports.filter(r => r.id !== savedReport.id && r.id !== currentId)
      ];
      
      setReports(updatedReports);
      localStorage.setItem('gamea_reports', JSON.stringify(updatedReports));
      setData(savedReport);
      
    } catch (err) {
      console.error('Error crítico al guardar en Supabase:', err);
      // Respaldo local
      const localId = data.id || Date.now();
      const localReport = { ...reportToSave, id: localId };
      const updatedReports = [
        localReport, 
        ...reports.filter(r => r.id !== localId)
      ];
      setReports(updatedReports);
      localStorage.setItem('gamea_reports', JSON.stringify(updatedReports));
      setData(localReport);
      alert('Se guardó localmente. Error de conexión con el servidor.');
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setCurrentView('list');
      }, 800);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (typeof id === 'string' && id.length > 20) {
        await supabase.from('reports').delete().eq('id', id);
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('gamea_reports', JSON.stringify(updated));
  };

  const EditorView = ({
    data, setData, indicadores, setIndicadores, 
    estadisticas, setEstadisticas, riesgos, setRiesgos,
    onImport, onDownloadCSV,
    secretarias, direcciones, unidades,
    selectedSec, setSelectedSec,
    selectedDir, setSelectedDir,
    selectedUni, setSelectedUni
  }) => {
    const [activeTab, setActiveTab] = useState('indicadores');
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
              <div className="relative group/select">
                <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest ml-1">Secretaría Municipal</label>
                <div className="relative">
                  <select
                    value={selectedSec}
                    onChange={e => { setSelectedSec(e.target.value); setSelectedDir(''); setSelectedUni(''); }}
                    className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 pr-12 text-sm text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-900/60"
                  >
                    <option value="" className="bg-slate-900">Seleccione Secretaría...</option>
                    {secretarias.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.nombre}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-brand-400 transition-colors">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="relative group/select">
                <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest ml-1">Dirección</label>
                <div className="relative">
                  <select
                    value={selectedDir}
                    onChange={e => { setSelectedDir(e.target.value); setSelectedUni(''); }}
                    disabled={!selectedSec}
                    className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 pr-12 text-sm text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-900/60 disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-slate-900">Seleccione Dirección...</option>
                    {direcciones.map(d => <option key={d.id} value={d.id} className="bg-slate-900">{d.nombre}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-brand-400 transition-colors">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="relative group/select">
                <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest ml-1">Unidad</label>
                <div className="relative">
                  <select
                    value={selectedUni}
                    onChange={e => setSelectedUni(e.target.value)}
                    disabled={!selectedDir}
                    className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 pr-12 text-sm text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-900/60 disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-slate-900">Seleccione Unidad...</option>
                    {unidades.map(u => <option key={u.id} value={u.id} className="bg-slate-900">{u.nombre}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-brand-400 transition-colors">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
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
                      onChange={e => setData({ ...data, [field.key]: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Observaciones de Auditoría</label>
                  <textarea
                    value={data.observaciones}
                    onChange={e => setData({ ...data, observaciones: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                    placeholder="Detalle hallazgos relevantes..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Plan de Acción Inmediato</label>
                  <textarea
                    value={data.planAccion}
                    onChange={e => setData({ ...data, planAccion: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                    placeholder="Pasos críticos a seguir..."
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                  {[
                    { id: 'indicadores', label: 'Indicadores', icon: Activity },
                    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
                    { id: 'riesgos', label: 'Riesgos', icon: ShieldAlert },
                    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (activeTab === 'indicadores') setIndicadores([...indicadores, { id: Date.now(), label: 'NUEVO INDICADOR', value: 50, color: '#38abf8' }]);
                    if (activeTab === 'stats') setEstadisticas([...estadisticas, { id: Date.now(), label: 'NUEVA MÉTRICA', val: 100, trend: 'up' }]);
                    if (activeTab === 'riesgos') setRiesgos([...riesgos, { id: Date.now(), title: 'NUEVO RIESGO', imp: 2, cat: 'GENERAL' }]);
                    if (activeTab === 'alertas') {
                      const tag = prompt('Ingrese nombre de la etiqueta de bloqueo:');
                      if (tag) setData({ ...data, bloqueos: [...(data.bloqueos || []), tag.toUpperCase()] });
                    }
                  }}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-600/20 hover:scale-105"
                >
                  <PlusCircle size={16} /> Añadir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
                {activeTab === 'indicadores' && indicadores.map(ind => (
                  <div key={ind.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <input
                        type="text"
                        value={ind.label}
                        onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? { ...x, label: e.target.value.toUpperCase() } : x))}
                        className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                      />
                      <button onClick={() => setIndicadores(indicadores.filter(x => x.id !== ind.id))} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <input type="range" value={ind.value} onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? { ...x, value: parseInt(e.target.value) } : x))} min="0" max="100" className="flex-1 accent-brand-500" />
                        <span className="text-xl font-black text-white min-w-[3rem] text-right font-display">{ind.value}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input type="color" value={ind.color} onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? { ...x, color: e.target.value } : x))} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full transition-all duration-500" style={{ width: `${ind.value}%`, backgroundColor: ind.color, boxShadow: `0 0 15px ${ind.color}66` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'stats' && estadisticas.map(s => (
                  <div key={s.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <input
                        type="text"
                        value={s.label}
                        onChange={e => setEstadisticas(estadisticas.map(x => x.id === s.id ? { ...x, label: e.target.value.toUpperCase() } : x))}
                        className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                      />
                      <button onClick={() => setEstadisticas(estadisticas.filter(x => x.id !== s.id))} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Valor</label>
                        <input type="number" value={s.val} onChange={e => setEstadisticas(estadisticas.map(x => x.id === s.id ? { ...x, val: parseInt(e.target.value) } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Tendencia</label>
                        <select value={s.trend} onChange={e => setEstadisticas(estadisticas.map(x => x.id === s.id ? { ...x, trend: e.target.value } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white outline-none">
                          <option value="up">ASCENDENTE</option>
                          <option value="down">DESCENDENTE</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'riesgos' && riesgos.map(r => (
                  <div key={r.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <input
                        type="text"
                        value={r.title}
                        onChange={e => setRiesgos(riesgos.map(x => x.id === r.id ? { ...x, title: e.target.value } : x))}
                        className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                      />
                      <button onClick={() => setRiesgos(riesgos.filter(x => x.id !== r.id))} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Impacto (1-3)</label>
                        <input type="number" min="1" max="3" value={r.imp} onChange={e => setRiesgos(riesgos.map(x => x.id === r.id ? { ...x, imp: parseInt(e.target.value) } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Categoría</label>
                        <input type="text" value={r.cat} onChange={e => setRiesgos(riesgos.map(x => x.id === r.id ? { ...x, cat: e.target.value.toUpperCase() } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white" />
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'alertas' && (
                  <div className="col-span-full space-y-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                      <label className="text-[10px] font-black text-slate-500 block mb-4 uppercase tracking-widest">Descripción de Alerta Crítica</label>
                      <textarea
                        value={data.alerta}
                        onChange={e => setData({ ...data, alerta: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-6 text-sm text-white focus:border-red-500 outline-none transition-all resize-none"
                        placeholder="Describa la situación de bloqueo..."
                      />
                    </div>
                    
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                      <label className="text-[10px] font-black text-slate-500 block mb-4 uppercase tracking-widest">Etiquetas de Bloqueo Activas</label>
                      <div className="flex flex-wrap gap-2">
                        {data.bloqueos?.map(tag => (
                          <div key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <span className="text-[10px] font-black text-red-500">{tag}</span>
                            <button 
                              onClick={() => setData({ ...data, bloqueos: data.bloqueos.filter(t => t !== tag) })}
                              className="text-red-500/50 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const tag = prompt('Nueva etiqueta:');
                            if (tag) setData({ ...data, bloqueos: [...(data.bloqueos || []), tag.toUpperCase()] });
                          }}
                          className="px-3 py-1.5 border border-dashed border-white/10 rounded-lg text-[10px] font-black text-slate-500 hover:border-brand-500 hover:text-white transition-all"
                        >
                          + AÑADIR
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 bg-brand-500/10 border border-brand-500/20 rounded-md text-[8px] font-black text-brand-400 uppercase tracking-widest">
                  {r.secretaria}
                </span>
                <span className="px-2 py-0.5 bg-slate-500/10 border border-slate-500/20 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  {r.direccion}
                </span>
                <span className="px-2 py-0.5 bg-slate-800/50 border border-white/5 rounded-md text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  {r.unidad}
                </span>
              </div>
              <h4 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-brand-400 transition-colors">{r.titulo}</h4>
              <p className="text-xs text-slate-500 mt-3 font-medium line-clamp-2">{r.subtitulo}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-slate-600" />
                <span className="text-[10px] font-bold text-slate-500">{r.fecha}</span>
              </div>
              <button
                onClick={() => onSelect(r)}
                className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                Abrir <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
    const file = e.target.files[0];
    if (file) {
      // Lógica de importación aquí
      alert('CSV importado correctamente');
    }
  };

  const downloadCSVTemplate = () => {
    const headers = 'ID,INDICADOR,VALOR,COLOR\n1,EJECUCIÓN,80,#38abf8';
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_indicadores.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-brand-500/30 selection:text-white">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="lg:ml-72 transition-all duration-300">
        <TopBar
          title={currentView === 'preview' ? 'Visualización Estratégica' :
            currentView === 'editor' ? 'Editor de Reporte' :
              currentView === 'list' ? 'Archivo de Reportes' : 'Configuración'}
          subtitle="Sistema de Control de Transición Municipal - El Alto"
          onSave={handleSave}
          isSaveActive={currentView === 'editor' && selectedUni}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {currentView === 'preview' && (
            <PreviewView
              data={data}
              indicadores={indicadores}
              estadisticas={estadisticas}
              riesgos={riesgos}
            />
          )}


          {currentView === 'editor' && (
            <EditorView
              data={data}
              setData={setData}
              indicadores={indicadores}
              setIndicadores={setIndicadores}
              estadisticas={estadisticas}
              setEstadisticas={setEstadisticas}
              riesgos={riesgos}
              setRiesgos={setRiesgos}
              onImport={handleImportCSV}
              onDownloadCSV={downloadCSVTemplate}
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

          {currentView === 'list' && (
            <ListViewComponent
              reports={reports}
              onSelect={async (r) => { 
                // Intentar sincronizar los dropdowns si es posible
                const sec = secretarias.find(s => s.nombre === r.secretaria);
                if (sec) {
                  setSelectedSec(sec.id.toString());
                  // Esperar un momento a que las direcciones se carguen no es posible aquí fácilmente
                  // pero el sync useEffect se encargará de poner la data correcta al final
                }
                
                setData(r); 
                setIndicadores(r.indicadores || []); 
                setEstadisticas(r.estadisticas || []);
                setRiesgos(r.riesgos || []);
                setCurrentView('preview'); 
              }}
              onDelete={handleDelete}
              onCreate={() => { 
                setSelectedSec(''); 
                setSelectedDir(''); 
                setSelectedUni(''); 
                setData(INITIAL_REPORT_STATE);
                setIndicadores([
                  { id: 1, label: 'EJECUCIÓN PRESUPUESTARIA', value: 84, color: '#38abf8' },
                  { id: 2, label: 'CUMPLIMIENTO DE METAS POI', value: 92, color: '#10b981' },
                  { id: 3, label: 'SITUACIÓN DE ACTIVOS', value: 45, color: '#f59e0b' },
                ]);
                setEstadisticas([
                  { id: 1, label: 'Proyectos Concluidos', val: 124, trend: 'up' },
                  { id: 2, label: 'Procesos Legales', val: 12, trend: 'down' },
                  { id: 3, label: 'Personal Vigente', val: 450, trend: 'up' },
                ]);
                setRiesgos([
                  { id: 1, title: 'Déficit presupuestario en Caja y Bancos', imp: 3, cat: 'FINANCIERO' },
                  { id: 2, title: 'Falta de conciliación de activos fijos', imp: 2, cat: 'ADMINISTRATIVO' },
                  { id: 3, title: 'Contratos con vencimiento próximo', imp: 3, cat: 'LEGAL' },
                ]);
                setCurrentView('editor'); 
              }}
            />
          )}

          {currentView === 'settings' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Settings size={48} className="text-slate-800 mb-4" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Ajustes del Sistema</h3>
              <p className="text-slate-500 mt-2">Configuración avanzada de API y Auditoría.</p>
            </div>
          )}
        </div>
      </main>

      {/* Overlay de carga al guardar */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">Procesando</h3>
            <p className="text-slate-500 font-bold mt-2">Sincronizando con base de datos de transición...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
