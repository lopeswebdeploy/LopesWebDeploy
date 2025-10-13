// API Route: Buscar, Atualizar e Deletar Propriedade
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { deleteMultipleImages } from '@/lib/blob'

// GET: Buscar propriedade específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Propriedade não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Erro ao buscar propriedade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar propriedade' },
      { status: 500 }
    )
  }
}

// PUT: Atualizar propriedade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Buscar propriedade existente
    const existingProperty = await prisma.property.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Propriedade não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissões
    const isOwner = existingProperty.authorId === session.userId
    const isAdmin = session.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Sem permissão para editar esta propriedade' },
        { status: 403 }
      )
    }

    // Preparar dados de atualização
    const updateData: any = {}

    // Campos que todos podem editar
    if (body.title !== undefined) updateData.title = body.title
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription
    if (body.fullDescription !== undefined) updateData.fullDescription = body.fullDescription
    if (body.propertyType !== undefined) updateData.propertyType = body.propertyType
    if (body.transactionType !== undefined) updateData.transactionType = body.transactionType
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms
    if (body.bathrooms !== undefined) updateData.bathrooms = body.bathrooms
    if (body.suites !== undefined) updateData.suites = body.suites
    if (body.parkingSpaces !== undefined) updateData.parkingSpaces = body.parkingSpaces
    if (body.area !== undefined) updateData.area = body.area ? parseFloat(body.area) : null
    if (body.amenities !== undefined) updateData.amenities = body.amenities
    if (body.bannerImage !== undefined) updateData.bannerImage = body.bannerImage
    if (body.galleryImages !== undefined) updateData.galleryImages = body.galleryImages
    if (body.floorPlans !== undefined) updateData.floorPlans = body.floorPlans
    if (body.apartmentVariants !== undefined) updateData.apartmentVariants = body.apartmentVariants
    if (body.address !== undefined) updateData.address = body.address
    if (body.googleMapsIframe !== undefined) updateData.googleMapsIframe = body.googleMapsIframe
    if (body.isLancamento !== undefined) updateData.isLancamento = body.isLancamento

    // Campos que apenas admin pode editar
    if (isAdmin) {
      if (body.visible !== undefined) updateData.visible = body.visible
      if (body.featured !== undefined) updateData.featured = body.featured
      if (body.status !== undefined) updateData.status = body.status
    }

    const property = await prisma.property.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Erro ao atualizar propriedade:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar propriedade' },
      { status: 500 }
    )
  }
}

// DELETE: Deletar propriedade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Buscar propriedade existente
    const existingProperty = await prisma.property.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Propriedade não encontrada' },
        { status: 404 }
      )
    }

    // Verificar permissões
    const isOwner = existingProperty.authorId === session.userId
    const isAdmin = session.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar esta propriedade' },
        { status: 403 }
      )
    }

    // Coletar todas as imagens para deletar
    const imagesToDelete = [
      ...(existingProperty.galleryImages || []),
      ...(existingProperty.floorPlans || []),
    ]

    if (existingProperty.bannerImage) {
      imagesToDelete.push(existingProperty.bannerImage)
    }

    // Deletar propriedade do banco
    await prisma.property.delete({
      where: { id: parseInt(id) },
    })

    // Deletar imagens do blob (não bloquear a resposta)
    if (imagesToDelete.length > 0) {
      deleteMultipleImages(imagesToDelete).catch((error) =>
        console.error('Erro ao deletar imagens:', error)
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar propriedade:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar propriedade' },
      { status: 500 }
    )
  }
}

