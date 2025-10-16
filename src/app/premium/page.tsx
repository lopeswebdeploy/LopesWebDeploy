'use client'

import { useEffect, useState } from 'react'
import PremiumPropertyCard from '@/components/PremiumPropertyCard'
import { Property } from '@/lib/types'
import { Search, SlidersHorizontal, Loader2, Crown, Star } from 'lucide-react'

export default function PremiumPage() {
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
      params.append('isPremium', 'true') // Apenas propriedades premium

      if (filters.propertyType) params.append('propertyType', filters.propertyType)
      if (filters.transactionType) params.append('transactionType', filters.transactionType)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms)
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Erro ao buscar propriedades premium:', error)
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
    })
    fetchProperties()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section Premium */}
      <section className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Propriedades Premium</h1>
            <Crown className="w-12 h-12" />
          </div>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Descubra nossa seleção exclusiva de imóveis de alto padrão, 
            cuidadosamente escolhidos para oferecer o máximo em conforto, 
            localização e qualidade de vida.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-lg">
            <Star className="w-6 h-6 fill-current" />
            <span className="font-semibold">Seleção Limitada</span>
            <span className="opacity-75">•</span>
            <span className="opacity-75">Máximo 5 propriedades</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Buscar propriedades premium..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <form onSubmit={handleSearch} className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Propriedade
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Todos</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transação
                  </label>
                  <select
                    value={filters.transactionType}
                    onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Todas</option>
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                    <option value="investimento">Investimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preço Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="R$ 0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preço Máximo
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="R$ 0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quartos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banheiros
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.bathrooms}
                    onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-6">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Carregando propriedades premium...</p>
            </div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PremiumPropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Nenhuma Propriedade Premium
              </h3>
              <p className="text-gray-600 mb-6">
                No momento não há propriedades premium disponíveis com os filtros selecionados.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Todas as Propriedades
              </button>
            </div>
          </div>
        )}

        {/* Info sobre limite */}
        {properties.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-600" />
                <h4 className="text-lg font-bold text-gray-900">Seleção Exclusiva</h4>
              </div>
              <p className="text-gray-700">
                Nossas propriedades premium são cuidadosamente selecionadas e limitadas a apenas 5 imóveis 
                para garantir exclusividade e qualidade superior.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
