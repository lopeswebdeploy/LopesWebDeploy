import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instância singleton do Prisma
const prisma = new PrismaClient();

// GET - Para site público (apenas published) ou painel admin (todas)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const adminView = searchParams.get('admin'); // Novo parâmetro para painel admin
    
    // Verificar se é requisição do painel admin
    const userHeader = request.headers.get('x-user');
    let whereClause: any = {};
    
    if (adminView === 'true' && userHeader) {
      const user = JSON.parse(userHeader);
      
      // Verificar se usuário está ativo
      if (!user.active) {
        return NextResponse.json({ error: 'Conta inativa' }, { status: 401 });
      }
      
      // Admin vê tudo, corretor vê apenas suas propriedades
      if (user.role === 'admin') {
        // Admin vê todas as propriedades (publicadas e rascunho)
        whereClause = {};
      } else if (user.role === 'corretor') {
        // Corretor vê apenas suas próprias propriedades (todas, mesmo rascunho)
        whereClause = { authorId: user.id };
      }
    } else {
      // Site público: apenas propriedades publicadas
      whereClause = { status: 'published' };
    }
    
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
    
    console.log(`✅ API Properties - ${properties.length} propriedades encontradas`);
    return NextResponse.json(properties);
  } catch (error) {
    console.error('❌ API Properties - Erro ao buscar propriedades:', error);
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

    // Verificar se usuário está ativo
    if (!user.active) {
      return NextResponse.json({ error: 'Conta inativa' }, { status: 401 });
    }

    // Determinar status baseado na role
    let propertyStatus = 'draft';
    let propertyFeatured = false;
    
    if (user.role === 'admin') {
      // Admin pode definir status e destaque
      propertyStatus = data.status || 'draft';
      propertyFeatured = data.featured || false;
    } else if (user.role === 'corretor') {
      // Corretor sempre cria como rascunho e sem destaque
      propertyStatus = 'draft';
      propertyFeatured = false;
    }

    // Inserir property
    const newProperty = await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        status: propertyStatus,
        featured: propertyFeatured,
        location: data.location || 'Goiânia',
        developer: data.developer || 'Lopes Imóveis',
        category: data.category || 'venda',
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        area: data.area ? parseFloat(data.area) : null,
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages || [],
        floorPlans: data.floorPlans || [],
        authorId: user.id
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
