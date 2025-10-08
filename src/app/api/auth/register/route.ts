import { hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return Response.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    // Criar usuário INATIVO
    const hashedPassword = await hashPassword(password);
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

    return Response.json({ 
      success: true, 
      message: 'Conta criada! Entre em contato com a equipe para ativação.',
      user 
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
