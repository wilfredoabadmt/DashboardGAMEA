import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Clock, BarChart3, FileText, ShieldAlert,
  UserCheck, Eye, Edit3, Server, Database, Lock, Download,
  Gavel, Briefcase, Users, TrendingUp, Trash2, PlusCircle,
  XCircle, Info, Scale, Activity, Building2, Save, FolderOpen, Loader2,
  Upload, FileUp, Sparkles, Plus, Minus, FileSpreadsheet, Layers,
  ChevronRight, Zap, Target, PieChart, LineChart, Globe, Terminal, Search,
  LayoutDashboard, History, Settings, LogOut, Menu, X
} from 'lucide-react';

// --- DATA CONSTANTS ---
const ORGANIGRAMA = [
  { name: "Despacho Alcaldesa", units: ["Auditoría Interna", "Transparencia", "Asesoría Estratégica"] },
  { name: "Sec. Mun. de Administración y Finanzas (SMAF)", units: ["Dirección Administrativa", "Dirección del Tesoro", "UASI", "Activos Fijos", "RRHH"] },
  { name: "Sec. Mun. de Gestión Institucional", units: ["Asesoría Legal", "Comunicación", "Relaciones Públicas"] },
  { name: "Sec. Mun. de Movilidad Urbana", units: ["Transporte", "Vialidad", "Bus Municipal"] },
  { name: "Sec. Mun. de Infraestructura Pública", units: ["Obras Públicas", "Supervisión", "Alumbrado Público"] },
  { name: "Sec. Mun. de Salud", units: ["Gestión Hospitalaria", "Seguros de Salud"] },
  { name: "Sec. Mun. de Desarrollo Humano", units: ["Educación", "Culturas", "Género", "Niñez"] },
  { name: "Sec. Mun. de Seguridad Ciudadana", units: ["Prevención", "Vigilancia", "Intendencia"] },
  { name: "Sec. Mun. de Agua, Gestión Ambiental y Riesgos", units: ["Saneamiento", "Riesgos", "Medio Ambiente"] },
  { name: "Sec. Mun. de Desarrollo Económico", units: ["Mypes", "Turismo", "Comercio"] }
];

const INITIAL_DATA = {
  titulo: 'SISTEMA DE CONTROL DE TRANSICIÓN',
  subtitulo: 'HUD de Inteligencia Municipal y Mitigación de Riesgos',
  fecha: new Date().toISOString().split('T')[0],
  acreditado: 'Wilfredo Abad Mancilla Terán',
  alcalde: 'Elieser Roca Tancara',
  secretaria: 'Sec. Mun. de Administración y Finanzas (SMAF)',
  direccion: 'UASI',
  indicadores: [
    { id: 1, label: 'DOCUMENTACIÓN NORMATIVA', value: 85, color: '#3b82f6', icon: 'FileText' },
    { id: 2, label: 'INVENTARIO FÍSICO DE ACTIVOS', value: 20, color: '#ef4444', icon: 'Database' },
    { id: 3, label: 'ACCESOS Y CREDENCIALES', value: 5, color: '#f59e0b', icon: 'Lock' }
  ],
  estadisticas: [
    { label: 'PISLEA (Software Libre)', val: 96, trend: 'up' },
    { label: 'PISI (Seguridad)', val: 70, trend: 'down' },
    { label: 'PIGE (Gob. Electrónico)', val: 10, trend: 'flat' }
  ],
  riesgos: [
    { id: 1, title: 'Opacidad de Datos', prob: 2, imp: 3, cat: 'Legal' },
    { id: 2, title: 'Inconsistencia Física', prob: 3, imp: 3, cat: 'Patrimonial' },
    { id: 3, title: 'Soberanía Digital', prob: 1, imp: 3, cat: 'Técnica' }
  ],
  alerta: 'Nivel crítico detectado: Retención de códigos fuente y opacidad en bases de datos financieras.',
  bloqueos: ["Tesorería", "Recursos Humanos", "Activos Fijos"],
  ley: 'Ley 1178 (SAFCO)'
};

// --- HELPER COMPONENTS ---

