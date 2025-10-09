import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Para site público (apenas published)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    let whereClause: any = { status: 'published' };
    
    if (featured === 'true') {
      whereClause.featured = true;
    }
    
    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        author: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar propriedades' },
      { status: 500 }
    );
  }
}

// POST - Criar property (apenas usuários logados)
export async function POST(request: Request) {
  try {
    // Verificar sessão do middleware
    const userHeader = request.headers.get('x-user');
    if (!userHeader) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = JSON.parse(userHeader);
    const data = await request.json();

    // Inserir property
    const newProperty = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        status: data.status || 'draft',
        featured: data.featured || false,
                bannerImage: data.bannerImage,
                galleryImages: data.galleryImages || [],
        floorPlans: data.floorPlans || [],
        authorId: user.userId
      },
      include: {
        author: true
      }
    });

    return NextResponse.json(newProperty);

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Erro ao criar propriedade' },
      { status: 500 }
    );
  }
}
