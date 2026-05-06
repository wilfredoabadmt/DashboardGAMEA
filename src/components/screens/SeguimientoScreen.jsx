import React from 'react';
import { 
  AlertTriangle, Building2, Scale, Users, Download 
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

const SeguimientoScreen = () => {
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

export default SeguimientoScreen;