const GlassCard = ({ children, className = "", title = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    {title && <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> {title}
    </h3>}
    {children}
  </motion.div>
);

const FuturisticGauge = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r="45"
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray="283"
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: 283 - (283 * value) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_var(--glow)]"
          style={{ '--glow': color } as any}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white tabular-nums">{value}%</span>
      </div>
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</span>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [reports, setReports] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileInputRef = useRef(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('gamea-reports-v2');
    if (saved) setReports(JSON.parse(saved));
  }, []);

  const saveToLocal = (updatedReports) => {
    setReports(updatedReports);
    localStorage.setItem('gamea-reports-v2', JSON.stringify(updatedReports));
  };

  const handleSave = () => {
    const newReports = [...reports];
    if (currentId) {
      const idx = newReports.findIndex(r => r.id === currentId);
      if (idx !== -1) newReports[idx] = { ...data, id: currentId, updated: new Date().toISOString() };
    } else {
      const newReport = { ...data, id: Date.now().toString(), created: new Date().toISOString() };
      newReports.push(newReport);
      setCurrentId(newReport.id);
    }
    saveToLocal(newReports);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim() !== '');
      if (lines.length > 1) {
        // Simple CSV parsing logic
        const newInds = [];
        lines.slice(1).forEach((l, i) => {
          const parts = l.split(',').map(s => s?.trim() || '');
          if (parts[0] === 'IND') {
            newInds.push({ id: Date.now() + i, label: parts[1], value: parseInt(parts[2]) || 0, color: parts[3] || '#3b82f6' });
          }
        });
        setData(prev => ({ ...prev, indicadores: newInds }));
        setActiveTab('dashboard');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="relative bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 flex flex-col no-print z-50"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Zap size={24} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden whitespace-nowrap">
              <h1 className="text-sm font-black tracking-widest text-white italic">GAMEA HUD</h1>
              <p className="text-[8px] text-blue-500 font-bold uppercase tracking-tighter">Smart Transition Engine</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Strategic HUD' },
            { id: 'editor', icon: Settings, label: 'Config Panel' },
            { id: 'history', icon: History, label: 'Local History' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>}
              {activeTab === item.id && sidebarOpen && (
                <motion.div layoutId="active-pill" className="ml-auto w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Collapse View</span>}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto relative custom-scroll">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/5 blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none" />

        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 bg-[#030712]/60 backdrop-blur-md border-b border-white/5 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">{data.titulo}</h2>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                <span className="text-blue-500">{data.secretaria}</span>
                <span className="opacity-20">/</span>
                <span>{data.direccion}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{data.fecha}</p>
              <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-tighter flex items-center justify-end gap-2">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" /> System Live
              </p>
            </div>
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-lg active:scale-95 flex items-center gap-2">
              <Save size={14} /> {currentId ? 'Sync Cloud' : 'Save Session'}
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.indicadores.map((ind) => (
                    <GlassCard key={ind.id} className="flex flex-col items-center justify-center py-10 group hover:border-blue-500/30 transition-colors">
                      <FuturisticGauge value={ind.value} label={ind.label} color={ind.color} />
                    </GlassCard>
                  ))}
                  <GlassCard title="Operational Stats" className="flex flex-col justify-between">
                    <div className="space-y-4">
                      {data.estadisticas.map((s, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                            <span>{s.label}</span>
                            <span className="text-white">{s.val}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${s.val}%` }}
                              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Main Analysis Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Risk Heatmap */}
                  <GlassCard title="Risk Topology Center" className="lg:col-span-8 h-[450px] relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="relative h-full flex flex-col pt-10">
                      <div className="flex-1 border-l border-b border-white/10 ml-12 mb-12 relative">
                        <div className="absolute -left-10 top-1/2 -rotate-90 text-[8px] font-bold text-slate-600 tracking-[0.5em]">IMPACT</div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-600 tracking-[0.5em]">PROBABILITY</div>
                        
                        {/* Grid zones */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                          <div className="border-r border-b border-white/5 bg-emerald-500/5" />
                          <div className="border-b border-white/5 bg-yellow-500/5" />
                          <div className="border-r border-white/5 bg-orange-500/5" />
                          <div className="bg-red-500/5" />
                        </div>

                        {data.riesgos.map((r, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, left: `${(r.prob / 3) * 90}%`, top: `${100 - (r.imp / 3) * 90}%` }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-full border-2 cursor-pointer transition-all hover:scale-150 z-20 group ${
                              r.imp === 3 ? 'bg-red-600/20 border-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-orange-600/20 border-orange-400 shadow-[0_0_15px_#f59e0b]'
                            }`}
                          >
                            <div className="relative">
                              <span className="text-[10px] font-black text-white whitespace-nowrap absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 px-3 py-1 rounded-md">
                                {r.title} ({r.cat})
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>

                  {/* Alerts & Critical Info */}
                  <div className="lg:col-span-4 space-y-6">
                    <GlassCard className="bg-red-950/20 border-red-900/50" title="System Alert Center">
                      <div className="flex gap-4 mb-6">
                        <div className="p-3 bg-red-600/20 text-red-500 rounded-xl border border-red-500/40">
                          <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Critical Alert</h4>
                          <p className="text-[9px] text-red-500/60 font-bold uppercase">Protocol Level 04</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium leading-relaxed italic text-slate-300 border-l-2 border-red-500 pl-4 mb-8">
                        "{data.alerta}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.bloqueos.map(b => (
                          <span key={b} className="text-[8px] font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">
                            {b}
                          </span>
                        ))}
                      </div>
                    </GlassCard>

                    <GlassCard title="Acredited Signatories">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                            <UserCheck size={20} />
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Transition Officer</p>
                            <p className="text-xs font-black text-white uppercase">{data.acreditado}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-500">
                            <ShieldAlert size={20} />
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Incoming Management</p>
                            <p className="text-xs font-black text-white uppercase">Alcalde {data.alcalde}</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {/* Print Export */}
                <div className="no-print pt-10 flex justify-center">
                   <button onClick={() => window.print()} className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-4">
                     <Download size={20} /> Generate PDF Strategic Report
                   </button>
                </div>
              </motion.div>
            )}

            {/* --- EDITOR TAB --- */}
            {activeTab === 'editor' && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-1 space-y-8">
                  <GlassCard title="Primary Metadata">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Secretaría Municipal</label>
                        <select 
                          value={data.secretaria} 
                          onChange={e => setData({...data, secretaria: e.target.value})}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-bold text-white focus:ring-2 ring-blue-600/40 outline-none"
                        >
                          {ORGANIGRAMA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Unidad Operativa</label>
                        <input 
                          value={data.direccion} 
                          onChange={e => setData({...data, direccion: e.target.value})}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Acreditado Responsable</label>
                        <input 
                          value={data.acreditado} 
                          onChange={e => setData({...data, acreditado: e.target.value})}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none" 
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-3xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-white/10 w-32 h-32 rotate-12 transition-transform group-hover:scale-125"><Sparkles size={128} /></div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Bulk Import</h3>
                    <p className="text-[11px] text-blue-100 mb-6 leading-relaxed">Fast-track your dashboard setup with CSV data ingestion.</p>
                    <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv" />
                    <button onClick={() => fileInputRef.current.click()} className="w-full bg-white text-blue-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-blue-50 transition-colors">
                      <Upload size={14}/> Upload CSV
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <GlassCard title="Strategic KPI Calibration">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.indicadores.map(k => (
                        <div key={k.id} className="bg-slate-950/60 border border-white/5 p-6 rounded-2xl relative group">
                          <button 
                            onClick={() => setData({...data, indicadores: data.indicadores.filter(x => x.id !== k.id)})}
                            className="absolute top-4 right-4 text-slate-700 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14}/>
                          </button>
                          <input 
                            value={k.label} 
                            onChange={e => setData({...data, indicadores: data.indicadores.map(x => x.id === k.id ? {...x, label: e.target.value.toUpperCase()} : x)})} 
                            className="bg-transparent border-none text-[10px] font-black text-blue-500 uppercase outline-none mb-4 w-full tracking-widest" 
                          />
                          <div className="flex items-center gap-6">
                            <input 
                              type="range" 
                              value={k.value} 
                              onChange={e => setData({...data, indicadores: data.indicadores.map(x => x.id === k.id ? {...x, value: parseInt(e.target.value)} : x)})} 
                              className="flex-1 accent-blue-600 h-1.5" 
                            />
                            <span className="text-lg font-black text-white tabular-nums">{k.value}%</span>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setData({...data, indicadores: [...data.indicadores, {id: Date.now(), label: 'NEW KPI', value: 0, color: '#3b82f6'}]})}
                        className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-600 hover:text-blue-500 hover:border-blue-500/40 transition-all"
                      >
                        <PlusCircle size={32} />
                        <span className="text-[9px] font-black uppercase mt-2">Add Metric</span>
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* --- HISTORY TAB --- */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {reports.map(r => (
                  <GlassCard key={r.id} className="group hover:bg-slate-900/60 transition-all flex flex-col justify-between h-64">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-widest">
                          {r.direccion}
                        </span>
                        <p className="text-[8px] font-bold text-slate-600 uppercase">{new Date(r.created || r.updated).toLocaleDateString()}</p>
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic leading-tight mb-2">{r.titulo}</h4>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">{r.secretaria}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setData(r); setCurrentId(r.id); setActiveTab('dashboard'); }}
                        className="flex-1 bg-white text-slate-950 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={14} /> View HUD
                      </button>
                      <button 
                        onClick={() => {
                          const filtered = reports.filter(item => item.id !== r.id);
                          saveToLocal(filtered);
                          if (currentId === r.id) {
                            setData(INITIAL_DATA);
                            setCurrentId(null);
                          }
                        }}
                        className="p-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
                {reports.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-600 font-black uppercase tracking-[0.5em]">No Local Archives Found</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* --- FOOTER (Strategic Legend) --- */}
      <div className="fixed bottom-4 right-8 z-50 pointer-events-none no-print">
        <p className="text-[8px] font-mono font-bold text-slate-700 tracking-[0.5em] uppercase">
          &copy; 2026 GAMEA - INTELLIGENCE COMMAND UNIT
        </p>
      </div>

    </div>
  );
};

export default App;

