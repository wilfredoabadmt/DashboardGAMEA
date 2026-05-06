import React from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, 
  TrendingUp, TrendingDown, FileSearch, Building2,
  AlertOctagon, BadgeCheck, FileText, Download, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const Card = ({ title, subtitle, icon: Icon, children, accent = "blue" }) => {
  const accentColors = {
    blue: "var(--accent-blue)",
    cyan: "var(--accent-cyan)",
    red: "var(--accent-red)",
    emerald: "var(--accent-emerald)",
    purple: "var(--accent-purple)",
    amber: "var(--accent-amber)"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        {Icon && (
          <div style={{ 
            padding: '10px', 
            background: `${accentColors[accent]}22`, 
            borderRadius: '10px',
            border: `1px solid ${accentColors[accent]}44`
          }}>
            <Icon size={20} color={accentColors[accent]} />
          </div>
        )}
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.05em' }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
};

const PanelControlScreen = ({ data }) => {
  const dashboardData = data || {
    alcalde_electo: 'Elieser Roca Tancara',
    alcaldesa_saliente: 'Eva Copa Murga',
    institucion: 'GAMEA - El Alto',
    indicadores: [],
    procesos: [],
    alerta: 'Cargando información del sistema...'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 10px', borderRadius: '4px' }}>TRANSICIÓN 2026</span>
            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)' }}>EL ALTO, BOLIVIA</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', marginTop: '12px', letterSpacing: '-0.02em' }}>
            {dashboardData.alcalde_electo} <span style={{ color: 'var(--text-dim)', fontWeight: '400' }}>vs</span> {dashboardData.alcaldesa_saliente}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Informe de Auditoría y Relevamiento de Activos Municipales</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost"><Download size={14} /> EXPORTAR AUDITORÍA</button>
          <button className="btn btn-primary" style={{ background: 'white', color: '#020617' }}><FileText size={14} /> INFORME DE PRENSA</button>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Progress Stats */}
        <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { label: 'PROCESOS AUDITADOS', value: '1,420', sub: '+12 hoy', icon: FileSearch, color: 'cyan' },
            { label: 'FALENCIAS DETECTADAS', value: '428', sub: 'Críticas: 45', icon: AlertOctagon, color: 'red' },
            { label: 'VIRTUDES / LOGROS', value: '892', sub: 'Tasa: 62%', icon: BadgeCheck, color: 'emerald' },
            { label: 'ESTADO DE RECEPCIÓN', value: '64%', sub: 'En proceso', icon: Clock, color: 'amber' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '24px', borderLeft: `4px solid var(--accent-${stat.color})` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>{stat.label}</p>
                <stat.icon size={16} color={`var(--accent-${stat.color})`} />
              </div>
              <h4 style={{ fontSize: '28px', fontWeight: '900', color: 'white', margin: '12px 0 4px' }}>{stat.value}</h4>
              <p style={{ fontSize: '11px', fontWeight: '700', color: `var(--accent-${stat.color})` }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Indicators Area */}
        <div style={{ gridColumn: 'span 8' }}>
          <Card title="RELEVAMIENTO POR SECRETARÍA" subtitle="Métricas de cumplimiento y transparencia" icon={BarChart3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '12px' }}>
              {dashboardData.indicadores.map((ind) => (
                <div key={ind.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{ind.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: ind.color }}>{ind.value}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ind.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ height: '100%', background: ind.color, boxShadow: `0 0 10px ${ind.color}44` }} 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>FALENCIAS</p>
                      <p style={{ fontSize: '13px', color: 'var(--accent-red)', fontWeight: '700' }}>{ind.falencias || 0}</p>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>VIRTUDES</p>
                      <p style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: '700' }}>{ind.virtudes || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alerts & Critical Info */}
        <div style={{ gridColumn: 'span 4' }}>
          <Card title="ALERTAS DE TRANSICIÓN" subtitle="Riesgos detectados en tiempo real" icon={AlertTriangle} accent="red">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                   <p style={{ fontSize: '12px', color: 'white', lineHeight: 1.5 }}>
                     {dashboardData.alerta}
                   </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>Fuga de activos en SMAF</span>
                   </div>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>Inconsistencia en RRHH</span>
                   </div>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>Retraso en entrega de llaves UASI</span>
                   </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', background: 'var(--accent-red)', border: 'none' }}>
                  NOTIFICAR FISCALÍA
                </button>
             </div>
          </Card>
        </div>

        {/* Processes Analysis Table */}
        <div style={{ gridColumn: 'span 12' }}>
           <Card title="ANÁLISIS DE PROCESOS POR OFICINA" subtitle="Detalle de falencias y virtudes encontradas" icon={FileText} accent="cyan">
              <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>SECRETARÍA / DIRECCIÓN</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>PROCESO / TRÁMITE</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>ESTADO</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>FALENCIAS ENCONTRADAS</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>VIRTUDES / ACIERTOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData.procesos || []).map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Building2 size={14} color="var(--accent-cyan)" />
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{p.secretaria}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-main)' }}>{p.proceso}</td>
                        <td style={{ padding: '16px' }}>
                           <span style={{ 
                             fontSize: '9px', fontWeight: '900', padding: '4px 8px', borderRadius: '4px',
                             background: p.estado === 'Alerta' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 211, 238, 0.1)',
                             color: p.estado === 'Alerta' ? 'var(--accent-red)' : 'var(--accent-cyan)',
                             border: `1px solid ${p.estado === 'Alerta' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 211, 238, 0.2)'}`
                           }}>
                             {p.estado.toUpperCase()}
                           </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '12px', color: 'var(--accent-red)', opacity: 0.8, maxWidth: '250px' }}>{p.falencias}</td>
                        <td style={{ padding: '16px', fontSize: '12px', color: 'var(--accent-emerald)', opacity: 0.8, maxWidth: '250px' }}>{p.virtudes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default PanelControlScreen;
