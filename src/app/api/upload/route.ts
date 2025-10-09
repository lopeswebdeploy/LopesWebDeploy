import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas arquivos de imagem são permitidos' }, { status: 400 });
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 });
    }

    // Organizar por tipo de imagem
    let folder = 'properties';
    switch (type) {
      case 'banner':
        folder = 'properties/banners';
        break;
      case 'gallery':
        folder = 'properties/gallery';
        break;
      case 'floorplan':
        folder = 'properties/floorplans';
        break;
      default:
        folder = 'properties/misc';
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    const fullPath = `${folder}/${filename}`;

    // Fazer upload para o Vercel Blob
    const blob = await put(fullPath, file, {
      access: 'public',
    });

    console.log(`✅ Upload realizado: ${fullPath} -> ${blob.url}`);

    return NextResponse.json({
      url: blob.url,
      path: fullPath,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}