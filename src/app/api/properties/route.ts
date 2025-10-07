import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Property } from '@/types/property';

// GET - Listar todas as propriedades
export async function GET() {
  try {
    const properties = await Database.loadProperties();
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
    const property: Property = await request.json();
    
    // Validar dados obrigatórios
    if (!property.title || !property.location || !property.price) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' }, 
        { status: 400 }
      );
    }

    // TODO: Implementar autenticação para obter userId
    const newProperty = await Database.addProperty(property, 'temp-user-id');
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('❌ Erro ao criar propriedade:', error);
    return NextResponse.json(
      { error: 'Erro ao criar propriedade' }, 
      { status: 500 }
    );
  }
}
