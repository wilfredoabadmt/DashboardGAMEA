import React from 'react';
import { 
  PieChart, Clock, Building2 
} from 'lucide-react';
import { motion } from 'framer-motion';

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

export default ReportesScreen;
