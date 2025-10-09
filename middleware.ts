import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar se está acessando rota admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Não proteger login e register
    if (request.nextUrl.pathname === '/admin/login' || 
        request.nextUrl.pathname === '/admin/register') {
      return NextResponse.next();
    }

    // Verificar se tem sessão
    const session = request.cookies.get('user-session');
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const user = JSON.parse(session.value);
      
      // Verificar se usuário está ativo
      if (!user.id) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Adicionar user ao header para uso nas páginas
      const response = NextResponse.next();
      response.headers.set('x-user', JSON.stringify(user));
      return response;

    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};



