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

    // Verificar permissões
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Propriedade não encontrada' }, { status: 404 });
    }
    
    // Apenas admin ou o autor podem editar
    if (user.role !== 'admin' && property.authorId !== user.userId) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    // Apenas admin pode destacar
    if (data.featured !== undefined && user.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas admin pode destacar' }, { status: 403 });
    }

    // Atualizar
    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        status: data.status,
                bannerImage: data.bannerImage,
                galleryImages: data.galleryImages || [],
        floorPlans: data.floorPlans || [],
        featured: data.featured || false,
        updatedAt: new Date()
      },
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

    // Verificar permissões
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Propriedade não encontrada' }, { status: 404 });
    }
    
    // Apenas admin ou o autor podem deletar
    if (user.role !== 'admin' && property.authorId !== user.userId) {
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