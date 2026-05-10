import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lkuatqkshmpgdgxroyiv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('🔍 Verificando esquema de Supabase...\n');

    // Intentar obtener tabla information_schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');

    if (error) {
      console.log('⚠️  No se puede acceder a information_schema');
      console.log('Intentando verificar tablas directamente...\n');
      
      // Listar tablas conocidas
      const tablesToCheck = ['reports', 'indicadores', 'estadisticas', 'riesgos', 'users'];
      
      for (const tableName of tablesToCheck) {
        const { data: result, error: checkError } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);
        
        if (!checkError) {
          console.log(`✅ Tabla "${tableName}" existe`);
        } else {
          console.log(`❌ Tabla "${tableName}" NO existe`);
        }
      }
    } else {
      console.log('📊 Tablas encontradas en la base de datos:\n');
      const tables = data.map(t => t.table_name).filter(t => !t.startsWith('_'));
      
      if (tables.length === 0) {
        console.log('⚠️  No hay tablas públicas en la base de datos.');
      } else {
        tables.forEach((t, i) => {
          console.log(`  ${i + 1}. ${t}`);
        });
      }

      // Validación de tablas esperadas
      const requiredTables = ['reports', 'indicadores', 'estadisticas', 'riesgos'];

      console.log('\n✅ Validación de tablas requeridas para dashboardGAMEA:\n');
      requiredTables.forEach(table => {
        const exists = tables.includes(table);
        console.log(`  ${exists ? '✓' : '✗'} ${table}`);
      });
    }

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
  }

  process.exit(0);
}

checkSchema();
