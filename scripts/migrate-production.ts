// Script de Migração para Produção
// Uso: npx tsx scripts/migrate-production.ts
// IMPORTANTE: Configure as variáveis de ambiente de produção antes de executar

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = ${tableName} AND column_name = ${columnName}
    `
    return Array.isArray(result) && result.length > 0
  } catch (error) {
    console.error(`Erro ao verificar coluna ${columnName} na tabela ${tableName}:`, error)
    return false
  }
}

async function addColumnIfNotExists(tableName: string, columnName: string, columnDefinition: string): Promise<void> {
  const exists = await checkColumnExists(tableName, columnName)
  
  if (!exists) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`)
      console.log(`✅ Coluna ${columnName} adicionada à tabela ${tableName}`)
    } catch (error) {
      console.error(`❌ Erro ao adicionar coluna ${columnName} à tabela ${tableName}:`, error)
      throw error
    }
  } else {
    console.log(`ℹ️  Coluna ${columnName} já existe na tabela ${tableName}`)
  }
}

async function updateExistingUsersWithEquipe(): Promise<void> {
  try {
    // Buscar usuários sem equipe definida
    const usersWithoutEquipe = await prisma.user.findMany({
      where: {
        OR: [
          { equipe: null },
          { equipe: '' }
        ]
      }
    })

    console.log(`📊 Encontrados ${usersWithoutEquipe.length} usuários sem equipe definida`)

    if (usersWithoutEquipe.length > 0) {
      // Atualizar usuários existentes com equipe padrão baseada no role
      for (const user of usersWithoutEquipe) {
        let defaultEquipe = null
        
        if (user.role === 'corretor') {
          // Para corretores, definir equipe padrão
          defaultEquipe = 'Lopes Marista'
        }
        // Para admins, manter null (não obrigatório)

        await prisma.user.update({
          where: { id: user.id },
          data: { equipe: defaultEquipe }
        })

        console.log(`✅ Usuário ${user.name} (${user.email}) atualizado com equipe: ${defaultEquipe || 'Não definida'}`)
      }
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar usuários existentes:', error)
    throw error
  }
}

async function checkAndCreateConstraints(): Promise<void> {
  try {
    // Verificar se a constraint de equipe válida existe
    const constraintExists = await prisma.$queryRaw`
      SELECT constraint_name 
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'check_equipe_valid'
    `

    if (!Array.isArray(constraintExists) || constraintExists.length === 0) {
      // Criar constraint para validar equipes
      await prisma.$executeRaw`
        ALTER TABLE users 
        ADD CONSTRAINT check_equipe_valid 
        CHECK (equipe IS NULL OR equipe IN ('Lopes Marista', 'Lopes Bueno', 'Lopes Jardim Goias'))
      `
      console.log('✅ Constraint de equipe válida criada')
    } else {
      console.log('ℹ️  Constraint de equipe válida já existe')
    }
  } catch (error) {
    console.error('❌ Erro ao criar constraint de equipe:', error)
    // Não falhar se a constraint já existir
    if (!error.message.includes('already exists')) {
      throw error
    }
  }
}

async function migrateProduction() {
  try {
    console.log('🚀 Iniciando migração do banco de dados de PRODUÇÃO...\n')
    console.log('⚠️  ATENÇÃO: Certifique-se de que as variáveis de ambiente de produção estão configuradas!')
    console.log('📋 Variáveis necessárias: POSTGRES_URL, NEXTAUTH_SECRET\n')

    // 1. Verificar e adicionar coluna equipe na tabela users
    console.log('1️⃣ Verificando coluna equipe na tabela users...')
    await addColumnIfNotExists('users', 'equipe', 'VARCHAR(50)')

    // 2. Verificar e adicionar coluna isLancamento na tabela properties
    console.log('\n2️⃣ Verificando coluna isLancamento na tabela properties...')
    await addColumnIfNotExists('properties', 'isLancamento', 'BOOLEAN DEFAULT FALSE')

    // 3. Atualizar usuários existentes com equipe padrão
    console.log('\n3️⃣ Atualizando usuários existentes...')
    await updateExistingUsersWithEquipe()

    // 4. Criar constraints de validação
    console.log('\n4️⃣ Criando constraints de validação...')
    await checkAndCreateConstraints()

    // 5. Verificar estado final
    console.log('\n5️⃣ Verificando estado final do banco...')
    
    const userCount = await prisma.user.count()
    const usersWithEquipe = await prisma.user.count({
      where: { equipe: { not: null } }
    })
    const propertyCount = await prisma.property.count()
    const propertiesWithLancamento = await prisma.property.count({
      where: { isLancamento: true }
    })

    console.log('\n📊 RESUMO DA MIGRAÇÃO:')
    console.log(`   👥 Total de usuários: ${userCount}`)
    console.log(`   🏢 Usuários com equipe: ${usersWithEquipe}`)
    console.log(`   🏠 Total de propriedades: ${propertyCount}`)
    console.log(`   🚀 Propriedades como lançamento: ${propertiesWithLancamento}`)

    console.log('\n✅ Migração de PRODUÇÃO concluída com sucesso!')
    console.log('\n🎯 PRÓXIMOS PASSOS:')
    console.log('   1. Execute: npx prisma generate')
    console.log('   2. Faça deploy da aplicação')
    console.log('   3. Teste o sistema em produção')

  } catch (error) {
    console.error('\n❌ Erro durante a migração de produção:', error)
    console.log('\n🔧 POSSÍVEIS SOLUÇÕES:')
    console.log('   1. Verifique se as variáveis de ambiente estão corretas')
    console.log('   2. Verifique se tem permissão para alterar o banco')
    console.log('   3. Verifique se o banco está acessível')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar migração
migrateProduction()
