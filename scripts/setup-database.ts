#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...');
  
  try {
    // 1. Verificar conexão
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');
    
    // 2. Criar usuários padrão
    console.log('👥 Criando usuários padrão...');
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lopes.com' },
      update: {},
      create: {
        email: 'admin@lopes.com',
        name: 'Admin Master',
        role: 'admin',
        phone: '(62) 99999-0000',
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
    
    console.log('✅ Usuários criados:', { admin: adminUser.id, corretor: corretorUser.id });
    
    // 3. Criar propriedades de exemplo
    console.log('🏠 Criando propriedades de exemplo...');
    
    const property1 = await prisma.property.upsert({
      where: { id: 'prop-1' },
      update: {},
      create: {
        id: 'prop-1',
        title: 'Apartamento 3 quartos no Setor Oeste',
        description: 'Apartamento moderno com 3 quartos, 2 banheiros, sala ampla e varanda gourmet.',
        fullDescription: 'Apartamento localizado no Setor Oeste de Goiânia, em condomínio fechado com segurança 24h. O imóvel possui 3 quartos sendo 1 suíte, 2 banheiros, sala ampla integrada à cozinha, área de serviço e varanda gourmet. O condomínio oferece piscina, academia, playground e área de lazer completa.',
        category: 'venda',
        type: 'Premium',
        propertyType: 'apartamento',
        authorId: corretorUser.id,
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
        bannerImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=400&fit=crop',
        floorPlan: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
        characteristics: ['Piscina', 'Academia', 'Playground', 'Segurança 24h'],
        locationBenefits: ['Próximo ao shopping', 'Metrô a 500m', 'Escolas particulares'],
        differentials: ['Vista panorâmica', 'Varanda gourmet', 'Acabamento premium'],
        status: 'ativo',
        isFeatured: true,
        isVisible: true
      }
    });
    
    const property2 = await prisma.property.upsert({
      where: { id: 'prop-2' },
      update: {},
      create: {
        id: 'prop-2',
        title: 'Casa 4 quartos no Setor Marista',
        description: 'Casa térrea com 4 quartos, 3 banheiros, quintal amplo e garagem para 3 carros.',
        fullDescription: 'Casa térrea localizada no Setor Marista, em lote de 500m². A casa possui 4 quartos sendo 2 suítes, 3 banheiros, sala ampla, cozinha planejada, área de serviço e quintal amplo. Garagem coberta para 3 carros. Próximo a escolas, shopping e transporte público.',
        category: 'venda',
        type: 'Exclusivo',
        propertyType: 'casa',
        authorId: corretorUser.id,
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
        characteristics: ['Quintal amplo', 'Garagem coberta', 'Cozinha planejada'],
        locationBenefits: ['Próximo a escolas', 'Shopping a 1km', 'Transporte público'],
        differentials: ['Casa térrea', 'Lote amplo', 'Localização privilegiada'],
        status: 'ativo',
        isFeatured: false,
        isVisible: true
      }
    });
    
    console.log('✅ Propriedades criadas:', { prop1: property1.id, prop2: property2.id });
    
    // 4. Criar imagens para as propriedades
    console.log('🖼️ Criando imagens...');
    
    await prisma.image.createMany({
      data: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=400&fit=crop',
          type: 'banner',
          propertyId: property1.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop',
          type: 'gallery',
          propertyId: property1.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
          type: 'floorplan',
          propertyId: property1.id
        }
      ],
      skipDuplicates: true
    });
    
    // 5. Criar leads de exemplo
    console.log('📞 Criando leads de exemplo...');
    
    await prisma.lead.createMany({
      data: [
        {
          name: 'Maria Silva',
          phone: '(62) 99999-1111',
          email: 'maria@email.com',
          propertyId: property1.id,
          ownerId: corretorUser.id,
          source: 'website',
          status: 'novo',
          notes: 'Interessada no apartamento 3 quartos'
        },
        {
          name: 'João Santos',
          phone: '(62) 99999-2222',
          email: 'joao@email.com',
          propertyId: property2.id,
          ownerId: corretorUser.id,
          source: 'whatsapp',
          status: 'novo',
          notes: 'Quer agendar visita para a casa'
        }
      ],
      skipDuplicates: true
    });
    
    console.log('✅ Leads criados');
    
    // 6. Verificar dados
    const stats = await prisma.$transaction([
      prisma.user.count(),
      prisma.property.count(),
      prisma.image.count(),
      prisma.lead.count()
    ]);
    
    console.log('📊 Estatísticas finais:');
    console.log(`  👥 Usuários: ${stats[0]}`);
    console.log(`  🏠 Propriedades: ${stats[1]}`);
    console.log(`  🖼️ Imagens: ${stats[2]}`);
    console.log(`  📞 Leads: ${stats[3]}`);
    
    console.log('🎉 Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { setupDatabase };
