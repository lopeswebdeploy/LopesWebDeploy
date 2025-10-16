'use client'

import { useEffect, useState } from 'react'
import PropertyCard from '@/components/PropertyCard'
import PremiumPropertyCard from '@/components/PremiumPropertyCard'
import { Property } from '@/lib/types'
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'

export default function ImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    propertyType: '',
    transactionType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    search: '',
    isLancamento: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      // Construir query string
      const params = new URLSearchParams()
      params.append('visible', 'true') // Apenas propriedades visíveis
      // Não filtrar por lançamento - mostrar todas as propriedades visíveis

      if (filters.propertyType) params.append('propertyType', filters.propertyType)
      if (filters.transactionType) params.append('transactionType', filters.transactionType)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms)
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms)
      if (filters.search) params.append('search', filters.search)
      if (filters.isLancamento !== '') params.append('isLancamento', filters.isLancamento)

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProperties()
  }

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      transactionType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      search: '',
      isLancamento: '',
    })
    setTimeout(() => fetchProperties(), 0)
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-22">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nossos Imóveis
          </h1>
          <p className="text-gray-600">
            Explore nossa seleção completa de propriedades disponíveis, incluindo lançamentos e propriedades premium
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou endereço..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-brand-coral text-white rounded-lg font-semibold hover:bg-brand-coral-dark transition-colors"
              >
                Buscar
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                  >
                    <option value="">Todos</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lançamento
                  </label>
                  <select
                    value={filters.isLancamento}
                    onChange={(e) => setFilters({ ...filters, isLancamento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                  >
                    <option value="">Todos</option>
                    <option value="true">Apenas Lançamentos</option>
                    <option value="false">Excluir Lançamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transação
                  </label>
                  <select
                    value={filters.transactionType}
                    onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                  >
                    <option value="">Todas</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                    <option value="investimento">Investimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Mín.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Máx.
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quartos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banheiros
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.bathrooms}
                    onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-coral"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-3 lg:col-span-7">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-brand-coral hover:text-brand-coral-dark font-medium"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-coral" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              property.isPremium ? (
                <PremiumPropertyCard key={property.id} property={property} />
              ) : (
                <PropertyCard key={property.id} property={property} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              Nenhuma propriedade encontrada com os filtros selecionados.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-brand-coral hover:text-brand-coral-dark font-semibold"
            >
              Limpar filtros e ver todos
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

