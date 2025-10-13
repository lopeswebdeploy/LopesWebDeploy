// API Route: Deletar imagem do Blob
import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      )
    }

    // Deletar do Blob
    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar imagem do Blob:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar imagem' },
      { status: 500 }
    )
  }
}
