// Middleware de Autenticação
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

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

    const session = await verifyToken(token)

    // Redirecionar para login se não autenticado
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar se a conta está ativa
    if (!session.active) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'inactive')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

