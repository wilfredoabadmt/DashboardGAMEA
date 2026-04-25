import { useState } from 'react'
import './SkillCard.css'

/**
 * Componente para mostrar un skill individual
 */
export default function SkillCard({ skill, isActive, onToggle }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`skill-card ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <div className="skill-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="skill-info">
          <h3 className="skill-name">{skill.name}</h3>
          <span className={`skill-category ${skill.category}`}>{skill.category}</span>
        </div>
        <div className="skill-controls">
          <button
            className={`toggle-btn ${isActive ? 'enabled' : 'disabled'}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(skill.name)
            }}
            title={isActive ? 'Desactivar' : 'Activar'}
          >
            {isActive ? '✓' : '+'}
          </button>
          <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="skill-card-body">
          <p className="skill-description">{skill.description}</p>
          {skill.version && (
            <div className="skill-meta">
              <small>v{skill.version}</small>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
