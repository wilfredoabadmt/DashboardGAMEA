import React, { useState, useMemo } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, 
  TrendingUp, TrendingDown, FileSearch, Building2,
  AlertOctagon, BadgeCheck, FileText, Download, BarChart3, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORGANIGRAMA } from '../../lib/constants';

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
  const [filterSec, setFilterSec] = useState('ALL');

  const dashboardData = data || {
    alcalde_electo: 'Elieser Roca Tancara',
    alcaldesa_saliente: 'Eva Copa Murga',
    indicadores: [],
    procesos: [],
    alerta: 'Cargando...'
  };

  const filteredProcesos = useMemo(() => {
    if (filterSec === 'ALL') return dashboardData.procesos;
    return dashboardData.procesos.filter(p => p.secretaria.includes(filterSec) || filterSec.includes(p.secretaria));
  }, [dashboardData.procesos, filterSec]);

  const filteredIndicadores = useMemo(() => {
    // In a real app, indicators would be linked to secretariats. 
    // Here we'll just show all if 'ALL' or a filtered set if applicable.
    return dashboardData.indicadores;
  }, [dashboardData.indicadores, filterSec]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.1)', padding: '4px 10px', borderRadius: '4px' }}>AUDITORÍA DE TRANSICIÓN 2026</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'white', marginTop: '12px', letterSpacing: '-0.02em' }}>
            {dashboardData.alcalde_electo} <span style={{ color: 'var(--text-dim)', fontWeight: '400' }}>/</span> GAMEA
          </h2>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(2, 6, 23, 0.5)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <Filter size={14} color="var(--accent-cyan)" />
              <select 
                className="custom-input" 
                style={{ border: 'none', background: 'none', padding: 0, height: 'auto', fontSize: '12px', width: '200px' }}
                value={filterSec}
                onChange={(e) => setFilterSec(e.target.value)}
              >
                <option value="ALL">VISTA GENERAL (TODOS)</option>
                {ORGANIGRAMA.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
           </div>
           <button className="btn btn-primary" style={{ background: 'white', color: '#020617' }}><FileText size={14} /> REPORTE PRENSA</button>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Progress Stats */}
        <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { label: 'PROCESOS AUDITADOS', value: filteredProcesos.length * 12, sub: '+5 hoy', icon: FileSearch, color: 'cyan' },
            { label: 'FALENCIAS DETECTADAS', value: filterSec === 'ALL' ? '428' : '24', sub: 'Críticas: 45', icon: AlertOctagon, color: 'red' },
            { label: 'VIRTUDES / LOGROS', value: filterSec === 'ALL' ? '892' : '15', sub: 'Tasa: 62%', icon: BadgeCheck, color: 'emerald' },
            { label: 'ESTADO RECEPCIÓN', value: filterSec === 'ALL' ? '64%' : '12%', sub: 'En proceso', icon: Clock, color: 'amber' },
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
          <Card title={filterSec === 'ALL' ? "RESUMEN MUNICIPAL" : `AUDITORÍA: ${filterSec}`} subtitle="Métricas de cumplimiento Ley 1178" icon={BarChart3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '12px' }}>
              {filteredIndicadores.map((ind) => (
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
          <Card title="NOTIFICACIONES" subtitle="Alertas de fiscalización" icon={AlertTriangle} accent="red">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                   <p style={{ fontSize: '12px', color: 'white', lineHeight: 1.5 }}>
                     {filterSec === 'ALL' ? dashboardData.alerta : `Auditando nodos críticos de la secretaría ${filterSec}...`}
                   </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>Observaciones de Contraloría</span>
                   </div>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>Relevamiento de activos TIC</span>
                   </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', background: 'var(--accent-red)', border: 'none' }}>
                  EXPEDIENTE DE FISCALÍA
                </button>
             </div>
          </Card>
        </div>

        {/* Processes Analysis Table */}
        <div style={{ gridColumn: 'span 12' }}>
           <Card title="DETALLE DE PROCESOS POR OFICINA" subtitle="Análisis de gestión por niveles operativos" icon={FileText} accent="cyan">
              <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>SECRETARÍA / DIRECCIÓN</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>PROCESO / TRÁMITE</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>ESTADO</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>FALENCIAS</th>
                      <th style={{ padding: '16px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '900' }}>VIRTUDES</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredProcesos.map((p, i) => (
                        <motion.tr 
                          key={p.secretaria + p.proceso}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}
                        >
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
                          <td style={{ padding: '16px', fontSize: '12px', color: 'var(--accent-red)', opacity: 0.8 }}>{p.falencias}</td>
                          <td style={{ padding: '16px', fontSize: '12px', color: 'var(--accent-emerald)', opacity: 0.8 }}>{p.virtudes}</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredProcesos.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                          No hay procesos registrados para esta selección.
                        </td>
                      </tr>
                    )}
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
