/**
 * Skills Storage - Gestiona la persistencia de skills activos en localStorage
 */

const STORAGE_KEY = 'dashboardgamea_active_skills'
const STORAGE_VERSION = '1.0'

/**
 * Obtiene los skills activos almacenados
 */
export function getSavedActiveSkills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    
    const data = JSON.parse(saved)
    return Array.isArray(data.skills) ? data.skills : []
  } catch (error) {
    console.error('Error loading saved skills:', error)
    return []
  }
}

/**
 * Guarda los skills activos
 */
export function saveActiveSkills(skillNames) {
  try {
    const data = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      skills: Array.isArray(skillNames) ? skillNames : []
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving skills:', error)
    return false
  }
}

/**
 * Limpia los skills guardados
 */
export function clearSavedSkills() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing skills:', error)
    return false
  }
}

/**
 * Obtiene información del último guardado
 */
export function getLastSaveInfo() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const data = JSON.parse(saved)
    return {
      timestamp: data.timestamp,
      count: data.skills ? data.skills.length : 0,
      version: data.version
    }
  } catch (error) {
    console.error('Error getting save info:', error)
    return null
  }
}

/**
 * Exporta los skills activos como JSON
 */
export function exportSkillsConfig(activeSkills) {
  const config = {
    version: STORAGE_VERSION,
    exportDate: new Date().toISOString(),
    skills: activeSkills,
    format: 'json'
  }
  return JSON.stringify(config, null, 2)
}

/**
 * Importa una configuración de skills
 */
export function importSkillsConfig(jsonString) {
  try {
    const config = JSON.parse(jsonString)
    if (!Array.isArray(config.skills)) {
      throw new Error('Invalid format: skills must be an array')
    }
    return config.skills
  } catch (error) {
    console.error('Error importing skills config:', error)
    throw error
  }
}
