'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize } from 'lucide-react'
import { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  showAdminActions?: boolean
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onToggleVisible?: (id: number, visible: boolean) => void
  onToggleFeatured?: (id: number, featured: boolean) => void
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Galeria de Imagens */}
      <div className="relative h-64 bg-gray-200 group">
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_img: string, index: number) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
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
        <div className="absolute top-2 left-2 flex gap-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {getPropertyTypeLabel(property.propertyType)}
          </span>
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {getTransactionTypeLabel(property.transactionType)}
          </span>
        </div>

        {property.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Destaque
            </span>
          </div>
        )}

        {showAdminActions && !property.visible && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Não Visível
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.shortDescription}
        </p>

        {/* Características */}
        <div className="flex gap-4 mb-3 text-gray-600 text-sm">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.parkingSpaces > 0 && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              <span>{property.parkingSpaces}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{Number(property.area)}m²</span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">A partir de</span>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(Number(property.price))}</p>
        </div>

        {/* Ações */}
        {showAdminActions ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(property.id)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onToggleVisible?.(property.id, !property.visible)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                property.visible
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {property.visible ? 'Ocultar' : 'Publicar'}
            </button>
            <button
              onClick={() => onToggleFeatured?.(property.id, !property.featured)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                property.featured
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {property.featured ? 'Remover' : 'Destacar'}
            </button>
            <button
              onClick={() => onDelete?.(property.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Deletar
            </button>
          </div>
        ) : (
          <Link
            href={`/imoveis/${property.id}`}
            className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Mais
          </Link>
        )}
      </div>
    </div>
  )
}
