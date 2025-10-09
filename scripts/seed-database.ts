import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lopes.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@lopes.com',
      password: await hashPassword('admin123'),
      role: 'admin',
      active: true
    }
  });

  console.log('✅ Usuário admin criado:', adminUser.email);

  // Criar usuário corretor
  const corretorUser = await prisma.user.upsert({
    where: { email: 'corretor@lopes.com' },
    update: {},
    create: {
      name: 'Corretor Teste',
      email: 'corretor@lopes.com',
      password: await hashPassword('corretor123'),
      role: 'corretor',
      active: true
    }
  });

  console.log('✅ Usuário corretor criado:', corretorUser.email);

  // Criar propriedades de exemplo
  const properties = [
    {
      title: 'Apartamento 3 quartos no centro',
      description: 'Apartamento moderno com 3 quartos, 2 banheiros, sala ampla e varanda.',
      price: 250000,
      status: 'published',
      featured: true,
      location: 'Goiânia',
      developer: 'Lopes Imóveis',
      category: 'venda',
      bedrooms: 3,
      bathrooms: 2,
      area: 85.5,
      authorId: adminUser.id,
      bannerImage: '/placeholder-image.jpg',
      galleryImages: ['/placeholder-image.jpg', '/property-1.jpg'],
      floorPlans: ['/placeholder-floorplan.jpg']
    },
    {
      title: 'Casa térrea com quintal',
      description: 'Casa térrea com 4 quartos, 3 banheiros, quintal grande e garagem para 2 carros.',
      price: 350000,
      status: 'published',
      featured: true,
      location: 'Goiânia',
      developer: 'Lopes Imóveis',
      category: 'venda',
      bedrooms: 4,
      bathrooms: 3,
      area: 120.0,
      authorId: corretorUser.id,
      bannerImage: '/property-2.jpg',
      galleryImages: ['/property-2.jpg', '/property-3.jpg'],
      floorPlans: ['/placeholder-floorplan.jpg']
    },
    {
      title: 'Sobrado comercial',
      description: 'Sobrado com potencial comercial, 2 pavimentos, localização estratégica.',
      price: 450000,
      status: 'published',
      featured: false,
      location: 'Goiânia',
      developer: 'Lopes Imóveis',
      category: 'venda',
      bedrooms: 5,
      bathrooms: 4,
      area: 180.0,
      authorId: adminUser.id,
      bannerImage: '/property-3.jpg',
      galleryImages: ['/property-3.jpg'],
      floorPlans: ['/placeholder-floorplan.jpg']
    }
  ];

  for (const propertyData of properties) {
    const property = await prisma.property.create({
      data: propertyData
    });
    console.log('✅ Propriedade criada:', property.title);
  }

  // Criar alguns leads de exemplo
  const leads = [
    {
      name: 'João Silva',
      phone: '(62) 99999-9999',
      email: 'joao@email.com',
      propertyId: 1,
      status: 'new'
    },
    {
      name: 'Maria Santos',
      phone: '(62) 88888-8888',
      email: 'maria@email.com',
      propertyId: 2,
      status: 'contacted'
    }
  ];

  for (const leadData of leads) {
    const lead = await prisma.lead.create({
      data: leadData
    });
    console.log('✅ Lead criado:', lead.name);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
