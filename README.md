# 🏛️ GAMEA: Tablero Estratégico de Transición Gubernamental 2026

### Gestión de Fiscalización y Relevamiento —— Eliser Roca Tancara

Este sistema de alta fidelidad ha sido diseñado específicamente para la administración del **Alcalde Electo de El Alto, Eliser Roca**, como herramienta central para la recepción de activos, procesos y documentación de la gestión saliente de la **Alcaldesa Eva Copa**.

## 📊 Propósito del Proyecto

El **Dashboard GAMEA** permite digitalizar el proceso de transición mediante el análisis de datos reales recopilados de cada Secretaría Municipal, Dirección y Unidad. El objetivo es proporcionar una radiografía clara y profesional de la situación institucional del Gobierno Autónomo Municipal de El Alto (GAMEA).

### Funcionalidades Clave

*   **🔍 Análisis de Falencias y Virtudes**: Identificación sistemática de errores críticos, deficiencias administrativas y aciertos de la gestión anterior.
*   **📂 Carga Digital vía CSV**: Módulo de ingesta masiva de datos para secretarías y unidades, permitiendo una transición ágil y documentada.
*   **🏢 Gestión de Estructura Municipal**: Visualización dinámica del organigrama institucional y el estado de recepción de cada nodo.
*   **⚠️ Monitor de Alertas Críticas**: Sistema de detección temprana de bloqueos, falta de credenciales o inconsistencias financieras.
*   **📰 Módulo de Prensa**: Generación de informes ejecutivos de alta calidad visual para presentaciones públicas y conferencias de prensa.

## 🛠️ Stack Tecnológico

*   **Frontend**: React 19 + Vite (Rendimiento ultra-rápido)
*   **Visualización**: Framer Motion + Lucide React (Interfaces dinámicas y profesionales)
*   **Persistencia**: Supabase (Backend as a Service para datos en tiempo real)
*   **Procesamiento**: Papaparse (Parsing robusto de documentos CSV)
*   **Estilos**: CSS Custom Properties + Modern Design System (Glassmorphism & High-Contrast)

## 📁 Guía de Carga de Datos (CSV)

Para cargar información real, el sistema acepta archivos CSV con la siguiente estructura sugerida:

| tipo | nombre / secretaria | valor | falencias | virtudes | estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| indicador | Documentación Legal | 75 | 15 | 40 | Normal |
| proceso | Sec. Finanzas | 0 | Falta de backups | Archivos ordenados | Alerta |

## 🚀 Instalación y Despliegue

```bash
# Clonar el repositorio
git clone https://github.com/wilfredoabadmt/DashboardGAMEA.git

# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key

# Iniciar en modo desarrollo
npm run dev
```

---
**SISTEMA DE CONTROL GUBERNAMENTAL // NIVEL DE ACCESO 4 // GAMEA 2026**
