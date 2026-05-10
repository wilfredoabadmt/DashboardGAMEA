import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3, FileText, ShieldAlert, UserCheck, Trash2, PlusCircle,
  Save, FolderOpen, FileSpreadsheet, Layers, Target, Scale, Activity,
  Building2, AlertTriangle, Upload, Download, Edit3, Eye, Zap,
  TrendingUp, CheckCircle, Clock
} from 'lucide-react';

// ============================================================================
// COMPONENTES VISUALES
// ============================================================================

const FuturisticGauge = ({ value, label, color }) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray="251.33"
          strokeDashoffset={251.33 - (251.33 * value) / 100}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-white">{value}%</div>
      </div>
    </div>
    <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wide max-w-[120px]">{label}</div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
    <div className="flex items-center justify-between mb-4">
      <Icon size={24} style={{ color }} className="opacity-80" />
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-green-500/20 text-green-400' : trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
        <TrendingUp size={12} />
        <span>{trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{value}%</span>
      </div>
    </div>
    <div className="text-sm text-slate-400 uppercase tracking-wide font-semibold">{label}</div>
  </div>
);

const RiskBadge = ({ title, severity, category }) => {
  const bgColor = severity === 'critical' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-orange-500/10 border-orange-500/50 text-orange-400';
  const dotColor = severity === 'critical' ? 'bg-red-500' : 'bg-orange-500';
  
  return (
    <div className={`px-4 py-3 rounded-lg border ${bgColor} flex items-center gap-3`}>
      <div className={`w-2 h-2 ${dotColor} rounded-full ${severity === 'critical' ? 'animate-pulse' : ''}`}></div>
      <div className="text-sm font-semibold">{title}</div>
      <span className="text-xs opacity-60">{category}</span>
    </div>
  );
};

// ============================================================================
// COMPONENTES DE LAYOUT
// ============================================================================

