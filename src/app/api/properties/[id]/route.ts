import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instância singleton do Prisma
const prisma = new PrismaClient();

// GET propriedade específica
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: { 
        id: parseInt(id),
        status: 'published'
      },
      include: {
        author: true
      }
    });

    if (!property) {
      return NextResponse.json({ error: 'Propriedade não encontrada' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PUT atualizar property (com permissões)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userHeader = request.headers.get('x-user');
    if (!userHeader) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = JSON.parse(userHeader);
    const { id } = await params;
    const data = await request.json();

    // Verificar se usuário está ativo
    if (!user.active) {
      return NextResponse.json({ error: 'Conta inativa' }, { status: 401 });
    }

    // Verificar permissões
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Propriedade não encontrada' }, { status: 404 });
    }
    
    // Apenas admin ou o autor podem editar
    if (user.role !== 'admin' && property.authorId !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    // Determinar quais campos podem ser atualizados baseado na role
    let updateData: any = {
      title: data.title,
      description: data.description,
      price: data.price ? parseFloat(data.price) : null,
      location: data.location || 'Goiânia',
      developer: data.developer || 'Lopes Imóveis',
      category: data.category || 'venda',
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
      area: data.area ? parseFloat(data.area) : null,
      bannerImage: data.bannerImage,
      galleryImages: data.galleryImages || [],
      floorPlans: data.floorPlans || [],
      updatedAt: new Date()
    };

    if (user.role === 'admin') {
      // Admin pode alterar status e destaque
      updateData.status = data.status;
      updateData.featured = data.featured || false;
    } else if (user.role === 'corretor') {
      // Corretor não pode alterar status nem destaque
      // Mantém os valores originais
      updateData.status = property.status;
      updateData.featured = property.featured;
    }

    // Atualizar
    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        author: true
      }
    });

    return NextResponse.json(updatedProperty);

  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

// DELETE - Deletar propriedade (com permissões)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userHeader = request.headers.get('x-user');
    if (!userHeader) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = JSON.parse(userHeader);
    const { id } = await params;

    // Verificar se usuário está ativo
    if (!user.active) {
      return NextResponse.json({ error: 'Conta inativa' }, { status: 401 });
    }

    // Verificar permissões
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Propriedade não encontrada' }, { status: 404 });
    }
    
    // Apenas admin ou o autor podem deletar
    if (user.role !== 'admin' && property.authorId !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    await prisma.property.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
  }
}