export const ORGANIGRAMA = [
  { 
    name: "DESPACHO ALCALDE", 
    units: ["Auditoría Interna", "Dirección de Transparencia", "Asesoría Estratégica", "Dirección de Comunicación", "Dirección de Relaciones Públicas"] 
  },
  { 
    name: "SEC. MUN. DE ADMINISTRACIÓN Y FINANZAS (SMAF)", 
    units: ["Dirección Administrativa", "Dirección del Tesoro", "Dirección de Recursos Humanos", "Dirección de Contabilidad", "Dirección de Activos Fijos", "UASI"] 
  },
  { 
    name: "SEC. MUN. DE GESTIÓN INSTITUCIONAL", 
    units: ["Dirección de Asesoría Legal", "Dirección de Planificación", "Dirección de Tecnologías de Información (TIC)"] 
  },
  { 
    name: "SEC. MUN. DE SALUD", 
    units: ["Dirección de Gestión Hospitalaria", "Dirección de Seguros de Salud", "Dirección de Salud Pública"] 
  },
  { 
    name: "SEC. MUN. DE EDUCACIÓN Y CULTURA", 
    units: ["Dirección de Educación", "Dirección de Culturas", "Dirección de Bibliotecas"] 
  },
  { 
    name: "SEC. MUN. DE DESARROLLO HUMANO", 
    units: ["Dirección de Género", "Dirección de Niñez y Adolescencia", "Dirección de Deportes", "Dirección de Desarrollo Social"] 
  },
  { 
    name: "SEC. MUN. DE INFRAESTRUCTURA PÚBLICA", 
    units: ["Dirección de Obras Públicas", "Dirección de Supervisión de Obras", "Dirección de Alumbrado Público"] 
  },
  { 
    name: "SEC. MUN. DE MOVILIDAD URBANA", 
    units: ["Dirección de Transporte", "Dirección de Vialidad", "Dirección de Bus Municipal"] 
  },
  { 
    name: "SEC. MUN. DE SEGURIDAD CIUDADANA", 
    units: ["Dirección de Prevención", "Dirección de Vigilancia", "Dirección de Intendencia Municipal"] 
  },
  { 
    name: "SEC. MUN. DE AGUA, GESTIÓN AMBIENTAL Y RIESGOS", 
    units: ["Dirección de Saneamiento Básico", "Dirección de Gestión de Riesgos", "Dirección de Medio Ambiente"] 
  },
  { 
    name: "SEC. MUN. DE DESARROLLO ECONÓMICO", 
    units: ["Dirección de Mypes", "Dirección de Turismo", "Dirección de Comercio y Servicios"] 
  }
];

