'use client'

import { useState } from 'react'
import { Property } from '@/lib/types'
import { ChevronRight } from 'lucide-react'

interface PremiumPropertiesCarouselProps {
  properties: Property[]
}

export default function PremiumPropertiesCarousel({ properties }: PremiumPropertiesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextProperty = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length)
  }

  if (properties.length === 0) return null

  const currentProperty = properties[currentIndex]
  const nextPropertyData = properties[(currentIndex + 1) % properties.length]

  // Se só há uma propriedade, mostra apenas ela
  if (properties.length === 1) {
    return (
      <div className="relative h-full">
        <div className="bg-gray-800 rounded-3xl h-full overflow-hidden relative group">
          <div className="h-4/5 relative">
            {currentProperty.galleryImages && currentProperty.galleryImages.length > 0 ? (
              <img
                src={currentProperty.galleryImages[0]}
                alt={currentProperty.title}
                className="w-full h-full object-cover rounded-t-3xl"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-t-3xl">
                <span className="text-gray-400 text-lg">Sem imagem</span>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold mb-2 line-clamp-2">
                {currentProperty.title}
              </h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {currentProperty.shortDescription}
              </p>
              <div className="text-brand-coral text-3xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(currentProperty.price))}
              </div>
            </div>
          </div>
          <div className="h-1/5 bg-black rounded-b-3xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full flex gap-4">
      {/* Propriedade Principal - 65% da largura */}
      <div className="w-2/3 relative">
        <div className="bg-gray-800 rounded-3xl h-full overflow-hidden relative group">
          <div className="h-4/5 relative">
            {currentProperty.galleryImages && currentProperty.galleryImages.length > 0 ? (
              <img
                src={currentProperty.galleryImages[0]}
                alt={currentProperty.title}
                className="w-full h-full object-cover rounded-t-3xl"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-t-3xl">
                <span className="text-gray-400 text-lg">Sem imagem</span>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold mb-2 line-clamp-2">
                {currentProperty.title}
              </h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {currentProperty.shortDescription}
              </p>
              <div className="text-brand-coral text-3xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(currentProperty.price))}
              </div>
            </div>
          </div>
          <div className="h-1/5 bg-black rounded-b-3xl"></div>
        </div>
      </div>

      {/* Propriedade Preview - 35% da largura com blur */}
      <div className="w-1/3 relative">
        <div className="bg-gray-800 rounded-3xl h-full overflow-hidden relative group">
          <div className="h-4/5 relative">
            {nextPropertyData.galleryImages && nextPropertyData.galleryImages.length > 0 ? (
              <img
                src={nextPropertyData.galleryImages[0]}
                alt={nextPropertyData.title}
                className="w-full h-full object-cover rounded-t-3xl filter blur-sm scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-t-3xl filter blur-sm">
                <span className="text-gray-400 text-lg">Sem imagem</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/60 rounded-t-3xl"></div>
          </div>
          <div className="h-1/5 bg-black rounded-b-3xl"></div>
        </div>
      </div>

      {/* Seta fixa no canto direito */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
        <button
          onClick={nextProperty}
          className="bg-brand-coral hover:bg-brand-coral-dark text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}