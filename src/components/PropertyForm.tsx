'use client'

import { useState } from 'react'
import { Property, PropertyFormData, ApartmentVariant } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => void
  isLoading?: boolean
}

const AMENITIES_OPTIONS = [
  'Piscina',
  'Academia',
  'Churrasqueira',
  'Salão de Festas',
  'Playground',
  'Quadra Esportiva',
  'Sauna',
  'Espaço Gourmet',
  'Pet Place',
  'Segurança 24h',
  'Portaria',
  'Elevador',
]

export default function PropertyForm({ property, onSubmit, isLoading = false }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || '',
    shortDescription: property?.shortDescription || '',
    fullDescription: property?.fullDescription || '',
    propertyType: property?.propertyType || 'casa',
    transactionType: property?.transactionType || 'venda',
    price: property?.price ? Number(property.price) : 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    suites: property?.suites || 0,
    parkingSpaces: property?.parkingSpaces || 0,
    area: property?.area ? Number(property.area) : 0,
    amenities: property?.amenities || [],
    address: property?.address || '',
    googleMapsIframe: property?.googleMapsIframe || '',
    bannerImage: property?.bannerImage || '',
    galleryImages: property?.galleryImages || [],
    floorPlans: property?.floorPlans || [],
    apartmentVariants: property?.apartmentVariants 
      ? (property.apartmentVariants as unknown as ApartmentVariant[])
      : [],
    isLancamento: property?.isLancamento || false,
  })

  const [showApartmentVariants, setShowApartmentVariants] = useState(
    property?.propertyType === 'apartamento' && 
    property?.apartmentVariants && 
    Array.isArray(property.apartmentVariants) &&
    (property.apartmentVariants as unknown as ApartmentVariant[]).length > 0
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      })
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      })
    }
  }

  const addVariant = () => {
    const newVariant: ApartmentVariant = {
      id: Date.now().toString(),
      name: '',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      floorPlan: '',
      gallery: [],
    }
    setFormData({
      ...formData,
      apartmentVariants: [...(formData.apartmentVariants || []), newVariant],
    })
  }

  const removeVariant = (id: string) => {
    setFormData({
      ...formData,
      apartmentVariants: formData.apartmentVariants?.filter((v) => v.id !== id),
    })
  }

  const updateVariant = (id: string, updates: Partial<ApartmentVariant>) => {
    setFormData({
      ...formData,
      apartmentVariants: formData.apartmentVariants?.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informações Básicas */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Casa de Luxo no Centro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Imóvel *
            </label>
            <select
              required
              value={formData.propertyType}
              onChange={(e) => {
                setFormData({ ...formData, propertyType: e.target.value })
                if (e.target.value !== 'apartamento') {
                  setShowApartmentVariants(false)
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Transação *
            </label>
            <select
              required
              value={formData.transactionType}
              onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="investimento">Investimento</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isLancamento}
                onChange={(e) => setFormData({ ...formData, isLancamento: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                É um lançamento
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Marque se esta propriedade é um novo lançamento
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área (m²)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
      </section>

      {/* Descrições */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Descrições</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição Curta (para cards)
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descrição..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.shortDescription.length}/200 caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição Completa
            </label>
            <textarea
              rows={6}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada do imóvel..."
            />
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Características</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartos
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bedrooms: Math.max(0, formData.bedrooms - 1) })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bedrooms: formData.bedrooms + 1 })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banheiros
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bathrooms: Math.max(0, formData.bathrooms - 1) })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bathrooms: formData.bathrooms + 1 })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suítes
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, suites: Math.max(0, formData.suites - 1) })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={formData.suites}
                onChange={(e) => setFormData({ ...formData, suites: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, suites: formData.suites + 1 })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vagas
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, parkingSpaces: Math.max(0, formData.parkingSpaces - 1) })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, parkingSpaces: formData.parkingSpaces + 1 })}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens/Amenities */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Vantagens do Imóvel</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITIES_OPTIONS.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Localização */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Localização</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps iFrame URL
            </label>
            <textarea
              rows={3}
              value={formData.googleMapsIframe}
              onChange={(e) => setFormData({ ...formData, googleMapsIframe: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
            />
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Importante: Acesse Google Maps em um computador, pesquise o local, clique em "Compartilhar" → "Incorporar um mapa" → Copie o código HTML completo
            </p>
          </div>
        </div>
      </section>

      {/* Variantes de Apartamento */}
      {formData.propertyType === 'apartamento' && (
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Variantes de Apartamento</h2>
            <button
              type="button"
              onClick={() => setShowApartmentVariants(!showApartmentVariants)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showApartmentVariants ? 'Remover variantes' : 'Adicionar variantes'}
            </button>
          </div>

          {showApartmentVariants && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use variantes quando o apartamento possui diferentes plantas (ex: opção de 2 ou 3 quartos)
              </p>

              {formData.apartmentVariants?.map((variant) => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">Variante</h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Variante
                      </label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ex: Planta 2 quartos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quartos
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variant.bedrooms}
                        onChange={(e) => updateVariant(variant.id, { bedrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banheiros
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={variant.bathrooms}
                        onChange={(e) => updateVariant(variant.id, { bathrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Área (m²)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.area}
                        onChange={(e) => updateVariant(variant.id, { area: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (opcional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price || ''}
                        onChange={(e) => updateVariant(variant.id, { price: parseFloat(e.target.value) || undefined })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Adicionar Variante
              </button>
            </div>
          )}
        </section>
      )}

      {/* Botão Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : property ? 'Atualizar Propriedade' : 'Criar Propriedade'}
        </button>
      </div>
    </form>
  )
}
