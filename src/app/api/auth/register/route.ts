import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    // Validações
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Senhas não coincidem' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    // Hash da senha e criar usuário INATIVO
    const hashedPassword = await hash(password, 12);
    
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        active: false,
        role: 'corretor'
      }
    });

    const user = {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      active: result.active
    };

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Entre em contato com a equipe para ativação.',
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
