// API Route: Gerenciar Usuários
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// Configurar runtime para Node.js
export const runtime = 'nodejs'

// GET - Listar usuários (apenas admins)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const equipe = searchParams.get('equipe') || ''
    const role = searchParams.get('role') || ''
    const active = searchParams.get('active')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (equipe) {
      where.equipe = equipe
    }
    
    if (role) {
      where.role = role
    }
    
    if (active !== null && active !== undefined) {
      where.active = active === 'true'
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          equipe: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              properties: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar usuário (apenas admins)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, password, role, equipe, active } = body

    // Validações
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nome, email, senha e role são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        equipe: role === 'corretor' ? equipe : null,
        active: active ?? (role === 'admin')
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        equipe: true,
        active: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
