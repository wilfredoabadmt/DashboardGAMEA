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

// --- DATA CONSTANTS ---
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
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6', vizType: 'gauge', params: [
        { id: 101, label: 'Manuales de Funciones', done: true },
        { id: 102, label: 'Reglamentos Internos', done: true },
        { id: 103, label: 'POA Actualizado', done: false }
      ]},
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4', vizType: 'bar', params: [
        { id: 201, label: 'Activos Fijos Registrados', done: true },
        { id: 202, label: 'Estado de Servidores', done: false }
      ]},
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 45, status: 'warning', color: '#f59e0b', vizType: 'gauge', params: [
        { id: 301, label: 'Repositorios Git', done: true },
        { id: 302, label: 'Contraseñas de Servidor', done: false },
        { id: 303, label: 'API Keys de Producción', done: false }
      ]},
      { id: 4, label: 'Sistemas Desarrollados', value: 92, status: 'good', color: '#8b5cf6', vizType: 'trend', params: [
        { id: 401, label: 'Módulo Administrativo', done: true },
        { id: 402, label: 'Módulo de Trámites', done: true }
      ]}
    ],
    solicitudes: [
      { unidad: 'UASI', notas: 3, estado: 'Respuesta Parcial', color: 'emerald', icon: 'check' },
      { unidad: 'TESORO', notas: 2, estado: 'En Revisión', color: 'blue', icon: 'clock' },
      { unidad: 'RRHH', notas: 4, estado: 'Pendiente', color: 'dim', icon: 'minus' },
      { unidad: 'ACTIVOS FIJOS', notas: 1, estado: 'Completado', color: 'emerald', icon: 'check' }
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
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6', vizType: 'gauge', params: [
        { id: 101, label: 'Manuales de Funciones', done: true },
        { id: 102, label: 'Reglamentos Internos', done: true },
        { id: 103, label: 'POA Actualizado', done: false }
      ]},
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4', vizType: 'bar', params: [
        { id: 201, label: 'Activos Fijos Registrados', done: true },
        { id: 202, label: 'Estado de Servidores', done: false }
      ]},
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 0, status: 'locked', color: '#ef4444', vizType: 'gauge', params: [
        { id: 301, label: 'Repositorios Git', done: false },
        { id: 302, label: 'Contraseñas de Servidor', done: false }
      ]},
      { id: 4, label: 'Sistemas Desarrollados', value: 10, status: 'locked', color: '#ef4444', vizType: 'trend', params: [
        { id: 401, label: 'Core Banking', done: false },
        { id: 402, label: 'Módulo de Pagos', done: false }
      ]}
    ],
    solicitudes: [
      { unidad: 'UASI', notas: 3, estado: 'Respuesta Parcial (DAGA/127)', color: 'emerald', icon: 'check' },
      { unidad: 'TESORO', notas: 2, estado: 'Negada Directa (Director)', color: 'red', icon: 'x' },
      { unidad: 'RRHH', notas: 2, estado: 'Negada (Firma Sr. Yapuchura)', color: 'red', icon: 'x' },
      { unidad: 'ACTIVOS FIJOS', notas: 5, estado: 'Puntos 5/20 Bloqueados', color: 'amber', icon: 'alert' }
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
  isLive: false,
  ...SCENARIOS.CRISIS
};

// --- HELPER COMPONENTS ---

const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', inset: 0, zIndex: 1000, 
        background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '600px', border: '1px solid var(--accent-blue)', boxShadow: '0 0 50px rgba(59, 130, 246, 0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Detalles de Inteligencia</p>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'white', marginTop: '4px' }}>{item.label}</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '8px' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(item.params || []).map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ 
                width: '24px', height: '24px', borderRadius: '6px', 
                background: p.done ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
              }}>
                {p.done && <Check size={14} strokeWidth={3} />}
              </div>
              <span style={{ fontSize: '14px', color: p.done ? 'white' : 'var(--text-dim)', fontWeight: p.done ? '600' : '400', flex: 1 }}>{p.label}</span>
              <span style={{ fontSize: '10px', fontWeight: '900', color: p.done ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                {p.done ? 'COMPLETADO' : 'PENDIENTE'}
              </span>
            </div>
          ))}
          {(!item.params || item.params.length === 0) && (
             <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
               No se han definido parámetros para esta métrica.
             </div>
          )}
        </div>

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)' }}>CUMPLIMIENTO TOTAL</p>
            <p style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>{item.value}%</p>
          </div>
          <button onClick={onClose} className="btn btn-primary">Entendido</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
          {subtitle && <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px', marginLeft: '14px', letterSpacing: '0.1em' }}>{subtitle}</p>}
        </div>
      </div>
    )}
    <div style={{ flex: 1 }}>
      {children}
    </div>
  </motion.div>
);

