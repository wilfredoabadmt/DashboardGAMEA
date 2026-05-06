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
  TRANSICION_REAL: {
    label: 'Transición Oficial 2026',
    indicadores: [
      { id: 1, label: 'Documentación Legal', value: 78, status: 'good', color: '#3b82f6', vizType: 'gauge', falencias: 12, virtudes: 45, params: [
        { id: 101, label: 'Actas de Recepción', done: true },
        { id: 102, label: 'Resoluciones Administrativas', done: true },
        { id: 103, label: 'Contratos Vigentes', done: false }
      ]},
      { id: 2, label: 'Gestión Financiera', value: 52, status: 'warning', color: '#06b6d4', vizType: 'bar', falencias: 34, virtudes: 18, params: [
        { id: 201, label: 'Conciliaciones Bancarias', done: true },
        { id: 202, label: 'Deuda Flotante', done: false },
        { id: 203, label: 'Presupuesto Ejecutado', done: false }
      ]},
      { id: 3, label: 'Sistemas y Datos', value: 35, status: 'locked', color: '#ef4444', vizType: 'gauge', falencias: 56, virtudes: 5, params: [
        { id: 301, label: 'Base de Datos Catastro', done: true },
        { id: 302, label: 'Credenciales Servidores', done: false },
        { id: 303, label: 'Backups 2021-2025', done: false }
      ]},
      { id: 4, label: 'Recursos Humanos', value: 88, status: 'good', color: '#8b5cf6', vizType: 'trend', falencias: 8, virtudes: 62, params: [
        { id: 401, label: 'Planillas Salariales', done: true },
        { id: 402, label: 'Files de Personal', done: true }
      ]}
    ],
    procesos: [
      { secretaria: 'SMAF', proceso: 'Auditoría de Cajas', estado: 'Alerta', falencias: 'Faltante de documentación en caja chica Q4', virtudes: 'Digitalización completa de comprobantes' },
      { secretaria: 'INFRAESTRUCTURA', proceso: 'Pavimentado Av. 6 de Marzo', estado: 'Retrasado', falencias: 'Falta de planillas de avance físico', virtudes: 'Materiales en almacén verificados' },
      { secretaria: 'SALUD', proceso: 'Suministro Hospitales', estado: 'Óptimo', falencias: 'Mantenimiento de equipos preventivo', virtudes: 'Stock de medicamentos al 95%' }
    ],
    solicitudes: [
      { unidad: 'TESORO', notas: 3, estado: 'Pendiente', color: 'blue', icon: 'clock' },
      { unidad: 'PLANIFICACIÓN', notas: 2, estado: 'Completado', color: 'emerald', icon: 'check' },
      { unidad: 'TIC', notas: 5, estado: 'Bloqueado', color: 'red', icon: 'x' }
    ],
    flujo: [
      { label: 'Recepción Inicial', status: 'done' },
      { label: 'Carga de Datos', status: 'process' },
      { label: 'Análisis de Falencias', status: 'pending' },
      { label: 'Informe de Prensa', status: 'pending' }
    ],
    alerta: 'Se ha detectado inconsistencia en el 40% de las credenciales de sistemas críticos entregadas por la gestión saliente.'
  }
};

export const INITIAL_DATA = {
  titulo: 'TABLERO DE TRANSICIÓN GUBERNAMENTAL GAMEA',
  subtitulo: 'SISTEMA DE CONTROL Y FISCALIZACIÓN - GESTIÓN ELIESER ROCA',
  fecha: new Date().toISOString().split('T')[0],
  acreditado: 'Equipo de Transición Estratégica',
  alcalde_electo: 'Elieser Roca Tancara',
  alcaldesa_saliente: 'Eva Copa Murga',
  institucion: 'Gobierno Autónomo Municipal de El Alto',
  isLive: false,
  ...SCENARIOS.TRANSICION_REAL
};
