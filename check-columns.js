import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .limit(1);

    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log('Columnas detectadas en reports:', Object.keys(data[0]));
    } else {
      console.log('La tabla reports está vacía, no se pueden detectar columnas dinámicamente.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkColumns();
