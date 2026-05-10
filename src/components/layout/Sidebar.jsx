import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, FolderOpen, Edit3, Settings, LogOut, UserCheck 
} from 'lucide-react';

const Sidebar = ({ currentView, onViewChange, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'preview', label: 'Dashboard', icon: BarChart3 },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'list', label: 'Archivos', icon: FolderOpen },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-white/5 z-50 transform transition-transform duration-300 lg:translate-x-0 no-print ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-12 px-2">
            <div>
              <img src="/gamea.png" alt="GAMEA Logo" className="w-full h-auto object-contain" />
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${currentView === item.id
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon size={20} className={currentView === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} />
                {item.label}
                {currentView === item.id && (
                  <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <UserCheck size={16} />
                </div>
                <div className="text-xs font-bold text-white">Wilfredo Abad</div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">Acceso Nivel 5: Auditoría Estratégica</div>
            </div>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
              <LogOut size={20} className="opacity-40" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
