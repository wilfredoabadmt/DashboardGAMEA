import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Activity, FileText, Upload, Terminal as TerminalIcon,
  LogOut, Menu, Search, AlertCircle, Settings, Info, ShieldAlert
} from 'lucide-react';
import Papa from 'papaparse';

// Components
import PanelControlScreen from './components/screens/PanelControlScreen';
import GabineteOrganigramaScreen from './components/screens/GabineteOrganigramaScreen';
import SeguimientoScreen from './components/screens/SeguimientoScreen';
import ReportesScreen from './components/screens/ReportesScreen';
import CargaInformacionScreen from './components/screens/CargaInformacionScreen';

// Lib & Constants
import { fetchDashboardConfig, saveDashboardConfig, fetchIndicadores, syncIndicadores } from './lib/db';
import { INITIAL_DATA } from './lib/constants';

const TerminalConsole = () => {
  const [lines, setLines] = useState([
    { text: 'SYSTEM ALPHA v2.7.0 BOOTING...', type: 'info' },
    { text: 'CONNECTING TO GAMEA SECURE NODES...', type: 'info' },
    { text: 'IDENTIFYING TRANSITION ASSETS...', type: 'info' },
    { text: 'ACCESS GRANTED: MAYOR ELECT ELISER ROCA OFFICE', type: 'success' },
  ]);

  useEffect(() => {
    const commands = [
      'SCANNING SMAF DATABASES...',
      'VERIFYING ASSETS AT ALMACENES CENTRALES...',
      'SYNCING PLANILLAS RRHH - GESTIÓN COPA...',
      'ANALYZING DEFICIENCIES IN UASI...',
      'FETCHING AUDIT REPORTS FROM TRANSPARENCIA...',
      'ALERT: MISSING CREDENTIALS FOR CATASTRO DB',
      'VALIDATING DIGITAL SIGNATURES...',
      'PREPARING PRESS REPORT MODULES...',
    ];

    const interval = setInterval(() => {
      const randomCmd = commands[Math.floor(Math.random() * commands.length)];
      setLines(prev => [...prev.slice(-15), { 
        text: `[${new Date().toLocaleTimeString()}] ${randomCmd}`, 
        type: randomCmd.includes('ALERT') || randomCmd.includes('MISSING') ? 'error' : 'info' 
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
        <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800' }}>NOD_ID: GAMEA_EL_ALTO_01</p>
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
              vizType: ind.viz_type,
              falencias: ind.falencias || 0,
              virtudes: ind.virtudes || 0
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

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Simple mapping: if CSV has 'type' column, we can distinguish between indicators and processes
        const rows = results.data;
        
        const newIndicadores = rows.filter(r => r.tipo === 'indicador').map(r => ({
          id: Date.now() + Math.random(),
          label: r.nombre || r.label,
          value: r.valor || r.value || 0,
          falencias: r.falencias || 0,
          virtudes: r.virtudes || 0,
          color: r.color || '#3b82f6',
          vizType: 'gauge'
        }));

        const newProcesos = rows.filter(r => r.tipo === 'proceso').map(r => ({
          secretaria: r.secretaria,
          proceso: r.proceso,
          estado: r.estado || 'Normal',
          falencias: r.falencias_detalle || 'Ninguna',
          virtudes: r.virtudes_detalle || 'N/A'
        }));

        if (newIndicadores.length > 0 || newProcesos.length > 0) {
          setData(prev => ({
            ...prev,
            indicadores: newIndicadores.length > 0 ? newIndicadores : prev.indicadores,
            procesos: newProcesos.length > 0 ? newProcesos : prev.procesos
          }));
          alert('Datos de transición cargados exitosamente.');
        } else {
          alert('No se encontraron datos válidos. Use las columnas: tipo, nombre, valor, falencias, virtudes.');
        }
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
          <p style={{ marginTop: '24px', fontWeight: '800', letterSpacing: '0.2em', color: 'var(--text-dim)' }}>SISTEMA DE TRANSICIÓN GAMEA...</p>
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
            width: '40px', height: '40px', background: 'var(--accent-cyan)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)', flexShrink: 0
          }}>
            <ShieldAlert size={24} color="#020617" />
          </div>
          {(!sidebarCollapsed || mobileMenuOpen) && (
            <div style={{ overflow: 'hidden' }}>
              <h1 style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TRANSICIÓN GAMEA</h1>
              <p style={{ fontSize: '8px', color: 'var(--text-dim)', fontWeight: '800', textTransform: 'uppercase' }}>Gestión Eliser Roca</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, marginTop: '32px' }}>
          <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>PANEL ESTRATÉGICO</span>}
          </button>
          <button onClick={() => { setActiveTab('gabinete'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'gabinete' ? 'active' : ''}`}>
            <Users size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>ESTRUCTURA GAMEA</span>}
          </button>
          <button onClick={() => { setActiveTab('seguimiento'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'seguimiento' ? 'active' : ''}`}>
            <Activity size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>MONITOR ALERTAS</span>}
          </button>
          <button onClick={() => { setActiveTab('reportes'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'reportes' ? 'active' : ''}`}>
            <FileText size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>REPORTES PRENSA</span>}
          </button>
          <button onClick={() => { setActiveTab('carga'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'carga' ? 'active' : ''}`}>
            <Upload size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>CARGA DIGITAL</span>}
          </button>
          <button onClick={() => { setActiveTab('terminal'); setMobileMenuOpen(false); }} className={`nav-item ${activeTab === 'terminal' ? 'active' : ''}`}>
            <TerminalIcon size={18} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>SISTEMA CORE</span>}
          </button>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
           <input 
            type="file" 
            accept=".csv" 
            id="csv-upload-main" 
            style={{ display: 'none' }} 
            onChange={handleCSVUpload}
          />
          <button onClick={() => document.getElementById('csv-upload-main').click()} className="btn btn-ghost" style={{ width: '100%', fontSize: '10px', justifyContent: 'center' }}>
            <Upload size={14} /> {(!sidebarCollapsed || mobileMenuOpen) && 'CARGAR CSV'}
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
            
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase' }}>GOBIERNO AUTÓNOMO MUNICIPAL DE EL ALTO</p>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: 'white', letterSpacing: '0.1em' }}>
                {activeTab.toUpperCase()} —— <span style={{ color: 'var(--accent-cyan)' }}>TRANSICIÓN 2026</span>
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-dim)' }}>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%', border: '2px solid #020617' }} />
                <AlertCircle size={20} />
              </motion.div>
              <motion.div whileHover={{ color: 'white' }} style={{ cursor: 'pointer' }}><Settings size={20} /></motion.div>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', className: 'hidden-mobile' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>{data.alcalde_electo}</p>
                <p style={{ fontSize: '9px', color: 'var(--accent-cyan)', fontWeight: '700' }}>ALCALDE ELECTO</p>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/100?u=eliser" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-viewport">
          <AnimatePresence mode="wait">
            
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <PanelControlScreen data={data} />
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

            {activeTab === 'carga' && (
              <motion.div key="carga" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CargaInformacionScreen />
              </motion.div>
            )}

            {activeTab === 'terminal' && (
               <motion.div key="terminal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '48px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>Core System Alpha</h2>
                      <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '14px' }}>Centro de monitoreo de activos digitales y auditoría de red institucional.</p>
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
          GAMEA TRANSITION HUD v2.7.0 // MAYOR ELECT ELISER ROCA
        </p>
      </div>

    </div>
  );
};

export default App;
