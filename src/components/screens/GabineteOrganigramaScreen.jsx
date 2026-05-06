import React, { useState } from 'react';
import { 
  Building2, Activity, Search, Target, Layers, ChevronRight, ChevronDown, Download, Plus, Map, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORGANIGRAMA } from '../../lib/constants';

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
          {subtitle && <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.1em' }}>{subtitle}</div>}
        </div>
      </div>
    )}
    <div style={{ flex: 1 }}>
      {children}
    </div>
  </motion.div>
);

const GabineteOrganigramaScreen = () => {
  const [selectedSecId, setSelectedSecId] = useState(ORGANIGRAMA[0].id);
  const [selectedNode, setSelectedNode] = useState(null);

  const selectedSec = ORGANIGRAMA.find(s => s.id === selectedSecId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>SYS.ORG.04 —— GESTIÓN JERÁRQUICA GAMEA</p>
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em', marginTop: '4px' }}>Estructura Institucional</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-ghost"><Map size={14} /> VISTA MAPA</button>
          <button className="btn btn-primary" style={{ background: 'white', color: '#020617' }}><Plus size={14} /> NUEVA UNIDAD</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 3' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <p className="section-label"><Building2 size={12} /> SECRETARÍA MUNICIPAL</p>
              <select 
                className="custom-input" 
                style={{ marginTop: '12px' }}
                value={selectedSecId}
                onChange={(e) => setSelectedSecId(e.target.value)}
              >
                {ORGANIGRAMA.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>

            <Card title="DETALLE DE SELECCIÓN" subtitle={<span style={{ color: 'var(--accent-cyan)', background: 'rgba(34, 211, 238, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '8px' }}>● INSPECCIÓN ACTIVA</span>}>
              {selectedNode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                    <div style={{ padding: '8px', background: 'var(--accent-cyan)', borderRadius: '8px', color: '#020617' }}><Network size={18} /></div>
                    <div>
                      <p style={{ fontSize: '9px', fontWeight: '900', color: 'var(--accent-cyan)' }}>{selectedNode.type}</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>{selectedNode.name}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>TIPO</p>
                      <p style={{ fontSize: '13px', color: 'white', fontWeight: '600', marginTop: '4px' }}>{selectedNode.type}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '800' }}>RELEVAMIENTO</p>
                      <p style={{ fontSize: '13px', color: 'var(--accent-emerald)', fontWeight: '600', marginTop: '4px' }}>90%</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '10px', height: '36px' }}>VER EXPEDIENTE</button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                   <Target size={32} style={{ margin: '0 auto 16px' }} />
                   <p style={{ fontSize: '12px' }}>Seleccione un nodo en el organigrama para ver detalles.</p>
                </div>
              )}
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
             <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '16px', alignItems: 'center', zIndex: 10 }}>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>VISTA: DESGLOSE OPERATIVO</span>
                <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>SECRETARÍA: {selectedSec?.id}</span>
             </div>

             <div style={{ padding: '100px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '60px' }}>
                {/* Level 1: Secretariat */}
                <motion.div 
                  layoutId="sec-root"
                  onClick={() => setSelectedNode({ name: selectedSec.name, type: 'SECRETARÍA' })}
                  style={{ 
                    padding: '24px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--accent-cyan)', 
                    borderRadius: '16px', width: '380px', textAlign: 'center', cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(34, 211, 238, 0.05)'
                  }}
                >
                  <Building2 size={24} color="var(--accent-cyan)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '900', letterSpacing: '0.1em' }}>SECRETARÍA MUNICIPAL</p>
                  <p style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginTop: '6px' }}>{selectedSec.name}</p>
                </motion.div>

                {/* Level 2: Directorates */}
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', width: '100%' }}>
                  {/* Lines container (simplified) */}
                  <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '30px', display: 'flex', justifyContent: 'center' }}>
                     <div style={{ width: '2px', height: '100%', background: 'var(--border-subtle)' }} />
                  </div>

                  {selectedSec.direcciones.map((dir, idx) => (
                    <div key={dir.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                      <div style={{ width: '1px', height: '30px', background: 'var(--border-subtle)' }} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedNode({ name: dir.name, type: 'DIRECCIÓN' })}
                        style={{ 
                          padding: '16px 20px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid var(--border-subtle)', 
                          borderRadius: '12px', width: '240px', textAlign: 'center', cursor: 'pointer'
                        }}
                        whileHover={{ borderColor: 'var(--accent-cyan)', scale: 1.02 }}
                      >
                        <p style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: '900' }}>DIRECCIÓN</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginTop: '4px' }}>{dir.name}</p>
                      </motion.div>

                      {/* Level 3: Units (nested) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dir.unidades.map((uni, uIdx) => (
                          <motion.div 
                            key={uni}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (idx * 0.1) + (uIdx * 0.05) }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNode({ name: uni, type: 'UNIDAD OPERATIVA' });
                            }}
                            style={{ 
                              padding: '10px 16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', 
                              borderRadius: '8px', width: '200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              cursor: 'pointer'
                            }}
                            whileHover={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--accent-blue)' }}
                          >
                             <div style={{ textAlign: 'left' }}>
                               <p style={{ fontSize: '8px', color: 'var(--text-dim)', fontWeight: '800' }}>UNIDAD</p>
                               <p style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>{uni}</p>
                             </div>
                             <ChevronRight size={14} color="var(--text-dim)" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           </div>
        </div>
      </div>

      <style>{`
        .section-label {
          font-size: 10px; 
          fontWeight: 900; 
          color: var(--text-dim); 
          display: flex; 
          alignItems: center; 
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default GabineteOrganigramaScreen;
