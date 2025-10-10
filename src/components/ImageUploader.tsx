'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  propertyId: number
  type: 'banner' | 'gallery' | 'floor_plan' | 'apartment_variant'
  label: string
  maxFiles?: number
  currentImages?: string[]
  onUploadComplete: (urls: string[]) => void
}

export default function ImageUploader({
  propertyId,
  type,
  label,
  maxFiles = 1,
  currentImages = [],
  onUploadComplete,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(currentImages)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Verificar limite
    if (images.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} imagens permitidas`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('propertyId', propertyId.toString())
      formData.append('type', type)
      files.forEach((file) => formData.append('files', file))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      const newImages = [...images, ...data.urls]
      setImages(newImages)
      onUploadComplete(newImages)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onUploadComplete(newImages)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {maxFiles > 1 && `(máx. ${maxFiles})`}
      </label>

      <div className="space-y-4">
        {/* Preview de Imagens */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative h-32 rounded-lg overflow-hidden group">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {images.length < maxFiles && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 mb-2 text-gray-400 animate-spin" />
                  <p className="text-sm text-gray-500">Fazendo upload...</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG até 10MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple={maxFiles > 1}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  )
}

