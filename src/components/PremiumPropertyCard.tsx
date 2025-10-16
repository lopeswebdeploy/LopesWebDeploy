'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { Property } from '@/lib/types'

interface PremiumPropertyCardProps {
  property: Property
  showAdminActions?: boolean
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onToggleVisible?: (id: number, visible: boolean) => void
  onToggleFeatured?: (id: number, featured: boolean) => void
  onTogglePremium?: (id: number, premium: boolean) => void
}

export default function PremiumPropertyCard({
  property,
  showAdminActions = false,
  onEdit,
  onDelete,
  onToggleVisible,
  onToggleFeatured,
  onTogglePremium,
}: PremiumPropertyCardProps) {
  const images = property.galleryImages || []
  const mainImage = images[0] || '/placeholder-image.jpg'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price))
  }

  return (
    <div className="bg-gray-800 text-white rounded-lg overflow-hidden group cursor-pointer h-full">
      {/* Imagem Principal - Grande como no template */}
      <div className="relative h-80 bg-gray-700">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay escuro sutil */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Botão de navegação circular no canto direito */}
        <div className="absolute bottom-4 right-4">
          <button className="w-16 h-16 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Título da propriedade */}
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-300 transition-colors">
          {property.title}
        </h3>
        
        {/* Descrição curta */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {property.shortDescription}
        </p>

        {/* Preço */}
        <div className="mb-6">
          <p className="text-2xl font-bold text-white">
            {formatPrice(Number(property.price))}
          </p>
        </div>

        {/* Botão de ação */}
        {showAdminActions ? (
          <div className="space-y-2">
            <button
              onClick={() => onEdit?.(property.id)}
              disabled={property.visible}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                property.visible
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {property.visible ? 'Bloqueado' : 'Editar'}
            </button>
            <button
              onClick={() => onToggleVisible?.(property.id, !property.visible)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                property.visible
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {property.visible ? 'Ocultar' : 'Publicar'}
            </button>
            <button
              onClick={() => onToggleFeatured?.(property.id, !property.featured)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                property.featured
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {property.featured ? 'Remover Destaque' : 'Destacar'}
            </button>
            <button
              onClick={() => onTogglePremium?.(property.id, !property.isPremium)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                property.isPremium
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {property.isPremium ? 'Remover Premium' : 'Tornar Premium'}
            </button>
            <button
              onClick={() => onDelete?.(property.id)}
              className="w-full py-2 px-4 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Deletar
            </button>
          </div>
        ) : (
          <Link
            href={`/premium/${property.id}`}
            className="block w-full bg-black hover:bg-gray-900 text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            Entrar em Contato
          </Link>
        )}
      </div>
    </div>
  )
}
