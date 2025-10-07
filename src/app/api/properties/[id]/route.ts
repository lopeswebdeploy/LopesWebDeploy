import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Property } from '@/types/property';

// GET - Buscar propriedade por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Implementar autenticação para obter userId e userRole
    const property = await Database.getPropertyById(id);
    
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
    const property: Property = await request.json();
    property.id = id; // Garantir que o ID seja o correto
    
    // TODO: Implementar autenticação para obter userId e userRole
    const updatedProperty = await Database.updateProperty(property, 'temp-user-id', 'admin');
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
    // TODO: Implementar autenticação para obter userId e userRole
    await Database.deleteProperty(id, 'temp-user-id', 'admin');
    return NextResponse.json({ message: 'Propriedade excluída com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir propriedade' }, 
      { status: 500 }
    );
  }
}
