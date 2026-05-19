import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Settings, Upload, Layers, Activity, BarChart3,  
  ShieldAlert, AlertTriangle, PlusCircle, Trash2, X, ChevronRight,
  Sparkles, RefreshCw, CloudDownload
} from 'lucide-react';
import {
  generateObservations,
  generateActionPlan,
  generateSuggestedRisks,
  generateSuggestedMetrics
} from '../lib/nvidia';

const EditorView = ({
  data, setData, indicadores, setIndicadores,
  estadisticas, setEstadisticas, riesgos, setRiesgos,
  onImport, onDownloadCSV,
  secretarias, direcciones, unidades,
  selectedSec, setSelectedSec,
  selectedDir, setSelectedDir,
  selectedUni, setSelectedUni,
  fetchDirecciones, fetchUnidades, loadUnitReport,
  onDeleteReport,
}) => {
  const [activeTab, setActiveTab] = useState('indicadores');
  
  // Loading states for AI generation
  const [isGeneratingObs, setIsGeneratingObs] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isGeneratingRiesgos, setIsGeneratingRiesgos] = useState(false);
  const [isGeneratingMetrics, setIsGeneratingMetrics] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const isSelectionComplete = selectedSec && selectedDir && selectedUni;

  // Resolve the human-readable names of selections to feed to the AI
  const secName = secretarias.find(s => s.id.toString() === selectedSec?.toString())?.nombre || '';
  const dirName = direcciones.find(d => d.id.toString() === selectedDir?.toString())?.nombre || '';
  const uniName = unidades.find(u => u.id.toString() === selectedUni?.toString())?.nombre || '';

  // AI Handlers
  const handleGenerateObservations = async () => {
    if (!selectedUni) return;
    setIsGeneratingObs(true);
    try {
      const obs = await generateObservations({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName
      });
      setData(prev => ({ ...prev, observaciones: obs }));
    } catch (err) {
      console.error(err);
      alert('Error al generar observaciones: ' + err.message);
    } finally {
      setIsGeneratingObs(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedUni) return;
    setIsGeneratingPlan(true);
    try {
      const plan = await generateActionPlan({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName,
        observaciones: data.observaciones
      });
      setData(prev => ({ ...prev, planAccion: plan }));
    } catch (err) {
      console.error(err);
      alert('Error al generar plan de acción: ' + err.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleGenerateRiesgos = async () => {
    if (!selectedUni) return;
    setIsGeneratingRiesgos(true);
    try {
      const suggested = await generateSuggestedRisks({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName
      });
      if (suggested && suggested.length > 0) {
        setRiesgos(suggested.map((r, index) => ({
          id: Date.now() + index,
          title: r.title,
          imp: r.imp,
          cat: r.cat
        })));
      }
    } catch (err) {
      console.error(err);
      alert('Error al generar riesgos: ' + err.message);
    } finally {
      setIsGeneratingRiesgos(false);
    }
  };

  const handleGenerateMetrics = async () => {
    if (!selectedUni) return;
    setIsGeneratingMetrics(true);
    try {
      const result = await generateSuggestedMetrics({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName
      });
      if (result.indicadores && result.indicadores.length > 0) {
        setIndicadores(result.indicadores.map((ind, index) => ({
          id: Date.now() + index,
          label: ind.label,
          value: ind.value,
          color: ind.color
        })));
      }
      if (result.estadisticas && result.estadisticas.length > 0) {
        setEstadisticas(result.estadisticas.map((stat, index) => ({
          id: Date.now() + index,
          label: stat.label,
          val: stat.val,
          trend: stat.trend
        })));
      }
    } catch (err) {
      console.error(err);
      alert('Error al generar métricas: ' + err.message);
    } finally {
      setIsGeneratingMetrics(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!selectedUni) return;
    setIsGeneratingAll(true);
    try {
      // 1. Observaciones
      const obs = await generateObservations({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName
      });
      
      // 2. Plan de Acción
      const plan = await generateActionPlan({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName,
        observaciones: obs
      });
      
      setData(prev => ({ 
        ...prev, 
        observaciones: obs,
        planAccion: plan,
        alerta: `Se han identificado situaciones complejas en la transición de la Unidad de ${uniName}. Se requiere seguimiento prioritario inmediato.`
      }));

      // 3. Riesgos
      const suggestedRisks = await generateSuggestedRisks({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName
      });
      if (suggestedRisks && suggestedRisks.length > 0) {
        setRiesgos(suggestedRisks.map((r, index) => ({
          id: Date.now() + index,
          title: r.title,
          imp: r.imp,
          cat: r.cat
        })));
      }

      // 4. Métricas
      const metrics = await generateSuggestedMetrics({
        secretaria: secName,
        direccion: dirName,
        unidad: uniName
      });
      if (metrics.indicadores && metrics.indicadores.length > 0) {
        setIndicadores(metrics.indicadores.map((ind, index) => ({
          id: Date.now() + index + 10,
          label: ind.label,
          value: ind.value,
          color: ind.color
        })));
      }
      if (metrics.estadisticas && metrics.estadisticas.length > 0) {
        setEstadisticas(metrics.estadisticas.map((stat, index) => ({
          id: Date.now() + index + 10,
          label: stat.label,
          val: stat.val,
          trend: stat.trend
        })));
      }

      setActiveTab('ia');

    } catch (err) {
      console.error(err);
      alert('Error en la generación masiva IA: ' + err.message);
    } finally {
      setIsGeneratingAll(false);
    }
  };

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
            className="glass-card p-8 rounded-3xl animate-fade-in"
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-500 block uppercase tracking-widest ml-1">Observaciones de Auditoría</label>
                  <button
                    type="button"
                    onClick={handleGenerateObservations}
                    disabled={isGeneratingObs || isGeneratingAll}
                    className="flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 hover:border-brand-500/50 rounded-lg text-[9px] font-black text-brand-400 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingObs ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <Sparkles size={10} />
                    )}
                    {isGeneratingObs ? 'Generando...' : 'Sugerir con IA'}
                  </button>
                </div>
                <textarea
                  value={data.observaciones}
                  onChange={e => setData({ ...data, observaciones: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all resize-none"
                  placeholder="Detalle hallazgos relevantes..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-500 block uppercase tracking-widest ml-1">Plan de Acción Inmediato</label>
                  <button
                    type="button"
                    onClick={handleGeneratePlan}
                    disabled={isGeneratingPlan || isGeneratingAll}
                    className="flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 hover:border-brand-500/50 rounded-lg text-[9px] font-black text-brand-400 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingPlan ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <Sparkles size={10} />
                    )}
                    {isGeneratingPlan ? 'Generando...' : 'Generar con IA'}
                  </button>
                </div>
                <textarea
                  value={data.planAccion}
                  onChange={e => setData({ ...data, planAccion: e.target.value })}
                  rows={4}
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
                <CloudDownload size={16} /> Plantilla
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
          <div className="glass-card p-8 rounded-3xl h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 flex-wrap gap-1">
                {[
                  { id: 'indicadores', label: 'Indicadores', icon: Activity },
                  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
                  { id: 'riesgos', label: 'Riesgos', icon: ShieldAlert },
                  { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
                  { id: 'ia', label: 'Asistente IA', icon: Sparkles },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <tab.icon size={14} className={tab.id === 'ia' ? 'text-brand-400' : ''} />
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {activeTab !== 'ia' && (
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
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar flex-1">
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

              {activeTab === 'ia' && (
                <div className="col-span-full space-y-6">
                  <div className="bg-slate-900/50 p-8 rounded-3xl border border-brand-500/20 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
                      <Sparkles className="text-brand-400" size={24} />
                      Asistente de Transición Inteligente (NVIDIA AI)
                    </h4>
                    <p className="text-slate-400 text-sm max-w-2xl mb-8 leading-relaxed font-medium">
                      Optimiza el proceso de auditoría y traspaso municipal de El Alto. Genera informes estratégicos, 
                      identifica bloqueos presupuestarios y sugiere planes de acción alineados con la **Ley 1178 (SAFCO)** y **Ley 482**.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <button
                        onClick={handleGenerateAll}
                        disabled={isGeneratingAll || isGeneratingObs || isGeneratingPlan || isGeneratingRiesgos || isGeneratingMetrics}
                        className="p-6 bg-brand-950/40 hover:bg-brand-900/40 border border-brand-500/20 hover:border-brand-500/50 rounded-2xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Generación Masiva</span>
                          {isGeneratingAll ? (
                            <RefreshCw size={16} className="text-brand-400 animate-spin" />
                          ) : (
                            <Sparkles size={16} className="text-brand-500 group-hover:scale-125 transition-transform" />
                          )}
                        </div>
                        <h5 className="text-sm font-black text-white uppercase tracking-wider mb-2">Autocompletar Reporte Completo</h5>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Genera observaciones de auditoría, plan de acción, indicadores clave, estadísticas y riesgos críticos sugeridos en un solo paso.
                        </p>
                      </button>

                      <button
                        onClick={handleGenerateMetrics}
                        disabled={isGeneratingAll || isGeneratingObs || isGeneratingPlan || isGeneratingRiesgos || isGeneratingMetrics}
                        className="p-6 bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-brand-500/30 rounded-2xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-400 uppercase tracking-widest">Planificación SISPLAN</span>
                          {isGeneratingMetrics ? (
                            <RefreshCw size={16} className="text-brand-400 animate-spin" />
                          ) : (
                            <Activity size={16} className="text-slate-500 group-hover:scale-125 transition-transform" />
                          )}
                        </div>
                        <h5 className="text-sm font-black text-white uppercase tracking-wider mb-2">Sugerir Indicadores y Métricas</h5>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Genera un set de 3 indicadores porcentuales (con colores dinámicos) y 3 estadísticas cuantitativas realistas adaptadas al área.
                        </p>
                      </button>

                      <button
                        onClick={handleGenerateRiesgos}
                        disabled={isGeneratingAll || isGeneratingObs || isGeneratingPlan || isGeneratingRiesgos || isGeneratingMetrics}
                        className="p-6 bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-brand-500/30 rounded-2xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-slate-500 group-hover:text-brand-400 uppercase tracking-widest">Matriz de Control Interno</span>
                          {isGeneratingRiesgos ? (
                            <RefreshCw size={16} className="text-brand-400 animate-spin" />
                          ) : (
                            <ShieldAlert size={16} className="text-slate-500 group-hover:scale-125 transition-transform" />
                          )}
                        </div>
                        <h5 className="text-sm font-black text-white uppercase tracking-wider mb-2">Evaluar Riesgos de Transición</h5>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Identifica los 3 riesgos de traspaso administrativo, legal y financiero más críticos de la unidad con su nivel de impacto.
                        </p>
                      </button>

                      <div className="p-6 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Normativa Aplicada</h5>
                          <ul className="text-slate-500 text-[11px] space-y-2 font-medium">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                              Ley 1178 (SAFCO): Control Gubernamental
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                              Ley 482: Autonomías Municipales
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                              Normas Básicas del SABS (D.S. 0181)
                            </li>
                          </ul>
                        </div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest pt-4 mt-4 border-t border-white/5">
                          Modelo: Mixtral 8x22B Instruct via NVIDIA
                        </div>
                      </div>
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

