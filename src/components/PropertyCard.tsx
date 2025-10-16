'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize, Crown } from 'lucide-react'
import { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  showAdminActions?: boolean
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onToggleVisible?: (id: number, visible: boolean) => void
  onToggleFeatured?: (id: number, featured: boolean) => void
  onTogglePremium?: (id: number, isPremium: boolean) => void
}

export default function PropertyCard({
  property,
  showAdminActions = false,
  onEdit,
  onDelete,
  onToggleVisible,
  onToggleFeatured,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = property.galleryImages || []

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
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
    <div className="mobile-card-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Galeria de Imagens */}
      <div className="relative mobile-h-48 lg:h-64 bg-gray-200 group overflow-hidden">
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
            />

            {/* Setas de navegação */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white mobile-p-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity mobile-touch-target lg:p-2"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="mobile-w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white mobile-p-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity mobile-touch-target lg:p-2"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="mobile-w-4 h-4 lg:w-5 lg:h-5" />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex mobile-gap-xs">
                  {images.map((_img: string, index: number) => (
                    <div
                      key={index}
                      className={`mobile-w-2 h-2 lg:w-2 lg:h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex mobile-gap-xs">
          <span className="bg-brand-coral text-white mobile-px-sm mobile-py-xs rounded-full mobile-text-2xs font-semibold">
            {getPropertyTypeLabel(property.propertyType)}
          </span>
          <span className="bg-green-600 text-white mobile-px-sm mobile-py-xs rounded-full mobile-text-2xs font-semibold">
            {getTransactionTypeLabel(property.transactionType)}
          </span>
        </div>

        {property.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white mobile-px-sm mobile-py-xs rounded-full mobile-text-2xs font-semibold">
              Destaque
            </span>
          </div>
        )}

        {showAdminActions && !property.visible && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-red-500 text-white mobile-px-sm mobile-py-xs rounded-full mobile-text-2xs font-semibold">
              Não Visível
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="mobile-p-md">
        <h3 className="mobile-text-lg font-bold text-gray-900 mobile-mb-sm">{property.title}</h3>
        
        <p className="text-gray-600 mobile-text-sm mobile-mb-sm line-clamp-2">
          {property.shortDescription}
        </p>

        {/* Características */}
        <div className="flex mobile-gap-sm mobile-mb-sm text-gray-600 mobile-text-2xs">
          {property.bedrooms > 0 && (
            <div className="flex items-center mobile-gap-xs">
              <Bed className="mobile-w-3 h-3 lg:w-4 lg:h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center mobile-gap-xs">
              <Bath className="mobile-w-3 h-3 lg:w-4 lg:h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.parkingSpaces > 0 && (
            <div className="flex items-center mobile-gap-xs">
              <Car className="mobile-w-3 h-3 lg:w-4 lg:h-4" />
              <span>{property.parkingSpaces}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center mobile-gap-xs">
              <Maximize className="mobile-w-3 h-3 lg:w-4 lg:h-4" />
              <span>{Number(property.area)}m²</span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="mobile-mb-md">
          <span className="mobile-text-2xs text-gray-500">A partir de</span>
          <p className="mobile-text-xl font-bold text-brand-coral">{formatPrice(Number(property.price))}</p>
        </div>

        {/* Ações */}
        {showAdminActions ? (
          <div className="flex mobile-gap-xs">
            <button
              onClick={() => onEdit?.(property.id)}
              disabled={property.visible}
              className={`flex-1 mobile-btn-sm mobile-touch-target mobile-focus-ring transition-colors ${
                property.visible
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-brand-coral text-white hover:bg-brand-coral-dark'
              }`}
              title={property.visible ? 'Propriedades aprovadas não podem ser editadas' : 'Editar propriedade'}
            >
              {property.visible ? 'Bloqueado' : 'Editar'}
            </button>
            <button
              onClick={() => onToggleVisible?.(property.id, !property.visible)}
              className={`flex-1 mobile-btn-sm mobile-touch-target mobile-focus-ring transition-colors ${
                property.visible
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {property.visible ? 'Ocultar' : 'Publicar'}
            </button>
            <button
              onClick={() => onToggleFeatured?.(property.id, !property.featured)}
              className={`flex-1 mobile-btn-sm mobile-touch-target mobile-focus-ring transition-colors ${
                property.featured
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {property.featured ? 'Remover' : 'Destacar'}
            </button>
            <button
              onClick={() => onDelete?.(property.id)}
              className="mobile-btn-sm bg-red-600 text-white hover:bg-red-700 transition-colors mobile-touch-target mobile-focus-ring"
            >
              Deletar
            </button>
          </div>
        ) : (
          <Link
            href={`/imoveis/${property.id}`}
            className="block w-full mobile-btn-md bg-brand-coral text-white text-center hover:bg-brand-coral-dark transition-colors mobile-touch-target mobile-focus-ring"
          >
            Ver Mais
          </Link>
        )}
      </div>
    </div>
  )
}
