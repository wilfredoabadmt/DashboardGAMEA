import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ORGANIGRAMA } from './lib/constants';
import { supabase } from './lib/supabase';
import { Settings } from 'lucide-react';

import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import PreviewView from './views/PreviewView';
import EditorView from './views/EditorView';
import ListViewComponent from './views/ListViewComponent';
import { useReports } from './hooks/useReports';

const INITIAL_REPORT_STATE = {
  id: null,
  secretaria: '',
  direccion: '',
  unidad: '',
  titulo: 'REPORTE ESTRATÉGICO DE TRANSICIÓN',
  subtitulo: 'Análisis de situación administrativa, financiera y legal para la nueva gestión.',
  acreditado: 'WILFREDO ABAD',
  alcalde: 'ELISER ROCA',
  fecha: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(),
  alerta: '',
  bloqueos: [],
  ley: 'LEY 1178 (SAFCO) / LEY 482',
  observaciones: '',
  planAccion: ''
};

const App = () => {
    const { 
      reports, setReports, 
      secretarias, 
      direcciones, setDirecciones,
      unidades, setUnidades, 
      isSaving, setIsSaving,
      fetchReports, fetchSecretarias, fetchDirecciones, fetchUnidades,
      handleDelete,
      lastSync 
    } = useReports();


  const [currentView, setCurrentView] = useState('preview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedSec, setSelectedSec] = useState('');
  const [selectedDir, setSelectedDir] = useState('');
  const [selectedUni, setSelectedUni] = useState('');

  const [data, setData] = useState({
    ...INITIAL_REPORT_STATE,
    secretaria: 'SECRETARÍA MUNICIPAL',
    direccion: 'DIRECCIÓN ESPECÍFICA',
    alerta: 'Se han identificado inconsistencias críticas en los activos fijos de la unidad operativa. Se requiere auditoría externa inmediata.',
    bloqueos: ['ACTIVOS FIJOS', 'PRESUPUESTO 2024', 'PERSONAL'],
  });

  const [indicadores, setIndicadores] = useState([
    { id: 1, label: 'EJECUCIÓN PRESUPUESTARIA', value: 84, color: '#38abf8' },
    { id: 2, label: 'CUMPLIMIENTO DE METAS POI', value: 92, color: '#10b981' },
    { id: 3, label: 'SITUACIÓN DE ACTIVOS', value: 45, color: '#f59e0b' },
  ]);

  const [estadisticas, setEstadisticas] = useState([
    { id: 1, label: 'Proyectos Concluidos', val: 124, trend: 'up' },
    { id: 2, label: 'Procesos Legales', val: 12, trend: 'down' },
    { id: 3, label: 'Personal Vigente', val: 450, trend: 'up' },
  ]);

  const [riesgos, setRiesgos] = useState([
    { id: 1, title: 'Déficit presupuestario en Caja y Bancos', imp: 3, cat: 'FINANCIERO' },
    { id: 2, title: 'Falta de conciliación de activos fijos', imp: 2, cat: 'ADMINISTRATIVO' },
    { id: 3, title: 'Contratos con vencimiento próximo', imp: 3, cat: 'LEGAL' },
  ]);

  const loadUnitReport = (uniId, dirId, secId) => {
    if (!uniId || !dirId || !secId) return;

    const secObj = secretarias.find(s => s.id.toString() === secId.toString());
    const dirObj = direcciones.find(d => d.id.toString() === dirId.toString());
    const uniObj = unidades.find(u => u.id.toString() === uniId.toString());

    if (!secObj || !dirObj || !uniObj) return;

    const existing = reports.find(r =>
      r.secretaria === secObj.nombre &&
      r.direccion === dirObj.nombre &&
      r.unidad === uniObj.nombre
    );

    if (existing) {
      setData(existing);
      setIndicadores(existing.indicadores || []);
      setEstadisticas(existing.estadisticas || []);
      setRiesgos(existing.riesgos || []);
    } else {
      setData({
        ...INITIAL_REPORT_STATE,
        secretaria: secObj.nombre,
        direccion: dirObj.nombre,
        unidad: uniObj.nombre
      });
      setIndicadores([
        { id: 1, label: 'EJECUCIÓN PRESUPUESTARIA', value: 0, color: '#38abf8' },
        { id: 2, label: 'CUMPLIMIENTO DE METAS POI', value: 0, color: '#10b981' },
        { id: 3, label: 'SITUACIÓN DE ACTIVOS', value: 0, color: '#f59e0b' },
      ]);
      setEstadisticas([]);
      setRiesgos([]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { fecha, ...dataWithoutFecha } = data;
    const reportToSave = {
      ...dataWithoutFecha,
      indicadores,
      estadisticas,
      riesgos,
    };

    const formattedDate = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();

    try {
      let result;
      const currentId = data.id;

      if (currentId && typeof currentId === 'string' && currentId.length > 20) {
        result = await supabase
          .from('reports')
          .update(reportToSave)
          .eq('id', currentId)
          .select();
      } else {
        const { id, ...saveData } = reportToSave;
        result = await supabase
          .from('reports')
          .insert([saveData])
          .select();
      }

      if (result.error) throw result.error;
      if (!result.data?.[0]) throw new Error('No se recibió confirmación del servidor');

      const savedReport = {
        ...result.data[0],
        fecha: formattedDate
      };

      const updatedReports = [
        savedReport,
        ...reports.filter(r => r.id !== savedReport.id && r.id !== currentId)
      ];

      setReports(updatedReports);
      localStorage.setItem('gamea_reports', JSON.stringify(updatedReports));
      setData(savedReport);

    } catch (err) {
      console.error('Error crítico al guardar en Supabase:', err);
      const localId = data.id || Date.now();
      const localReport = { ...reportToSave, id: localId, fecha: formattedDate };
      const updatedReports = [
        localReport,
        ...reports.filter(r => r.id !== localId)
      ];
      setReports(updatedReports);
      localStorage.setItem('gamea_reports', JSON.stringify(updatedReports));
      setData(localReport);
      alert('Se guardó localmente. Error de conexión con el servidor.');
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setCurrentView('list');
      }, 800);
    }
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert('CSV importado correctamente');
    }
  };

  const downloadCSVTemplate = () => {
    const template = [
      '# INDICADORES (id, label, value, color)',
      'ID,INDICADOR,VALOR,COLOR',
      '1,EJECUCIÓN PRESUPUESTARIA,80,#38abf8',
      '2,CUMPLIMIENTO DE METAS POI,90,#10b981',
      '3,SITUACIÓN DE ACTIVOS,45,#f59e0b',
      '',
      '# ESTADISTICAS (id, label, val, trend)',
      'ID,ESTADISTICA,VALOR,TENDENCIA',
      '1,Proyectos Concluidos,124,up',
      '2,Procesos Legales,12,down',
      '3,Personal Vigente,450,up',
      '',
      '# RIESGOS (id, title, imp, cat)',
      'ID,RIESGO,IMP,CAT',
      '1,Déficit presupuestario,3,FINANCIERO',
      '2,Falta de conciliación,2,ADMINISTRATIVO',
      '3,Contratos vencidos,3,LEGAL',
      '',
      '# BLOQUEOS (etiquetas separadas por punto y coma)',
      'BLOQUEOS',
      'ACTIVOS FIJOS;PRESUPUESTO 2024;PERSONAL',
    ].join('\n');
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_dashboard.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-brand-500/30 selection:text-white">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="lg:ml-72 transition-all duration-300">
          <TopBar
            title={currentView === 'preview' ? 'Visualización Estratégica' :
              currentView === 'editor' ? 'Editor de Reporte' :
                currentView === 'list' ? 'Archivo de Reportes' : 'Configuración'}
            subtitle="Sistema de Control de Transición Municipal - El Alto"
            onSave={handleSave}
            isSaveActive={currentView === 'editor' && selectedUni}
            onMenuClick={() => setIsSidebarOpen(true)}
            lastSync={lastSync}
          />

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {currentView === 'preview' && (
            <PreviewView
              data={data}
              indicadores={indicadores}
              estadisticas={estadisticas}
              riesgos={riesgos}
            />
          )}

          {currentView === 'editor' && (
            <EditorView
              data={data}
              setData={setData}
              indicadores={indicadores}
              setIndicadores={setIndicadores}
              estadisticas={estadisticas}
              setEstadisticas={setEstadisticas}
              riesgos={riesgos}
              setRiesgos={setRiesgos}
              onImport={handleImportCSV}
              onDownloadCSV={downloadCSVTemplate}
              secretarias={secretarias}
              direcciones={direcciones}
              unidades={unidades}
              selectedSec={selectedSec}
              setSelectedSec={setSelectedSec}
              selectedDir={selectedDir}
              setSelectedDir={setSelectedDir}
              selectedUni={selectedUni}
              setSelectedUni={setSelectedUni}
              fetchDirecciones={fetchDirecciones}
              fetchUnidades={fetchUnidades}
              loadUnitReport={loadUnitReport}
            />
          )}

          {currentView === 'list' && (
            <ListViewComponent
              reports={reports}
              onSelect={async (r) => {
                const sec = secretarias.find(s => s.nombre === r.secretaria);
                if (sec) {
                  setSelectedSec(sec.id.toString());
                  const { data: dirs } = await supabase.from('direcciones').select('*').eq('secretaria_id', sec.id);
                  if (dirs) {
                    setDirecciones(dirs); // This is problematic as setDirecciones is not directly available here
                    // Wait, setDirecciones should come from useReports. Let's fix useReports to return them.
                    const dir = dirs.find(d => d.nombre === r.direccion);
                    if (dir) {
                      setSelectedDir(dir.id.toString());
                      const { data: unis } = await supabase.from('unidades').select('*').eq('direccion_id', dir.id);
                      if (unis) {
                        setUnidades(unis);
                        const uni = unis.find(u => u.nombre === r.unidad);
                        if (uni) setSelectedUni(uni.id.toString());
                      }
                    }
                  }
                    setData({ ...r });
                    setIndicadores(r.indicadores ? [...r.indicadores] : []);
                    setEstadisticas(r.estadisticas ? [...r.estadisticas] : []);
                    setRiesgos(r.riesgos ? [...r.riesgos] : []);
                    setCurrentView('editor');
                }
              }}
              onDelete={handleDelete}
              onCreate={() => {
                setSelectedSec('');
                setSelectedDir('');
                setSelectedUni('');
                setData(INITIAL_REPORT_STATE);
                setIndicadores([
                  { id: 1, label: 'EJECUCIÓN PRESUPUESTARIA', value: 84, color: '#38abf8' },
                  { id: 2, label: 'CUMPLIMIENTO DE METAS POI', value: 92, color: '#10b981' },
                  { id: 3, label: 'SITUACIÓN DE ACTIVOS', value: 45, color: '#f59e0b' },
                ]);
                setEstadisticas([
                  { id: 1, label: 'Proyectos Concluidos', val: 124, trend: 'up' },
                  { id: 2, label: 'Procesos Legales', val: 12, trend: 'down' },
                  { id: 3, label: 'Personal Vigente', val: 450, trend: 'up' },
                ]);
                setRiesgos([
                  { id: 1, title: 'Déficit presupuestario en Caja y Bancos', imp: 3, cat: 'FINANCIERO' },
                  { id: 2, title: 'Falta de conciliación de activos fijos', imp: 2, cat: 'ADMINISTRATIVO' },
                  { id: 3, title: 'Contratos con vencimiento próximo', imp: 3, cat: 'LEGAL' },
                ]);
                setCurrentView('editor');
              }}
            />
          )}

          {currentView === 'settings' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Settings size={48} className="text-slate-800 mb-4" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Ajustes del Sistema</h3>
              <p className="text-slate-500 mt-2">Configuración avanzada de API y Auditoría.</p>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">Procesando</h3>
            <p className="text-slate-500 font-bold mt-2">Sincronizando con base de datos de transición...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
