import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Clock, BarChart3, FileText, ShieldAlert,
  UserCheck, Eye, Edit3, Server, Database, Lock, Download,
  Gavel, Briefcase, Users, TrendingUp, Trash2, PlusCircle,
  XCircle, Info, Scale, Activity, Building2, Save, FolderOpen, Loader2,
  Upload, FileUp, Sparkles, Plus, Minus, FileSpreadsheet, Layers,
  ChevronRight, Zap, Target, PieChart, LineChart, Globe, Terminal, Search,
  LayoutDashboard, History, Settings, LogOut, Menu, X, ArrowRight, MousePointer2,
  LockKeyhole, AlertCircle, Hand, ChevronDown
} from 'lucide-react';

// --- DATA CONSTANTS: ORGANIGRAMA GAMEA 2025 ---
const ORGANIGRAMA = [
  { 
    name: "DESPACHO ALCALDESA", 
    units: ["Auditoría Interna", "Dirección de Transparencia", "Asesoría Estratégica", "Dirección de Comunicación", "Dirección de Relaciones Públicas"] 
  },
  { 
    name: "SEC. MUN. DE ADMINISTRACIÓN Y FINANZAS (SMAF)", 
    units: ["Dirección Administrativa", "Dirección del Tesoro", "Dirección de Recursos Humanos", "Dirección de Contabilidad", "Dirección de Activos Fijos", "UASI"] 
  },
  { 
    name: "SEC. MUN. DE GESTIÓN INSTITUCIONAL", 
    units: ["Dirección de Asesoría Legal", "Dirección de Planificación", "Dirección de Tecnologías de Información (TIC)"] 
  },
  { 
    name: "SEC. MUN. DE SALUD", 
    units: ["Dirección de Gestión Hospitalaria", "Dirección de Seguros de Salud", "Dirección de Salud Pública"] 
  },
  { 
    name: "SEC. MUN. DE EDUCACIÓN Y CULTURA", 
    units: ["Dirección de Educación", "Dirección de Culturas", "Dirección de Bibliotecas"] 
  },
  { 
    name: "SEC. MUN. DE DESARROLLO HUMANO", 
    units: ["Dirección de Género", "Dirección de Niñez y Adolescencia", "Dirección de Deportes", "Dirección de Desarrollo Social"] 
  },
  { 
    name: "SEC. MUN. DE INFRAESTRUCTURA PÚBLICA", 
    units: ["Dirección de Obras Públicas", "Dirección de Supervisión de Obras", "Dirección de Alumbrado Público"] 
  },
  { 
    name: "SEC. MUN. DE MOVILIDAD URBANA", 
    units: ["Dirección de Transporte", "Dirección de Vialidad", "Dirección de Bus Municipal"] 
  },
  { 
    name: "SEC. MUN. DE SEGURIDAD CIUDADANA", 
    units: ["Dirección de Prevención", "Dirección de Vigilancia", "Dirección de Intendencia Municipal"] 
  },
  { 
    name: "SEC. MUN. DE AGUA, GESTIÓN AMBIENTAL Y RIESGOS", 
    units: ["Dirección de Saneamiento Básico", "Dirección de Gestión de Riesgos", "Dirección de Medio Ambiente"] 
  },
  { 
    name: "SEC. MUN. DE DESARROLLO ECONÓMICO", 
    units: ["Dirección de Mypes", "Dirección de Turismo", "Dirección de Comercio y Servicios"] 
  }
];

