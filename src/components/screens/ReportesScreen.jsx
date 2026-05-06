import React from 'react';
import { 
  PieChart, Clock, Building2, Download, Filter, FileCheck
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
          {subtitle && <p style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.1em' }}>{subtitle}</p>}
        </div>
      </div>
    )}
    <div style={{ flex: 1 }}>
      {children}
    </div>
  </motion.div>
);

const ReportesScreen = () => {
  const categories = [
    { label: 'TODOS', value: 'all' },
    { label: 'RECURSOS PROPIOS', value: 'propios' },
    { label: 'COPARTICIPACIÓN / IDH', value: 'coparticipacion' },
    { label: 'AUDITORÍA INTERNA', value: 'auditoria' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Reportes de Fiscalización</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Normativa Municipal Boliviana —— Ley 1178 (SAFCO) y Ley 482 (GAM).</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="btn btn-ghost"><Download size={14} /> DESCARGAR COMPILADO</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 12' }}>
           <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>CUMPLIMIENTO DE RELEVAMIENTO (LEY 1178)</p>
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

        <div style={{ gridColumn: 'span 4' }}>
           <Card title="RECURSOS PROPIOS">
              <span style={{ fontSize: '42px', fontWeight: '900', color: 'white' }}>Bs. 124.5M</span>
              <p style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '800', marginTop: '8px' }}>DISPONIBILIDAD: ALTA</p>
           </Card>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
           <Card title="COPARTICIPACIÓN">
              <span style={{ fontSize: '42px', fontWeight: '900', color: 'white' }}>Bs. 342.1M</span>
              <p style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', marginTop: '8px' }}>SALDO EN BANCOS</p>
           </Card>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
           <Card title="IDH (SALUD/EDU)">
              <span style={{ fontSize: '42px', fontWeight: '900', color: 'white' }}>Bs. 88.4M</span>
              <p style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: '800', marginTop: '8px' }}>CON COMPROMISO</p>
           </Card>
        </div>

        <div style={{ gridColumn: 'span 12' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Filter size={20} color="var(--accent-cyan)" />
              Historial de Auditoría y Control
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
               {categories.map((cat, i) => (
                 <button key={cat.value} className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`} style={{ height: '32px', fontSize: '10px', padding: '0 16px' }}>{cat.label}</button>
               ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: '#AUD-1178-01', title: 'Dictamen de Auditoría Interna Q4', date: '14 Oct, 2025', sec: 'Auditoría Interna', status: 'COMPLETADO', color: 'var(--accent-emerald)', type: 'AUDITORÍA' },
              { id: '#FIN-PRO-2025', title: 'Ejecución Presupuestaria Recursos Propios', date: 'Hoy, 09:45', sec: 'SMAF / Tesorería', status: 'EN REVISIÓN', color: 'var(--accent-purple)', type: 'R. PROPIOS' },
              { id: '#IDH-INV-004', title: 'Inversión Pública IDH Hospitales', date: '02 Oct, 2025', sec: 'Sec. Salud', status: 'RETRASADO', color: 'var(--accent-red)', type: 'IDH' },
              { id: '#COP-TRI-882', title: 'Transferencias Coparticipación Tributaria', date: '28 Sep, 2025', sec: 'SMAF', status: 'COMPLETADO', color: 'var(--accent-cyan)', type: 'COPART.' },
            ].map(rep => (
              <div key={rep.id} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'var(--bg-card)', border: `1px solid ${rep.color}22`, borderRadius: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: `${rep.color}11`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <FileCheck size={24} color={rep.color} />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <p style={{ fontSize: '10px', color: rep.color, fontWeight: '800' }}>{rep.id}</p>
                    <span style={{ fontSize: '8px', fontWeight: '900', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-dim)' }}>{rep.type}</span>
                   </div>
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
