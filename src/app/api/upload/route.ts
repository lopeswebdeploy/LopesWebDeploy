import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// GET - Testar se a API está funcionando
export async function GET() {
  return NextResponse.json({ 
    message: 'API de upload funcionando',
    timestamp: new Date().toISOString(),
    token: process.env.BLOB_READ_WRITE_TOKEN ? 'Configurado' : 'Não configurado'
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    const type = formData.get('type') as 'banner' | 'gallery' | 'floorplan';
    
    if (!file || !propertyId || !type) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }
    
    console.log('📤 Upload iniciado:', { propertyId, type, fileName: file.name });
    
    // Verificar se o token está disponível
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN não configurado');
      return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });
    }
    
    const filename = `properties/${propertyId}/${type}-${Date.now()}.jpg`;
    
    // Upload direto com token (Vercel Blob v2.0.0)
    const blob = await put(filename, file, {
      access: 'public',
      contentType: 'image/jpeg',
      token: token
    });
    
    console.log('✅ Upload concluído:', blob.url);
    
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
  }
}
