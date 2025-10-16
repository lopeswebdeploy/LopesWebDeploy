// Script Rápido para Atualizar Banco de Produção
// Uso: npx tsx scripts/quick-update.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function quickUpdate() {
  try {
    console.log('🚀 Atualizando banco de produção...')
    
    // Conectar
    await prisma.$connect()
    console.log('✅ Conectado!')
    
    // Adicionar coluna equipe se não existir
    try {
      await prisma.$executeRaw`ALTER TABLE users ADD COLUMN equipe VARCHAR(50)`
      console.log('✅ Coluna equipe adicionada')
    } catch (e) {
      console.log('ℹ️  Coluna equipe já existe')
    }
    
    // Adicionar coluna isLancamento se não existir
    try {
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN isLancamento BOOLEAN DEFAULT FALSE`
      console.log('✅ Coluna isLancamento adicionada')
    } catch (e) {
      console.log('ℹ️  Coluna isLancamento já existe')
    }
    
    // Adicionar coluna isPremium se não existir
    try {
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN isPremium BOOLEAN DEFAULT FALSE`
      console.log('✅ Coluna isPremium adicionada')
    } catch (e) {
      console.log('ℹ️  Coluna isPremium já existe')
    }
    
    // Adicionar coluna regionAdvantages se não existir
    try {
      await prisma.$executeRaw`ALTER TABLE properties ADD COLUMN regionAdvantages TEXT`
      console.log('✅ Coluna regionAdvantages adicionada')
    } catch (e) {
      console.log('ℹ️  Coluna regionAdvantages já existe')
    }

    // Remover coluna duplicada islancamento se existir
    try {
      await prisma.$executeRaw`ALTER TABLE properties DROP COLUMN islancamento`
      console.log('✅ Coluna islancamento duplicada removida')
    } catch (e) {
      console.log('ℹ️  Coluna islancamento não existe ou já foi removida')
    }
    
    // Atualizar usuários com equipe padrão
    const result = await prisma.user.updateMany({
      where: {
        role: 'corretor',
        OR: [
          { equipe: null },
          { equipe: '' }
        ]
      },
      data: {
        equipe: 'Lopes Marista'
      }
    })
    
    console.log(`✅ ${result.count} usuários atualizados com equipe padrão`)
    
    // Criar constraint
    try {
      await prisma.$executeRaw`
        ALTER TABLE users 
        ADD CONSTRAINT check_equipe_valid 
        CHECK (equipe IS NULL OR equipe IN ('Lopes Marista', 'Lopes Bueno', 'Lopes Jardim Goias'))
      `
      console.log('✅ Constraint criada')
    } catch (e) {
      console.log('ℹ️  Constraint já existe')
    }
    
    // Verificar resultado
    const users = await prisma.user.findMany({
      select: { name: true, role: true, equipe: true }
    })
    
    console.log('\n📊 USUÁRIOS:')
    users.forEach(u => {
      console.log(`- ${u.name} (${u.role}) - Equipe: ${u.equipe || 'Não definida'}`)
    })
    
    console.log('\n🎉 ATUALIZAÇÃO CONCLUÍDA!')
    
  } catch (error) {
    console.error('❌ Erro:', error instanceof Error ? error.message : String(error))
  } finally {
    await prisma.$disconnect()
  }
}

quickUpdate()
