import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    const type = formData.get('type') as string; // 'banner', 'gallery', 'floorplan'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 });
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (max 5MB)' }, { status: 400 });
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}-${timestamp}.${fileExtension}`;
    
    const path = propertyId ? `properties/${propertyId}/${fileName}` : `temp/${fileName}`;

    // Fazer upload para Vercel Blob
    const blob = await put(path, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      path: blob.pathname
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}



