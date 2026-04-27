import { supabase } from './supabase'

/**
 * Carga la configuración global del dashboard
 */
export async function fetchDashboardConfig() {
  const { data, error } = await supabase
    .from('dashboard_config')
    .select('*')
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching config:', error)
    return null
  }
  return data
}

/**
 * Guarda o actualiza la configuración global
 */
export async function saveDashboardConfig(config) {
  const { data, error } = await supabase
    .from('dashboard_config')
    .upsert({
      id: config.id || 'default-config', // Usamos un ID fijo para la config global por ahora
      titulo: config.titulo,
      subtitulo: config.subtitulo,
      acreditado: config.acreditado,
      secretaria: config.secretaria,
      direccion: config.direccion,
      updated_at: new Date().toISOString()
    })
  
  if (error) throw error
  return data
}

/**
 * Carga todos los indicadores
 */
export async function fetchIndicadores() {
  const { data, error } = await supabase
    .from('indicadores')
    .select('*')
    .order('id', { ascending: true })
  
  if (error) {
    console.error('Error fetching indicadores:', error)
    return []
  }
  return data
}

/**
 * Sincroniza los indicadores (bulk upsert)
 */
export async function syncIndicadores(indicadores) {
  const formatted = indicadores.map(ind => ({
    id: ind.id,
    label: ind.label,
    value: ind.value,
    viz_type: ind.vizType,
    color: ind.color,
    params: ind.params,
    updated_at: new Date().toISOString()
  }))

  const { error } = await supabase
    .from('indicadores')
    .upsert(formatted)
  
  if (error) throw error
}