const SCENARIOS = {
  NORMAL: {
    label: 'Operación Normal',
    indicadores: [
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6' },
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4' },
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 45, status: 'warning', color: '#f59e0b' }
    ],
    solicitudes: [
      { unidad: 'UASI', notas: 3, estado: 'Respuesta Parcial', color: 'text-emerald-400', icon: 'check' },
      { unidad: 'TESORO', notas: 2, estado: 'En Revisión', color: 'text-blue-400', icon: 'clock' },
      { unidad: 'RRHH', notas: 4, estado: 'Pendiente', color: 'text-slate-400', icon: 'minus' },
      { unidad: 'ACTIVOS FIJOS', notas: 1, estado: 'Completado', color: 'text-emerald-500', icon: 'check' }
    ],
    flujo: [
      { label: 'Comisión TIC', status: 'done' },
      { label: 'Notas', status: 'done' },
      { label: 'Tesoro', status: 'process' },
      { label: 'RRHH', status: 'pending' },
      { label: 'SMAF', status: 'pending' }
    ],
    alerta: 'Operaciones de relevamiento en curso. No se detectan bloqueos críticos actualmente.'
  },
  CRISIS: {
    label: 'Situación de Bloqueo',
    indicadores: [
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6' },
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4' },
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 0, status: 'locked', color: '#ef4444' }
    ],
    solicitudes: [
      { unidad: 'UASI', notas: 3, estado: 'Respuesta Parcial (DAGA/127)', color: 'text-emerald-400', icon: 'check' },
      { unidad: 'TESORO', notas: 2, estado: 'Negada Directa (Director)', color: 'text-red-500', icon: 'x' },
      { unidad: 'RRHH', notas: 2, estado: 'Negada (Firma Sr. Yapuchura)', color: 'text-red-500', icon: 'x' },
      { unidad: 'ACTIVOS FIJOS', notas: 5, estado: 'Puntos 5/20 Bloqueados', color: 'text-orange-500', icon: 'alert' }
    ],
    flujo: [
      { label: 'Comisión TIC', status: 'done' },
      { label: 'Notas', status: 'done' },
      { label: 'Tesoro', status: 'blocked', sub: 'RECHAZO DIRECTO' },
      { label: 'RRHH', status: 'blocked', sub: 'RECHAZO DIRECTOR' },
      { label: 'SMAF', status: 'pending' }
    ],
    alerta: 'Sin Backups de últimas 5 gestiones en sistemas críticos de TESORO/RRHH. Negativa taxativa a entregar Credenciales de Alta Jerarquía.'
  }
};

const INITIAL_DATA = {
  titulo: 'TABLERO ESTRATÉGICO TIC: TRANSICIÓN GAMEA 2026',
  subtitulo: 'INFORME EJECUTIVO DE RELEVAMIENTO TECNOLÓGICO Y RIESGOS',
  fecha: new Date().toISOString().split('T')[0],
  acreditado: 'Wilfredo Abad Mancilla Terán',
  alcalde: 'Elieser Roca Tancara',
  secretaria: 'SEC. MUN. DE ADMINISTRACIÓN Y FINANZAS (SMAF)',
  direccion: 'DIRECCIÓN DEL TESORO',
  ley: 'Ley 1178 (SAFCO)',
  ...SCENARIOS.CRISIS
};

// --- HELPER COMPONENTS ---

