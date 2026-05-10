import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setReports(data);
    } catch (err) {
      console.warn('Usando respaldo de localStorage:', err);
      const local = localStorage.getItem('gamea_reports');
      if (local) setReports(JSON.parse(local));
    }
  };

  const fetchSecretarias = async () => {
    try {
      const { data, error } = await supabase
        .from('secretarias')
        .select('*')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setSecretarias(data);
    } catch (err) {
      console.error('Error al cargar secretarias:', err);
    }
  };

  const fetchDirecciones = async (secId) => {
    try {
      const { data, error } = await supabase
        .from('direcciones')
        .select('*')
        .eq('secretaria_id', secId)
        .order('nombre', { ascending: true });
      if (error) throw error;
      setDirecciones(data);
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
    }
  };

  const fetchUnidades = async (dirId) => {
    try {
      const { data, error } = await supabase
        .from('unidades')
        .select('*')
        .eq('direccion_id', dirId)
        .order('nombre', { ascending: true });
      if (error) throw error;
      setUnidades(data);
    } catch (err) {
      console.error('Error al cargar unidades:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      if (typeof id === 'string' && id.length > 20) {
        const { error } = await supabase.from('reports').delete().eq('id', id);
        if (error) throw error;
      }
    } catch (err) {
      console.error('Error al eliminar en Supabase:', err);
      alert('Error al eliminar el reporte del servidor, pero se quitará de la vista local.');
    }

    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('gamea_reports', JSON.stringify(updated));
  };

  useEffect(() => {
    fetchSecretarias();
    fetchReports();
  }, []);

  return {
    reports, setReports,
    secretarias,
    direcciones,
    unidades,
    isSaving, setIsSaving,
    fetchReports, fetchSecretarias, fetchDirecciones, fetchUnidades,
    handleDelete
  };
};
