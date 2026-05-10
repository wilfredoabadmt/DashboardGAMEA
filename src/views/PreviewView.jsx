import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Clock, Target, Zap, ShieldAlert, Eye, CheckCircle, FileText, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import FuturisticGauge from '../components/ui/FuturisticGauge';
import StatCard from '../components/ui/StatCard';
import RiskBadge from '../components/ui/RiskBadge';

const PreviewView = ({ data, indicadores, estadisticas, riesgos }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-10"
  >
    {/* HERO SECTION */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
      <div className="relative bg-slate-900 border border-white/5 p-10 lg:p-14 rounded-[2rem] overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform rotate-12">
          <Building2 size={240} />
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-full text-[11px] font-black text-brand-400 uppercase tracking-[0.2em]">
                {data.secretaria || 'SECRETARÍA GENERAL'}
              </span>
              {data.direccion && (
                <>
                  <div className="h-1.5 w-1.5 bg-slate-700 rounded-full"></div>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {data.direccion}
                  </span>
                </>
              )}
              {data.unidad && (
                <>
                  <div className="h-1.5 w-1.5 bg-slate-700 rounded-full"></div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {data.unidad}
                  </span>
                </>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] font-display max-w-4xl">
                {data.titulo}
              </h2>
              <p className="text-slate-400 text-xl font-medium max-w-3xl leading-relaxed">{data.subtitulo}</p>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400 border border-white/5">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Actualizado</div>
                  <div className="text-sm font-bold text-slate-200">{data.fecha}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5">
                  <Target size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Estatus</div>
                  <div className="text-sm font-bold text-emerald-400">AUDITORÍA ACTIVA</div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:min-w-[400px] grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Responsable</div>
              <div className="text-sm font-bold text-white mb-1">{data.acreditado}</div>
              <div className="text-[10px] text-brand-400 font-bold uppercase">Auditor Jefe</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Autoridad</div>


                <div className="text-sm font-bold text-white mb-1 truncate text-left">{data.alcalde}</div>
               <div className="text-[10px] text-indigo-400 font-bold uppercase">Alcalde Electo</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* DASHBOARD GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: MAIN KPIS */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Zap size={20} className="text-brand-400" />
            Métricas Críticas de Transición
          </h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]"></div>
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indicadores.map((ind) => (
            <div
              key={ind.id}
              className="glass-card p-10 flex items-center justify-center"
            >
              <FuturisticGauge value={ind.value} label={ind.label} color={ind.color} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Matriz de Riesgos</h4>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">ÁMBITO: {data.unidad || data.direccion || data.secretaria}</p>
              </div>
              <ShieldAlert size={18} className="text-amber-500" />
            </div>
            <div className="space-y-3">
              {riesgos.map((r, i) => (
                <RiskBadge key={i} title={r.title} severity={r.imp === 3 ? 'critical' : 'high'} category={r.cat} delay={i * 0.1} />
              ))}
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2rem] flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                  <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">Alertas de Bloqueo</h4>
                </div>
                <span className="text-[9px] font-black text-red-500/40 uppercase bg-red-500/5 px-2 py-1 rounded border border-red-500/10">
                  REF: {data.unidad || 'INSTITUCIONAL'}
                </span>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed mb-8">{data.alerta}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.bloqueos.map(b => (
                <span key={b} className="text-[10px] font-black text-red-400 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: SECONDARY STATS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Estadísticas</h3>
          <TrendingUp size={18} className="text-emerald-500" />
        </div>

        {estadisticas.map((s, i) => (
          <StatCard key={i} icon={Activity} label={s.label} value={s.val} trend={s.trend} color="#38abf8" delay={i * 0.1} />
        ))}

        <div className="glass-card p-8 bg-gradient-to-br from-brand-600/20 to-indigo-600/20 border-brand-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-xs font-black text-white uppercase tracking-widest">Base Legal</div>
              <div className="text-lg font-bold text-brand-200">{data.ley}</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
            Todos los indicadores están alineados con los marcos normativos de control gubernamental vigentes en el Estado Plurinacional de Bolivia.
          </p>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all uppercase text-[10px] tracking-[0.2em] border border-white/10">
            Consultar Normativa
          </button>
        </div>
      </div>
    </div>

    {/* DETAILED ANALYSIS SECTION */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      <div className="glass-card p-10 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Eye size={120} />
        </div>
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <Eye size={18} className="text-indigo-400" />
          Observaciones y Hallazgos
        </h4>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-slate-300 leading-relaxed italic text-sm">"{data.observaciones}"</p>
        </div>
      </div>

      <div className="glass-card p-10 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <CheckCircle size={120} />
        </div>
        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <CheckCircle size={18} className="text-brand-400" />
          Ruta de Acción Estratégica
        </h4>
        <div className="p-6 bg-brand-500/5 rounded-2xl border border-brand-500/10">
          <p className="text-brand-100 leading-relaxed font-medium text-sm">{data.planAccion}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default PreviewView;
