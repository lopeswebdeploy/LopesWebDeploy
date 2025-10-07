import { PrismaClient } from '@prisma/client';
import { Database } from '../src/lib/database';

const prisma = new PrismaClient();

async function initCompleteSystem() {
  console.log('🚀 Inicializando sistema completo...');
  
  try {
    // 1. Criar usuários iniciais
    console.log('👥 Criando usuários iniciais...');
    
    const adminUser = await Database.createUser({
      email: 'admin@lopes.com',
      name: 'Admin Master',
      role: 'admin',
      phone: '(62) 99999-9999',
      isActive: true,
    });
    
    const corretorUser = await Database.createUser({
      email: 'corretor@lopes.com',
      name: 'João Corretor',
      role: 'corretor',
      phone: '(62) 88888-8888',
      isActive: true,
    });
    
    console.log('✅ Usuários criados:');
    console.log(`   - Admin: ${adminUser.name} (${adminUser.email})`);
    console.log(`   - Corretor: ${corretorUser.name} (${corretorUser.email})`);

    // 2. Criar propriedades de exemplo
    console.log('🏠 Criando propriedades de exemplo...');
    
    const property1 = await Database.addProperty({
      title: 'Apartamento 3 quartos no Setor Oeste',
      description: 'Apartamento moderno com 3 quartos, 2 banheiros, sala ampla e varanda gourmet.',
      fullDescription: 'Apartamento localizado no Setor Oeste de Goiânia, em condomínio fechado com segurança 24h. O imóvel possui 3 quartos sendo 1 suíte, 2 banheiros, sala ampla integrada à cozinha, área de serviço e varanda gourmet. O condomínio oferece piscina, academia, playground e área de lazer completa.',
      category: 'venda',
      type: 'Premium',
      propertyType: 'apartamento',
      location: 'Setor Oeste',
      state: 'Goiânia',
      address: 'Rua das Flores, 123 - Setor Oeste',
      coordinates: { lat: -16.6869, lng: -49.2648 },
      bedrooms: 3,
      bathrooms: 2,
      suites: 1,
      parking: 2,
      area: '85m²',
      balconyTypes: ['Varanda gourmet'],
      price: 'R$ 450.000',
      apartmentOptions: [],
      developer: 'Construtora ABC',
      deliveryDate: 'Dezembro 2024',
      availability: 'Disponível para visita',
      bannerImage: '',
      images: [],
      photoGallery: [],
      floorPlan: '',
      characteristics: ['Piscina', 'Academia', 'Playground', 'Segurança 24h'],
      locationBenefits: ['Próximo ao shopping', 'Metrô a 500m', 'Escolas particulares'],
      differentials: ['Vista panorâmica', 'Varanda gourmet', 'Acabamento premium'],
      status: 'ativo',
      isFeatured: true,
      isVisible: true
    }, corretorUser.id);

    const property2 = await Database.addProperty({
      title: 'Casa 4 quartos no Setor Marista',
      description: 'Casa térrea com 4 quartos, 3 banheiros, quintal amplo e garagem para 3 carros.',
      fullDescription: 'Casa térrea localizada no Setor Marista, em lote de 500m². A casa possui 4 quartos sendo 2 suítes, 3 banheiros, sala ampla, cozinha planejada, área de serviço e quintal amplo. Garagem coberta para 3 carros. Próximo a escolas, shopping e transporte público.',
      category: 'venda',
      type: 'Exclusivo',
      propertyType: 'casa',
      location: 'Setor Marista',
      state: 'Goiânia',
      address: 'Rua das Palmeiras, 456 - Setor Marista',
      coordinates: { lat: -16.6869, lng: -49.2648 },
      bedrooms: 4,
      bathrooms: 3,
      suites: 2,
      parking: 3,
      area: '180m²',
      balconyTypes: [],
      price: 'R$ 650.000',
      apartmentOptions: [],
      developer: 'Construtora XYZ',
      deliveryDate: 'Pronto para morar',
      availability: 'Disponível para visita',
      bannerImage: '',
      images: [],
      photoGallery: [],
      floorPlan: '',
      characteristics: ['Quintal amplo', 'Garagem coberta', 'Cozinha planejada'],
      locationBenefits: ['Próximo a escolas', 'Shopping a 1km', 'Transporte público'],
      differentials: ['Casa térrea', 'Lote amplo', 'Localização privilegiada'],
      status: 'ativo',
      isFeatured: false,
      isVisible: true
    }, corretorUser.id);

    console.log('✅ Propriedades criadas:');
    console.log(`   - ${property1.title}`);
    console.log(`   - ${property2.title}`);

    // 3. Criar algumas imagens de exemplo (simuladas)
    console.log('🖼️ Criando imagens de exemplo...');
    
    // Simular upload de imagens (em produção, essas seriam URLs reais do Vercel Blob)
    const bannerImage1 = await Database.addImage({
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=400&fit=crop',
      type: 'banner',
      propertyId: property1.id!
    });

    const galleryImage1 = await Database.addImage({
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop',
      type: 'gallery',
      propertyId: property1.id!
    });

    const floorPlan1 = await Database.addImage({
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
      type: 'floorplan',
      propertyId: property1.id!
    });

    console.log('✅ Imagens criadas para propriedade 1');

    // 4. Criar alguns leads de exemplo
    console.log('📞 Criando leads de exemplo...');
    
    const lead1 = await Database.addLead({
      name: 'Maria Silva',
      phone: '(62) 99999-1111',
      email: 'maria@email.com',
      propertyId: property1.id!,
      ownerId: corretorUser.id,
      source: 'website',
      notes: 'Interessada no apartamento 3 quartos'
    });

    const lead2 = await Database.addLead({
      name: 'João Santos',
      phone: '(62) 99999-2222',
      email: 'joao@email.com',
      propertyId: property2.id!,
      ownerId: corretorUser.id,
      source: 'whatsapp',
      notes: 'Quer agendar visita para a casa'
    });

    console.log('✅ Leads criados:');
    console.log(`   - ${lead1.name} (${lead1.phone})`);
    console.log(`   - ${lead2.name} (${lead2.phone})`);

    // 5. Verificar estatísticas
    console.log('📊 Verificando estatísticas...');
    const stats = await Database.getStats();
    
    console.log('📊 Estatísticas do sistema:');
    console.log(`   - Total de propriedades: ${stats.totalProperties}`);
    console.log(`   - Propriedades visíveis: ${stats.visibleProperties}`);
    console.log(`   - Propriedades em destaque: ${stats.featuredProperties}`);
    console.log(`   - Total de leads: ${stats.totalLeads}`);
    console.log(`   - Total de imagens: ${stats.totalImages}`);

    console.log('🎉 Sistema inicializado com sucesso!');
    console.log('');
    console.log('🔑 CREDENCIAIS DE ACESSO:');
    console.log('   Admin Master:');
    console.log('     Email: admin@lopes.com');
    console.log('     Senha: admin123');
    console.log('');
    console.log('   Corretor:');
    console.log('     Email: corretor@lopes.com');
    console.log('     Senha: corretor123');
    console.log('');
    console.log('🌐 Acesse: http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Erro na inicialização do sistema:', error);
  } finally {
    await prisma.$disconnect();
    console.log('✅ Script executado com sucesso!');
  }
}

initCompleteSystem();
