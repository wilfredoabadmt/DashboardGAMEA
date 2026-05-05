import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, Clock, BarChart3, FileText, ShieldAlert,
  UserCheck, Eye, Edit3, Server, Database, Lock, Download, Check,
  Gavel, Briefcase, Users, TrendingUp, Trash2, PlusCircle,
  XCircle, Info, Scale, Activity, Building2, Save, FolderOpen, Loader2,
  Upload, FileUp, Sparkles, Plus, Minus, FileSpreadsheet, Layers,
  ChevronRight, Zap, Target, PieChart, LineChart, Globe, Terminal, Search,
  LayoutDashboard, History, Settings, LogOut, Menu, X, ArrowRight, MousePointer2,
  LockKeyhole, AlertCircle, Hand, ChevronDown, MapPin
} from 'lucide-react';
import { fetchDashboardConfig, saveDashboardConfig, fetchIndicadores, syncIndicadores } from './lib/db';


// --- DATA CONSTANTS ---
const ORGANIGRAMA = [
  { 
    name: "DESPACHO ALCALDE", 
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

const Card = ({ title, subtitle, icon: Icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass-card"
    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        {Icon && <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}><Icon size={18} color="var(--accent-blue)" /></div>}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h3>
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

// --- NEW SCREENS ---

const PanelControlScreen = () => {
  const logs = [
    { time: "10:42:01", type: "SYS", msg: "INIT DATA SYNC PROCESS...", color: "var(--accent-cyan)" },
    { time: "10:42:05", type: "SEC_FIN", msg: "Paquete de nóminas VERIFICADO", color: "var(--accent-emerald)" },
    { time: "10:45:12", type: "SEC_SAL", msg: "Actualizando inventario hospitales...", color: "var(--accent-blue)" },
    { time: "10:46:00", type: "ERR", msg: "SEC_OBRAS: Firma digital faltante en Anexo B.", color: "var(--accent-red)" },
    { time: "10:48:33", type: "SYS", msg: "Compilando reporte global...", color: "var(--text-dim)" },
    { time: "10:50:12", type: "SEC_TIC", msg: "Sincronización con Supabase: OK", color: "var(--accent-emerald)" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>Panel de Control</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px', lineHeight: 1.6 }}>
            Monitoreo estratégico y técnico del proceso de transición administrativa. Visualización de métricas críticas y flujo documental en tiempo real.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800', letterSpacing: '0.1em' }}>ESTADO DEL SISTEMA</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 10px var(--accent-emerald)' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>EN LÍNEA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 4' }}>
          <Card title="CUMPLIMIENTO GLOBAL" subtitle="PROGRESO DE TRANSICIÓN">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '10px 0' }}>
               <Gauge value={82} color="var(--accent-cyan)" size={180} />
               <div style={{ textAlign: 'center' }}>
                 <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '800', letterSpacing: '0.1em' }}>META Q1: 95%</p>
                 <p style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontWeight: '900', marginTop: '4px' }}>+5.2% VS SEMANA ANTERIOR</p>
               </div>
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <Card title="EXPEDIENTES VALIDADOS" subtitle="INTEGRIDAD DE DATOS">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '64px', fontWeight: '900', color: 'white', fontFamily: 'var(--font-display)' }}>2,458</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: '700' }}>unid.</span>
                </div>
                <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <p style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '900' }}>NIVEL DE CONFIANZA</p>
                     <CheckCircle size={12} color="var(--accent-emerald)" />
                   </div>
                   <p style={{ fontSize: '18px', color: 'white', fontWeight: '800', marginTop: '4px' }}>99.8% Nominal</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                   <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Pendientes de firma</span>
                   <span style={{ color: 'white', fontWeight: '800' }}>142</span>
                </div>
             </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <Card title="RECURSOS TIC" subtitle="RELEVAMIENTO DE ACTIVOS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <p style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>128</p>
                   <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>SISTEMAS</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>1.4k</p>
                   <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>EQUIPOS</p>
                 </div>
               </div>
               <div style={{ height: '1px', background: 'var(--border-subtle)' }} />
               <Visualizer type="bar" value={65} color="var(--accent-blue)" label="BACKUPS" />
               <Visualizer type="bar" value={40} color="var(--accent-amber)" label="LICENCIAS" />
               <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                 <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: '900', color: 'white' }}>12</p>
                    <p style={{ fontSize: '8px', color: 'var(--accent-red)', fontWeight: '800', marginTop: '2px' }}>CRÍTICOS</p>
                 </div>
                 <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: '900', color: 'white' }}>85</p>
                    <p style={{ fontSize: '8px', color: 'var(--accent-emerald)', fontWeight: '800', marginTop: '2px' }}>ESTABLES</p>
                 </div>
               </div>
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12' }}>
          <Card title="FLUJO DE DOCUMENTACIÓN CRÍTICA" subtitle="ESTADO DE TRAMITACIÓN INTER-SECRETARIAL">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', padding: '20px 40px 60px' }}>
              {[
                { label: 'UASI', status: 'done' },
                { label: 'TESORO', status: 'done' },
                { label: 'SMAF', status: 'process' },
                { label: 'DESPACHO', status: 'pending' },
                { label: 'COMISIÓN TIC', status: 'pending' }
              ].map((step, i, arr) => (
                <FlowNode key={step.label} item={step} isLast={i === arr.length - 1} />
              ))}
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 8' }}>
          <Card title="Entrega de Activos por Secretaría" subtitle="RANKING DE CUMPLIMIENTO">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px 0' }}>
              {[
                { name: 'SEC. MUN. DE ADMINISTRACIÓN Y FINANZAS', val: 95, color: 'var(--accent-emerald)', icon: Building2 },
                { name: 'SEC. MUN. DE GESTIÓN INSTITUCIONAL', val: 88, color: 'var(--accent-cyan)', icon: ShieldAlert },
                { name: 'SEC. MUN. DE SALUD', val: 76, color: 'var(--accent-blue)', icon: Activity },
                { name: 'SEC. MUN. DE INFRAESTRUCTURA PÚBLICA', val: 42, color: 'var(--accent-amber)', icon: Gavel },
                { name: 'SEC. MUN. DE SEGURIDAD CIUDADANA', val: 31, color: 'var(--accent-red)', icon: ShieldAlert },
              ].map(sec => (
                <div key={sec.name} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <sec.icon size={16} color={sec.color} />
                  </div>
                  <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-main)', fontWeight: '600' }}>{sec.name}</span>
                  <div style={{ width: '200px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${sec.val}%` }} style={{ height: '100%', background: sec.color, boxShadow: `0 0 10px ${sec.color}44` }} />
                  </div>
                  <span style={{ width: '45px', textAlign: 'right', fontSize: '13px', fontWeight: '900', color: 'white' }}>{sec.val}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <div className="glass-card" style={{ background: '#020617', border: '1px solid var(--border-subtle)', height: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>TRANSITION_MONITOR.LOG</span>
              </div>
              <Terminal size={14} color="var(--text-dim)" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '340px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} style={{ opacity: i === logs.length - 1 ? 1 : 0.6, borderLeft: `2px solid ${log.color}`, paddingLeft: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: log.color, fontWeight: '800', fontSize: '9px' }}>{log.type}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '9px' }}>{log.time}</span>
                  </div>
                  <span style={{ color: 'white', lineHeight: 1.4 }}>{log.msg}</span>
                </div>
              ))}
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '14px' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>{'>'}</span>
                <span className="animate-pulse" style={{ color: 'var(--text-dim)' }}>Sincronizando con Supabase...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const GabineteOrganigramaScreen = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>SYS.ORG.04 —— ESTRUCTURA GUBERNAMENTAL</p>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em', marginTop: '4px' }}>Gestión de Organigrama</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost"><Download size={14} /> EXPORTAR</button>
          <button className="btn btn-primary" style={{ background: 'white', color: '#020617' }}><Plus size={14} /> NUEVO NODO</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 3' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={12} /> SELECCIONAR SECRETARÍA
              </p>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>Innovación y Tecnología</p>
                  <p style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px' }}>ID: SEC-INT-001</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <ChevronDown size={14} color="var(--text-dim)" />
                </div>
              </div>
            </div>

            <Card title="INSPECCIÓN DE NODO" subtitle={<span style={{ color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '8px' }}>● ACTIVO</span>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                  <div style={{ padding: '8px', background: 'var(--accent-cyan)', borderRadius: '8px', color: '#020617' }}><Activity size={18} /></div>
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: '900', color: 'var(--accent-cyan)' }}>DIRECCIÓN GENERAL</p>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>Dir. de Transformación Digital</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>TITULAR</p>
                    <p style={{ fontSize: '13px', color: 'white', fontWeight: '600', marginTop: '4px' }}>Dra. Elena Rostova</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>PRESUPUESTO</p>
                    <p style={{ fontSize: '13px', color: 'white', fontWeight: '600', marginTop: '4px' }}>$14.2M</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>PERSONAL</p>
                    <p style={{ fontSize: '13px', color: 'white', fontWeight: '600', marginTop: '4px' }}>142 FTEs</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>NIVEL</p>
                    <p style={{ fontSize: '13px', color: 'white', fontWeight: '600', marginTop: '4px' }}>L2</p>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800', marginBottom: '12px' }}>ATRIBUCIONES CLAVE</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-main)' }}><Check size={14} color="var(--accent-cyan)" /> Implementación de gobierno electrónico.</div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-main)' }}><Check size={14} color="var(--accent-cyan)" /> Ciberseguridad estatal.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: '10px', height: '36px' }}>EDITAR NODO</button>
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: '10px', height: '36px', color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>SUSPENDER</button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div style={{ gridColumn: 'span 9' }}>
           <div className="glass-card" style={{ 
             minHeight: '700px', 
             position: 'relative', 
             overflow: 'hidden', 
             background: '#020617',
             backgroundImage: 'radial-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
             backgroundSize: '30px 30px'
           }}>
             <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>VISTA: JERÁRQUICA</span>
                <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>ZOOM: 100%</span>
             </div>
             <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost" style={{ padding: '8px', background: 'rgba(2, 6, 23, 0.8)' }}><Search size={16} /></button>
                <button className="btn btn-ghost" style={{ padding: '8px', background: 'rgba(2, 6, 23, 0.8)' }}><Target size={16} /></button>
                <button className="btn btn-ghost" style={{ padding: '8px', background: 'rgba(2, 6, 23, 0.8)' }}><Layers size={16} /></button>
             </div>

             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px' }}>
                   {/* Level 1 */}
                   <div style={{ padding: '24px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '12px', width: '320px', textAlign: 'center', position: 'relative' }}>
                      <Building2 size={24} color="white" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>SECRETARÍA</p>
                      <p style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginTop: '4px' }}>Innovación y Tecnología</p>
                      <p style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '8px' }}>TITULAR: ING. M. VALDEZ</p>
                   </div>
                   
                   {/* Connection Line */}
                   <div style={{ width: '2px', height: '60px', background: 'var(--border-subtle)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '1px', background: 'var(--border-subtle)' }} />
                   </div>

                   {/* Level 2 */}
                   <div style={{ display: 'flex', gap: '40px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
                        <div style={{ padding: '20px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '12px', width: '240px', textAlign: 'center' }}>
                          <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>SUBSECRETARÍA</p>
                          <p style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginTop: '4px' }}>Gobierno Digital</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '1px', height: '20px', background: 'var(--accent-cyan)' }} />
                        <div style={{ padding: '20px', background: 'rgba(34, 211, 238, 0.1)', border: '2px solid var(--accent-cyan)', borderRadius: '12px', width: '280px', textAlign: 'center', boxShadow: '0 0 30px rgba(34, 211, 238, 0.15)' }}>
                          <p style={{ fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: '800' }}>DIRECCIÓN GENERAL</p>
                          <p style={{ fontSize: '16px', fontWeight: '800', color: 'white', marginTop: '4px' }}>Transformación Digital</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                             <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                             <p style={{ fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: '800' }}>SELECCIONADO</p>
                          </div>
                        </div>
                        
                        <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />
                        
                        <div style={{ padding: '16px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '12px', width: '220px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '8px', color: 'var(--text-dim)', fontWeight: '800' }}>UNIDAD</p>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>Innovación Abierta</p>
                          </div>
                          <ChevronRight size={14} color="var(--text-dim)" />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
                        <div style={{ padding: '20px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '12px', width: '240px', textAlign: 'center' }}>
                          <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>SUBSECRETARÍA</p>
                          <p style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginTop: '4px' }}>Infraestructura Tecnológica</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>

             <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '24px', background: 'rgba(2, 6, 23, 0.8)', padding: '12px 24px', borderRadius: '40px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', border: '1px solid var(--border-subtle)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>NODO ESTÁNDAR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>NODO ACTIVO</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SeguimientoScreen = () => {
  const [step, setStep] = useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Monitor de Faltantes & Alertas</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px', lineHeight: 1.6 }}>
            Visualización analítica de dependencias gubernamentales con datos de transición pendientes, atrasados o bajo revisión de cumplimiento.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost"><Download size={14} /> EXPORTAR REPORTE</button>
          <button className="btn btn-primary" style={{ background: 'var(--accent-cyan)', color: '#020617' }}><Users size={14} /> NOTIFICAR A TODOS</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 4' }}>
          <Card title="ALERTAS CRÍTICAS">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '64px', fontWeight: '900', color: 'white' }}>14</span>
              <span style={{ fontSize: '16px', color: 'var(--text-dim)', fontWeight: '800' }}>direcciones</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
              <div style={{ width: '70%', height: '100%', background: 'var(--accent-red)', boxShadow: '0 0 10px var(--accent-red)' }} />
            </div>
          </Card>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <Card title="INFORMACIÓN PENDIENTE">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '64px', fontWeight: '900', color: 'white' }}>42</span>
              <span style={{ fontSize: '16px', color: 'var(--text-dim)', fontWeight: '800' }}>entidades</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }} />
            </div>
          </Card>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <Card title="EN REVISIÓN DE AUDITORES">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '64px', fontWeight: '900', color: 'white' }}>08</span>
              <span style={{ fontSize: '16px', color: 'var(--text-dim)', fontWeight: '800' }}>carpetas</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
              <div style={{ width: '25%', height: '100%', background: 'var(--accent-purple)', boxShadow: '0 0 10px var(--accent-purple)' }} />
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: 'span 12' }}>
          <Card title="Atención Requerida Inmediata" icon={AlertTriangle}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--accent-red)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={24} color="white" /></div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Secretaría de Finanzas y Planeación</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Reporte de Ejercicio Presupuestal Q3 - <span style={{ color: 'var(--accent-red)', fontWeight: '700' }}>Atraso de 5 días</span></p>
                  </div>
                  <button className="btn btn-ghost" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '10px' }}>REQUERIR</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--accent-red)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Scale size={24} color="white" /></div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Dirección Jurídica Consultiva</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Inventario de Litigios Activos - <span style={{ color: 'var(--accent-red)', fontWeight: '700' }}>Atraso de 2 días</span></p>
                  </div>
                  <button className="btn btn-ghost" style={{ borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '10px' }}>REQUERIR</button>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ReportesScreen = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Reportes y Estadísticas</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Análisis centralizado de operatividad gubernamental.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 12' }}>
           <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>CUMPLIMIENTO MENSUAL</p>
                <PieChart size={18} color="var(--accent-cyan)" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '72px', fontWeight: '900', color: 'white' }}>94.2%</span>
                <span style={{ color: 'var(--accent-emerald)', fontSize: '16px', fontWeight: '800' }}>+2.4% ↑</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--accent-cyan)' }} />
              </div>
           </div>
        </div>

        <div style={{ gridColumn: 'span 6' }}>
           <Card title="GENERADOS">
              <span style={{ fontSize: '48px', fontWeight: '900', color: 'white' }}>1,284</span>
              <p style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '800', marginTop: '8px' }}>ESTADO: ÓPTIMO</p>
           </Card>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
           <Card title="ANOMALÍAS">
              <span style={{ fontSize: '48px', fontWeight: '900', color: 'white' }}>12</span>
              <p style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: '800', marginTop: '8px' }}>CRÍTICO: 03</p>
           </Card>
        </div>

        <div style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>Historial de Reportes</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
               {['TODOS', 'ESTATALES', 'FEDERALES', 'AUDITORÍA'].map((f, i) => (
                 <button key={f} className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`} style={{ height: '32px', fontSize: '10px', padding: '0 16px' }}>{f}</button>
               ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: '#REP-932-QX', title: 'Infraestructura Vial', date: '14 Oct, 2023', sec: 'Sec. Transporte', status: 'COMPLETADO', color: 'var(--accent-emerald)' },
              { id: '#REP-881-BZ', title: 'Presupuesto Salud Q4', date: 'Hoy, 09:45', sec: 'Sec. Salud', status: 'EN PROCESO', color: 'var(--accent-purple)' },
              { id: '#REP-770-ML', title: 'Auditoría Energética', date: '02 Oct, 2023', sec: 'Sec. Energía', status: 'RETRASADO', color: 'var(--accent-red)' },
            ].map(rep => (
              <div key={rep.id} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'var(--bg-card)', border: `1px solid ${rep.color}33`, borderRadius: '16px' }}>
                <div style={{ flex: 1 }}>
                   <p style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800' }}>{rep.id}</p>
                   <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginTop: '4px' }}>{rep.title}</h4>
                   <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-dim)' }}><Clock size={14} /> {rep.date}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-dim)' }}><Building2 size={14} /> {rep.sec}</div>
                   </div>
                </div>
                <div style={{ padding: '6px 12px', borderRadius: '4px', background: `${rep.color}11`, color: rep.color, fontSize: '10px', fontWeight: '900', border: `1px solid ${rep.color}33` }}>
                  {rep.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CargaInformacionScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    secretaria: '',
    direccion: '',
    titular: '',
    gestion: '2025',
    tipoDocumento: 'General'
  });
  const [files, setFiles] = useState([]);

  const steps = [
    { id: 1, label: 'Selección', icon: Layers },
    { id: 2, label: 'Configuración', icon: Settings },
    { id: 3, label: 'Carga de Archivos', icon: FileUp },
    { id: 4, label: 'Verificación', icon: CheckCircle }
  ];

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {ORGANIGRAMA.map((sec, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setFormData({...formData, secretaria: sec.name});
                    handleNext();
                  }}
                  className="glass-card"
                  style={{ 
                    cursor: 'pointer', 
                    padding: '24px', 
                    border: formData.secretaria === sec.name ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    background: formData.secretaria === sec.name ? 'rgba(34, 211, 238, 0.05)' : 'rgba(255,255,255,0.01)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Building2 size={24} color={formData.secretaria === sec.name ? 'var(--accent-cyan)' : 'var(--text-dim)'} />
                  <h4 style={{ fontSize: '14px', fontWeight: '800', marginTop: '16px', color: 'white' }}>{sec.name}</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{sec.units.length} UNIDADES DEPENDIENTES</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        const selectedSec = ORGANIGRAMA.find(s => s.name === formData.secretaria);
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>DIRECCIÓN / UNIDAD SOLICITANTE</label>
                <select 
                  className="custom-input"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  style={{ width: '100%', background: '#020617' }}
                >
                  <option value="">Seleccione una unidad...</option>
                  {selectedSec?.units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>TITULAR RESPONSABLE</label>
                  <input 
                    type="text" 
                    className="custom-input" 
                    placeholder="Nombre completo"
                    value={formData.titular}
                    onChange={(e) => setFormData({...formData, titular: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>GESTIÓN</label>
                  <select 
                    className="custom-input"
                    value={formData.gestion}
                    onChange={(e) => setFormData({...formData, gestion: e.target.value})}
                    style={{ width: '100%', background: '#020617' }}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleBack}>ATRÁS</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={!formData.direccion || !formData.titular}>CONTINUAR</button>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ 
                border: '2px dashed var(--border-subtle)', 
                borderRadius: '16px', 
                padding: '60px 40px',
                background: 'rgba(255,255,255,0.01)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFiles = Array.from(e.dataTransfer.files);
                setFiles([...files, ...droppedFiles]);
              }}
              >
                <FileUp size={48} color="var(--accent-cyan)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>Arrastre sus archivos aquí</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginTop: '8px' }}>Formatos soportados: PDF, XLSX, DOCX (Máx 50MB)</p>
                <button className="btn btn-ghost" style={{ marginTop: '24px' }}>SELECCIONAR ARCHIVOS</button>
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: '32px', textAlign: 'left' }}>
                  <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', marginBottom: '16px' }}>ARCHIVOS PREPARADOS ({files.length})</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <FileText size={16} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '13px', color: 'white', flex: 1 }}>{f.name}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleBack}>ATRÁS</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={files.length === 0}>SUBIR Y VERIFICAR</button>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '500px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
            <div className="glass-card" style={{ padding: '48px 32px' }}>
              <div style={{ 
                width: '80px', height: '80px', background: 'var(--accent-emerald)', borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)'
              }}>
                <Check size={40} color="white" strokeWidth={3} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>¡Carga Completada!</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '12px', lineHeight: 1.6 }}>
                La información ha sido procesada y cifrada bajo estándares de Nivel 4. Se ha notificado a la Comisión de Transición.
              </p>
              
              <div style={{ margin: '32px 0', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'left', border: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-cyan)', marginBottom: '16px' }}>RESUMEN DE OPERACIÓN</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Ticket ID:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>#TRN-2026-9942</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Secretaría:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>{formData.secretaria}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Archivos:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>{files.length} cargados</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(1)}>NUEVA CARGA</button>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Carga de Información</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Subida segura de activos digitales y documentación administrativa.</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '20px' }}>
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', 
                background: step >= s.id ? 'var(--accent-cyan)' : '#020617',
                border: step >= s.id ? '2px solid var(--accent-cyan)' : '2px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: step >= s.id ? '#020617' : 'var(--text-dim)',
                transition: 'all 0.3s ease',
                boxShadow: step === s.id ? '0 0 20px rgba(34, 211, 238, 0.2)' : 'none'
              }}>
                <s.icon size={20} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '900', color: step >= s.id ? 'white' : 'var(--text-dim)', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ width: '100px', height: '2px', background: step > s.id ? 'var(--accent-cyan)' : 'var(--border-subtle)', marginTop: '24px', marginX: '-10px' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderStep()}
      </div>
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
    const headers = "id,label,value,vizType,params\n";
    const rows = data.indicadores.map(ind => {
      const paramsStr = (ind.params || []).map(p => `${p.label}:${p.done ? 1 : 0}`).join('|');
      return `${ind.id},"${ind.label}",${ind.value},${ind.vizType},"${paramsStr}"`;
    }).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
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
        // Basic CSV parser handle quotes for labels/params
        const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const id = parts[0];
        const label = parts[1]?.replace(/"/g, '') || 'Sin Etiqueta';
        const value = parseInt(parts[2]) || 0;
        const vizType = parts[3]?.trim() || 'gauge';
        const paramsRaw = parts[4]?.replace(/"/g, '') || '';
        
        const params = paramsRaw ? paramsRaw.split('|').map((p, i) => {
          const [pLabel, pStatus] = p.split(':');
          return { id: Date.now() + i, label: pLabel, done: pStatus === '1' };
        }) : [];

        return {
          id: id || Date.now() + Math.random(),
          label,
          value: params.length > 0 ? calculateCompliance(params) : value,
          vizType,
          color: '#3b82f6',
          params
        };
      });
      setData({ ...data, indicadores: newMetrics });
      alert('Datos con parámetros cargados exitosamente.');
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [config, indicadores] = await Promise.all([
          fetchDashboardConfig(),
          fetchIndicadores()
        ]);
        
        if (config || indicadores.length > 0) {
          setData(prev => ({
            ...prev,
            ...(config || {}),
            indicadores: indicadores.length > 0 ? indicadores.map(ind => ({
              ...ind,
              vizType: ind.viz_type // Map snake_case from DB to camelCase
            })) : prev.indicadores
          }));
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await Promise.all([
        saveDashboardConfig(data),
        syncIndicadores(data.indicadores)
      ]);
      
      const newReport = { ...data, id: Date.now().toString(), created: new Date().toISOString() };
      const updated = [...reports, newReport];
      setReports(updated);
      localStorage.setItem('gamea-reports-v5', JSON.stringify(updated));
      alert('¡Dashboard sincronizado con Supabase exitosamente!');
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      alert('Error al guardar en la base de datos.');
    }
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
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '40px', height: '40px', background: '#fff',
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255,255,255,0.1)', flexShrink: 0
          }}>
            <div style={{ width: '20px', height: '20px', background: '#020617', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div style={{ overflow: 'hidden' }}>
              <h1 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SISTEMA ALPHA</h1>
              <p style={{ fontSize: '8px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>Admin Gubernamental</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, marginTop: '32px' }}>
          <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>PANEL DE CONTROL</span>}
          </button>
          <button onClick={() => { setActiveTab('gabinete'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'gabinete' ? 'active' : ''}`}>
            <Users size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>GABINETE</span>}
          </button>
          <button onClick={() => { setActiveTab('seguimiento'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'seguimiento' ? 'active' : ''}`}>
            <Activity size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>SEGUIMIENTO</span>}
          </button>
          <button onClick={() => { setActiveTab('reportes'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}>
            <FileText size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>REPORTES</span>}
          </button>
          <button onClick={() => { setActiveTab('carga'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'carga' ? 'active' : ''}`}>
            <Upload size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>CARGA</span>}
          </button>
          <button onClick={() => { setActiveTab('terminal'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'terminal' ? 'active' : ''}`}>
            <Terminal size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>TERMINAL</span>}
          </button>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={() => alert('Cerrando sesión...')} className="nav-item" style={{ color: 'var(--text-dim)' }}>
            <LogOut size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>CERRAR SESIÓN</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* HEADER */}
        <header className="dashboard-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
            <button 
              className="show-mobile btn btn-ghost" 
              style={{ padding: '8px' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                placeholder="Buscar expedientes..." 
                className="custom-input" 
                style={{ paddingLeft: '48px', height: '40px', fontSize: '12px' }}
              />
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                TRANSICIÓN ESTATAL
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-dim)' }}>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', border: '2px solid #020617' }} />
                <AlertCircle size={20} />
              </motion.div>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer' }}><Settings size={20} /></motion.div>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer' }}><Info size={20} /></motion.div>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/100?u=wilfredo" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-viewport">
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <PanelControlScreen />
              </motion.div>
            )}

            {activeTab === 'gabinete' && (
              <motion.div key="gabinete" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <GabineteOrganigramaScreen />
              </motion.div>
            )}

            {activeTab === 'seguimiento' && (
              <motion.div key="seguimiento" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SeguimientoScreen />
              </motion.div>
            )}

            {activeTab === 'reportes' && (
              <motion.div key="reportes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ReportesScreen />
              </motion.div>
            )}

            {activeTab === 'carga' && (
              <motion.div key="carga" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CargaInformacionScreen />
              </motion.div>
            )}

            {activeTab === 'terminal' && (
               <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <Terminal size={64} style={{ margin: '0 auto 24px', opacity: 0.1 }} />
                  <p style={{ fontSize: '18px', fontWeight: '700' }}>Acceso Restringido a Terminal</p>
                  <p style={{ marginTop: '8px' }}>Se requieren credenciales de Nivel 5 para ejecución de comandos.</p>
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
