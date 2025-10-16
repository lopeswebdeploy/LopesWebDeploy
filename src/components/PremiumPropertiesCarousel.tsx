'use client'

import { useState } from 'react'
import { Property } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PremiumPropertiesCarouselProps {
  properties: Property[]
}

export default function PremiumPropertiesCarousel({ properties }: PremiumPropertiesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextProperty = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length)
  }

  const prevProperty = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length)
  }

  if (properties.length === 0) return null

  const currentProperty = properties[currentIndex]

  return (
    <div className="relative h-full">
      {/* Container principal do carrossel */}
      <div className="h-full overflow-hidden relative">
        {/* Propriedade atual */}
        <div 
          key={currentIndex}
          className="h-full transition-all duration-500 ease-in-out"
        >
          <div className="bg-gray-800 rounded-3xl h-full overflow-hidden relative group">
            {/* Imagem principal - destaque maior */}
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
              
              {/* Overlay com informações na imagem */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <h3 className="text-white text-2xl font-bold mb-2 line-clamp-2">
                  {currentProperty.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {currentProperty.shortDescription}
                </p>
                <div className="text-pink-600 text-3xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(Number(currentProperty.price))}
                </div>
              </div>
            </div>
            
            {/* Faixa preta embaixo - sem informações */}
            <div className="h-1/5 bg-black rounded-b-3xl"></div>
          </div>
        </div>
      </div>

      {/* Controles de navegação - só setas laterais */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <button
          onClick={prevProperty}
          className="bg-pink-600 hover:bg-pink-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <button
          onClick={nextProperty}
          className="bg-pink-600 hover:bg-pink-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}