import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Activity, FileText, Upload, Terminal as TerminalIcon,
  LogOut, Menu, Search, AlertCircle, Settings, Info, X
} from 'lucide-react';
import Papa from 'papaparse';

// Components
import PanelControlScreen from './components/screens/PanelControlScreen';
import GabineteOrganigramaScreen from './components/screens/GabineteOrganigramaScreen';
import SeguimientoScreen from './components/screens/SeguimientoScreen';
import ReportesScreen from './components/screens/ReportesScreen';
import CargaInformacionScreen from './components/screens/CargaInformacionScreen';
import SkillsPanel from './components/SkillsPanel';

// Lib & Constants
import { fetchDashboardConfig, saveDashboardConfig, fetchIndicadores, syncIndicadores } from './lib/db';
import { INITIAL_DATA } from './lib/constants';

const TerminalConsole = () => {
  const [lines, setLines] = useState([
    { text: 'SYSTEM ALPHA v2.7.0 BOOTING...', type: 'info' },
    { text: 'CONNECTING TO SUPABASE CLUSTER...', type: 'info' },
    { text: 'AUTHENTICATING LEVEL 4 ACCESS...', type: 'info' },
    { text: 'ACCESS GRANTED: WELCOME WILFREDO ABAD', type: 'success' },
  ]);

  useEffect(() => {
    const commands = [
      'SCANNING NETWORK NODES...',
      'ENCRYPTING DATA PACKETS...',
      'SYNCING REPOSITORIES...',
      'CHECKING SYSTEM INTEGRITY...',
      'FETCHING LATEST UPDATES FROM SMAF...',
      'ALERT: SEC_OBRAS DELAY DETECTED',
      'MONITORING ACTIVE SESSIONS...',
      'OPTIMIZING DATABASE QUERIES...',
    ];

    const interval = setInterval(() => {
      const randomCmd = commands[Math.floor(Math.random() * commands.length)];
      setLines(prev => [...prev.slice(-15), { 
        text: `[${new Date().toLocaleTimeString()}] ${randomCmd}`, 
        type: randomCmd.includes('ALERT') ? 'error' : 'info' 
      }]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      background: '#020617', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: '16px', 
      padding: '32px',
      height: '600px',
      fontFamily: 'var(--font-mono)',
      fontSize: '14px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ 
            color: line.type === 'error' ? 'var(--accent-red)' : line.type === 'success' ? 'var(--accent-emerald)' : 'var(--text-main)',
            opacity: i === lines.length - 1 ? 1 : 0.6,
            borderLeft: `2px solid ${line.type === 'error' ? 'var(--accent-red)' : 'var(--accent-cyan)'}`,
            paddingLeft: '16px'
          }}>
            {line.text}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>{'>'}</span>
          <span className="animate-pulse" style={{ color: 'var(--text-dim)' }}>_</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '32px', right: '32px', textAlign: 'right' }}>
        <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>SYS_ACCESS_PORT: 8080</p>
        <p style={{ fontSize: '10px', color: 'var(--accent-red)', fontWeight: '800' }}>RESTRICTED ACCESS AREA</p>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(INITIAL_DATA);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [config, indicadores] = await Promise.all([
          fetchDashboardConfig(),
          fetchIndicadores()
        ]);
        
        if (config || indicadores.length > 0) {
          setData(prev => ({
            ...prev,
            ...(config || {}),
            indicadores: indicadores.length > 0 ? indicadores.map(ind => ({
              ...ind,
              vizType: ind.viz_type
            })) : prev.indicadores
          }));
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await Promise.all([
        saveDashboardConfig(data),
        syncIndicadores(data.indicadores)
      ]);
      alert('¡Dashboard sincronizado con Supabase exitosamente!');
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      alert('Error al guardar en la base de datos.');
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const newMetrics = results.data.filter(row => row.label).map(row => ({
          id: row.id || Date.now() + Math.random(),
          label: row.label,
          value: row.value || 0,
          vizType: row.vizType || 'gauge',
          color: row.color || '#3b82f6',
          params: row.params ? row.params.split('|').map((p, i) => {
            const [pLabel, pStatus] = p.split(':');
            return { id: Date.now() + i, label: pLabel, done: pStatus === '1' };
          }) : []
        }));
        
        setData({ ...data, indicadores: newMetrics });
        alert('Métricas cargadas exitosamente via CSV.');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error al procesar el archivo CSV.');
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <Activity size={48} className="animate-spin" color="var(--accent-cyan)" />
          <p style={{ marginTop: '24px', fontWeight: '800', letterSpacing: '0.2em', color: 'var(--text-dim)' }}>CARGANDO SISTEMA ALPHA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'active' : ''} no-print`}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '40px', height: '40px', background: '#fff',
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255,255,255,0.1)', flexShrink: 0
          }}>
            <div style={{ width: '20px', height: '20px', background: '#020617', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div style={{ overflow: 'hidden' }}>
              <h1 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SISTEMA ALPHA</h1>
              <p style={{ fontSize: '8px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>Admin Gubernamental</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, marginTop: '32px' }}>
          <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>PANEL DE CONTROL</span>}
          </button>
          <button onClick={() => { setActiveTab('gabinete'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'gabinete' ? 'active' : ''}`}>
            <Users size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>GABINETE</span>}
          </button>
          <button onClick={() => { setActiveTab('seguimiento'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'seguimiento' ? 'active' : ''}`}>
            <Activity size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>SEGUIMIENTO</span>}
          </button>
          <button onClick={() => { setActiveTab('reportes'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}>
            <FileText size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>REPORTES</span>}
          </button>
          <button onClick={() => { setActiveTab('habilidades'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'habilidades' ? 'active' : ''}`}>
            <Settings size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>HABILIDADES</span>}
          </button>
          <button onClick={() => { setActiveTab('carga'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'carga' ? 'active' : ''}`}>
            <Upload size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>CARGA</span>}
          </button>
          <button onClick={() => { setActiveTab('terminal'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'terminal' ? 'active' : ''}`}>
            <TerminalIcon size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>TERMINAL</span>}
          </button>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={() => alert('Cerrando sesión...')} className="nav-item" style={{ color: 'var(--text-dim)' }}>
            <LogOut size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>CERRAR SESIÓN</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* HEADER */}
        <header className="dashboard-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
            <button 
              className="show-mobile btn btn-ghost" 
              style={{ padding: '8px' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                placeholder="Buscar expedientes..." 
                className="custom-input" 
                style={{ paddingLeft: '48px', height: '40px', fontSize: '12px' }}
              />
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                {activeTab.toUpperCase()}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-dim)' }}>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', border: '2px solid #020617' }} />
                <AlertCircle size={20} />
              </motion.div>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer' }}><Settings size={20} /></motion.div>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer' }}><Info size={20} /></motion.div>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/100?u=wilfredo" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-viewport">
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <PanelControlScreen />
              </motion.div>
            )}

            {activeTab === 'gabinete' && (
              <motion.div key="gabinete" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <GabineteOrganigramaScreen />
              </motion.div>
            )}

            {activeTab === 'seguimiento' && (
              <motion.div key="seguimiento" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SeguimientoScreen />
              </motion.div>
            )}

            {activeTab === 'reportes' && (
              <motion.div key="reportes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ReportesScreen />
              </motion.div>
            )}

            {activeTab === 'habilidades' && (
              <motion.div key="habilidades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SkillsPanel />
              </motion.div>
            )}

            {activeTab === 'carga' && (
              <motion.div key="carga" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CargaInformacionScreen />
              </motion.div>
            )}

            {activeTab === 'terminal' && (
               <motion.div key="terminal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Terminal de Sistema</h2>
                      <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Consola de comandos para operaciones de bajo nivel y monitoreo de red.</p>
                    </div>
                    <TerminalConsole />
                  </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <div className="hidden-mobile" style={{ position: 'fixed', bottom: '24px', right: '32px', zIndex: 100, pointerEvents: 'none' }}>
        <p style={{ fontSize: '8px', fontWeight: '900', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
          GAMEA STRATEGIC HUD v2.7.0 // SECURITY LEVEL 4
        </p>
      </div>

    </div>
  );
};

export default App;
