import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params;
    
    // Verificar se property existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'gallery';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Verificar se o token está disponível
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN não configurado');
      return NextResponse.json({ 
        error: 'Token não configurado',
        environment: process.env.NODE_ENV
      }, { status: 500 });
    }

    // Fazer upload para Vercel Blob
    const filename = `properties/${propertyId}/${type}-${Date.now()}.jpg`;
    const blob = await put(filename, file, {
      access: 'public',
      contentType: 'image/jpeg',
      token: token
    });

    // Salvar no banco
    const image = await prisma.image.create({
      data: {
        url: blob.url,
        type: type,
        propertyId: propertyId,
      },
    });

    return NextResponse.json({
      id: image.id,
      url: image.url,
      type: image.type,
      propertyId: image.propertyId
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
