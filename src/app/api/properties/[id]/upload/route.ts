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
      where: { id: parseInt(propertyId) }
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

    // Atualizar property no banco com a nova imagem
    let updatedProperty;
    
    if (type === 'banner') {
      updatedProperty = await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { bannerImage: blob.url }
      });
    } else if (type === 'gallery') {
      // Adicionar ao array de gallery
      updatedProperty = await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { 
          galleryImages: { 
            push: blob.url 
          } 
        }
      });
    } else if (type === 'floorplan') {
      // Adicionar ao array de floor plans
      updatedProperty = await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { 
          floorPlans: { 
            push: blob.url 
          } 
        }
      });
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      type: type,
      propertyId: parseInt(propertyId)
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
