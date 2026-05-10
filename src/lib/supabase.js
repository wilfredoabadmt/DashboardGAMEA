import { createClient } from '@supabase/supabase-js'

// Intentar obtener las variables de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación y log preventivo
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Configuración de Supabase incompleta. ' +
    'Asegúrate de que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en tu .env'
  );
}

// Inicialización con salvaguarda
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
