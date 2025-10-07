import { PrismaClient } from '@prisma/client';
import { sampleProperties } from '../src/data/admin-properties';

const prisma = new PrismaClient();

async function initializeDatabase() {
  console.log('🚀 Inicializando banco de dados...');
  
  try {
    // 1. Criar usuários iniciais
    console.log('👥 Criando usuários iniciais...');
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lopes.com' },
      update: {},
      create: {
        email: 'admin@lopes.com',
        name: 'Admin Master',
        role: 'admin',
        phone: '(62) 99999-9999',
        isActive: true
      }
    });
    
    const corretorUser = await prisma.user.upsert({
      where: { email: 'corretor@lopes.com' },
      update: {},
      create: {
        email: 'corretor@lopes.com',
        name: 'João Corretor',
        role: 'corretor',
        phone: '(62) 88888-8888',
        isActive: true
      }
    });
    
    console.log('✅ Usuários criados:');
    console.log(`   - Admin: ${adminUser.name} (${adminUser.email})`);
    console.log(`   - Corretor: ${corretorUser.name} (${corretorUser.email})`);
    
    // 2. Limpar propriedades existentes
    console.log('🗑️ Limpando propriedades existentes...');
    await prisma.property.deleteMany();
    
    // 3. Migrar propriedades de exemplo
    console.log('🏠 Migrando propriedades de exemplo...');
    
    for (const property of sampleProperties) {
      const newProperty = await prisma.property.create({
        data: {
          title: property.title,
          description: property.description,
          fullDescription: property.fullDescription,
          category: property.category,
          type: property.type,
          propertyType: property.propertyType,
          location: property.location,
          state: property.state,
          address: property.address,
          coordinates: property.coordinates as any,
          embedUrl: property.embedUrl,
          bedrooms: typeof property.bedrooms === 'string' ? parseInt(property.bedrooms) || 0 : property.bedrooms,
          bathrooms: property.bathrooms,
          suites: property.suites,
          parking: property.parking,
          area: property.area,
          balconyTypes: property.balconyTypes as any,
          price: property.price,
          apartmentOptions: property.apartmentOptions as any,
          developer: property.developer,
          deliveryDate: property.deliveryDate,
          availability: property.availability,
          bannerImage: property.bannerImage,
          images: property.images as any,
          photoGallery: property.photoGallery as any,
          floorPlan: property.floorPlan,
          characteristics: property.characteristics as any,
          locationBenefits: property.locationBenefits as any,
          differentials: property.differentials as any,
          status: property.status,
          isFeatured: property.isFeatured,
          isVisible: property.isVisible,
          ownerId: adminUser.id // Todas as propriedades iniciais pertencem ao admin
        }
      });
      
      console.log(`✅ Propriedade migrada: ${newProperty.title}`);
    }
    
    // 4. Verificar resultado
    const totalProperties = await prisma.property.count();
    const totalUsers = await prisma.user.count();
    
    console.log('🎉 Inicialização concluída!');
    console.log(`📊 Estatísticas:`);
    console.log(`   - Usuários: ${totalUsers}`);
    console.log(`   - Propriedades: ${totalProperties}`);
    
    // 5. Mostrar propriedades por visibilidade
    const visibleProperties = await prisma.property.count({ where: { isVisible: true } });
    const hiddenProperties = await prisma.property.count({ where: { isVisible: false } });
    
    console.log(`   - Visíveis: ${visibleProperties}`);
    console.log(`   - Ocultas: ${hiddenProperties}`);
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na execução:', error);
      process.exit(1);
    });
}

export { initializeDatabase };
