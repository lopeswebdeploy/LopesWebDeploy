// Script para Atualizar Banco de Produção
// Uso: npx tsx scripts/update-production-db.ts
// IMPORTANTE: Configure POSTGRES_URL para apontar para o banco de produção

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductionDatabase() {
  try {
    console.log('🚀 Conectando ao banco de produção...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conectado ao banco de produção!')
    
    // 1. Verificar se a coluna equipe existe
    console.log('\n1️⃣ Verificando coluna equipe...')
    const equipeExists = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'equipe'
    `
    
    if (Array.isArray(equipeExists) && equipeExists.length === 0) {
      console.log('❌ Coluna equipe não existe. Criando...')
      await prisma.$executeRaw`ALTER TABLE users ADD COLUMN equipe VARCHAR(50)`
      console.log('✅ Coluna equipe criada!')
    } else {
      console.log('✅ Coluna equipe já existe')
    }
    
    // 2. Verificar se a coluna isLancamento existe
    console.log('\n2️⃣ Verificando coluna isLancamento...')
    const lancamentoExists = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' AND column_name = 'isLancamento'
    `
    
    if (Array.isArray(lancamentoExists) && lancamentoExists.length === 0) {
      console.log('❌ Coluna isLancamento não existe. Criando...')
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN isLancamento BOOLEAN DEFAULT FALSE`
      console.log('✅ Coluna isLancamento criada!')
    } else {
      console.log('✅ Coluna isLancamento já existe')
    }
    
    // 3. Atualizar usuários existentes com equipe padrão
    console.log('\n3️⃣ Atualizando usuários existentes...')
    const usersToUpdate = await prisma.user.findMany({
      where: {
        OR: [
          { equipe: null },
          { equipe: '' }
        ]
      }
    })
    
    console.log(`📊 Encontrados ${usersToUpdate.length} usuários para atualizar`)
    
    for (const user of usersToUpdate) {
      let defaultEquipe = null
      
      if (user.role === 'corretor') {
        defaultEquipe = 'Lopes Marista'
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: { equipe: defaultEquipe }
      })
      
      console.log(`✅ ${user.name} atualizado com equipe: ${defaultEquipe || 'Não definida'}`)
    }
    
    // 4. Criar constraint de validação
    console.log('\n4️⃣ Criando constraint de validação...')
    try {
      await prisma.$executeRaw`
        ALTER TABLE users 
        ADD CONSTRAINT check_equipe_valid 
        CHECK (equipe IS NULL OR equipe IN ('Lopes Marista', 'Lopes Bueno', 'Lopes Jardim Goias'))
      `
      console.log('✅ Constraint de equipe criada!')
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('✅ Constraint de equipe já existe')
      } else {
        throw error
      }
    }
    
    // 5. Verificar resultado final
    console.log('\n5️⃣ Verificando resultado final...')
    const finalStats = await prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE equipe IS NOT NULL) as users_with_equipe,
        (SELECT COUNT(*) FROM properties) as total_properties,
        (SELECT COUNT(*) FROM properties WHERE isLancamento = true) as lancamentos
    `
    
    console.log('\n📊 ESTATÍSTICAS FINAIS:')
    console.table(finalStats)
    
    // 6. Mostrar usuários atualizados
    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        equipe: true,
        active: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('\n👥 USUÁRIOS ATUALIZADOS:')
    console.table(updatedUsers)
    
    console.log('\n🎉 BANCO DE PRODUÇÃO ATUALIZADO COM SUCESSO!')
    console.log('\n🎯 PRÓXIMOS PASSOS:')
    console.log('   1. Faça deploy da aplicação atualizada')
    console.log('   2. Teste o painel de usuários em produção')
    console.log('   3. Verifique se as equipes estão aparecendo corretamente')
    
  } catch (error) {
    console.error('\n❌ Erro ao atualizar banco de produção:', error)
    console.log('\n🔧 POSSÍVEIS SOLUÇÕES:')
    console.log('   1. Verifique se POSTGRES_URL está apontando para produção')
    console.log('   2. Verifique se tem permissão para alterar o banco')
    console.log('   3. Verifique se o banco está acessível')
  } finally {
    await prisma.$disconnect()
  }
}

// Executar atualização
updateProductionDatabase()
