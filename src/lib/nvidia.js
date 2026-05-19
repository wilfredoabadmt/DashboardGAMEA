/**
 * Servidor e integraciones para la API de NVIDIA AI
 * Dashboard GAMEA - Transición Estratégica Municipal de El Alto
 */

const DEFAULT_API_KEY = "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";
const MODEL_NAME = "mistralai/mixtral-8x22b-instruct-v0.1";
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

/**
 * Obtiene la clave de API activa de localStorage o usa la predeterminada
 */
export const getNvidiaApiKey = () => {
  return localStorage.getItem('gamea_nvidia_api_key') || DEFAULT_API_KEY;
};

/**
 * Guarda la clave de API en localStorage
 */
export const setNvidiaApiKey = (key) => {
  if (key) {
    localStorage.setItem('gamea_nvidia_api_key', key.trim());
  } else {
    localStorage.removeItem('gamea_nvidia_api_key');
  }
};

/**
 * Realiza una consulta directa a la API de NVIDIA
 */
async function callNvidiaApi(messages, temperature = 0.5, maxTokens = 1024) {
  const apiKey = getNvidiaApiKey();
  
  if (!apiKey) {
    throw new Error("Clave de API de NVIDIA no configurada");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      temperature: temperature,
      top_p: 1,
      max_tokens: maxTokens,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Error en la API de NVIDIA: ${response.statusText}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || "";
}

/**
 * Genera sugerencias de Observaciones de Auditoría basadas en la estructura organizacional de El Alto (Ley 1178 / 482)
 */
export async function generateObservations({ secretaria, direccion, unidad }) {
  const prompt = `Actúa como un Auditor Gubernamental Senior experto en la legislación municipal de Bolivia (Ley 1178 SAFCO y Ley 482 de Gobiernos Autónomos Municipales).
Estás redactando el Reporte de Transición Institucional para el Gobierno Autónomo Municipal de El Alto (GAMEA).

Genera las OBSERVACIONES DE AUDITORÍA críticas para la siguiente ubicación institucional:
- Secretaría: ${secretaria}
- Dirección: ${direccion}
- Unidad: ${unidad}

Requisitos del texto:
1. Sé muy profesional, técnico y directo.
2. Menciona la Ley 1178 (SAFCO), en particular los sistemas de control (SAYCO, SISPLAN, SPO) o la Ley 482 si aplica.
3. Describe de 2 a 3 hallazgos lógicos y comunes para esta área (ej. conciliación de activos fijos, retrasos en ejecución presupuestaria física/financiera, o regularización de contratos).
4. El tono debe ser crítico pero constructivo para el Alcalde electo Eliser Roca.
5. El texto debe estar resumido en un solo párrafo contundente (máximo 120 palabras).
6. NO agregues introducciones vacías como "Aquí tienes..." o "Entendido". Empieza a escribir el párrafo directamente.`;

  return await callNvidiaApi([
    { role: "system", content: "Eres un auditor estatal de Bolivia con más de 20 años de experiencia, experto en control interno municipal y en Ley 1178." },
    { role: "user", content: prompt }
  ], 0.6, 500);
}

/**
 * Genera un Plan de Acción Inmediato basado en las observaciones del reporte
 */
export async function generateActionPlan({ secretaria, direccion, unidad, observaciones }) {
  const prompt = `Actúa como un Asesor Estratégico Municipal para el Alcalde entrante Eliser Roca en El Alto (GAMEA).
Basándote en las siguientes observaciones de transición para la Unidad de ${unidad} (${direccion} - ${secretaria}):

Observaciones:
"${observaciones}"

Genera un PLAN DE ACCIÓN INMEDIATO estratégico.
Requisitos:
1. Propón 3 o 4 medidas correctivas urgentes que se deben tomar en los primeros 90 días de gestión.
2. Incluye plazos realistas y referencias normativas bolivianas (Ley 1178, normas básicas SABS, etc.) cuando corresponda.
3. Formatea las medidas con viñetas limpias y concisas.
4. El párrafo introductorio o de cierre debe ser muy breve, enfocado en resguardar la responsabilidad ejecutiva.
5. NO uses saludos ni cierres conversacionales. Empieza a escribir directamente.`;

  return await callNvidiaApi([
    { role: "system", content: "Eres el jefe de asesores de la comisión de transición para la alcaldía de El Alto, especializado en gobernanza local boliviana." },
    { role: "user", content: prompt }
  ], 0.5, 600);
}

/**
 * Genera Riesgos sugeridos para el área seleccionada
 */
export async function generateSuggestedRisks({ secretaria, direccion, unidad }) {
  const prompt = `Actúa como un Analista de Riesgos en el sector público de Bolivia.
Identifica los 3 riesgos de transición más críticos para la Unidad de ${unidad} (${direccion} - ${secretaria}) en el GAMEA.

Debes devolver obligatoriamente un arreglo JSON válido con 3 objetos. Cada objeto debe tener la siguiente estructura exacta en inglés:
{
  "title": "Descripción corta del riesgo en español (ej. Inconsistencia de inventario en almacenes)",
  "imp": 3, // Nivel de impacto numérico de 1 a 3 (1=Bajo, 2=Medio, 3=Alto)
  "cat": "Categoría en mayúsculas (ej. FINANCIERO, LEGAL, ADMINISTRATIVO, OPERATIVO o TECNOLÓGICO)"
}

Responde ÚNICAMENTE con el bloque JSON. No agregues explicaciones, ni etiquetas de bloque de código, ni formateo markdown. Solo el JSON plano.`;

  const responseText = await callNvidiaApi([
    { role: "system", content: "Eres un sistema automatizado que solo responde en formato JSON puro, sin markdown, sin texto adicional." },
    { role: "user", content: prompt }
  ], 0.4, 600);

  try {
    // Limpiar posibles bloques de código markdown si los hay
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const risks = JSON.parse(cleanText);
    return Array.isArray(risks) ? risks : [];
  } catch (err) {
    console.error("Error parseando riesgos generados por IA:", err, responseText);
    return [];
  }
}

/**
 * Genera Indicadores y Estadísticas sugeridos para el área seleccionada
 */
export async function generateSuggestedMetrics({ secretaria, direccion, unidad }) {
  const prompt = `Actúa como un Administrador de Planificación Municipal (UCP/SISPLAN) para el GAMEA de El Alto.
Sugiere 3 indicadores clave de gestión y 3 estadísticas reales para la Unidad de ${unidad} (${direccion} - ${secretaria}).

Debes responder estrictamente en un formato JSON estructurado como el siguiente ejemplo, sin markdown y sin textos de introducción o cierre:
{
  "indicadores": [
    { "label": "EJECUCIÓN DE INVERSIÓN PÚBLICA", "value": 72, "color": "#38abf8" },
    { "label": "EFICACIA EN COMPRAS MENORES", "value": 88, "color": "#10b981" },
    { "label": "ACTIVOS DEPURADOS EN SINA", "value": 41, "color": "#f59e0b" }
  ],
  "estadisticas": [
    { "label": "Procesos SABS Iniciados", "val": 45, "trend": "up" },
    { "label": "Auditorías Internas Pendientes", "val": 3, "trend": "down" },
    { "label": "Funcionarios con Contrato Eventual", "val": 84, "trend": "up" }
  ]
}

Usa valores numéricos lógicos y colores en hexadecimal para los indicadores. En "trend" usa únicamente "up" o "down".
Responde únicamente el JSON.`;

  const responseText = await callNvidiaApi([
    { role: "system", content: "Eres un sistema automatizado que solo responde en formato JSON puro, sin markdown, sin texto adicional." },
    { role: "user", content: prompt }
  ], 0.5, 800);

  try {
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const metrics = JSON.parse(cleanText);
    return metrics;
  } catch (err) {
    console.error("Error parseando métricas generadas por IA:", err, responseText);
    return { indicadores: [], estadisticas: [] };
  }
}
