import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// GET - Testar se a API está funcionando
export async function GET() {
  return NextResponse.json({ 
    message: 'API de upload funcionando',
    timestamp: new Date().toISOString(),
    token: process.env.BLOB_READ_WRITE_TOKEN ? 'Configurado' : 'Não configurado',
    environment: process.env.NODE_ENV
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 API Upload - Iniciando processamento...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    const type = formData.get('type') as 'banner' | 'gallery' | 'floorplan';
    
    console.log('📤 API Upload - Dados recebidos:', {
      hasFile: !!file,
      fileName: file?.name,
      propertyId,
      type,
      fileSize: file?.size
    });
    
    if (!file || !propertyId || !type) {
      console.error('❌ API Upload - Dados inválidos:', { file: !!file, propertyId, type });
      return NextResponse.json({ 
        error: 'Dados inválidos',
        details: { hasFile: !!file, propertyId, type }
      }, { status: 400 });
    }
    
    // Verificar se o token está disponível
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ API Upload - BLOB_READ_WRITE_TOKEN não configurado');
      return NextResponse.json({ 
        error: 'Token não configurado',
        environment: process.env.NODE_ENV
      }, { status: 500 });
    }
    
    const filename = `properties/${propertyId}/${type}-${Date.now()}.jpg`;
    console.log('📤 API Upload - Nome do arquivo:', filename);
    
    // Upload com tratamento de erro melhorado
    let blob;
    try {
      blob = await put(filename, file, {
        access: 'public',
        contentType: 'image/jpeg',
        token: token
      });
      console.log('✅ API Upload - Upload concluído:', blob.url);
    } catch (uploadError) {
      console.error('❌ API Upload - Erro no Vercel Blob:', uploadError);
      return NextResponse.json({ 
        error: 'Erro no upload para Vercel Blob',
        details: uploadError instanceof Error ? uploadError.message : 'Erro desconhecido'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type
    });
    
  } catch (error) {
    console.error('❌ API Upload - Erro geral:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
