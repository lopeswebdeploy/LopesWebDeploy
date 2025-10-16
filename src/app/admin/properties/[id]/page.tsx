'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PropertyForm from '@/components/PropertyForm'
import ImageUploader from '@/components/ImageUploader'
import { Property, PropertyFormData } from '@/lib/types'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [propertyId, setPropertyId] = useState<number>(0)
  const [images, setImages] = useState({
    banner: [] as string[],
    gallery: [] as string[],
    floorPlans: [] as string[],
  })

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params
      setPropertyId(parseInt(resolvedParams.id))
      await fetchSession()
      await fetchProperty(parseInt(resolvedParams.id))
    }
    init()
  }, [params])

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchProperty = async (id: number) => {
    try {
      const response = await fetch(`/api/properties/${id}`)
      const data = await response.json()

      if (response.ok) {
        setProperty(data.property)
        setImages({
          banner: data.property.bannerImage ? [data.property.bannerImage] : [],
          gallery: data.property.galleryImages || [],
          floorPlans: data.property.floorPlans || [],
        })
      } else {
        alert('Propriedade não encontrada')
        router.push('/admin/properties')
      }
    } catch (error) {
      alert('Erro ao carregar propriedade')
      router.push('/admin/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: PropertyFormData) => {
    setSaving(true)

    try {
      const propertyData = {
        ...data,
        bannerImage: images.banner[0] || '',
        galleryImages: images.gallery,
        floorPlans: images.floorPlans,
      }

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar propriedade')
      }

      alert('Propriedade atualizada com sucesso!')
      router.push('/admin/properties')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !session || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-coral" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/properties"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Propriedade
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Upload de Imagens */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Imagens da Propriedade
            </h2>
            
            <div className="space-y-6">
              <div>
                <ImageUploader
                  propertyId={propertyId}
                  type="banner"
                  label="Imagem de Banner (Destaque)"
                  maxFiles={1}
                  currentImages={images.banner}
                  onUploadComplete={(urls) => setImages({ ...images, banner: urls })}
                />
              </div>

              <div>
                <ImageUploader
                  propertyId={propertyId}
                  type="gallery"
                  label="Galeria de Imagens"
                  maxFiles={15}
                  currentImages={images.gallery}
                  onUploadComplete={(urls) => setImages({ ...images, gallery: urls })}
                />
              </div>

              <div>
                <ImageUploader
                  propertyId={propertyId}
                  type="floor_plan"
                  label="Plantas Baixas"
                  maxFiles={5}
                  currentImages={images.floorPlans}
                  onUploadComplete={(urls) => setImages({ ...images, floorPlans: urls })}
                />
              </div>
            </div>
          </div>

          {/* Formulário */}
          <PropertyForm 
            property={property} 
            onSubmit={handleSubmit} 
            isLoading={saving} 
          />
        </div>
      </div>
    </div>
  )
}