export const SCENARIOS = {
  NORMAL: {
    label: 'Operación Normal',
    indicadores: [
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6', vizType: 'gauge', params: [
        { id: 101, label: 'Manuales de Funciones', done: true },
        { id: 102, label: 'Reglamentos Internos', done: true },
        { id: 103, label: 'POA Actualizado', done: false }
      ]},
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4', vizType: 'bar', params: [
        { id: 201, label: 'Activos Fijos Registrados', done: true },
        { id: 202, label: 'Estado de Servidores', done: false }
      ]},
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 45, status: 'warning', color: '#f59e0b', vizType: 'gauge', params: [
        { id: 301, label: 'Repositorios Git', done: true },
        { id: 302, label: 'Contraseñas de Servidor', done: false },
        { id: 303, label: 'API Keys de Producción', done: false }
      ]},
      { id: 4, label: 'Sistemas Desarrollados', value: 92, status: 'good', color: '#8b5cf6', vizType: 'trend', params: [
        { id: 401, label: 'Módulo Administrativo', done: true },
        { id: 402, label: 'Módulo de Trámites', done: true }
      ]}
    ],
    solicitudes: [
      { unidad: 'UASI', notas: 3, estado: 'Respuesta Parcial', color: 'emerald', icon: 'check' },
      { unidad: 'TESORO', notas: 2, estado: 'En Revisión', color: 'blue', icon: 'clock' },
      { unidad: 'RRHH', notas: 4, estado: 'Pendiente', color: 'dim', icon: 'minus' },
      { unidad: 'ACTIVOS FIJOS', notas: 1, estado: 'Completado', color: 'emerald', icon: 'check' }
    ],
    flujo: [
      { label: 'Comisión TIC', status: 'done' },
      { label: 'Notas', status: 'done' },
      { label: 'Tesoro', status: 'process' },
      { label: 'RRHH', status: 'pending' },
      { label: 'SMAF', status: 'pending' }
    ],
    alerta: 'Operaciones de relevamiento en curso. No se detectan bloqueos críticos actualmente.'
  },
  CRISIS: {
    label: 'Situación de Bloqueo',
    indicadores: [
      { id: 1, label: 'Documentación Normativa', value: 85, status: 'good', color: '#3b82f6', vizType: 'gauge', params: [
        { id: 101, label: 'Manuales de Funciones', done: true },
        { id: 102, label: 'Reglamentos Internos', done: true },
        { id: 103, label: 'POA Actualizado', done: false }
      ]},
      { id: 2, label: 'Inventarios de Hardware', value: 60, status: 'warning', color: '#06b6d4', vizType: 'bar', params: [
        { id: 201, label: 'Activos Fijos Registrados', done: true },
        { id: 202, label: 'Estado de Servidores', done: false }
      ]},
      { id: 3, label: 'Códigos Fuente y Credenciales', value: 0, status: 'locked', color: '#ef4444', vizType: 'gauge', params: [
        { id: 301, label: 'Repositorios Git', done: false },
        { id: 302, label: 'Contraseñas de Servidor', done: false }
      ]},
      { id: 4, label: 'Sistemas Desarrollados', value: 10, status: 'locked', color: '#ef4444', vizType: 'trend', params: [
        { id: 401, label: 'Core Banking', done: false },
        { id: 402, label: 'Módulo de Pagos', done: false }
      ]}
    ],
    solicitudes: [
      { unidad: 'UASI', notas: 3, estado: 'Respuesta Parcial (DAGA/127)', color: 'emerald', icon: 'check' },
      { unidad: 'TESORO', notas: 2, estado: 'Negada Directa (Director)', color: 'red', icon: 'x' },
      { unidad: 'RRHH', notas: 2, estado: 'Negada (Firma Sr. Yapuchura)', color: 'red', icon: 'x' },
      { unidad: 'ACTIVOS FIJOS', notas: 5, estado: 'Puntos 5/20 Bloqueados', color: 'amber', icon: 'alert' }
    ],
    flujo: [
      { label: 'Comisión TIC', status: 'done' },
      { label: 'Notas', status: 'done' },
      { label: 'Tesoro', status: 'blocked', sub: 'RECHAZO DIRECTO' },
      { label: 'RRHH', status: 'blocked', sub: 'RECHAZO DIRECTOR' },
      { label: 'SMAF', status: 'pending' }
    ],
    alerta: 'Sin Backups de últimas 5 gestiones en sistemas críticos de TESORO/RRHH. Negativa taxativa a entregar Credenciales de Alta Jerarquía.'
  }
};

export const INITIAL_DATA = {
  titulo: 'TABLERO ESTRATÉGICO TIC: TRANSICIÓN GAMEA 2026',
  subtitulo: 'INFORME EJECUTIVO DE RELEVAMIENTO TECNOLÓGICO Y RIESGOS',
  fecha: new Date().toISOString().split('T')[0],
  acreditado: 'Wilfredo Abad Mancilla Terán',
  alcalde: 'Elieser Roca Tancara',
  secretaria: 'SEC. MUN. DE ADMINISTRACIÓN Y FINANZAS (SMAF)',
  direccion: 'DIRECCIÓN DEL TESORO',
  ley: 'Ley 1178 (SAFCO)',
  isLive: false,
  ...SCENARIOS.CRISIS
};
