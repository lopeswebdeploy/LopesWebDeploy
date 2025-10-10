// API Route: Upload de Imagens
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { uploadImage, uploadMultipleImages } from '@/lib/blob'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const propertyId = formData.get('propertyId') as string
    const type = formData.get('type') as 'banner' | 'gallery' | 'floor_plan' | 'apartment_variant'
    
    if (!propertyId || !type) {
      return NextResponse.json(
        { error: 'propertyId e type são obrigatórios' },
        { status: 400 }
      )
    }

    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Upload único ou múltiplo
    let urls: string[]

    if (type === 'banner') {
      const url = await uploadImage(files[0], parseInt(propertyId), type)
      urls = [url]
    } else {
      urls = await uploadMultipleImages(files, parseInt(propertyId), type)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}

