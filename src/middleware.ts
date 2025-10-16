// Middleware de Autenticação
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Rotas protegidas
  const isAdminRoute = path.startsWith('/admin') && 
                      !path.startsWith('/admin/login') && 
                      !path.startsWith('/admin/register')

  if (isAdminRoute) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }

    // Verificação básica do token (sem usar bcryptjs no Edge Runtime)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(loginUrl)
      }

      // Verificar se a conta está ativa
      if (!payload.active) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('error', 'inactive')
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