const Gauge = ({ value, color, status, size = 120 }) => {
  const isLocked = status === 'locked';
  const displayColor = isLocked ? 'var(--accent-red)' : color;
  
  return (
    <div className="gauge-container">
      <div style={{ position: 'relative', width: size, height: size }}>
        {isLocked && (
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ position: 'absolute', inset: 0, background: 'var(--accent-red)', filter: 'blur(20px)', borderRadius: '50%' }}
          />
        )}
        
        <svg className="gauge-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="transparent"
            stroke={displayColor}
            strokeWidth="8"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * (isLocked ? 100 : value)) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${displayColor})` }}
          />
        </svg>
        
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {isLocked ? (
            <LockKeyhole size={24} color="var(--accent-red)" />
          ) : (
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>{value}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Visualizer = ({ type, value, color, label }) => {
  const barWidth = `${value}%`;
  
  if (type === 'bar') {
    return (
      <div style={{ width: '100%', padding: '10px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PROGRESO</span>
          <span style={{ fontSize: '10px', fontWeight: '900', color: color }}>{value}%</span>
        </div>
        <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            style={{ height: '100%', background: color, boxShadow: `0 0 10px ${color}44` }}
          />
        </div>
      </div>
    );
  }

  if (type === 'trend') {
    return (
      <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        {[...Array(12)].map((_, i) => {
          const h = Math.max(10, value - (11-i) * 3 + Math.random() * 10);
          return (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(100, h)}%` }}
              style={{ flex: 1, background: i === 11 ? color : `${color}33`, borderRadius: '2px' }}
            />
          );
        })}
      </div>
    );
  }

  return <Gauge value={value} color={color} status={value === 0 ? 'locked' : ''} size={100} />;
};

