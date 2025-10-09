import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar se está acessando rota admin ou API protegida
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/api/properties')) {
    
    // Não proteger login e register
    if (request.nextUrl.pathname === '/admin/login' || 
        request.nextUrl.pathname === '/admin/register') {
      return NextResponse.next();
    }

    // Para APIs, permitir GET sem autenticação (público)
    if (request.nextUrl.pathname.startsWith('/api/properties') && 
        request.method === 'GET') {
      return NextResponse.next();
    }

    // Verificar se tem sessão
    const session = request.cookies.get('user-session');
    
    if (!session) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const user = JSON.parse(session.value);
      
      // Verificar se usuário está ativo
      if (!user.id) {
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Adicionar user ao header para uso nas páginas e APIs
      const response = NextResponse.next();
      response.headers.set('x-user', JSON.stringify(user));
      return response;

    } catch (error) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/properties/:path*']
};



