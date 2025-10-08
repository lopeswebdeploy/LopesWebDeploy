import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Listar todas as propriedades
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        author: true,
        _count: {
          select: { leads: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('❌ Erro ao carregar propriedades:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar propriedades' }, 
      { status: 500 }
    );
  }
}

// POST - Criar nova propriedade
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar dados obrigatórios
    if (!data.title || !data.price) {
      return NextResponse.json(
        { error: 'Título e preço são obrigatórios' }, 
        { status: 400 }
      );
    }

    const newProperty = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        status: data.status || 'draft',
        featured: data.featured || false,
        authorId: data.authorId || 1, // TODO: Obter do auth
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages || [],
        floorPlans: data.floorPlans || []
      },
      include: {
        author: true
      }
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('❌ Erro ao criar propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao criar propriedade' }, 
      { status: 500 }
    );
  }
}
