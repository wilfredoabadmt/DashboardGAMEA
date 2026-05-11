import React from 'react';
import { Search, Bell, Save, Menu } from 'lucide-react';
import CloudDownload from 'lucide-react/dist/esm/icons/cloud-download.mjs';
import { exportPdf } from '../../lib/exportPdf';

const TopBar = ({ title, subtitle, onSave, isSaveActive, onMenuClick }) => (
  <header className="sticky top-0 z-30 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 px-6 lg:px-10 py-4 no-print">
    <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight font-display">{title}</h2>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-2 focus-within:border-brand-500 transition-all">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar reportes..."
            className="bg-transparent border-none outline-none text-sm px-3 text-white placeholder:text-slate-600 w-48 xl:w-64"
          />
        </div>

        <button
          onClick={() => window.print()}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl border border-white/5 transition-all text-xs font-black uppercase tracking-widest"
        >
          <CloudDownload size={18} /> PDF
        </button>

        <button className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <button
          onClick={onSave}
          className={`ml-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${isSaveActive
            ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95'
            : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
          disabled={!isSaveActive}
        >
          <Save size={18} />
          <span className="hidden sm:inline">Guardar</span>
        </button>
      </div>
    </div>
  </header>
);

export default TopBar;
