import React, { useState, useMemo } from 'react';
import { 
  Layers, Settings, FileUp, CheckCircle, Building2, FileText, Trash2, Check, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORGANIGRAMA } from '../../lib/constants';

const CargaInformacionScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    secretaria: '',
    direccion: '',
    unidad: '',
    titular: '',
    gestion: '2025',
    tipoDocumento: 'General'
  });
  const [files, setFiles] = useState([]);

  const steps = [
    { id: 1, label: 'Estructura', icon: Building2 },
    { id: 2, label: 'Detalles', icon: Settings },
    { id: 3, label: 'Carga', icon: FileUp },
    { id: 4, label: 'Verificación', icon: CheckCircle }
  ];

  // Memoized lists for cascading dropdowns
  const currentSecretaria = useMemo(() => 
    ORGANIGRAMA.find(s => s.id === formData.secretaria || s.name === formData.secretaria),
  [formData.secretaria]);

  const currentDireccion = useMemo(() => 
    currentSecretaria?.direcciones.find(d => d.id === formData.direccion || d.name === formData.direccion),
  [currentSecretaria, formData.direccion]);

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const resetHierarchy = (level) => {
    if (level === 'secretaria') {
      setFormData(prev => ({ ...prev, direccion: '', unidad: '' }));
    } else if (level === 'direccion') {
      setFormData(prev => ({ ...prev, unidad: '' }));
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8 w-full max-w-4xl">
            <div className="glass-card" style={{ padding: '32px' }}>
              <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-cyan)', marginBottom: '24px', letterSpacing: '0.1em' }}>JERARQUÍA MUNICIPAL GAMEA</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Level 1: Secretariat */}
                <div>
                  <label className="input-label">1. SELECCIONE SECRETARÍA MUNICIPAL</label>
                  <select 
                    className="custom-input"
                    value={formData.secretaria}
                    onChange={(e) => {
                      setFormData({...formData, secretaria: e.target.value});
                      resetHierarchy('secretaria');
                    }}
                  >
                    <option value="">-- Seleccione Secretaría --</option>
                    {ORGANIGRAMA.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                  </select>
                </div>

                {/* Level 2: Directorate */}
                <AnimatePresence>
                  {formData.secretaria && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="input-label">2. SELECCIONE DIRECCIÓN</label>
                      <select 
                        className="custom-input"
                        value={formData.direccion}
                        onChange={(e) => {
                          setFormData({...formData, direccion: e.target.value});
                          resetHierarchy('direccion');
                        }}
                      >
                        <option value="">-- Seleccione Dirección --</option>
                        {currentSecretaria?.direcciones.map(dir => <option key={dir.id} value={dir.id}>{dir.name}</option>)}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Level 3: Unit */}
                <AnimatePresence>
                  {formData.direccion && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="input-label">3. SELECCIONE UNIDAD</label>
                      <select 
                        className="custom-input"
                        value={formData.unidad}
                        onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                      >
                        <option value="">-- Seleccione Unidad --</option>
                        {currentDireccion?.unidades.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-primary" 
                  disabled={!formData.unidad}
                  onClick={handleNext}
                >
                  CONTINUAR <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '16px', background: 'rgba(34, 211, 238, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 211, 238, 0.2)', marginBottom: '12px' }}>
                 <p style={{ fontSize: '9px', fontWeight: '900', color: 'var(--accent-cyan)' }}>ÁREA SELECCIONADA</p>
                 <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginTop: '4px' }}>{formData.unidad}</p>
                 <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{currentDireccion?.name}</p>
              </div>

              <div>
                <label className="input-label">TITULAR RESPONSABLE (ACTUAL)</label>
                <input 
                  type="text" 
                  className="custom-input" 
                  placeholder="Ej. Ing. Juan Perez"
                  value={formData.titular}
                  onChange={(e) => setFormData({...formData, titular: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="input-label">GESTIÓN RELEVAMIENTO</label>
                  <select 
                    className="custom-input"
                    value={formData.gestion}
                    onChange={(e) => setFormData({...formData, gestion: e.target.value})}
                  >
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">TIPO DE ACTIVO / DOC</label>
                  <select 
                    className="custom-input"
                    value={formData.tipoDocumento}
                    onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Financiero">Financiero (Tesorería)</option>
                    <option value="Activos">Activos Fijos</option>
                    <option value="Legal">Legal / Contratos</option>
                    <option value="TIC">Sistemas / Credenciales</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleBack}>ATRÁS</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={!formData.titular}>CONTINUAR</button>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
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
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>Arrastre los archivos de {formData.unidad}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginTop: '8px' }}>Se requiere escaneado de actas y backups digitales.</p>
                <button className="btn btn-ghost" style={{ marginTop: '24px' }}>SELECCIONAR ARCHIVOS</button>
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: '32px', textAlign: 'left' }}>
                  <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', marginBottom: '16px' }}>LISTO PARA PROCESAR ({files.length})</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {files.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <FileText size={16} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '13px', color: 'white', flex: 1 }}>{f.name}</span>
                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleBack}>ATRÁS</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext} disabled={files.length === 0}>INICIAR CARGA SEGURA</button>
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
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'white' }}>Relevamiento Exitoso</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '12px', lineHeight: 1.6 }}>
                La información de la <strong>{formData.unidad}</strong> ha sido cargada al repositorio central de transición.
              </p>
              
              <div style={{ margin: '32px 0', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'left', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Secretaría:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>{currentSecretaria?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Dirección:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>{currentDireccion?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Gestión:</span>
                    <span style={{ color: 'white', fontWeight: '700' }}>{formData.gestion}</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setStep(1); setFormData({ ...formData, direccion: '', unidad: '' }); }}>NUEVA CARGA</button>
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
          <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Ingreso de Información</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Carga escalonada por Secretaría, Dirección y Unidad operativa.</p>
        </div>
      </div>

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
                transition: 'all 0.3s ease'
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

      <style>{`
        .input-label {
          font-size: 10px;
          font-weight: 900;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 12px;
          display: block;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default CargaInformacionScreen;