const GlassCard = ({ children, className = "", title = "", subtitle = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden bg-slate-950/50 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 shadow-2xl ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    <div className="flex flex-col mb-6">
      {title && <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" /> {title}
      </h3>}
      {subtitle && <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 ml-3.5 tracking-wider">{subtitle}</p>}
    </div>
    {children}
  </motion.div>
);

const FuturisticGauge = ({ value, label, color, status }) => {
  const isLocked = status === 'locked';
  
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="relative w-36 h-36">
        {isLocked && (
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-red-600 blur-2xl rounded-full"
          />
        )}
        
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="transparent"
            stroke={isLocked ? '#ef4444' : color}
            strokeWidth="8"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * (isLocked ? 100 : value)) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className={`drop-shadow-[0_0_8px_var(--glow)] ${isLocked ? 'animate-pulse' : ''}`}
            style={{ '--glow': isLocked ? '#ef4444' : color }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isLocked ? (
            <>
              <LockKeyhole size={32} className="text-red-500 mb-1" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">BLOQUEADO</span>
            </>
          ) : (
            <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{value}%</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center text-center px-4">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-tight mb-1">{label}</span>
      </div>
    </div>
  );
};

const FlowStep = ({ item, isLast }) => {
  const statusColors = {
    done: 'bg-emerald-500 text-white',
    process: 'bg-blue-600 text-white animate-pulse',
    blocked: 'bg-red-600 text-white',
    pending: 'bg-slate-800 text-slate-500'
  };

  return (
    <div className="flex items-center flex-1 group">
      <div className="flex flex-col items-center relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#030712] shadow-xl z-10 ${statusColors[item.status]}`}>
          {item.status === 'done' && <CheckCircle size={16} />}
          {item.status === 'process' && <Loader2 size={16} className="animate-spin" />}
          {item.status === 'blocked' && <XCircle size={16} />}
          {item.status === 'pending' && <Clock size={16} />}
        </div>
        <div className="absolute top-12 whitespace-nowrap flex flex-col items-center">
          <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.label}</span>
          {item.sub && <span className="text-[7px] font-bold text-red-500 mt-1 uppercase animate-pulse">{item.sub}</span>}
        </div>
      </div>
      {!isLast && (
        <div className="flex-1 h-[2px] bg-slate-800 mx-2 relative overflow-hidden">
          {item.status === 'done' && <div className="absolute inset-0 bg-emerald-500 w-full" />}
          {item.status === 'process' && (
            <motion.div 
              animate={{ x: ['-100%', '100%'] }} 
              transition={{ repeat: Infinity, duration: 1.5 }} 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2" 
            />
          )}
        </div>
      )}
    </div>
  );
};

// --- MAIN APPLICATION ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [reports, setReports] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileInputRef = useRef(null);
  
  // Filtering Logic for Form
  const selectedSec = ORGANIGRAMA.find(s => s.name === data.secretaria);
  const availableUnits = selectedSec ? selectedSec.units : [];

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('gamea-reports-v4');
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      // Mock some varied data for presentation
      const mockData = [
        { ...INITIAL_DATA, id: '1', secretaria: "SEC. MUN. DE SALUD", direccion: "Dirección de Gestión Hospitalaria", titulo: "INFORME SALUD: HOSPITAL EL ALTO SUR", created: "2026-04-10T10:00:00Z" },
        { ...INITIAL_DATA, id: '2', secretaria: "SEC. MUN. DE SEGURIDAD CIUDADANA", direccion: "Dirección de Vigilancia", titulo: "CONTROL SEGURIDAD: CENTRO MONITOREO", created: "2026-04-15T14:30:00Z" },
      ];
      setReports(mockData);
    }
  }, []);

  const saveToLocal = (updatedReports) => {
    setReports(updatedReports);
    localStorage.setItem('gamea-reports-v4', JSON.stringify(updatedReports));
  };

  const handleSave = () => {
    const newReports = [...reports];
    const reportToSave = { ...data, updated: new Date().toISOString() };
    
    if (currentId) {
      const idx = newReports.findIndex(r => r.id === currentId);
      if (idx !== -1) newReports[idx] = reportToSave;
    } else {
      const newReport = { ...reportToSave, id: Date.now().toString(), created: new Date().toISOString() };
      newReports.push(newReport);
      setCurrentId(newReport.id);
    }
    saveToLocal(newReports);
    alert('Sesión guardada en los archivos locales del HUD.');
  };

  const setScenario = (key) => {
    setData(prev => ({ ...prev, ...SCENARIOS[key] }));
  };

  const downloadCSVTemplate = () => {
    const headers = "TYPE,LABEL,VALUE,COLOR,STATUS\n";
    const example = "IND,Documentación Normativa,85,#3b82f6,good\nIND,Inventarios de Hardware,60,#06b6d4,warning\nIND,Códigos Fuente,0,#ef4444,locked\n";
    const blob = new Blob([headers + example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "gamea_dashboard_template.csv";
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim() !== '');
      if (lines.length > 1) {
        const newInds = [];
        lines.slice(1).forEach((l, i) => {
          const parts = l.split(',').map(s => s?.trim() || '');
          if (parts[0] === 'IND') {
            newInds.push({ 
              id: Date.now() + i, 
              label: parts[1], 
              value: parseInt(parts[2]) || 0, 
              color: parts[3] || '#3b82f6',
              status: parts[4] || 'good'
            });
          }
        });
        setData(prev => ({ ...prev, indicadores: newInds }));
        setActiveTab('dashboard');
        alert('Datos importados con éxito.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- SIDEBAR --- */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="relative bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 flex flex-col no-print z-50"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <ShieldAlert size={22} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <h1 className="text-xs font-black tracking-[0.2em] text-white uppercase italic">GAMEA HUD</h1>
              <p className="text-[7px] text-blue-500 font-bold uppercase tracking-tighter">Strategic Defense Unit</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Strategic HUD' },
            { id: 'editor', icon: Settings, label: 'Control Center' },
            { id: 'history', icon: History, label: 'Archives' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}

          {sidebarOpen && (
            <div className="pt-10 pb-4 px-4">
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Escenarios Rápidos</p>
              <div className="space-y-2">
                {Object.keys(SCENARIOS).map(k => (
                  <button 
                    key={k}
                    onClick={() => setScenario(k)}
                    className="w-full text-left p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all flex items-center gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full ${k === 'CRISIS' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{SCENARIOS[k].label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center p-4 text-slate-600 hover:text-white transition-colors">
            {sidebarOpen ? <Minus size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto relative custom-scroll">
        
        {/* Ambient Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-2xl border-b border-white/5 px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">{data.titulo}</h2>
            <div className="flex items-center gap-3 mt-3">
              <Building2 size={12} className="text-blue-500" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">{data.secretaria} / {data.direccion}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[9px] font-black tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 flex items-center gap-3">
              <Save size={14} /> {currentId ? 'Actualizar Archivo' : 'Guardar Nueva Sesión'}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1700px] mx-auto">
          <AnimatePresence mode="wait">

            {/* --- STRATEGIC HUD TAB --- */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  <GlassCard title="Estado General del Relevamiento" className="xl:col-span-5">
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {data.indicadores.map(ind => (
                        <FuturisticGauge key={ind.id} {...ind} />
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard title="Resumen Operativo de Solicitudes" className="xl:col-span-7 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <th className="pb-4 pl-2">Unidad Solicitada</th>
                          <th className="pb-4">Documentación</th>
                          <th className="pb-4">Estado de Respuesta</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {data.solicitudes.map((s, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="py-4 pl-2 font-black text-white text-[10px] uppercase tracking-widest">{s.unidad}</td>
                            <td className="py-4">
                              <div className="flex gap-2 text-blue-400">
                                <FileText size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                <Database size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                <Edit3 size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${s.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} style={{ color: 'inherit' }} />
                                <span className={`font-bold text-[9px] uppercase tracking-wider ${s.color}`}>{s.estado}</span>
                                {s.icon === 'x' && <Hand size={12} className="text-red-500 ml-auto" />}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  <GlassCard title="Mapa de Riesgos Institucionales" subtitle="Impacto vs Probabilidad" className="xl:col-span-4 h-[420px]">
                    <div className="h-full relative pt-4 pb-12 pr-4">
                      <div className="absolute -left-2 top-1/2 -rotate-90 text-[8px] font-black text-slate-600 tracking-[0.5em] uppercase">Impacto</div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-600 tracking-[0.5em] uppercase">Probabilidad</div>
                      <div className="grid grid-cols-3 grid-rows-3 h-full gap-2 ml-4">
                        <div className="bg-red-600/40 border border-red-500/50 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Vacío Información Crítica</span></div>
                        <div className="bg-red-600/30 border border-red-500/30 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Vacío Información Crítica</span></div>
                        <div className="bg-red-600/40 border border-red-500/50 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Vacío Información Crítica</span></div>
                        <div className="bg-yellow-500/40 border border-yellow-500/50 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Riesgo Patrimonial Activos</span></div>
                        <div className="bg-orange-500/40 border border-orange-500/50 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Riesgo Patrimonial</span></div>
                        <div className="bg-red-600/30 border border-red-500/30 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Opacidad RRHH/TESORO</span></div>
                        <div className="bg-emerald-500/40 border border-emerald-500/50 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Medio</span></div>
                        <div className="bg-yellow-500/30 border border-yellow-500/30 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Opacidad RRHH/TESORO</span></div>
                        <div className="bg-red-600/20 border border-red-500/20 rounded-lg p-2 flex items-center justify-center text-center"><span className="text-[8px] font-black text-white leading-tight uppercase">Opacidad RRHH/TESORO</span></div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard title="Flujo de Solicitudes y Obstrucción" className="xl:col-span-8 flex flex-col justify-center py-20 px-12">
                    <div className="flex w-full items-center">
                      {data.flujo.map((step, i) => (
                        <FlowStep key={i} item={step} isLast={i === data.flujo.length - 1} />
                      ))}
                    </div>
                    <div className="mt-24 bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex items-start gap-6">
                      <div className="p-4 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20"><Scale size={24} /></div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Sustento Legal</span>
                          <div className="h-[1px] w-12 bg-white/10" />
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{data.ley}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-medium">Protocolos de transparencia activos para la mitigación de responsabilidad administrativa.</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <motion.div className="bg-red-600/10 border border-red-500/30 rounded-3xl p-6 flex items-center gap-6">
                  <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shrink-0 animate-pulse"><AlertTriangle size={24} /></div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Alert Intelligence</p>
                    <p className="text-sm font-bold text-white italic">"{data.alerta}"</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* --- CONTROL CENTER (EDITOR) --- */}
            {activeTab === 'editor' && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              >
                {/* Organigrama Selector */}
                <div className="lg:col-span-1 space-y-8">
                  <GlassCard title="Selector de Organigrama" subtitle="Filtro jerárquico dinámico">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Secretaría Municipal</label>
                        <div className="relative group">
                          <select
                            value={data.secretaria}
                            onChange={e => setData({ ...data, secretaria: e.target.value, direccion: ORGANIGRAMA.find(s => s.name === e.target.value)?.units[0] || "" })}
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-[10px] font-black text-white appearance-none focus:ring-2 ring-blue-600/40 outline-none transition-all cursor-pointer"
                          >
                            {ORGANIGRAMA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Unidad / Dirección / Área</label>
                        <div className="relative group">
                          <select
                            value={data.direccion}
                            onChange={e => setData({ ...data, direccion: e.target.value })}
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-[10px] font-black text-white appearance-none focus:ring-2 ring-blue-600/40 outline-none transition-all cursor-pointer"
                          >
                            {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Acreditado Responsable</label>
                        <input
                          value={data.acreditado}
                          onChange={e => setData({ ...data, acreditado: e.target.value })}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-[10px] font-black text-white outline-none focus:ring-2 ring-blue-600/40 transition-all"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] shadow-3xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-white/10 w-32 h-32 rotate-12"><FileSpreadsheet size={128} /></div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Ingesta Masiva CSV</h3>
                    <p className="text-[10px] text-blue-100 mb-6 leading-relaxed font-medium">Utilice la plantilla oficial para una carga de datos acelerada en el HUD.</p>
                    <div className="space-y-3">
                      <button onClick={downloadCSVTemplate} className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                        <Download size={14} /> Bajar Plantilla
                      </button>
                      <button onClick={() => fileInputRef.current.click()} className="w-full bg-white text-blue-700 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-blue-50 transition-all">
                        <Upload size={14} /> Subir CSV
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv" />
                    </div>
                  </div>
                </div>

                {/* KPI Calibration */}
                <div className="lg:col-span-2">
                  <GlassCard title="Calibración de Indicadores Estratégicos" subtitle="Llenado manual de métricas en tiempo real">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.indicadores.map(k => (
                        <div key={k.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl relative group">
                          <button
                            onClick={() => setData({ ...data, indicadores: data.indicadores.filter(x => x.id !== k.id) })}
                            className="absolute top-4 right-4 text-slate-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                          <input
                            value={k.label}
                            onChange={e => setData({ ...data, indicadores: data.indicadores.map(x => x.id === k.id ? { ...x, label: e.target.value.toUpperCase()} : x) })}
                            className="bg-transparent border-none text-[9px] font-black text-blue-500 uppercase outline-none mb-6 w-full tracking-[0.2em]"
                          />
                          <div className="flex items-center gap-6">
                            <input
                              type="range"
                              value={k.value}
                              onChange={e => setData({ ...data, indicadores: data.indicadores.map(x => x.id === k.id ? { ...x, value: parseInt(e.target.value) } : x) })}
                              className="flex-1 accent-blue-600 h-1.5"
                            />
                            <div className="w-12 text-right">
                              <span className="text-xl font-black text-white tabular-nums">{k.value}%</span>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                             {['good', 'warning', 'locked'].map(st => (
                               <button 
                                 key={st}
                                 onClick={() => setData({ ...data, indicadores: data.indicadores.map(x => x.id === k.id ? { ...x, status: st } : x) })}
                                 className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-tighter transition-all ${k.status === st ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}
                               >
                                 {st}
                               </button>
                             ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setData({ ...data, indicadores: [...data.indicadores, { id: Date.now(), label: 'NUEVO INDICADOR', value: 0, color: '#3b82f6', status: 'good' }] })}
                        className="border-2 border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-700 hover:text-blue-500 hover:border-blue-500/40 transition-all group"
                      >
                        <PlusCircle size={32} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase mt-3 tracking-widest">Añadir Métrica</span>
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* --- ARCHIVES (HISTORY) --- */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {reports.map(r => (
                  <GlassCard key={r.id} className="group hover:bg-slate-900/60 transition-all flex flex-col justify-between h-72">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[8px] font-black text-blue-400 uppercase tracking-widest">
                          {r.direccion}
                        </span>
                        <div className="flex items-center gap-2 text-slate-600">
                           <Clock size={10} />
                           <p className="text-[8px] font-bold uppercase">{new Date(r.created || r.updated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic leading-tight mb-3 group-hover:text-blue-400 transition-colors">{r.titulo}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">{r.secretaria}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setData(r); setCurrentId(r.id); setActiveTab('dashboard'); }}
                        className="flex-1 bg-white text-slate-950 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Eye size={14} /> Desplegar HUD
                      </button>
                      <button
                        onClick={() => {
                          const filtered = reports.filter(item => item.id !== r.id);
                          saveToLocal(filtered);
                        }}
                        className="p-3.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-6 right-8 z-50 pointer-events-none no-print">
        <p className="text-[7px] font-mono font-bold text-slate-800 tracking-[0.5em] uppercase flex items-center gap-4">
          <div className="h-[1px] w-20 bg-slate-800" />
          Quantum Intelligence Command v2.6.5
        </p>
      </div>

    </div>
  );
};

export default App;
