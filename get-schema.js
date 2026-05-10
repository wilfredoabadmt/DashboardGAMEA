import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSchema() {
  try {
    // Use a trick to get column names: query the table and see what comes back
    // Since it's empty, we can't. Let's use information_schema.
    // But since I have the service role (wait, I only have anon key in .env), 
    // I might not have access to information_schema.
    
    // Let's try to insert a record and then see the result.
    const { data, error } = await supabase
      .from('reports')
      .insert([{ titulo: 'schema_test' }])
      .select();

    if (error) {
      console.log('Insert error (this is useful):', error);
      return;
    }
    console.log('Columns:', Object.keys(data[0]));
  } catch (err) {
    console.error('Error:', err);
  }
}

getSchema();
