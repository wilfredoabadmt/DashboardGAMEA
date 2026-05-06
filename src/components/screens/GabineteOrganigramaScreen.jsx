import React from 'react';
import { 
  Building2, Activity, Search, Target, Layers, ChevronRight, ChevronDown, Download, Plus 
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
          {subtitle && <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px', marginLeft: '14px', letterSpacing: '0.1em' }}>{subtitle}</div>}
        </div>
      </div>
    )}
    <div style={{ flex: 1 }}>
      {children}
    </div>
  </motion.div>
);

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
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-main)' }}>✓ Implementación de gobierno electrónico.</div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-main)' }}>✓ Ciberseguridad estatal.</div>
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

export default GabineteOrganigramaScreen;
