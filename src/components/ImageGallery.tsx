'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  autoPlay?: boolean
  showArrows?: boolean
  variant?: 'mini' | 'full'
}

export default function ImageGallery({
  images,
  autoPlay = false,
  showArrows = true,
  variant = 'full',
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl">
        <p className="text-gray-400">Nenhuma imagem disponível</p>
      </div>
    )
  }

  return (
    <>
      {/* Galeria Principal */}
      <div className="relative group">
        {/* Imagem Principal */}
        <div
          className={`relative bg-gray-200 rounded-xl overflow-hidden cursor-pointer ${
            variant === 'mini' ? 'h-64' : 'h-96 lg:h-[500px]'
          }`}
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />

          {/* Setas de Navegação */}
          {showArrows && images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Contador */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Miniaturas */}
        {variant === 'full' && images.length > 1 && (
          <div className="mt-4 grid grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative h-20 rounded-lg overflow-hidden ${
                  index === currentIndex ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
            <Image
              src={images[currentIndex]}
              alt={`Imagem ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

