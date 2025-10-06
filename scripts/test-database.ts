import { Database } from '../src/lib/database';

async function testDatabase() {
  console.log('🧪 Testando conexão com banco de dados...');
  
  try {
    // Testar conexão
    const connected = await Database.testConnection();
    if (!connected) {
      console.error('❌ Falha na conexão com banco de dados');
      return;
    }

    console.log('✅ Conexão com banco estabelecida!');

    // Testar carregamento de propriedades
    console.log('📊 Testando carregamento de propriedades...');
    const properties = await Database.loadProperties();
    console.log(`✅ ${properties.length} propriedades carregadas`);

    // Testar carregamento de propriedades em destaque
    console.log('⭐ Testando carregamento de propriedades em destaque...');
    const featured = await Database.loadFeaturedProperties();
    console.log(`✅ ${featured.length} propriedades em destaque carregadas`);

    // Testar carregamento de leads
    console.log('📞 Testando carregamento de leads...');
    const leads = await Database.loadLeads();
    console.log(`✅ ${leads.length} leads carregados`);

    console.log('🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  testDatabase();
}

export { testDatabase };
