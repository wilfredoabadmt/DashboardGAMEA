import React, { useState } from 'react';
import { 
  Layers, Settings, FileUp, CheckCircle, Building2, FileText, Trash2, Check 
} from 'lucide-react';
import { motion } from 'framer-motion';

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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6" style={{ width: '100%' }}>
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

export default CargaInformacionScreen;
