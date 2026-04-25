import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, CheckCircle, Clock, BarChart3, FileText, ShieldAlert,
  UserCheck, Eye, Edit3, Server, Database, Lock, Download,
  Gavel, Briefcase, Users, TrendingUp, Trash2, PlusCircle,
  XCircle, Info, Scale, Activity, Building2, Save, FolderOpen, Loader2,
  Upload, FileUp, Sparkles, Plus, Minus, FileSpreadsheet, Layers,
  ChevronRight, Zap, Target, PieChart, LineChart, Globe, Terminal, Search
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('preview'); // HUD por defecto
  const [reports, setReports] = useState([]);
  const [currentReportId, setCurrentReportId] = useState(null);
  const fileInputRef = useRef(null);

  // ESTRUCTURA ORGANIGRAMA OFICIAL 2025 (Basado en PDF Institucional)
  const organigrama = [
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

  const initialData = {
    titulo: 'CONTROL DE TRANSICIÓN ESTRATÉGICA',
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

  const [data, setData] = useState(initialData);

  // --- LÓGICA DE PERSISTENCIA LOCAL ---
  useEffect(() => {
    const savedReports = localStorage.getItem('gamea-reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const saveReportsToLocal = (newReports) => {
    setReports(newReports);
    localStorage.setItem('gamea-reports', JSON.stringify(newReports));
  };

  const handleSave = () => {
    const newReports = [...reports];
    if (currentReportId) {
      const index = newReports.findIndex(r => r.id === currentReportId);
      if (index !== -1) {
        newReports[index] = { ...data, id: currentReportId, updatedAt: new Date().toISOString() };
      }
    } else {
      const newReport = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
      newReports.push(newReport);
      setCurrentReportId(newReport.id);
    }
    saveReportsToLocal(newReports);
  };

  const deleteReport = (id) => {
    const newReports = reports.filter(r => r.id !== id);
    saveReportsToLocal(newReports);
    if (currentReportId === id) {
      setData(initialData);
      setCurrentReportId(null);
    }
  };

  // --- AUTOMATIZACIÓN CSV ---
  const downloadCSVTemplate = () => {
    const csv = "Tipo,Etiqueta,Valor,Color\nIND,NORMATIVA,90,#3b82f6\nIND,ACTIVOS,45,#ef4444\nEST,PISLEA,96,#10b981\nEST,PIGE,10,#f59e0b";
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "plantilla_transicion_gamea.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim() !== '');
      if (lines.length > 1) {
        const newInds = [];
        const newEsts = [];
        lines.slice(1).forEach((l, i) => {
          const parts = l.split(',').map(s => s?.trim() || '');
          if (parts.length < 3) return;
          const [type, lab, val, col] = parts;
          if (type === 'IND') newInds.push({ id: Date.now()+i, label: lab.toUpperCase(), value: parseInt(val) || 0, color: col || '#3b82f6' });
          if (type === 'EST') newEsts.push({ label: lab, val: parseInt(val) || 0, trend: 'up' });
        });
        setData(prev => ({ ...prev, indicadores: newInds, estadisticas: newEsts }));
        setView('preview');
      }
    };
    reader.readAsText(file);
  };

  // --- COMPONENTES UI FUTURISTA ---

  const FuturisticGauge = ({ value, label, color }) => (
    <div className="relative group flex flex-col items-center">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full blur-3xl opacity-10 animate-pulse" style={{ backgroundColor: color }}></div>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="44"
            fill="transparent"
            stroke={color}
            strokeWidth="6"
            strokeDasharray="276.46"
            strokeDashoffset={276.46 - (276.46 * value) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out shadow-2xl"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">{value}%</span>
        </div>
      </div>
      <span className="mt-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] text-center max-w-[140px] leading-tight">{label}</span>
    </div>
  );

  const StatBar = ({ label, value, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <div
          className="h-full transition-all duration-1000 rounded-full"
          style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 12px ${color}88` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/40">

      {/* NAVEGACIÓN TÁCTICA */}
      <nav className="border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl sticky top-0 z-50 no-print">
        <div className="max-w-[1700px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="relative">
               <div className="absolute -inset-2 bg-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
               <div className="relative bg-slate-900 p-3 rounded-xl border border-white/10 shadow-2xl"><Layers size={24} className="text-blue-400" /></div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.5em] text-white uppercase italic">GAMEA DASHBOARD</h1>
              <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">Transición Transparente 2026</p>
            </div>
          </div>

          <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 gap-3">
            {['editor', 'preview', 'list'].map(v => (
              <button
                key={v} onClick={() => setView(v)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${view === v ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.3)]' : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                {v === 'editor' ? 'Config' : v === 'preview' ? 'Strategic HUD' : 'Local History'}
              </button>
            ))}
          </div>

          <button onClick={handleSave} className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-2xl transition-all active:scale-95 uppercase">
            <Save size={16}/> {currentReportId ? 'Update Local' : 'Save Locally'}
          </button>
        </div>
      </nav>

      <main className="max-w-[1700px] mx-auto p-10">

        {/* PANEL DE CONTROL (EDITOR) */}
        {view === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900/40 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl">
                <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-10 flex items-center gap-4 border-b border-white/5 pb-4"><Building2 size={18}/> Entidad de Relevamiento</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Secretaría Municipal</label>
                    <select value={data.secretaria} onChange={e => setData({...data, secretaria: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-bold focus:ring-2 ring-blue-600/40 outline-none text-white">
                      {organigrama.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Unidad Operativa</label>
                    <input value={data.direccion} onChange={e => setData({...data, direccion: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Acreditado Responsable</label>
                    <input value={data.acreditado} onChange={e => setData({...data, acreditado: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 text-white/10 w-48 h-48 rotate-12 transition-transform group-hover:scale-110 duration-700"><Sparkles size={192} /></div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-6">Importación Inteligente</h3>
                <p className="text-[12px] text-blue-50 font-medium mb-8 leading-relaxed">Carga datos masivos desde un archivo CSV para generar el tablero en segundos.</p>
                <div className="space-y-4 relative z-10">
                  <button onClick={downloadCSVTemplate} className="w-full bg-white/15 hover:bg-white/25 py-4 rounded-2xl border border-white/20 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 backdrop-blur-sm"><FileSpreadsheet size={18}/> Obtener Formato CSV</button>
                  <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv" />
                  <button onClick={() => fileInputRef.current.click()} className="w-full bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 border border-white/5 shadow-2xl"><Upload size={18}/> Procesar Datos</button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900/20 border border-white/5 p-12 rounded-[4rem] backdrop-blur-sm">
              <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4"><Activity size={20}/> Calibración de KPIs Estratégicos</h3>
                <button onClick={() => setData({...data, indicadores: [...data.indicadores, {id: Date.now(), label: 'NUEVA MÉTRICA', value: 0, color: '#3b82f6'}]})} className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">Añadir Métrica HUD</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[650px] overflow-y-auto pr-6 custom-scroll">
                {data.indicadores.map(k => (
                  <div key={k.id} className="bg-slate-950/60 border border-white/5 p-8 rounded-[2.5rem] relative group shadow-2xl">
                    <button onClick={() => setData({...data, indicadores: data.indicadores.filter(x => x.id !== k.id)})} className="absolute top-6 right-6 text-slate-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    <input value={k.label} onChange={e => setData({...data, indicadores: data.indicadores.map(x => x.id === k.id ? {...x, label: e.target.value.toUpperCase()} : x)})} className="bg-transparent border-none text-[11px] font-black text-blue-500 uppercase outline-none mb-6 w-full tracking-widest" />
                    <div className="flex items-center gap-8">
                      <input type="range" value={k.value} onChange={e => setData({...data, indicadores: data.indicadores.map(x => x.id === k.id ? {...x, value: parseInt(e.target.value)} : x)})} className="flex-1 accent-blue-600 h-2" />
                      <span className="text-2xl font-black text-white w-16 text-center tabular-nums">{k.value}%</span>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                       <input type="color" value={k.color} onChange={e => setData({...data, indicadores: data.indicadores.map(x => x.id === k.id ? {...x, color: e.target.value} : x)})} className="w-12 h-8 rounded-lg bg-transparent cursor-pointer border-none shadow-lg" />
                       <span className="text-[9px] font-black text-slate-600 uppercase">Ajuste de Color HUD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ESTRATEGIC HUD (PREVIEW) */}
        {view === 'preview' && (
          <div className="animate-in zoom-in-95 duration-1000 space-y-12 pb-20">

            {/* CABEZAL TIPO COMAND CENTER */}
            <div className="relative bg-slate-950 p-14 rounded-[4.5rem] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/10 rounded-full -mr-80 -mt-80 blur-[150px] animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full -ml-40 -mb-40 blur-[120px]"></div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-14">
                <div className="flex items-center gap-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-[3rem] blur-2xl opacity-15 animate-pulse"></div>
                    <div className="relative p-10 bg-slate-900 rounded-[3rem] border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                       <Target size={64} className="text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic mb-5 leading-[0.8] drop-shadow-2xl">{data.titulo}</h2>
                    <div className="flex items-center gap-6">
                      <div className="px-6 py-2.5 bg-blue-600/10 border border-blue-500/40 rounded-2xl text-[11px] font-black text-blue-400 tracking-[0.3em] uppercase">{data.secretaria}</div>
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{data.direccion}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right border-l border-white/10 pl-14">
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-12 py-5 rounded-[2rem] text-sm font-black tracking-[0.4em] uppercase mb-5 shadow-2xl shadow-red-500/10 animate-pulse">Critical Alert</div>
                  <p className="font-mono text-[11px] font-black text-slate-600 tracking-[0.4em] uppercase">{data.fecha} — DATA OPS CENTER</p>
                </div>
              </div>
            </div>

            {/* GRID DE KPIs Y ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {data.indicadores.map(ind => (
                 <div key={ind.id} className="bg-slate-900/30 border border-white/5 p-12 rounded-[4rem] backdrop-blur-2xl flex flex-col items-center justify-center transition-all hover:scale-[1.03] hover:border-blue-500/40 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                    <FuturisticGauge value={ind.value} label={ind.label} color={ind.color} />
                 </div>
               ))}
               <div className="bg-slate-900/30 border border-white/5 p-12 rounded-[4rem] flex flex-col justify-center gap-8 backdrop-blur-xl shadow-2xl">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] border-b border-white/5 pb-4 mb-2 flex items-center gap-3"><Activity size={16}/> HUD Stats</h4>
                  {data.estadisticas.map((s, i) => (
                    <StatBar key={i} label={s.label} value={s.val} color={s.val > 80 ? '#10b981' : s.val > 40 ? '#3b82f6' : '#ef4444'} />
                  ))}
               </div>
            </div>

            {/* SECCIÓN ANALÍTICA: MAPA DE RIESGOS Y RESUMEN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Mapa de Riesgos Interactivo */}
              <div className="lg:col-span-8 bg-slate-950 p-14 rounded-[4.5rem] border border-white/10 relative overflow-hidden shadow-3xl">
                <div className="flex justify-between items-center mb-14">
                   <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4"><Scale size={24} className="text-orange-500"/> Risk Heatmap Center</h3>
                   <div className="flex gap-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <span className="flex items-center gap-3"><div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626]"></div> Crisis</span>
                      <span className="flex items-center gap-3"><div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#f97316]"></div> High</span>
                   </div>
                </div>

                <div className="relative h-80 border-l-2 border-b-2 border-white/10 ml-14">
                   <div className="absolute -left-14 top-1/2 -rotate-90 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">IMPACT</div>
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">PROBABILITY</div>

                   {/* Cyber Grid */}
                   <div className="grid grid-cols-3 h-full">
                      <div className="border-r border-white/5 bg-slate-900/5 hover:bg-slate-900/20 transition-all"></div>
                      <div className="border-r border-white/5 bg-slate-900/10 hover:bg-slate-900/30 transition-all"></div>
                      <div className="bg-red-950/10 hover:bg-red-950/20 transition-all"></div>
                   </div>

                   {data.riesgos.map((r, i) => (
                     <div key={i} className={`absolute group p-6 rounded-3xl border-2 cursor-pointer transition-all hover:scale-125 z-20 ${r.imp === 3 ? 'bg-red-600/10 border-red-600/60 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'bg-orange-500/10 border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.2)]'}`}
                          style={{ left: `${(r.prob/3)*85}%`, top: `${100 - (r.imp/3)*85}%` }}>
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${r.imp === 3 ? 'bg-red-500 animate-ping' : 'bg-orange-500'}`}></div>
                           <span className="text-[11px] font-black text-white uppercase tracking-widest">{r.title}</span>
                        </div>
                        <div className="absolute top-full left-0 mt-4 bg-[#0f172a] text-white p-5 rounded-2xl w-56 opacity-0 group-hover:opacity-100 transition-all z-50 border border-white/10 shadow-3xl backdrop-blur-3xl">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest">{r.cat}</span>
                              <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded uppercase">{r.imp === 3 ? 'CRÍTICO' : 'ALTO'}</span>
                           </div>
                           <p className="text-[10px] text-slate-300 leading-relaxed font-bold">Evaluación estratégica de impacto en servicios municipales.</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* Panel de Alertas HUD */}
              <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-[#020617] p-12 rounded-[4.5rem] border border-white/10 flex flex-col justify-between shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-5 mb-12">
                      <div className="p-5 bg-red-600/20 text-red-500 rounded-[2rem] border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]"><AlertTriangle size={32}/></div>
                      <div>
                        <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Critical Summary</h4>
                        <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 tracking-widest">Protocolo de Emergencia</p>
                      </div>
                   </div>
                   <p className="text-2xl font-medium text-slate-200 leading-tight italic border-l-4 border-red-600 pl-8 mb-12 drop-shadow-lg">"{data.alerta}"</p>
                </div>
                <div className="space-y-6 relative z-10">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Unidades Identificadas:</p>
                   <div className="flex flex-wrap gap-3">
                      {data.bloqueos.map(b => (
                        <div key={b} className="flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-2xl group/tag hover:bg-red-600/20 hover:border-red-600/40 transition-all cursor-default">
                           <div className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover/tag:scale-150 transition-transform"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/tag:text-white transition-colors">{b}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

            </div>

            {/* FOOTER FIRMAS / VALIDACIÓN */}
            <div className="bg-slate-900/40 p-14 rounded-[5rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-14 backdrop-blur-3xl shadow-2xl">
              <div className="flex gap-20">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl"><UserCheck size={40}/></div>
                    <div>
                       <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mb-2">Acreditado de Transición</p>
                       <p className="text-xl font-black text-white uppercase tracking-tighter">{data.acreditado}</p>
                       <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 to-transparent mt-4 opacity-30"></div>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-500 border border-white/10 shadow-2xl"><ShieldAlert size={40}/></div>
                    <div>
                       <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mb-2">Gestión Entrante</p>
                       <p className="text-xl font-black text-white uppercase tracking-tighter">Alcalde {data.alcalde}</p>
                       <div className="h-[2px] w-full bg-gradient-to-r from-slate-600 to-transparent mt-4 opacity-30"></div>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-5 no-print">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">Carga de Información Activa</p>
                    <p className="text-[10px] font-bold text-blue-500/60 uppercase tracking-[0.3em]">Sustento: {data.ley}</p>
                 </div>
                 <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-500 text-white px-16 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-2 active:scale-95">EXPORTAR INFORME HUD PDF</button>
              </div>
            </div>
          </div>
        )}

        {/* VISTA LISTA / REPOSITORIO */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
            {reports.map(r => (
              <div key={r.id} className="bg-slate-900/40 border border-white/10 p-12 rounded-[4rem] hover:bg-slate-900 transition-all group flex flex-col justify-between shadow-3xl">
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="bg-blue-600/10 px-6 py-2 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] border border-blue-500/20">{r.direccion}</div>
                      <button onClick={() => deleteReport(r.id)} className="text-slate-800 hover:text-red-500 transition-colors p-2"><Trash2 size={20}/></button>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic leading-none mb-4">{r.titulo}</h4>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{r.secretaria}</p>
                   <div className="mt-10 flex gap-2 h-1.5">
                      {r.indicadores?.slice(0, 5).map((k, idx) => (
                        <div key={idx} className="flex-1 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full transition-all duration-1000" style={{ width: `${k.value}%`, backgroundColor: k.color }}></div>
                        </div>
                      ))}
                   </div>
                </div>
                <button onClick={() => { setData(r); setCurrentReportId(r.id); setView('editor'); }} className="mt-12 w-full bg-white text-slate-950 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-400 transition-all flex items-center justify-center gap-4 shadow-2xl">
                  <FolderOpen size={20}/> Load Local Data
                </button>
              </div>
            ))}
            <div onClick={() => {setData(initialData); setCurrentReportId(null); setView('editor');}} className="border-4 border-dashed border-slate-900 rounded-[4rem] flex flex-col items-center justify-center p-14 cursor-pointer hover:border-blue-600/40 hover:bg-slate-900/20 transition-all text-slate-800 hover:text-blue-500">
               <PlusCircle size={64} />
               <p className="mt-6 font-black uppercase text-xs tracking-[0.6em]">New Requeriment</p>
            </div>
          </div>
        )}

      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.3); }

        input[type="range"] { -webkit-appearance: none; background: rgba(255,255,255,0.03); height: 5px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; cursor: pointer; box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-slate-950, .bg-slate-900, .bg-slate-900/40, .bg-slate-900/30, .bg-slate-900/20 { background: white !important; border: 1px solid #ddd !important; color: black !important; }
          .text-white, .text-slate-200, .text-slate-300, .text-slate-400, .text-slate-500 { color: black !important; }
          .shadow-3xl, .shadow-2xl, .shadow-xl, .shadow-lg, .blur-3xl, .blur-2xl, .blur-xl { box-shadow: none !important; filter: none !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
