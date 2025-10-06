import { Database } from '../src/lib/database';
import { sampleProperties } from '../src/data/admin-properties';

async function migrateProperties() {
  console.log('🚀 Iniciando migração das propriedades...');
  
  try {
    // Testar conexão
    const connected = await Database.testConnection();
    if (!connected) {
      console.error('❌ Não foi possível conectar ao banco de dados');
      return;
    }

    console.log(`📊 Migrando ${sampleProperties.length} propriedades...`);
    
    for (const property of sampleProperties) {
      try {
        await Database.addProperty(property);
        console.log(`✅ Migrada: ${property.title}`);
      } catch (error) {
        console.error(`❌ Erro ao migrar ${property.title}:`, error);
      }
    }

    // Verificar se a migração foi bem-sucedida
    const migratedProperties = await Database.loadProperties();
    console.log(`🎉 Migração concluída! ${migratedProperties.length} propriedades no banco`);
    
    // Listar propriedades migradas
    migratedProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title} - ${prop.location}`);
    });

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateProperties();
}

export { migrateProperties };
