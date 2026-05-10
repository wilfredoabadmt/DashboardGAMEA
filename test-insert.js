import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([
        { 
          titulo: 'Test Report', 
          secretaria: 'Test Sec', 
          direccion: 'Test Dir', 
          unidad: 'Test Uni',
          indicadores: [], 
          estadisticas: [], 
          riesgos: [] 
        }
      ])
      .select();

    if (error) throw error;
    console.log('Insert successful:', data);
  } catch (err) {
    console.error('Insert failed:', err.message);
  }
}

testInsert();
