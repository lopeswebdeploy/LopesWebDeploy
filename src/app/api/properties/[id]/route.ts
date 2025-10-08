import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Buscar propriedade por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        leads: true
      }
    });
    
    if (!property) {
      return NextResponse.json(
        { error: 'Propriedade não encontrada' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(property);
  } catch (error) {
    console.error('❌ Erro ao buscar propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar propriedade' }, 
      { status: 500 }
    );
  }
}

// PUT - Atualizar propriedade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updatedProperty = await prisma.property.update({
      where: { id: parseInt(id) },
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        status: data.status,
        featured: data.featured,
        bannerImage: data.bannerImage,
        galleryImages: data.galleryImages || [],
        floorPlans: data.floorPlans || [],
        updatedAt: new Date()
      },
      include: {
        author: true
      }
    });
    
    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('❌ Erro ao atualizar propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar propriedade' }, 
      { status: 500 }
    );
  }
}

// DELETE - Excluir propriedade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.property.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ message: 'Propriedade excluída com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir propriedade' }, 
      { status: 500 }
    );
  }
}
