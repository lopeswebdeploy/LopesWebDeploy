// API Route: Listar e Criar Propriedades
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET: Listar propriedades com filtros
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parâmetros de filtro
    const propertyType = searchParams.get('propertyType')
    const transactionType = searchParams.get('transactionType')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const featured = searchParams.get('featured')
    const visible = searchParams.get('visible')
    const authorId = searchParams.get('authorId')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Construir filtros
    const where: any = {}

    if (propertyType) where.propertyType = propertyType
    if (transactionType) where.transactionType = transactionType
    if (bedrooms) where.bedrooms = parseInt(bedrooms)
    if (bathrooms) where.bathrooms = parseInt(bathrooms)
    if (featured !== null) where.featured = featured === 'true'
    if (visible !== null) where.visible = visible === 'true'
    if (authorId) where.authorId = parseInt(authorId)
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Buscar propriedades
    const properties = await prisma.property.findMany({
      where,
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
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    })

    const total = await prisma.property.count({ where })

    return NextResponse.json({
      properties,
      total,
      limit: limit ? parseInt(limit) : total,
      offset: offset ? parseInt(offset) : 0,
    })
  } catch (error) {
    console.error('Erro ao listar propriedades:', error)
    return NextResponse.json(
      { error: 'Erro ao listar propriedades' },
      { status: 500 }
    )
  }
}

// POST: Criar propriedade
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validações básicas
    if (!body.title || !body.propertyType || !body.transactionType || !body.price) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Corretor sempre cria propriedades invisíveis
    const visible = session.role === 'admin' ? body.visible || false : false

    const property = await prisma.property.create({
      data: {
        title: body.title,
        shortDescription: body.shortDescription || '',
        fullDescription: body.fullDescription || '',
        propertyType: body.propertyType,
        transactionType: body.transactionType,
        price: parseFloat(body.price),
        bedrooms: body.bedrooms || 0,
        bathrooms: body.bathrooms || 0,
        suites: body.suites || 0,
        parkingSpaces: body.parkingSpaces || 0,
        area: body.area ? parseFloat(body.area) : null,
        amenities: body.amenities || [],
        bannerImage: body.bannerImage || null,
        galleryImages: body.galleryImages || [],
        floorPlans: body.floorPlans || [],
        apartmentVariants: body.apartmentVariants || null,
        address: body.address || '',
        googleMapsIframe: body.googleMapsIframe || '',
        featured: false,
        visible,
        status: 'draft',
        authorId: session.userId,
      },
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

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar propriedade:', error)
    return NextResponse.json(
      { error: 'Erro ao criar propriedade' },
      { status: 500 }
    )
  }
}

