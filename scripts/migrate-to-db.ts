import { Database } from '../src/lib/database';

async function migrateToDatabase() {
  console.log('🚀 Iniciando migração para banco de dados...');
  
  try {
    // Testar conexão
    const connected = await Database.testConnection();
    if (!connected) {
      console.error('❌ Não foi possível conectar ao banco de dados');
      return;
    }

    // Migrar propriedades
    await Database.migrateSampleProperties();

    // Verificar se a migração foi bem-sucedida
    const properties = await Database.loadProperties();
    console.log(`🎉 Migração concluída! ${properties.length} propriedades no banco`);
    
    // Listar propriedades migradas
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title} - ${prop.location}`);
    });

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateToDatabase();
}

export { migrateToDatabase };
