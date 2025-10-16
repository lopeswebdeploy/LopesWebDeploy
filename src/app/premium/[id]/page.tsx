import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Property } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  MapPin, 
  Crown, 
  Star, 
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Mail,
  Calendar,
  CheckCircle
} from 'lucide-react'
import ImageGallery from '@/components/ImageGallery'
import LeadForm from '@/components/LeadForm'

interface PremiumPropertyPageProps {
  params: {
    id: string
  }
}

async function getPremiumProperty(id: string): Promise<any | null> {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: parseInt(id),
        visible: true,
        isPremium: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            equipe: true,
          },
        },
      },
    })

    return property
  } catch (error) {
    console.error('Erro ao buscar propriedade premium:', error)
    return null
  }
}

export default async function PremiumPropertyPage({ params }: PremiumPropertyPageProps) {
  const property = await getPremiumProperty(params.id)

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/premium"
              className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para Premium
            </Link>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
                Favoritar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria Premium */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <ImageGallery
                  images={property.galleryImages}
                  autoPlay={true}
                  showArrows={true}
                  variant="full"
                />
                
                {/* Badges Premium */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    PREMIUM
                  </span>
                  {property.featured && (
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      DESTAQUE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações da Propriedade */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{property.shortDescription}</p>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      {getPropertyTypeLabel(property.propertyType)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                      {getTransactionTypeLabel(property.transactionType)}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      <span>{property.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características Premium */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {property.bedrooms > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{property.bedrooms}</p>
                    <p className="text-blue-700 font-semibold">Quartos</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                    <Bath className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">{property.bathrooms}</p>
                    <p className="text-green-700 font-semibold">Banheiros</p>
                  </div>
                )}
                {property.parkingSpaces > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                    <Car className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">{property.parkingSpaces}</p>
                    <p className="text-purple-700 font-semibold">Vagas</p>
                  </div>
                )}
                {property.area && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                    <Maximize className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-900">{Number(property.area)}</p>
                    <p className="text-orange-700 font-semibold">m²</p>
                  </div>
                )}
              </div>

              {/* Descrição Completa */}
              {property.fullDescription && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Sobre a Propriedade</h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {property.fullDescription.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Comodidades */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Comodidades</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 px-4 py-3 rounded-lg"
                      >
                        <span className="text-gray-800 font-semibold">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vantagens da Região */}
              {property.regionAdvantages && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Vantagens da Região
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="space-y-4">
                      {property.regionAdvantages.split('\n').map((advantage: string, index: number) => (
                        advantage.trim() && (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{advantage.trim()}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Google Maps */}
              {property.googleMapsIframe && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Localização</h3>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <div
                      dangerouslySetInnerHTML={{ __html: property.googleMapsIframe }}
                      className="w-full h-96"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preço Premium */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-4">
                <Crown className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">Preço Premium</h3>
              </div>
              <p className="text-5xl font-bold mb-2">{formatPrice(Number(property.price))}</p>
              <p className="text-yellow-100">Valor exclusivo para esta propriedade</p>
            </div>

            {/* Formulário de Lead */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interessado?</h3>
              <p className="text-gray-600 mb-6">
                Entre em contato conosco para agendar uma visita ou obter mais informações.
              </p>
              <LeadForm propertyId={property.id} />
            </div>

            {/* Informações do Corretor */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seu Corretor</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {property.author.name.charAt(0)}
                </div>
                <h4 className="font-bold text-gray-900">{property.author.name}</h4>
                <p className="text-gray-600 mb-4">{property.author.equipe}</p>
                <div className="space-y-2">
                  <a
                    href={`tel:+55${property.author.email}`}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <Phone className="w-5 h-5" />
                    Ligar Agora
                  </a>
                  <a
                    href={`mailto:${property.author.email}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Mail className="w-5 h-5" />
                    Enviar Email
                  </a>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informações</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Publicado em {new Date(property.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span>Propriedade Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span>Seleção Exclusiva</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
