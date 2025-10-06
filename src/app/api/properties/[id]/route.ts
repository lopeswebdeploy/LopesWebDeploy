import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Property } from '@/types/property';

// GET - Buscar propriedade por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await Database.getPropertyById(params.id);
    
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
  { params }: { params: { id: string } }
) {
  try {
    const property: Property = await request.json();
    property.id = params.id; // Garantir que o ID seja o correto
    
    const updatedProperty = await Database.updateProperty(property);
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
  { params }: { params: { id: string } }
) {
  try {
    await Database.deleteProperty(params.id);
    return NextResponse.json({ message: 'Propriedade excluída com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir propriedade' }, 
      { status: 500 }
    );
  }
}
