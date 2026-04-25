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
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6' },
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4' },
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 45, status: 'warning', color: '#f59e0b' }
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
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6' },
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4' },
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 0, status: 'locked', color: '#ef4444' }
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
  ...SCENARIOS.CRISIS
};

// --- HELPER COMPONENTS ---

const Card = ({ children, title, subtitle, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-card ${className}`}
  >
    {(title || subtitle) && (
      <div style={{ marginBottom: '24px' }}>
        {title && <h3 style={{ fontSize: '12px', color: 'white', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', background: 'var(--accent-blue)', borderRadius: '50%', boxShadow: 'var(--glow-blue)' }} />
          {title}
        </h3>}
        {subtitle && <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px', marginLeft: '14px', letterSpacing: '0.1em' }}>{subtitle}</p>}
      </div>
    )}
    {children}
  </motion.div>
);

const Gauge = ({ value, label, color, status }) => {
  const isLocked = status === 'locked';
  const displayColor = isLocked ? 'var(--accent-red)' : color;
  
  return (
    <div className="gauge-container">
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {isLocked && (
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ position: 'absolute', inset: 0, background: 'var(--accent-red)', filter: 'blur(20px)', borderRadius: '50%' }}
          />
        )}
        
        <svg className="gauge-svg" viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
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
            <>
              <LockKeyhole size={24} color="var(--accent-red)" />
              <span style={{ fontSize: '8px', fontWeight: '900', color: 'var(--accent-red)', textTransform: 'uppercase', marginTop: '2px' }}>Locked</span>
            </>
          ) : (
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>{value}%</span>
          )}
        </div>
      </div>
      <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
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
          display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '4px solid #020617',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10, justifyContent: 'center'
        }}>
          {style.icon}
        </div>
        <div style={{ position: 'absolute', top: '48px', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</span>
          {item.sub && <span style={{ fontSize: '7px', fontWeight: '900', color: 'var(--accent-red)', textTransform: 'uppercase', marginTop: '2px' }} className="animate-pulse">{item.sub}</span>}
        </div>
      </div>
      {!isLast && (
        <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.05)', margin: '0 8px', position: 'relative' }}>
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
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('gamea-reports-v5');
    if (saved) setReports(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const newReport = { ...data, id: Date.now().toString(), created: new Date().toISOString() };
    const updated = [...reports, newReport];
    setReports(updated);
    localStorage.setItem('gamea-reports-v5', JSON.stringify(updated));
    alert('Informe guardado en el archivo local.');
  };

  return (
    <div className="app-container">
      
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} no-print`}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow-blue)', flexShrink: 0
          }}>
            <ShieldAlert size={20} color="white" />
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <h1 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>GAMEA HUD</h1>
              <p style={{ fontSize: '8px', color: 'var(--accent-blue)', fontWeight: '800', textTransform: 'uppercase' }}>Strategic Unit</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav" style={{ flex: 1 }}>
          <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard className="nav-icon" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
          <button onClick={() => setActiveTab('editor')} className={`nav-item ${activeTab === 'editor' ? 'active' : ''}`}>
            <Settings className="nav-icon" />
            {!sidebarCollapsed && <span>Control</span>}
          </button>
          <button onClick={() => setActiveTab('history')} className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}>
            <History className="nav-icon" />
            {!sidebarCollapsed && <span>Archivos</span>}
          </button>

          {!sidebarCollapsed && (
            <div style={{ marginTop: '40px', padding: '0 16px' }}>
              <p style={{ fontSize: '9px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Escenarios</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(SCENARIOS).map(([key, sc]) => (
                  <button 
                    key={key}
                    onClick={() => setData({ ...data, ...sc })}
                    style={{ 
                      padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                      borderRadius: '12px', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '700',
                      textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: key === 'CRISIS' ? 'var(--accent-red)' : 'var(--accent-emerald)' }} />
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="nav-item">
            {sidebarCollapsed ? <Plus size={20} /> : <Minus size={20} />}
            {!sidebarCollapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* HEADER */}
        <header style={{ 
          position: 'sticky', top: 0, zIndex: 40, background: 'rgba(2, 6, 23, 0.8)', 
          backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-subtle)',
          padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{data.titulo}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <Building2 size={14} color="var(--accent-blue)" />
              <p style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {data.secretaria} / {data.direccion}
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} /> Guardar Informe
          </button>
        </header>

        <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
              >
                {/* Top Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
                  <Card title="KPIs de Relevamiento" className="xl-col-span-5" style={{ gridColumn: 'span 5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px 0' }}>
                      {data.indicadores.map(ind => (
                        <Gauge key={ind.id} {...ind} />
                      ))}
                    </div>
                  </Card>

                  <Card title="Estado de Unidades" className="xl-col-span-7" style={{ gridColumn: 'span 7' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Unidad</th>
                          <th>Docs</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.solicitudes.map((s, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: '800', color: 'white', textTransform: 'uppercase' }}>{s.unidad}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', color: 'var(--accent-blue)', opacity: 0.6 }}>
                                <FileText size={14} />
                                <Database size={14} />
                                <Server size={14} />
                              </div>
                            </td>
                            <td>
                              <span className={`status-pill status-${s.color === 'emerald' ? 'good' : s.color === 'amber' ? 'warning' : s.color === 'red' ? 'locked' : 'warning'}`}>
                                {s.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>

                {/* Bottom Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
                  <Card title="Flujo de Transición" style={{ gridColumn: 'span 8', padding: '60px 40px' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                      {data.flujo.map((step, i) => (
                        <FlowNode key={i} item={step} isLast={i === data.flujo.length - 1} />
                      ))}
                    </div>
                  </Card>

                  <Card title="Marco Legal" style={{ gridColumn: 'span 4' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '8px' }}>Ley de Base</p>
                        <p style={{ fontSize: '16px', fontWeight: '800', color: 'white' }}>{data.ley}</p>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Protocolos de transparencia y control interno activos bajo normativa vigente para la mitigación de riesgos administrativos durante la transición.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Alert Intelligence */}
                <motion.div 
                  style={{ 
                    padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '24px'
                  }}
                >
                  <div style={{ 
                    width: '56px', height: '56px', background: 'var(--accent-red)', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    boxShadow: 'var(--glow-red)', flexShrink: 0
                  }}>
                    <AlertTriangle size={28} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Alert Intelligence</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: 'white', fontStyle: 'italic', marginTop: '4px' }}>"{data.alerta}"</p>
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
                style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}
              >
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <Card title="Entidad Gubernamental">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Secretaría</label>
                        <select 
                          className="custom-select"
                          value={data.secretaria}
                          onChange={e => setData({ ...data, secretaria: e.target.value })}
                        >
                          {ORGANIGRAMA.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Dirección</label>
                        <input 
                          className="custom-input"
                          value={data.direccion}
                          onChange={e => setData({ ...data, direccion: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Acreditado</label>
                        <input 
                          className="custom-input"
                          value={data.acreditado}
                          onChange={e => setData({ ...data, acreditado: e.target.value })}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                <div style={{ gridColumn: 'span 8' }}>
                  <Card title="Calibración de Métricas">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {data.indicadores.map(k => (
                        <div key={k.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                           <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-blue)', textTransform: 'uppercase', marginBottom: '16px' }}>{k.label}</p>
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
      <div style={{ position: 'fixed', bottom: '24px', right: '32px', zIndex: 100, pointerEvents: 'none' }}>
        <p style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          GAMEA STRATEGIC HUD v2.7.0 // SECURITY LEVEL 4
        </p>
      </div>

    </div>
  );
};

export default App;
