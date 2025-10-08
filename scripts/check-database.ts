import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Verificando banco de dados...');

  try {
    // Verificar usuários
    const users = await prisma.user.findMany();
    console.log('👥 Usuários:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role} - Ativo: ${user.active}`);
    });

    // Verificar propriedades
    const properties = await prisma.property.findMany({
      include: {
        author: true
      }
    });
    console.log('🏠 Propriedades:', properties.length);
    properties.forEach(property => {
      console.log(`  - ${property.title} - R$ ${property.price} - Autor: ${property.author.name}`);
    });

    // Verificar leads
    const leads = await prisma.lead.findMany({
      include: {
        property: true
      }
    });
    console.log('📞 Leads:', leads.length);
    leads.forEach(lead => {
      console.log(`  - ${lead.name} (${lead.phone}) - Propriedade: ${lead.property?.title || 'N/A'}`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
