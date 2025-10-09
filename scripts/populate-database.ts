import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando povoamento do banco de dados...');

  try {
    // Limpar dados existentes
    await prisma.lead.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Dados antigos removidos');

    // Criar usuários
    const adminPassword = await hash('admin123', 12);
    const corretor1Password = await hash('corretor123', 12);
    const corretor2Password = await hash('corretor456', 12);

    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@lopes.com',
        password: adminPassword,
        role: 'admin',
        active: true
      }
    });

    const corretor1 = await prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@lopes.com',
        password: corretor1Password,
        role: 'corretor',
        active: true
      }
    });

    const corretor2 = await prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@lopes.com',
        password: corretor2Password,
        role: 'corretor',
        active: true
      }
    });

    console.log('👥 Usuários criados:', { admin: admin.id, corretor1: corretor1.id, corretor2: corretor2.id });

    // Criar propriedades
    const properties = [
      {
        title: 'Apartamento Luxo no Centro',
        description: 'Apartamento de 3 quartos com vista para o mar, localizado no centro da cidade.',
        price: 450000,
        status: 'published',
        featured: true,
        authorId: corretor1.id,
        bannerImage: '/property-1.jpg',
        galleryImages: ['/property-1.jpg', '/property-2.jpg'],
        floorPlans: ['/placeholder-floorplan.jpg']
      },
      {
        title: 'Casa com Piscina',
        description: 'Casa térrea com 4 quartos, piscina e área de lazer completa.',
        price: 680000,
        status: 'published',
        featured: true,
        authorId: corretor2.id,
        bannerImage: '/property-2.jpg',
        galleryImages: ['/property-2.jpg', '/property-3.jpg'],
        floorPlans: ['/placeholder-floorplan.jpg']
      },
      {
        title: 'Apartamento Moderno',
        description: 'Apartamento de 2 quartos com acabamento moderno e localização privilegiada.',
        price: 320000,
        status: 'published',
        featured: false,
        authorId: corretor1.id,
        bannerImage: '/property-3.jpg',
        galleryImages: ['/property-3.jpg'],
        floorPlans: []
      },
      {
        title: 'Cobertura Duplex',
        description: 'Cobertura duplex com 3 quartos, terraço e vista panorâmica.',
        price: 850000,
        status: 'draft',
        featured: false,
        authorId: corretor2.id,
        bannerImage: '/property-1.jpg',
        galleryImages: ['/property-1.jpg'],
        floorPlans: ['/placeholder-floorplan.jpg']
      },
      {
        title: 'Casa em Condomínio',
        description: 'Casa em condomínio fechado com 3 quartos e área de lazer.',
        price: 520000,
        status: 'published',
        featured: false,
        authorId: admin.id,
        bannerImage: '/property-2.jpg',
        galleryImages: ['/property-2.jpg', '/property-3.jpg'],
        floorPlans: []
      }
    ];

    for (const propertyData of properties) {
      const property = await prisma.property.create({
        data: propertyData
      });
      console.log(`🏠 Propriedade criada: ${property.title} (ID: ${property.id})`);
    }

    // Buscar propriedades criadas para usar nos leads
    const createdProperties = await prisma.property.findMany({
      select: { id: true, title: true }
    });

    console.log('🏠 Propriedades disponíveis:', createdProperties.map(p => `${p.id}: ${p.title}`));

    // Criar alguns leads
    const leads = [
      {
        name: 'Carlos Oliveira',
        phone: '(11) 99999-1111',
        email: 'carlos@email.com',
        propertyId: createdProperties[0]?.id,
        ownerId: corretor1.id,
        status: 'new'
      },
      {
        name: 'Ana Costa',
        phone: '(11) 99999-2222',
        email: 'ana@email.com',
        propertyId: createdProperties[1]?.id,
        ownerId: corretor2.id,
        status: 'contacted'
      },
      {
        name: 'Pedro Santos',
        phone: '(11) 99999-3333',
        email: 'pedro@email.com',
        propertyId: createdProperties[2]?.id,
        ownerId: corretor1.id,
        status: 'new'
      }
    ];

    for (const leadData of leads) {
      if (leadData.propertyId) {
        const lead = await prisma.lead.create({
          data: leadData
        });
        console.log(`📞 Lead criado: ${lead.name} (ID: ${lead.id})`);
      }
    }

    console.log('✅ Povoamento concluído com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('👑 Admin: admin@lopes.com / admin123');
    console.log('👤 Corretor 1: joao@lopes.com / corretor123');
    console.log('👤 Corretor 2: maria@lopes.com / corretor456');

  } catch (error) {
    console.error('❌ Erro no povoamento:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
