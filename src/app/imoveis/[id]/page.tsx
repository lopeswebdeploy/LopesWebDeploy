import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ImageGallery from '@/components/ImageGallery'
import LeadForm from '@/components/LeadForm'
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  MapPin, 
  CheckCircle,
  ChevronLeft 
} from 'lucide-react'
import { ApartmentVariant } from '@/lib/types'

async function getProperty(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { 
        id: parseInt(id),
        visible: true, // Apenas propriedades visíveis
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })
    return property
  } catch (error) {
    return null
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(price))
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      casa: 'Casa',
      apartamento: 'Apartamento',
      terreno: 'Terreno',
      comercial: 'Comercial',
    }
    return labels[type] || type
  }

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      venda: 'Venda',
      aluguel: 'Aluguel',
      investimento: 'Investimento',
    }
    return labels[type] || type
  }

  const apartmentVariants = property.apartmentVariants 
    ? (property.apartmentVariants as unknown as ApartmentVariant[])
    : []

  return (
    <main className="min-h-screen bg-gray-50 pt-22">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-2 text-brand-coral hover:text-brand-coral-dark mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Imóveis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner e Título */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {property.bannerImage ? (
                <div className="relative h-96">
                  <Image
                    src={property.bannerImage}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : property.galleryImages && property.galleryImages.length > 0 ? (
                <div className="relative h-96">
                  <Image
                    src={property.galleryImages[0]}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-400">Sem imagem</p>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-brand-coral text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {getPropertyTypeLabel(property.propertyType)}
                  </span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {getTransactionTypeLabel(property.transactionType)}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>

                {property.address && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                )}

                <div className="flex items-end gap-2 mb-4">
                  <span className="text-sm text-gray-500">A partir de</span>
                  <span className="text-3xl font-bold text-brand-coral">
                    {formatPrice(Number(property.price))}
                  </span>
                </div>

                {/* Características */}
                <div className="flex flex-wrap gap-6 text-gray-700">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'Quarto' : 'Quartos'}</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}</span>
                    </div>
                  )}
                  {property.suites > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-purple-600" />
                      <span>{property.suites} {property.suites === 1 ? 'Suíte' : 'Suítes'}</span>
                    </div>
                  )}
                  {property.parkingSpaces > 0 && (
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      <span>{property.parkingSpaces} {property.parkingSpaces === 1 ? 'Vaga' : 'Vagas'}</span>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5" />
                      <span>{Number(property.area)}m²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Galeria de Imagens */}
            {property.galleryImages && property.galleryImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Galeria de Imagens
                </h2>
                <ImageGallery images={property.galleryImages} />
              </div>
            )}

            {/* Descrição */}
            {property.fullDescription && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sobre o Imóvel
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {property.fullDescription}
                </p>
              </div>
            )}

            {/* Vantagens */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Vantagens do Imóvel
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variantes de Apartamento */}
            {apartmentVariants.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Opções de Plantas
                </h2>
                <div className="space-y-6">
                  {apartmentVariants.map((variant) => (
                    <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-2">{variant.name}</h3>
                      <div className="flex flex-wrap gap-4 text-gray-700 mb-4">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          <span>{variant.bedrooms} Quartos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4" />
                          <span>{variant.bathrooms} Banheiros</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Maximize className="w-4 h-4" />
                          <span>{variant.area}m²</span>
                        </div>
                        {variant.price && (
                          <span className="font-semibold text-brand-coral">
                            {formatPrice(variant.price)}
                          </span>
                        )}
                      </div>

                      {variant.floorPlan && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Planta Baixa</h4>
                          <div className="relative h-64 rounded-lg overflow-hidden">
                            <Image
                              src={variant.floorPlan}
                              alt={`Planta ${variant.name}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                              className="object-contain bg-gray-50"
                            />
                          </div>
                        </div>
                      )}

                      {variant.gallery && variant.gallery.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Galeria</h4>
                          <ImageGallery images={variant.gallery} variant="mini" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Planta Baixa Normal */}
            {property.floorPlans && property.floorPlans.length > 0 && apartmentVariants.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Planta Baixa
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.floorPlans.map((plan, index) => (
                    <div key={index} className="relative h-80 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={plan}
                        alt={`Planta ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vantagens da Região */}
            {property.regionAdvantages && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Vantagens da Região
                </h2>
                <div className="space-y-3">
                  {property.regionAdvantages.split('\n').map((advantage, index) => (
                    advantage.trim() && (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{advantage.trim()}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Mapa */}
            {property.googleMapsIframe && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Localização
                </h2>
                <div 
                  className="w-full rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: property.googleMapsIframe }}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Formulário de Contato */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Tenho Interesse
              </h3>
              <LeadForm
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

