import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PropertyService } from '@/services/propertyService'
import PropertyDetails from '@/components/properties/PropertyDetails'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const property = await PropertyService.getPropertyById(id)
  
  if (!property) {
    return {
      title: 'Imóvel não encontrado - Lopes Imóveis',
    }
  }

  return {
    title: `${property.title} - Lopes Imóveis`,
    description: property.description || `Confira este imóvel exclusivo em Goiânia`,
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await PropertyService.getPropertyById(id)

  if (!property) {
    notFound()
  }

  return <PropertyDetails property={property} />
}
