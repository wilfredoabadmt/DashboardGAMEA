import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, ShieldAlert, Activity, Gavel, CheckCircle, Loader2, Terminal 
} from 'lucide-react';

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
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-red)' }}>🔒</span>
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
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</span>
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
    blocked: { bg: 'var(--accent-red)', icon: <Activity size={14} /> },
    pending: { bg: '#1e293b', icon: <Activity size={14} /> }
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

export default PanelControlScreen;
