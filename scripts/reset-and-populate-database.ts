#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAndPopulateDatabase() {
  console.log('🚀 Iniciando reset e população do banco de dados...');
  
  try {
    // 1. Conectar ao banco
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');
    
    // 2. LIMPAR TODAS AS TABELAS (em ordem correta devido às foreign keys)
    console.log('🧹 Limpando todas as tabelas...');
    
    await prisma.lead.deleteMany({});
    console.log('  ✅ Leads deletados');
    
    await prisma.image.deleteMany({});
    console.log('  ✅ Imagens deletadas');
    
    await prisma.property.deleteMany({});
    console.log('  ✅ Propriedades deletadas');
    
    await prisma.user.deleteMany({});
    console.log('  ✅ Usuários deletados');
    
    console.log('🎉 Banco limpo com sucesso!');
    
    // 3. CRIAR USUÁRIOS
    console.log('👥 Criando usuários...');
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@lopes.com',
        name: 'Admin Master',
        role: 'admin',
        phone: '(62) 99999-0000',
        isActive: true
      }
    });
    
    const corretorUser = await prisma.user.create({
      data: {
        email: 'corretor@lopes.com',
        name: 'João Corretor',
        role: 'corretor',
        phone: '(62) 88888-8888',
        isActive: true
      }
    });
    
    const corretor2User = await prisma.user.create({
      data: {
        email: 'maria@lopes.com',
        name: 'Maria Corretora',
        role: 'corretor',
        phone: '(62) 77777-7777',
        isActive: true
      }
    });
    
    console.log('✅ Usuários criados:', {
      admin: adminUser.name,
      corretor1: corretorUser.name,
      corretor2: corretor2User.name
    });
    
    // 4. CRIAR PROPRIEDADES COMPLETAS
    console.log('🏠 Criando propriedades completas...');
    
    // Propriedade 1: Apartamento Premium
    const property1 = await prisma.property.create({
      data: {
        title: 'Borges Landeiro Classic',
        description: 'Apartamentos exclusivos no coração do Setor Oeste com acabamento de luxo e localização privilegiada.',
        fullDescription: 'O Borges Landeiro Classic representa o que há de mais moderno em empreendimentos residenciais em Goiânia. Localizado no valorizado Setor Oeste, o projeto oferece apartamentos com acabamentos de primeira qualidade, incluindo piso porcelanato 80x80, bancadas em quartzo, cozinha gourmet integrada e automação residencial. O condomínio conta com área de lazer completa, incluindo piscina adulto e infantil, academia, salão de festas, playground e quadra poliesportiva.',
        category: 'venda',
        type: 'Premium',
        propertyType: 'apartamento',
        authorId: corretorUser.id,
        location: 'Setor Oeste',
        state: 'Goiânia',
        address: 'Rua T-10, 1234 - Setor Oeste',
        coordinates: { lat: -16.6869, lng: -49.2648 },
        bedrooms: 3,
        bathrooms: 2,
        suites: 1,
        parking: 2,
        area: '85m²',
        balconyTypes: ['Varanda gourmet', 'Sacada privativa'],
        price: 'R$ 450.000',
        apartmentOptions: [
          {
            id: 'apt-1-1',
            bedrooms: 2,
            area: '75m²',
            price: 'R$ 380.000',
            floor: 5,
            available: true,
            features: ['Varanda', 'Vista para o jardim'],
            unitType: 'Padrão',
            bathrooms: 2,
            suites: 0,
            parking: 1,
            balcony: 'Varanda 6m²',
            description: 'Apartamento 2 quartos com varanda'
          },
          {
            id: 'apt-1-2',
            bedrooms: 3,
            area: '85m²',
            price: 'R$ 450.000',
            floor: 8,
            available: true,
            features: ['Suíte master', 'Varanda gourmet'],
            unitType: 'Premium',
            bathrooms: 2,
            suites: 1,
            parking: 2,
            balcony: 'Varanda gourmet 12m²',
            description: 'Apartamento 3 quartos com suíte master'
          }
        ],
        developer: 'Construtora Borges Landeiro',
        deliveryDate: 'Dezembro 2024',
        availability: 'Disponível para visita',
        characteristics: ['Piscina adulto e infantil', 'Academia completa', 'Salão de festas', 'Playground', 'Quadra poliesportiva', 'Portaria 24h'],
        locationBenefits: ['Próximo ao shopping Flamboyant', 'Metrô a 500m', 'Escolas particulares renomadas', 'Hospitais próximos'],
        differentials: ['Acabamento premium', 'Automação residencial', 'Vista panorâmica', 'Localização privilegiada'],
        status: 'ativo',
        isFeatured: true,
        isVisible: true
      }
    });
    
    // Propriedade 2: Cobertura de Luxo
    const property2 = await prisma.property.create({
      data: {
        title: 'Marista Sky Residences',
        description: 'Cobertura duplex com vista panorâmica de 360° da cidade, piscina privativa e área gourmet completa.',
        fullDescription: 'Uma cobertura única no Setor Marista, oferecendo o que há de mais exclusivo em moradia urbana. Com 250m² distribuídos em dois pavimentos, esta unidade conta com piscina privativa, sauna, área gourmet com churrasqueira, jardim suspenso e vista panorâmica deslumbrante de Goiânia. O acabamento inclui mármore travertino, madeira de demolição, sistema de som ambiente e iluminação LED automatizada.',
        category: 'investimento',
        type: 'Exclusivo',
        propertyType: 'cobertura',
        authorId: corretor2User.id,
        location: 'Setor Marista',
        state: 'Goiânia',
        address: 'Rua 9, 1234 - Setor Marista',
        coordinates: { lat: -16.6869, lng: -49.2648 },
        bedrooms: 4,
        bathrooms: 4,
        suites: 2,
        parking: 4,
        area: '250m²',
        balconyTypes: ['Terraço privativo', 'Jardim suspenso'],
        price: 'R$ 1.200.000',
        apartmentOptions: [],
        developer: 'Construtora Marista',
        deliveryDate: 'Pronto para morar',
        availability: 'Disponível para visita',
        characteristics: ['Piscina privativa', 'Sauna', 'Área gourmet', 'Jardim suspenso', 'Elevador privativo', 'Portaria 24h'],
        locationBenefits: ['Centro de Goiânia', 'Shopping próximo', 'Faculdades renomadas', 'Hospitais de referência'],
        differentials: ['Vista panorâmica 360°', 'Acabamento de luxo', 'Terraço privativo', 'Localização nobre'],
        status: 'ativo',
        isFeatured: true,
        isVisible: true
      }
    });
    
    // Propriedade 3: Casa de Alto Padrão
    const property3 = await prisma.property.create({
      data: {
        title: 'Casa Europa Garden',
        description: 'Casa térrea de alto padrão com piscina, jardim paisagístico e área gourmet em condomínio fechado.',
        fullDescription: 'Localizada no exclusivo condomínio Jardim Europa Residence, esta casa representa o que há de melhor em moradia familiar. Com 280m² de área construída em terreno de 500m², a residência oferece amplos ambientes integrados, suíte master com closet e hidromassagem, piscina com cascata, jardim paisagístico assinado e área gourmet completa com forno a lenha. O condomínio oferece segurança 24h, clube, quadras e área verde preservada.',
        category: 'venda',
        type: 'Alto Padrão',
        propertyType: 'casa',
        authorId: corretorUser.id,
        location: 'Jardim Europa',
        state: 'Goiânia',
        address: 'Rua das Palmeiras, 456 - Jardim Europa',
        coordinates: { lat: -16.6869, lng: -49.2648 },
        bedrooms: 4,
        bathrooms: 3,
        suites: 2,
        parking: 3,
        area: '280m²',
        balconyTypes: ['Área gourmet', 'Jardim'],
        price: 'R$ 850.000',
        apartmentOptions: [],
        developer: 'Construtora Europa',
        deliveryDate: 'Pronto para morar',
        availability: 'Disponível para visita',
        characteristics: ['Piscina com cascata', 'Jardim paisagístico', 'Área gourmet', 'Suíte master com hidromassagem', 'Closet walk-in'],
        locationBenefits: ['Condomínio fechado', 'Segurança 24h', 'Clube social', 'Área verde preservada'],
        differentials: ['Casa térrea', 'Terreno amplo', 'Acabamento premium', 'Localização nobre'],
        status: 'ativo',
        isFeatured: true,
        isVisible: true
      }
    });
    
    // Propriedade 4: Loft Moderno
    const property4 = await prisma.property.create({
      data: {
        title: 'University Loft Studios',
        description: 'Lofts modernos para jovens profissionais e estudantes, com conceito inovador e localização estratégica.',
        fullDescription: 'Pensado para a nova geração de profissionais e universitários, o University Loft Studios oferece conceito inovador de moradia urbana no Setor Universitário. Os lofts contam com pé direito duplo, mezanino funcional, cozinha integrada e design contemporâneo. O empreendimento oferece coworking, lavanderia compartilhada, bike sharing, academia 24h e localização estratégica próxima à UFG e principais corredores de transporte da cidade.',
        category: 'aluguel',
        type: 'Moderno',
        propertyType: 'loft',
        authorId: corretor2User.id,
        location: 'Setor Universitário',
        state: 'Goiânia',
        address: 'Rua 235, 1234 - Setor Universitário',
        coordinates: { lat: -16.6869, lng: -49.2648 },
        bedrooms: 1,
        bathrooms: 1,
        suites: 0,
        parking: 1,
        area: '45m²',
        balconyTypes: ['Sacada compacta'],
        price: 'R$ 1.200/mês',
        apartmentOptions: [
          {
            id: 'loft-1',
            bedrooms: 1,
            area: '45m²',
            price: 'R$ 1.200/mês',
            floor: 3,
            available: true,
            features: ['Pé direito duplo', 'Mezanino'],
            unitType: 'Studio',
            bathrooms: 1,
            suites: 0,
            parking: 1,
            balcony: 'Sacada 3m²',
            description: 'Loft studio com mezanino'
          }
        ],
        developer: 'Construtora University',
        deliveryDate: 'Março 2024',
        availability: 'Disponível para locação',
        characteristics: ['Pé direito duplo', 'Mezanino funcional', 'Coworking', 'Lavanderia compartilhada', 'Bike sharing', 'Academia 24h'],
        locationBenefits: ['Próximo à UFG', 'Transporte público', 'Comércio local', 'Universidades'],
        differentials: ['Design contemporâneo', 'Conceito inovador', 'Localização estratégica', 'Comodidades modernas'],
        status: 'ativo',
        isFeatured: false,
        isVisible: true
      }
    });
    
    console.log('✅ Propriedades criadas:', {
      prop1: property1.title,
      prop2: property2.title,
      prop3: property3.title,
      prop4: property4.title
    });
    
    // 5. CRIAR IMAGENS PARA CADA PROPRIEDADE
    console.log('🖼️ Criando imagens...');
    
    // Imagens para Property 1
    await prisma.image.createMany({
      data: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
          type: 'banner',
          propertyId: property1.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property1.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property1.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
          type: 'floorplan',
          propertyId: property1.id
        }
      ]
    });
    
    // Imagens para Property 2
    await prisma.image.createMany({
      data: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
          type: 'banner',
          propertyId: property2.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property2.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property2.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
          type: 'floorplan',
          propertyId: property2.id
        }
      ]
    });
    
    // Imagens para Property 3
    await prisma.image.createMany({
      data: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
          type: 'banner',
          propertyId: property3.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property3.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property3.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
          type: 'floorplan',
          propertyId: property3.id
        }
      ]
    });
    
    // Imagens para Property 4
    await prisma.image.createMany({
      data: [
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=600&fit=crop',
          type: 'banner',
          propertyId: property4.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property4.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          type: 'gallery',
          propertyId: property4.id
        },
        {
          url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=800&fit=crop',
          type: 'floorplan',
          propertyId: property4.id
        }
      ]
    });
    
    console.log('✅ Imagens criadas para todas as propriedades');
    
    // 6. CRIAR LEADS DE EXEMPLO
    console.log('📞 Criando leads...');
    
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
          notes: 'Interessada no apartamento 3 quartos, quer agendar visita'
        },
        {
          name: 'João Santos',
          phone: '(62) 99999-2222',
          email: 'joao@email.com',
          propertyId: property2.id,
          ownerId: corretor2User.id,
          source: 'whatsapp',
          status: 'contatado',
          notes: 'Quer informações sobre financiamento da cobertura'
        },
        {
          name: 'Ana Costa',
          phone: '(62) 99999-3333',
          email: 'ana@email.com',
          propertyId: property3.id,
          ownerId: corretorUser.id,
          source: 'instagram',
          status: 'novo',
          notes: 'Interessada na casa, tem cachorro'
        },
        {
          name: 'Pedro Oliveira',
          phone: '(62) 99999-4444',
          email: 'pedro@email.com',
          propertyId: property4.id,
          ownerId: corretor2User.id,
          source: 'facebook',
          status: 'novo',
          notes: 'Estudante da UFG, procura loft próximo à universidade'
        },
        {
          name: 'Carla Mendes',
          phone: '(62) 99999-5555',
          email: 'carla@email.com',
          propertyId: property1.id,
          ownerId: corretorUser.id,
          source: 'website',
          status: 'interessado',
          notes: 'Já visitou, está analisando proposta'
        }
      ]
    });
    
    console.log('✅ Leads criados');
    
    // 7. VERIFICAR DADOS FINAIS
    const stats = await prisma.$transaction([
      prisma.user.count(),
      prisma.property.count(),
      prisma.image.count(),
      prisma.lead.count()
    ]);
    
    console.log('📊 ESTATÍSTICAS FINAIS:');
    console.log(`  👥 Usuários: ${stats[0]}`);
    console.log(`  🏠 Propriedades: ${stats[1]}`);
    console.log(`  🖼️ Imagens: ${stats[2]}`);
    console.log(`  📞 Leads: ${stats[3]}`);
    
    console.log('🎉 BANCO DE DADOS RESETADO E POPULADO COM SUCESSO!');
    console.log('');
    console.log('📋 RESUMO DO QUE FOI CRIADO:');
    console.log('  👤 3 usuários (1 admin + 2 corretores)');
    console.log('  🏠 4 propriedades completas:');
    console.log('    - Apartamento Premium (Setor Oeste)');
    console.log('    - Cobertura de Luxo (Setor Marista)');
    console.log('    - Casa Alto Padrão (Jardim Europa)');
    console.log('    - Loft Moderno (Setor Universitário)');
    console.log('  🖼️ 16 imagens (4 por propriedade)');
    console.log('  📞 5 leads de exemplo');
    console.log('');
    console.log('🔑 CREDENCIAIS DE LOGIN:');
    console.log('  Admin: admin@lopes.com');
    console.log('  Corretor 1: corretor@lopes.com');
    console.log('  Corretor 2: maria@lopes.com');
    
  } catch (error) {
    console.error('❌ Erro ao resetar e popular banco:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  resetAndPopulateDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { resetAndPopulateDatabase };
