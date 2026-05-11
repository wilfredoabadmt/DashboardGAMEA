import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, Clock, ChevronRight, PlusCircle } from 'lucide-react';

const ListViewComponent = ({ reports, onSelect, onDelete, onCreate }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between px-2">
      <div>
        <h3 className="text-2xl font-black text-white tracking-tight font-display">Archivo de Reportes</h3>
        <p className="text-sm text-slate-500 font-medium">Gestión histórica de auditorías estratégicas.</p>
      </div>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-brand-600/20"
      >
        <PlusCircle size={18} /> Nuevo Reporte
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {reports.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-8 flex flex-col group relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors"></div>

          <div className="flex items-start justify-between mb-8">
            <div className="p-3 rounded-2xl bg-white/5 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
              <FileText size={24} />
            </div>
          <div className="flex gap-1 items-center">
                <button
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas eliminar este reporte?')) {
                      onDelete(r.id);
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-white hover:bg-red-500/10 rounded-lg px-2 py-1 transition-colors"
                  title="Eliminar reporte"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-0.5 bg-brand-500/10 border border-brand-500/20 rounded-md text-[8px] font-black text-brand-400 uppercase tracking-widest">
                {r.secretaria}
              </span>
              <span className="px-2 py-0.5 bg-slate-500/10 border border-slate-500/20 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest">
                {r.direccion}
              </span>
              <span className="px-2 py-0.5 bg-slate-800/50 border border-white/5 rounded-md text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                {r.unidad}
              </span>
            </div>
            <h4 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-brand-400 transition-colors">{r.titulo}</h4>
            <p className="text-xs text-slate-500 mt-3 font-medium line-clamp-2">{r.subtitulo}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-slate-600" />
              <span className="text-[10px] font-bold text-slate-500">{r.fecha}</span>
            </div>
            <button
              onClick={() => onSelect(r)}
              className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-widest hover:text-white transition-colors"
            >
              Abrir <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ListViewComponent;