const Header = ({ onViewChange, currentView, onSave, isSaveActive }) => (
  <nav className="bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
          <Layers size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">GAMEA DASHBOARD</h1>
          <p className="text-xs text-blue-400 font-semibold">Control de Transición Estratégica</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-800 p-1 rounded-lg border border-slate-700">
        {['preview', 'editor', 'list'].map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-6 py-2 rounded-md text-xs font-bold uppercase transition-all ${
              currentView === v
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {v === 'preview' ? '📊 Vista' : v === 'editor' ? '⚙️ Config' : '📁 Historial'}
          </button>
        ))}
      </div>

      <button
        onClick={onSave}
        className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all flex items-center gap-2 ${
          isSaveActive
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
            : 'bg-slate-700 text-slate-400'
        }`}
      >
        <Save size={18} /> {isSaveActive ? 'Actualizar' : 'Guardar'}
      </button>
    </div>
  </nav>
);

const Footer = ({ onPrint }) => (
  <footer className="bg-slate-950 border-t border-slate-800 mt-16 no-print">
    <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
      <div className="text-sm text-slate-500">
        <p className="font-semibold mb-1">GAMEA Dashboard v1.0</p>
        <p>Plataforma de Inteligencia Estratégica Municipal</p>
      </div>
      <button
        onClick={onPrint}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all uppercase text-sm"
      >
        📄 Exportar PDF
      </button>
    </div>
  </footer>
);

// ============================================================================
// VISTAS PRINCIPALES
// ============================================================================

const PreviewView = ({ data, indicadores, estadisticas, riesgos }) => (
  <div className="space-y-8 animate-in fade-in duration-500 pb-20">
    {/* HEADER PRINCIPAL */}
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-black p-12 rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
            <Target size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white mb-2 leading-tight">{data.titulo}</h2>
            <p className="text-slate-400 font-semibold text-lg">{data.subtitulo}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-6 border-t border-slate-800">
          <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-sm font-bold text-blue-400">
            {data.secretaria}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500">{data.direccion}</span>
          </div>
          <div className="text-xs font-bold text-slate-600 ml-auto">{data.fecha}</div>
        </div>
      </div>
    </div>

    {/* GRID DE KPIs */}
    <div>
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
        <BarChart3 size={24} className="text-blue-500" />
        Indicadores Estratégicos
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {indicadores.map(ind => (
          <div key={ind.id} className="bg-slate-800 border border-slate-700 p-8 rounded-xl hover:border-slate-600 transition-all flex flex-col items-center">
            <FuturisticGauge value={ind.value} label={ind.label} color={ind.color} />
          </div>
        ))}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-xl flex flex-col justify-center items-center gap-4">
          <h4 className="text-xs font-black text-slate-400 text-center uppercase">Estadísticas</h4>
          <div className="space-y-3 w-full">
            {estadisticas.map((s, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">{s.label}</span>
                <span className="text-sm font-black text-white">{s.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* ALERTAS Y RIESGOS */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-8 rounded-xl">
        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-3">
          <Scale size={24} className="text-orange-500" />
          Matriz de Riesgos
        </h3>
        <div className="space-y-3">
          {riesgos.map((r, i) => (
            <RiskBadge key={i} title={r.title} severity={r.imp === 3 ? 'critical' : 'high'} category={r.cat} />
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/50 p-8 rounded-xl">
        <h4 className="text-lg font-black text-red-400 mb-4 uppercase tracking-wider flex items-center gap-3">
          <AlertTriangle size={20} />
          Alerta Crítica
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">{data.alerta}</p>
        <div className="mt-6 space-y-2">
          {data.bloqueos.map(b => (
            <div key={b} className="text-xs font-bold text-red-400 px-3 py-2 bg-red-950/50 rounded-lg border border-red-800/30">
              ⚠️ {b}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FIRMAS */}
    <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-4">
        <UserCheck size={40} className="text-blue-500" />
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase">Responsable</p>
          <p className="text-lg font-black text-white">{data.acreditado}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ShieldAlert size={40} className="text-slate-500" />
        <div>
          <p className="text-xs text-slate-500 font-semibold uppercase">Alcaldía</p>
          <p className="text-lg font-black text-white">{data.alcalde}</p>
        </div>
      </div>
    </div>
  </div>
);

const EditorView = ({ data, setData, indicadores, setIndicadores, onImport, onDownloadCSV }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
    {/* PANEL IZQUIERDO */}
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl">
        <h3 className="text-lg font-black text-blue-400 mb-6 uppercase tracking-wider flex items-center gap-3">
          <Building2 size={20} />
          Configuración
        </h3>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Secretaría</label>
            <input
              type="text"
              value={data.secretaria}
              onChange={e => setData({...data, secretaria: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Unidad</label>
            <input
              type="text"
              value={data.direccion}
              onChange={e => setData({...data, direccion: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Responsable</label>
            <input
              type="text"
              value={data.acreditado}
              onChange={e => setData({...data, acreditado: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/50 p-8 rounded-xl">
        <h4 className="text-lg font-black text-blue-400 mb-4 uppercase tracking-wider">Importar Datos</h4>
        <p className="text-sm text-slate-300 mb-4 font-medium">Carga datos masivos desde CSV</p>
        <div className="space-y-3">
          <button onClick={onDownloadCSV} className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2">
            <FileSpreadsheet size={18} /> Descargar CSV
          </button>
          <button onClick={() => document.getElementById('csv-input').click()} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2">
            <Upload size={18} /> Cargar CSV
          </button>
          <input id="csv-input" type="file" accept=".csv" onChange={onImport} className="hidden" />
        </div>
      </div>
    </div>

    {/* PANEL CENTRAL - KPIs */}
    <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-8 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Activity size={20} className="text-blue-500" />
          Indicadores
        </h3>
        <button
          onClick={() => setIndicadores([...indicadores, { id: Date.now(), label: 'NUEVA', value: 50, color: '#3b82f6' }])}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
        >
          <PlusCircle size={16} /> Agregar
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
        {indicadores.map(ind => (
          <div key={ind.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={ind.label}
                onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? {...x, label: e.target.value.toUpperCase()} : x))}
                className="flex-1 bg-transparent text-sm font-bold text-blue-400 outline-none"
              />
              <button
                onClick={() => setIndicadores(indicadores.filter(x => x.id !== ind.id))}
                className="text-slate-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                value={ind.value}
                onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? {...x, value: parseInt(e.target.value)} : x))}
                min="0"
                max="100"
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-black text-white min-w-12 text-right">{ind.value}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={ind.color}
                onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? {...x, color: e.target.value} : x))}
                className="w-10 h-8 rounded-lg cursor-pointer border border-slate-600"
              />
              <div
                className="h-3 flex-1 rounded-full"
                style={{ backgroundColor: ind.color, boxShadow: `0 0 12px ${ind.color}99` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ListViewComponent = ({ reports, onSelect, onDelete, onCreate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
    {reports.map(r => (
      <div key={r.id} className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-slate-600 transition-all flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-xs font-bold text-blue-400 inline-block mb-2">
              {r.direccion}
            </div>
            <h4 className="text-lg font-black text-white mb-1">{r.titulo}</h4>
            <p className="text-xs text-slate-500 font-semibold">{r.secretaria}</p>
          </div>
          <button onClick={() => onDelete(r.id)} className="text-slate-600 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
        <button
          onClick={() => onSelect(r)}
          className="mt-auto px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <FolderOpen size={16} /> Abrir
        </button>
      </div>
    ))}

    <div
      onClick={onCreate}
      className="bg-slate-800 border-2 border-dashed border-slate-700 hover:border-blue-600 p-6 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-slate-500 hover:text-blue-400"
    >
      <PlusCircle size={40} className="mb-2" />
      <p className="font-bold text-center">Nuevo Reporte</p>
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const App = () => {
  const [view, setView] = useState('preview');
  const [reports, setReports] = useState([]);
  const [currentReportId, setCurrentReportId] = useState(null);

  const initialData = {
    titulo: 'CONTROL DE TRANSICIÓN ESTRATÉGICA',
    subtitulo: 'HUD de Inteligencia Municipal',
    fecha: new Date().toISOString().split('T')[0],
    acreditado: 'Wilfredo Abad Mancilla Terán',
    alcalde: 'Elieser Roca Tancara',
    secretaria: 'Sec. Mun. de Administración y Finanzas',
    direccion: 'UASI',
    alerta: 'Retención de códigos fuente y opacidad en bases de datos financieras.',
    bloqueos: ['Tesorería', 'Recursos Humanos', 'Activos Fijos'],
    ley: 'Ley 1178 (SAFCO)'
  };

  const initialIndicadores = [
    { id: 1, label: 'DOCUMENTACIÓN', value: 85, color: '#3b82f6' },
    { id: 2, label: 'ACTIVOS FÍSICOS', value: 20, color: '#ef4444' },
    { id: 3, label: 'CREDENCIALES', value: 5, color: '#f59e0b' }
  ];

  const initialEstadisticas = [
    { label: 'PISLEA', val: 96, trend: 'up' },
    { label: 'PISI', val: 70, trend: 'down' },
    { label: 'PIGE', val: 10, trend: 'flat' }
  ];

  const initialRiesgos = [
    { id: 1, title: 'Opacidad de Datos', imp: 3, cat: 'Legal' },
    { id: 2, title: 'Inconsistencia Física', imp: 3, cat: 'Patrimonial' },
    { id: 3, title: 'Soberanía Digital', imp: 3, cat: 'Técnica' }
  ];

  const [data, setData] = useState(initialData);
  const [indicadores, setIndicadores] = useState(initialIndicadores);
  const [estadisticas] = useState(initialEstadisticas);
  const [riesgos] = useState(initialRiesgos);

  // PERSISTENCIA
  useEffect(() => {
    const saved = localStorage.getItem('gamea-reports');
    if (saved) setReports(JSON.parse(saved));
  }, []);

  const saveReports = (newReports) => {
    setReports(newReports);
    localStorage.setItem('gamea-reports', JSON.stringify(newReports));
  };

  const handleSave = () => {
    const newReports = [...reports];
    if (currentReportId) {
      const idx = newReports.findIndex(r => r.id === currentReportId);
      if (idx !== -1) {
        newReports[idx] = { ...data, indicadores, id: currentReportId, updatedAt: new Date().toISOString() };
      }
    } else {
      const newReport = { ...data, indicadores, id: Date.now().toString(), createdAt: new Date().toISOString() };
      newReports.push(newReport);
      setCurrentReportId(newReport.id);
    }
    saveReports(newReports);
  };

  const handleDelete = (id) => {
    saveReports(reports.filter(r => r.id !== id));
    if (currentReportId === id) {
      setData(initialData);
      setIndicadores(initialIndicadores);
      setCurrentReportId(null);
    }
  };

  const handleSelect = (r) => {
    setData(r);
    setIndicadores(r.indicadores || initialIndicadores);
    setCurrentReportId(r.id);
    setView('editor');
  };

  const downloadCSV = () => {
    const csv = "Tipo,Etiqueta,Valor,Color\nIND,NORMATIVA,90,#3b82f6\nIND,ACTIVOS,45,#ef4444";
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla.csv';
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
          newInds.push({ id: Date.now() + i, label: label.toUpperCase(), value: parseInt(val) || 0, color: color || '#3b82f6' });
        }
      });
      setIndicadores(newInds);
      setView('preview');
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 font-sans">
      <Header onViewChange={setView} currentView={view} onSave={handleSave} isSaveActive={currentReportId !== null} />

      <main className="max-w-7xl mx-auto px-8 py-10">
        {view === 'preview' && (
          <PreviewView data={data} indicadores={indicadores} estadisticas={estadisticas} riesgos={riesgos} />
        )}
        {view === 'editor' && (
          <EditorView data={data} setData={setData} indicadores={indicadores} setIndicadores={setIndicadores} onImport={handleImport} onDownloadCSV={downloadCSV} />
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
      </main>

      <Footer onPrint={() => window.print()} />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          * { background: white !important; color: black !important; border-color: #ccc !important; }
        }
        
        input[type="range"] { accent-color: #3b82f6; }
      `}</style>
    </div>
  );
};

export default App;
