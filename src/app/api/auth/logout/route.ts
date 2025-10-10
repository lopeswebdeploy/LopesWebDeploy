// API Route: Logout
import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth'

export async function POST() {
  try {
    await clearSession()
    
    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso',
    })
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}

