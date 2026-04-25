import { useState, useEffect } from 'react'
import SkillCard from './SkillCard'
import { loadSkills, getSkillsByCategory } from '../lib/skillsLoader'
import { getSavedActiveSkills, saveActiveSkills, clearSavedSkills, getLastSaveInfo, exportSkillsConfig, importSkillsConfig } from '../lib/skillsStorage'
import './SkillsPanel.css'

export default function SkillsPanel() {
  const [skills, setSkills] = useState([])
  const [skillsByCategory, setSkillsByCategory] = useState({})
  const [activeSkills, setActiveSkills] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSkills, setFilteredSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastSaveInfo, setLastSaveInfo] = useState(null)

  // Carga inicial de skills
  useEffect(() => {
    async function init() {
      try {
        const loadedSkills = await loadSkills()
        const grouped = await getSkillsByCategory()
        const savedSkills = getSavedActiveSkills()
        
        setSkills(loadedSkills)
        setSkillsByCategory(grouped)
        setActiveSkills(savedSkills)
        setFilteredSkills(loadedSkills)
        setLastSaveInfo(getLastSaveInfo())
      } catch (error) {
        console.error('Error loading skills:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Auto-guarda los skills activos cuando cambian
  useEffect(() => {
    if (skills.length > 0) {
      saveActiveSkills(activeSkills)
    }
  }, [activeSkills, skills.length])

  // Maneja búsqueda
  useEffect(() => {
    const filtered = searchQuery.trim() === ''
      ? skills
      : skills.filter(skill =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredSkills(filtered)
  }, [searchQuery, skills])

  const toggleSkill = (skillName) => {
    setActiveSkills(prev => {
      if (prev.includes(skillName)) {
        return prev.filter(s => s !== skillName)
      } else {
        return [...prev, skillName]
      }
    })
  }

  const activateAll = () => {
    setActiveSkills(skills.map(s => s.name))
  }

  const deactivateAll = () => {
    setActiveSkills([])
  }

  const handleExportConfig = () => {
    const config = exportSkillsConfig(activeSkills)
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `skills-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const imported = importSkillsConfig(event.target?.result)
            setActiveSkills(imported)
          } catch (error) {
            alert('Error importing skills config: ' + error.message)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleResetConfig = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todas las preferencias guardadas?')) {
      clearSavedSkills()
      setActiveSkills([])
      setLastSaveInfo(null)
    }
  }

  if (loading) {
    return <div className="skills-panel loading">Cargando habilidades...</div>
  }

  const categoryCounts = Object.entries(skillsByCategory).reduce((acc, [cat, list]) => {
    acc[cat] = list.length
    return acc
  }, {})

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <h2>Habilidades del Sistema</h2>
        <p className="skills-subtitle">
          Total: <strong>{skills.length}</strong> | Activas: <strong>{activeSkills.length}</strong>
        </p>
      </div>

      <div className="skills-toolbar">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar habilidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-activate"
            onClick={activateAll}
            title="Activar todas"
          >
            Activar todas
          </button>
          <button
            className="btn btn-deactivate"
            onClick={deactivateAll}
            title="Desactivar todas"
          >
            Desactivar todas
          </button>
          <button
            className="btn btn-export"
            onClick={handleExportConfig}
            title="Exportar configuración"
          >
            📥 Exportar
          </button>
          <button
            className="btn btn-import"
            onClick={handleImportConfig}
            title="Importar configuración"
          >
            📤 Importar
          </button>
          <button
            className="btn btn-reset"
            onClick={handleResetConfig}
            title="Limpiar preferencias"
          >
            🔄 Limpiar
          </button>
        </div>
      </div>

      {lastSaveInfo && (
        <div className="save-info">
          <small>
            ✓ Guardado: {new Date(lastSaveInfo.timestamp).toLocaleString()} 
            ({lastSaveInfo.count} habilidades activas)
          </small>
        </div>
      )}

      <div className="skills-stats">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <div key={category} className={`stat stat-${category}`}>
            <span className="stat-label">{category}</span>
            <span className="stat-value">{count}</span>
          </div>
        ))}
      </div>

      <div className="skills-list">
        {filteredSkills.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron habilidades</p>
          </div>
        ) : (
          filteredSkills.map(skill => (
            <SkillCard
              key={skill.name}
              skill={skill}
              isActive={activeSkills.includes(skill.name)}
              onToggle={toggleSkill}
            />
          ))
        )}
      </div>

      {activeSkills.length > 0 && (
        <div className="active-skills-footer">
          <h3>Habilidades activas:</h3>
          <div className="active-skills-tags">
            {activeSkills.map(skillName => (
              <span key={skillName} className="skill-tag">
                {skillName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
