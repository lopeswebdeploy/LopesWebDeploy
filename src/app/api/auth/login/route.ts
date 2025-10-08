import { verifyPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    if (!user.active) {
      return Response.json({ error: 'Conta inativa. Entre em contato com a equipe.' }, { status: 401 });
    }

    // Verificar senha
    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Retornar usuário (sem senha)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };

    return Response.json({ 
      success: true, 
      user: userResponse 
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