const FlowNode = ({ item, isLast }) => {
  const statusStyles = {
    done: { bg: 'var(--accent-emerald)', icon: <CheckCircle size={14} /> },
    process: { bg: 'var(--accent-blue)', icon: <Loader2 size={14} className="animate-spin" /> },
    blocked: { bg: 'var(--accent-red)', icon: <XCircle size={14} /> },
    pending: { bg: '#1e293b', icon: <Clock size={14} /> }
  };

  const style = statusStyles[item.status];

  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', background: style.bg, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #020617',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10
        }}>
          {style.icon}
        </div>
        <div style={{ position: 'absolute', top: '48px', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</span>
          {item.sub && <span style={{ fontSize: '7px', fontWeight: '900', color: 'var(--accent-red)', textTransform: 'uppercase', marginTop: '2px' }} className="animate-pulse">{item.sub}</span>}
        </div>
      </div>
      {!isLast && (
        <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.05)', margin: '0 8px', position: 'relative', minWidth: '20px' }}>
          {item.status === 'done' && <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-emerald)' }} />}
          {item.status === 'process' && (
            <motion.div 
              animate={{ left: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: 'linear-gradient(90deg, transparent, var(--accent-blue), transparent)' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [reports, setReports] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);

  const calculateCompliance = (params = []) => {
    if (params.length === 0) return 0;
    const done = params.filter(p => p.done).length;
    return Math.round((done / params.length) * 100);
  };
  const getDynamicAlert = () => {
    const lowMetrics = data.indicadores.filter(ind => ind.value < 50);
    if (lowMetrics.length > 0) {
      return `ALERTA CRÍTICA: La ${data.secretaria} (${data.direccion}) presenta deficiencias en: ${lowMetrics.map(m => m.label).join(', ')}. Riesgo administrativo detectado.`;
    }
    return `SITUACIÓN ESTABLE: ${data.secretaria} operando bajo parámetros normales. Monitoreo preventivo activo.`;
  };

  const downloadCSVTemplate = () => {
    const headers = "id,label,value,vizType\n";
    const rows = data.indicadores.map(ind => `${ind.id},${ind.label},${ind.value},${ind.vizType}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'plantilla_gamea_metrics.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').slice(1);
      const newMetrics = lines.filter(l => l.trim()).map(line => {
        const [id, label, value, vizType] = line.split(',');
        return {
          id: id || Date.now() + Math.random(),
          label: label.replace(/"/g, '').trim(),
          value: parseInt(value) || 0,
          vizType: vizType?.trim() || 'gauge',
          color: '#3b82f6',
          params: []
        };
      });
      setData({ ...data, indicadores: newMetrics });
      alert('Datos cargados exitosamente desde CSV.');
    };
    reader.readAsText(file);
  };

  useEffect(() => {

  const handleSave = () => {
    const newReport = { ...data, id: Date.now().toString(), created: new Date().toISOString() };
    const updated = [...reports, newReport];
    setReports(updated);
    localStorage.setItem('gamea-reports-v5', JSON.stringify(updated));
    alert('Informe guardado en el archivo local.');
  };

  const handleAddMetric = () => {
    if (!newMetricLabel.trim()) return;
    const newMetric = {
      id: Date.now(),
      label: newMetricLabel,
      value: 0,
      status: 'warning',
      color: '#3b82f6',
      vizType: 'gauge',
      params: []
    };
    setData({
      ...data,
      indicadores: [...data.indicadores, newMetric]
    });
    setNewMetricLabel('');
  };

  const handleRemoveMetric = (id) => {
    setData({
      ...data,
      indicadores: data.indicadores.filter(ind => ind.id !== id)
    });
  };

  return (
    <div className="app-container">
      
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'active' : ''} no-print`}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--glow-blue)', flexShrink: 0
            }}>
              <ShieldAlert size={20} color="white" />
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div style={{ overflow: 'hidden' }}>
                <h1 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>GAMEA HUD</h1>
                <p style={{ fontSize: '8px', color: 'var(--accent-blue)', fontWeight: '800', textTransform: 'uppercase' }}>Strategic Unit</p>
              </div>
            )}
          </div>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Dashboard</span>}
          </button>
          <button onClick={() => { setActiveTab('editor'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'editor' ? 'active' : ''}`}>
            <Settings size={20} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Control</span>}
          </button>
          <button onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}>
            <History size={20} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Archivos</span>}
          </button>

          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div style={{ marginTop: '40px', padding: '0 16px' }}>
              <p style={{ fontSize: '9px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Escenarios</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(SCENARIOS).map(([key, sc]) => (
                  <button 
                    key={key}
                    onClick={() => setData({ ...data, ...sc })}
                    className="btn btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '12px', fontSize: '10px' }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: key === 'CRISIS' ? 'var(--accent-red)' : 'var(--accent-emerald)' }} />
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }} className="hidden-mobile">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="nav-item">
            {sidebarCollapsed ? <Plus size={20} /> : <Minus size={20} />}
            {!sidebarCollapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* HEADER */}
        <header className="dashboard-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button 
              className="show-mobile btn btn-ghost" 
              style={{ padding: '8px' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden-mobile" style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <LayoutDashboard size={24} color="var(--accent-blue)" />
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(16px, 4vw, 24px)', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{data.titulo}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Building2 size={12} color="var(--accent-blue)" />
                <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {data.secretaria} <span className="hidden-mobile" style={{ color: 'rgba(255,255,255,0.1)', margin: '0 4px' }}>|</span> <span className="hidden-mobile">{data.direccion}</span>
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => window.print()} className="btn btn-ghost hidden-mobile">
              <Download size={16} /> <span className="hidden-tablet">Exportar PDF</span>
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <Save size={16} /> <span className="hidden-mobile">Guardar</span>
            </button>
          </div>
        </header>

        <div className="dashboard-viewport">
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
              >
                {/* Top Row: Indicators */}
                <div className="dashboard-grid">
                  {data.indicadores.map(k => (
                    <div key={k.id} style={{ gridColumn: 'span 3' }}>
                      <Card title={k.label}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                          <Visualizer type={k.vizType} value={k.value} color={k.color} label={k.label} />
                          <p style={{ marginTop: '16px', fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textAlign: 'center' }}>{k.label.toUpperCase()}</p>
                          <button 
                            onClick={() => setSelectedDetail(k)}
                            className="btn btn-ghost" 
                            style={{ marginTop: '16px', padding: '6px 12px', fontSize: '9px', width: '100%', justifyContent: 'center' }}
                          >
                            VER DETALLES
                          </button>
                        </div>
                      </Card>
                    </div>
                  ))}

                  <div style={{ gridColumn: 'span 12' }}>
                    <Card title="Recopilación de Inteligencia por Unidades" icon={Activity}>
                       <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Unidad / Secretaría</th>
                              <th>Estado de Transición</th>
                              <th>Notas Enviadas</th>
                              <th>Cumplimiento</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ORGANIGRAMA.map((sec, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: '700' }}>{sec.name}</td>
                                <td>
                                  <div className={`status-pill ${idx % 3 === 0 ? 'status-good' : 'status-warning'}`}>
                                    {idx % 3 === 0 ? 'OPTIMO' : 'EN PROCESO'}
                                  </div>
                                </td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{Math.floor(Math.random() * 10) + 1}</td>
                                <td style={{ width: '200px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                      <div style={{ width: `${80 - idx * 5}%`, height: '100%', background: 'var(--accent-blue)', borderRadius: '10px' }} />
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: '900' }}>{80 - idx * 5}%</span>
                                  </div>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-ghost" 
                                    style={{ padding: '6px 12px', fontSize: '10px' }}
                                    onClick={() => setSelectedDetail({
                                      label: sec.name,
                                      value: 80 - idx * 5,
                                      params: [
                                        { id: 1, label: 'Documentación Técnica', done: idx % 2 === 0 },
                                        { id: 2, label: 'Inventario Físico', done: idx % 3 === 0 },
                                        { id: 3, label: 'Certificación Legal', done: true }
                                      ]
                                    })}
                                  >
                                    DETALLES
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                       </div>
                    </Card>
                  </div>
                </div>

                {/* Alert Intelligence */}
                <motion.div 
                  className="glass-card animate-pulse-soft"
                  style={{ 
                    padding: '24px', 
                    background: data.indicadores.some(i => i.value < 50) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                    border: `1px solid ${data.indicadores.some(i => i.value < 50) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                    display: 'flex', alignItems: 'center', gap: '24px', flexDirection: 'row'
                  }}
                >
                  <div style={{ 
                    width: '56px', height: '56px', 
                    background: data.indicadores.some(i => i.value < 50) ? 'var(--accent-red)' : 'var(--accent-emerald)', 
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    boxShadow: data.indicadores.some(i => i.value < 50) ? 'var(--glow-red)' : '0 0 20px rgba(16, 185, 129, 0.2)', 
                    flexShrink: 0
                  }}>
                    {data.indicadores.some(i => i.value < 50) ? <AlertTriangle size={28} /> : <CheckCircle size={28} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: data.indicadores.some(i => i.value < 50) ? 'var(--accent-red)' : 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Alert Intelligence</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: 'white', fontStyle: 'italic', marginTop: '4px' }}>"{getDynamicAlert()}"</p>
                  </div>
                </motion.div>

              </motion.div>
            )}

            {activeTab === 'editor' && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="dashboard-grid"
              >
                <div style={{ gridColumn: 'span 4' }}>
                  <Card title="Entidad Gubernamental">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Building2 size={12} color="var(--accent-blue)" /> Secretaría
                        </label>
                        <select 
                          className="custom-select"
                          value={data.secretaria}
                          onChange={e => {
                            const sec = ORGANIGRAMA.find(s => s.name === e.target.value);
                            setData({ 
                              ...data, 
                              secretaria: e.target.value,
                              direccion: sec ? sec.units[0] : '' 
                            });
                          }}
                        >
                          {ORGANIGRAMA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <MapPin size={12} color="var(--accent-blue)" /> Dirección / Unidad
                        </label>
                        <select 
                          className="custom-select"
                          value={data.direccion}
                          onChange={e => setData({ ...data, direccion: e.target.value })}
                        >
                          {ORGANIGRAMA.find(s => s.name === data.secretaria)?.units.map(u => (
                            <option key={u} value={u}>{u}</option>
                          )) || <option value={data.direccion}>{data.direccion}</option>}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <UserCheck size={12} color="var(--accent-blue)" /> Personal Acreditado
                        </label>
                        <input 
                          className="custom-input"
                          placeholder="Nombre del responsable..."
                          value={data.acreditado}
                          onChange={e => setData({ ...data, acreditado: e.target.value })}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                <div style={{ gridColumn: 'span 8' }}>
                  <Card title="Calibración y Visualización de Métricas">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                      {data.indicadores.map(k => (
                        <div key={k.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                           <button 
                             onClick={() => handleRemoveMetric(k.id)}
                             style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', opacity: 0.5 }}
                           >
                             <Trash2 size={14} />
                           </button>
                           <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '16px', paddingRight: '20px' }}>{k.label}</p>
                           
                           <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                              {['gauge', 'bar', 'trend'].map(vtype => (
                                <button 
                                  key={vtype}
                                  onClick={() => setData({
                                    ...data,
                                    indicadores: data.indicadores.map(x => x.id === k.id ? { ...x, vizType: vtype } : x)
                                  })}
                                  style={{ 
                                    padding: '4px 8px', fontSize: '9px', borderRadius: '4px', border: '1px solid var(--border-subtle)', cursor: 'pointer',
                                    background: k.vizType === vtype ? 'var(--accent-blue)' : 'transparent',
                                    color: k.vizType === vtype ? 'white' : 'var(--text-dim)'
                                  }}
                                >
                                  {vtype.toUpperCase()}
                                </button>
                              ))}
                           </div>

                           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                             <input 
                               type="range" 
                               style={{ flex: 1 }}
                               value={k.value}
                               onChange={e => setData({
                                 ...data,
                                 indicadores: data.indicadores.map(x => x.id === k.id ? { ...x, value: parseInt(e.target.value) } : x)
                               })}
                             />
                             <span style={{ fontSize: '18px', fontWeight: '900', width: '40px' }}>{k.value}%</span>
                           </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px dotted var(--border-subtle)', alignItems: 'center' }}>
                      <input 
                        className="custom-input"
                        style={{ flex: 1, minWidth: '200px' }}
                        placeholder="Nombre de la nueva métrica..."
                        value={newMetricLabel}
                        onChange={e => setNewMetricLabel(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddMetric()}
                      />
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={handleAddMetric} className="btn btn-primary">
                          <Plus size={16} /> Añadir Métrica
                        </button>
                        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
                        <button 
                          onClick={() => setData({...data, isLive: !data.isLive})}
                          className={`btn ${data.isLive ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ background: data.isLive ? 'var(--accent-emerald)' : '' }}
                        >
                          <Zap size={16} /> {data.isLive ? 'SIMULACIÓN ACTIVA' : 'MODO SIMULACIÓN'}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <button onClick={downloadCSVTemplate} className="btn btn-ghost" style={{ flex: 1 }}>
                        <Download size={16} /> Descargar Plantilla CSV
                      </button>
                      <label className="btn btn-ghost" style={{ flex: 1, cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}>
                        <Upload size={16} /> Cargar Datos (CSV)
                        <input type="file" hidden accept=".csv" onChange={handleCSVUpload} />
                      </label>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}
              >
                {reports.map(r => (
                  <Card key={r.id} title={new Date(r.created).toLocaleDateString()}>
                    <h4 style={{ fontSize: '16px', color: 'white', marginBottom: '8px' }}>{r.titulo}</h4>
                    <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '20px' }}>{r.direccion}</p>
                    <button 
                      onClick={() => { setData(r); setActiveTab('dashboard'); }}
                      className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Cargar HUD
                    </button>
                  </Card>
                ))}
                {reports.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px', color: 'var(--text-dim)' }}>
                    <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                    <p>No hay informes archivados todavía.</p>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER LABEL */}
      <div className="hidden-mobile" style={{ position: 'fixed', bottom: '24px', right: '32px', zIndex: 100, pointerEvents: 'none' }}>
        <p style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          GAMEA STRATEGIC HUD v2.7.0 // SECURITY LEVEL 4
        </p>
      </div>

      <AnimatePresence>
        {selectedDetail && (
          <DetailModal 
            item={selectedDetail} 
            onClose={() => setSelectedDetail(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
