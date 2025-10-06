import { NextRequest, NextResponse } from 'next/server';
import { ImageStorage } from '@/services/imageStorage';

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
    
    const imageUrl = await ImageStorage.uploadPropertyImage(file, propertyId, type);
    
    console.log('✅ Upload concluído:', imageUrl);
    
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
  }
}
