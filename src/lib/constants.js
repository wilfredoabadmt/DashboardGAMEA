export const ORGANIGRAMA = [
  { 
    id: "SEC-SMAF",
    name: "SEC. MUN. DE ADMINISTRACIÓN Y FINANZAS (SMAF)", 
    direcciones: [
      {
        id: "DIR-ADMIN",
        name: "Dirección Administrativa",
        unidades: ["Unidad de Servicios Generales", "Unidad de Almacenes", "Unidad de Activos Fijos"]
      },
      {
        id: "DIR-TESORO",
        name: "Dirección del Tesoro",
        unidades: ["Unidad de Programación Financiera", "Unidad de Contabilidad", "Unidad de Crédito Público"]
      },
      {
        id: "DIR-RRHH",
        name: "Dirección de Recursos Humanos",
        unidades: ["Unidad de Planillas", "Unidad de Escalafón", "Unidad de Bienestar Social"]
      }
    ]
  },
  { 
    id: "SEC-SMGI",
    name: "SEC. MUN. DE GESTIÓN INSTITUCIONAL", 
    direcciones: [
      {
        id: "DIR-LEGAL",
        name: "Dirección de Asesoría Legal",
        unidades: ["Unidad de Procesos Penales", "Unidad de Contrataciones", "Unidad Normativa"]
      },
      {
        id: "DIR-PLAN",
        name: "Dirección de Planificación",
        unidades: ["Unidad de Seguimiento POA", "Unidad de Inversión Pública", "Unidad de Estadísticas"]
      },
      {
        id: "DIR-TIC",
        name: "Dirección de Tecnologías de Información (TIC)",
        unidades: ["Unidad de Desarrollo de Sistemas", "Unidad de Infraestructura", "Unidad de Soporte Técnico"]
      }
    ]
  },
  { 
    id: "SEC-SMS",
    name: "SEC. MUN. DE SALUD", 
    direcciones: [
      {
        id: "DIR-HOSP",
        name: "Dirección de Gestión Hospitalaria",
        unidades: ["Unidad de Hospitales de 2do Nivel", "Unidad de Centros de Salud", "Unidad de Farmacia"]
      },
      {
        id: "DIR-SP",
        name: "Dirección de Salud Pública",
        unidades: ["Unidad de Epidemiología", "Unidad de Zoonosis", "Unidad de Saneamiento"]
      }
    ]
  },
  { 
    id: "SEC-SMIP",
    name: "SEC. MUN. DE INFRAESTRUCTURA PÚBLICA", 
    direcciones: [
      {
        id: "DIR-OP",
        name: "Dirección de Obras Públicas",
        unidades: ["Unidad de Pavimentos", "Unidad de Puentes", "Unidad de Equipamiento"]
      },
      {
        id: "DIR-SUPER",
        name: "Dirección de Supervisión de Obras",
        unidades: ["Unidad de Control de Calidad", "Unidad de Fiscalización", "Unidad de Auditoría Técnica"]
      }
    ]
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
