import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  try {
    // 1. Get the ID of the test report we just created
    const { data: reports, error: fetchError } = await supabase
      .from('reports')
      .select('id')
      .eq('titulo', 'Test Report')
      .single();

    if (fetchError) throw fetchError;
    const id = reports.id;
    console.log('Updating report ID:', id);

    // 2. Try to update it
    const { data, error: updateError } = await supabase
      .from('reports')
      .update({ titulo: 'Updated Test Report' })
      .eq('id', id)
      .select();

    if (updateError) throw updateError;
    console.log('Update successful:', data);
  } catch (err) {
    console.error('Update failed:', err.message);
  }
}

testUpdate();
