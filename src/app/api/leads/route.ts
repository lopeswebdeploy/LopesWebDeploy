import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Listar todos os leads
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        property: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('❌ Erro ao carregar leads:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar leads' }, 
      { status: 500 }
    );
  }
}

// POST - Criar novo lead
export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();
    
    // Validar dados obrigatórios
    if (!leadData.name || !leadData.phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' }, 
        { status: 400 }
      );
    }

    const newLead = await prisma.lead.create({
      data: {
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        propertyId: leadData.propertyId ? parseInt(leadData.propertyId) : null,
        status: leadData.status || 'new'
      },
      include: {
        property: true
      }
    });

    // TODO: Integrar com WhatsApp aqui
    console.log('📱 Lead criado, pronto para envio WhatsApp:', {
      name: leadData.name,
      phone: leadData.phone,
      property: leadData.propertyId
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro ao criar lead' }, 
      { status: 500 }
    );
  }
}
