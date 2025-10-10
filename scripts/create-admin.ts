// Script para criar o primeiro usuário admin
// Uso: npx tsx scripts/create-admin.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@lopesmarista.com'
    const password = 'admin123' // MUDE ISSO DEPOIS!
    const name = 'Administrador'

    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('❌ Admin já existe com este email!')
      return
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        active: true,
      },
    })

    console.log('✅ Admin criado com sucesso!')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Senha: ${password}`)
    console.log('⚠️  IMPORTANTE: Mude a senha após o primeiro login!')
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

