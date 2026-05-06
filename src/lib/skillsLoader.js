/**
 * Skill Loader - Carga y parsea los archivos SKILL.md desde la carpeta skills/
 */

/**
 * Parsea el frontmatter YAML de un archivo SKILL.md
 * @param {string} content - Contenido del archivo
 * @returns {Object} - { metadata, body }
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, body: content };

  const yamlContent = match[1];
  const body = match[2];
  const metadata = {};

  // Parse simple YAML
  const lines = yamlContent.split('\n');
  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata[key.trim()] = value;
    }
  });

  return { metadata, body };
}

/**
 * Obtiene la lista de skills disponibles desde la carpeta skills/
 * En desarrollo, esto sería cargado dinámicamente. En producción,
 * se puede usar un archivo JSON pre-generado.
 */
export async function loadSkills() {
  try {
    const skillsMetadata = {
      'ab-test-setup': {
        name: 'ab-test-setup',
        description: 'Diseña y ejecuta pruebas A/B estadísticamente rigurosas',
        category: 'marketing',
        version: '1.1.0'
      },
      'ad-creative': {
        name: 'ad-creative',
        description: 'Genera y escala creative para publicidad pagada',
        category: 'marketing',
        version: '1.1.0'
      },
      'ai-seo': {
        name: 'ai-seo',
        description: 'Optimiza contenido para motores de búsqueda IA',
        category: 'marketing',
        version: '1.1.0'
      },
      'analytics-tracking': {
        name: 'analytics-tracking',
        description: 'Configura y optimiza seguimiento analítico',
        category: 'marketing',
        version: '1.1.0'
      },
      'churn-prevention': {
        name: 'churn-prevention',
        description: 'Reduce abandono y recupera clientes perdidos',
        category: 'marketing',
        version: '1.1.0'
      },
      'claude-code': {
        name: 'claude-code',
        description: 'Desarrollo con Claude Code plugins',
        category: 'development',
        version: '1.0.0'
      },
      'cold-email': {
        name: 'cold-email',
        description: 'Crea secuencias de cold email efectivas',
        category: 'marketing',
        version: '1.1.0'
      },
      'competitor-alternatives': {
        name: 'competitor-alternatives',
        description: 'Analiza alternativas y competidores',
        category: 'marketing',
        version: '1.0.0'
      },
      'content-strategy': {
        name: 'content-strategy',
        description: 'Desarrolla estrategia de contenido',
        category: 'marketing',
        version: '1.0.0'
      },
      'copy-editing': {
        name: 'copy-editing',
        description: 'Edita y mejora copy de marketing existente',
        category: 'marketing',
        version: '1.0.0'
      },
      'copywriting': {
        name: 'copywriting',
        description: 'Escribe copy de marketing desde cero',
        category: 'marketing',
        version: '1.0.0'
      },
      'email-sequence': {
        name: 'email-sequence',
        description: 'Diseña secuencias de correo automatizadas',
        category: 'marketing',
        version: '1.0.0'
      },
      'form-cro': {
        name: 'form-cro',
        description: 'Optimiza formularios para mayor conversión',
        category: 'marketing',
        version: '1.0.0'
      },
      'free-tool-strategy': {
        name: 'free-tool-strategy',
        description: 'Estrategia de herramientas gratuitas para captación',
        category: 'marketing',
        version: '1.0.0'
      },
      'launch-strategy': {
        name: 'launch-strategy',
        description: 'Planificación de lanzamientos de productos',
        category: 'marketing',
        version: '1.0.0'
      },
      'marketing-ideas': {
        name: 'marketing-ideas',
        description: 'Generación de ideas creativas de marketing',
        category: 'marketing',
        version: '1.0.0'
      },
      'marketing-psychology': {
        name: 'marketing-psychology',
        description: 'Aplicación de psicología al marketing',
        category: 'marketing',
        version: '1.0.0'
      },
      'onboarding-cro': {
        name: 'onboarding-cro',
        description: 'Optimización del proceso de bienvenida',
        category: 'marketing',
        version: '1.0.0'
      },
      'page-cro': {
        name: 'page-cro',
        description: 'Optimiza páginas para conversión',
        category: 'marketing',
        version: '1.0.0'
      },
      'paid-ads': {
        name: 'paid-ads',
        description: 'Estrategia y optimización de campañas pagadas',
        category: 'marketing',
        version: '1.0.0'
      },
      'paywall-upgrade-cro': {
        name: 'paywall-upgrade-cro',
        description: 'Optimización de muros de pago y upgrades',
        category: 'marketing',
        version: '1.0.0'
      },
      'popup-cro': {
        name: 'popup-cro',
        description: 'Optimización de popups y captación',
        category: 'marketing',
        version: '1.0.0'
      },
      'pricing-strategy': {
        name: 'pricing-strategy',
        description: 'Define estrategia de pricing y monetización',
        category: 'marketing',
        version: '1.0.0'
      },
      'product-marketing-context': {
        name: 'product-marketing-context',
        description: 'Crea contexto de marketing del producto',
        category: 'marketing',
        version: '1.0.0'
      },
      'programmatic-seo': {
        name: 'programmatic-seo',
        description: 'Genera páginas a escala para SEO',
        category: 'marketing',
        version: '1.0.0'
      },
      'referral-program': {
        name: 'referral-program',
        description: 'Diseña programas de referidos efectivos',
        category: 'marketing',
        version: '1.0.0'
      },
      'revops': {
        name: 'revops',
        description: 'Optimización de operaciones de ingresos',
        category: 'marketing',
        version: '1.0.0'
      },
      'sales-enablement': {
        name: 'sales-enablement',
        description: 'Capacitación y herramientas para ventas',
        category: 'marketing',
        version: '1.0.0'
      },
      'schema-markup': {
        name: 'schema-markup',
        description: 'Implementación de datos estructurados',
        category: 'marketing',
        version: '1.0.0'
      },
      'seo-audit': {
        name: 'seo-audit',
        description: 'Audita y diagnostica problemas SEO',
        category: 'marketing',
        version: '1.0.0'
      },
      'signup-flow-cro': {
        name: 'signup-flow-cro',
        description: 'Optimización del flujo de registro',
        category: 'marketing',
        version: '1.0.0'
      },
      'site-architecture': {
        name: 'site-architecture',
        description: 'Optimización de arquitectura web',
        category: 'marketing',
        version: '1.0.0'
      },
      'social-content': {
        name: 'social-content',
        description: 'Estrategia de contenido para redes sociales',
        category: 'marketing',
        version: '1.0.0'
      }
    };

    return Object.values(skillsMetadata);
  } catch (error) {
    console.error('Error loading skills:', error);
    return [];
  }
}

/**
 * Obtiene un skill específico por nombre
 */
export async function getSkill(skillName) {
  const skills = await loadSkills();
  return skills.find(s => s.name === skillName) || null;
}

/**
 * Agrupa skills por categoría
 */
export async function getSkillsByCategory() {
  const skills = await loadSkills();
  const grouped = {};

  skills.forEach(skill => {
    const category = skill.category || 'other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(skill);
  });

  return grouped;
}

/**
 * Busca skills por nombre o descripción
 */
export async function searchSkills(query) {
  const skills = await loadSkills();
  const q = query.toLowerCase();

  return skills.filter(skill => 
    skill.name.toLowerCase().includes(q) ||
    skill.description.toLowerCase().includes(q)
  );
}

export { parseFrontmatter };
