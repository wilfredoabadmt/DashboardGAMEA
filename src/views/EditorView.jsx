import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Settings, Upload, Download, Layers, Activity, BarChart3, 
  ShieldAlert, AlertTriangle, PlusCircle, Trash2, X, ChevronRight 
} from 'lucide-react';

const EditorView = ({
  data, setData, indicadores, setIndicadores,
  estadisticas, setEstadisticas, riesgos, setRiesgos,
  onImport, onDownloadCSV,
  secretarias, direcciones, unidades,
  selectedSec, setSelectedSec,
  selectedDir, setSelectedDir,
  selectedUni, setSelectedUni,
  fetchDirecciones, fetchUnidades, loadUnitReport
}) => {
  const [activeTab, setActiveTab] = useState('indicadores');
  const isSelectionComplete = selectedSec && selectedDir && selectedUni;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT PANEL: SELECTION & CONFIG */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-8 rounded-3xl border-brand-500/20">
          <h3 className="text-lg font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
            <Building2 size={20} className="text-brand-400" />
            Ubicación Institucional
          </h3>
          <div className="space-y-6">
            <div className="relative group/select">
              <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest ml-1">Secretaría Municipal</label>
              <div className="relative">
                <select
                  value={selectedSec}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedSec(val);
                    setSelectedDir('');
                    setSelectedUni('');
                    if (val) fetchDirecciones(val);
                  }}
                  className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 pr-12 text-sm text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-900/60"
                >
                  <option value="" className="bg-slate-900">Seleccione Secretaría...</option>
                  {secretarias.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.nombre}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-brand-400 transition-colors">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative group/select">
              <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest ml-1">Dirección</label>
              <div className="relative">
                <select
                  value={selectedDir}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedDir(val);
                    setSelectedUni('');
                    if (val) fetchUnidades(val);
                  }}
                  disabled={!selectedSec}
                  className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 pr-12 text-sm text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-900/60 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-slate-900">Seleccione Dirección...</option>
                  {direcciones.map(d => <option key={d.id} value={d.id} className="bg-slate-900">{d.nombre}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-brand-400 transition-colors">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="relative group/select">
              <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest ml-1">Unidad</label>
              <div className="relative">
                <select
                  value={selectedUni}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedUni(val);
                    if (val) loadUnitReport(val, selectedDir, selectedSec);
                  }}
                  disabled={!selectedDir}
                  className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 pr-12 text-sm text-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 outline-none appearance-none transition-all cursor-pointer hover:bg-slate-900/60 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-slate-900">Seleccione Unidad...</option>
                  {unidades.map(u => <option key={u.id} value={u.id} className="bg-slate-900">{u.nombre}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/select:text-brand-400 transition-colors">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isSelectionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl"
          >
            <h3 className="text-lg font-black text-white mb-8 uppercase tracking-wider flex items-center gap-3">
              <Settings size={20} className="text-brand-400" />
              General
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Título del Reporte', key: 'titulo' },
                { label: 'Subtítulo / Contexto', key: 'subtitulo' },
                { label: 'Nombre del Responsable', key: 'acreditado' },
                { label: 'Alcalde Electo', key: 'alcalde' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">{field.label}</label>
                  <input
                    type="text"
                    value={data[field.key]}
                    onChange={e => setData({ ...data, [field.key]: e.target.value })}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Observaciones de Auditoría</label>
                <textarea
                  value={data.observaciones}
                  onChange={e => setData({ ...data, observaciones: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                  placeholder="Detalle hallazgos relevantes..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 block mb-2 uppercase tracking-widest">Plan de Acción Inmediato</label>
                <textarea
                  value={data.planAccion}
                  onChange={e => setData({ ...data, planAccion: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                  placeholder="Pasos críticos a seguir..."
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="text-[10px] font-black text-slate-500 block mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Upload size={14} /> Subir Información / Evidencia
                </label>
                <div
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-brand-500/50 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <Upload size={24} className="text-slate-600 group-hover:text-brand-400 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Click para subir archivos</span>
                  <input id="file-upload" type="file" className="hidden" multiple />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isSelectionComplete && (
          <div className="glass-card p-8 rounded-3xl bg-brand-500/5 border-brand-500/20">
            <h4 className="text-sm font-black text-white mb-2 uppercase tracking-wider">Gestión de Datos</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Automatiza la carga de indicadores mediante archivos CSV estructurados.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onDownloadCSV} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                <Download size={16} /> Plantilla
              </button>
              <button onClick={() => document.getElementById('csv-input').click()} className="px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
                <Upload size={16} /> Importar
              </button>
              <input id="csv-input" type="file" accept=".csv" onChange={onImport} className="hidden" />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: INDICATORS */}
      <div className="lg:col-span-8">
        {!isSelectionComplete ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-2 border-white/5">
            <Layers size={48} className="text-slate-800 mb-6" />
            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Editor Bloqueado</h4>
            <p className="text-slate-500 font-medium text-center max-w-sm">
              Debe seleccionar una **Secretaría, Dirección y Unidad** para habilitar los campos de edición y carga de información.
            </p>
          </div>
        ) : (
          <div className="glass-card p-8 rounded-3xl h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {[
                  { id: 'indicadores', label: 'Indicadores', icon: Activity },
                  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
                  { id: 'riesgos', label: 'Riesgos', icon: ShieldAlert },
                  { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'indicadores') setIndicadores([...indicadores, { id: Date.now(), label: 'NUEVO INDICADOR', value: 50, color: '#38abf8' }]);
                  if (activeTab === 'stats') setEstadisticas([...estadisticas, { id: Date.now(), label: 'NUEVA MÉTRICA', val: 100, trend: 'up' }]);
                  if (activeTab === 'riesgos') setRiesgos([...riesgos, { id: Date.now(), title: 'NUEVO RIESGO', imp: 2, cat: 'GENERAL' }]);
                  if (activeTab === 'alertas') {
                    const tag = prompt('Ingrese nombre de la etiqueta de bloqueo:');
                    if (tag) setData({ ...data, bloqueos: [...(data.bloqueos || []), tag.toUpperCase()] });
                  }
                }}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-600/20 hover:scale-105"
              >
                <PlusCircle size={16} /> Añadir
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
              {activeTab === 'indicadores' && indicadores.map(ind => (
                <div key={ind.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      value={ind.label}
                      onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? { ...x, label: e.target.value.toUpperCase() } : x))}
                      className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                    />
                    <button onClick={() => setIndicadores(indicadores.filter(x => x.id !== ind.id))} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <input type="range" value={ind.value} onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? { ...x, value: parseInt(e.target.value) } : x))} min="0" max="100" className="flex-1 accent-brand-500" />
                      <span className="text-xl font-black text-white min-w-[3rem] text-right font-display">{ind.value}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input type="color" value={ind.color} onChange={e => setIndicadores(indicadores.map(x => x.id === ind.id ? { ...x, color: e.target.value } : x))} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${ind.value}%`, backgroundColor: ind.color, boxShadow: `0 0 15px ${ind.color}66` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'stats' && estadisticas.map(s => (
                <div key={s.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      value={s.label}
                      onChange={e => setEstadisticas(estadisticas.map(x => x.id === s.id ? { ...x, label: e.target.value.toUpperCase() } : x))}
                      className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                    />
                    <button onClick={() => setEstadisticas(estadisticas.filter(x => x.id !== s.id))} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Valor</label>
                      <input type="number" value={s.val} onChange={e => setEstadisticas(estadisticas.map(x => x.id === s.id ? { ...x, val: parseInt(e.target.value) } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Tendencia</label>
                      <select value={s.trend} onChange={e => setEstadisticas(estadisticas.map(x => x.id === s.id ? { ...x, trend: e.target.value } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="up">ASCENDENTE</option>
                        <option value="down">DESCENDENTE</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'riesgos' && riesgos.map(r => (
                <div key={r.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      value={r.title}
                      onChange={e => setRiesgos(riesgos.map(x => x.id === r.id ? { ...x, title: e.target.value } : x))}
                      className="bg-transparent text-sm font-black text-white border-b border-transparent focus:border-brand-500 outline-none w-full mr-4"
                    />
                    <button onClick={() => setRiesgos(riesgos.filter(x => x.id !== r.id))} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Impacto (1-3)</label>
                      <input type="number" min="1" max="3" value={r.imp} onChange={e => setRiesgos(riesgos.map(x => x.id === r.id ? { ...x, imp: parseInt(e.target.value) } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-2 uppercase font-black">Categoría</label>
                      <input type="text" value={r.cat} onChange={e => setRiesgos(riesgos.map(x => x.id === r.id ? { ...x, cat: e.target.value.toUpperCase() } : x))} className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-sm text-white" />
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'alertas' && (
                <div className="col-span-full space-y-6">
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <label className="text-[10px] font-black text-slate-500 block mb-4 uppercase tracking-widest">Descripción de Alerta Crítica</label>
                    <textarea
                      value={data.alerta}
                      onChange={e => setData({ ...data, alerta: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-6 text-sm text-white focus:border-red-500 outline-none transition-all resize-none"
                      placeholder="Describa la situación de bloqueo..."
                    />
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <label className="text-[10px] font-black text-slate-500 block mb-4 uppercase tracking-widest">Etiquetas de Bloqueo Activas</label>
                    <div className="flex flex-wrap gap-2">
                      {data.bloqueos?.map(tag => (
                        <div key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <span className="text-[10px] font-black text-red-500">{tag}</span>
                          <button
                            onClick={() => setData({ ...data, bloqueos: data.bloqueos.filter(t => t !== tag) })}
                            className="text-red-500/50 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const tag = prompt('Nueva etiqueta:');
                          if (tag) setData({ ...data, bloqueos: [...(data.bloqueos || []), tag.toUpperCase()] });
                        }}
                        className="px-3 py-1.5 border border-dashed border-white/10 rounded-lg text-[10px] font-black text-slate-500 hover:border-brand-500 hover:text-white transition-all"
                      >
                        + AÑADIR
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorView;
