'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'
import { Search, Plus, Loader2, Crown, Star } from 'lucide-react'
import Link from 'next/link'

export default function AdminPropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [premiumProperties, setPremiumProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [selectedPremiumProperties, setSelectedPremiumProperties] = useState<number[]>([])
  const [filters, setFilters] = useState({
    search: '',
    visible: 'all',
    featured: 'all',
  })

  useEffect(() => {
    fetchSession()
  }, [])

  useEffect(() => {
    if (session) {
      fetchProperties()
    }
  }, [session])

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

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Corretor só vê suas próprias propriedades
      if (session.role !== 'admin') {
        params.append('authorId', session.userId.toString())
      }

      if (filters.search) params.append('search', filters.search)
      if (filters.visible !== 'all') params.append('visible', filters.visible)
      if (filters.featured !== 'all') params.append('featured', filters.featured)

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (response.ok) {
        const allProperties = data.properties
        setProperties(allProperties.filter((p: Property) => !p.isPremium))
        setPremiumProperties(allProperties.filter((p: Property) => p.isPremium))
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

  const handleEdit = (id: number) => {
    router.push(`/admin/properties/${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta propriedade?')) return

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProperties()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao excluir propriedade')
      }
    } catch (error) {
      alert('Erro ao excluir propriedade')
    }
  }

  const handleToggleVisible = async (id: number, visible: boolean) => {
    // Apenas admin pode alterar visibilidade
    if (session.role !== 'admin') {
      alert('Apenas administradores podem alterar a visibilidade')
      return
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible }),
      })

      if (response.ok) {
        fetchProperties()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao atualizar propriedade')
      }
    } catch (error) {
      alert('Erro ao atualizar propriedade')
    }
  }

  const handleToggleFeatured = async (id: number, featured: boolean) => {
    // Apenas admin pode destacar
    if (session.role !== 'admin') {
      alert('Apenas administradores podem destacar propriedades')
      return
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      })

      if (response.ok) {
        fetchProperties()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao atualizar propriedade')
      }
    } catch (error) {
      alert('Erro ao atualizar propriedade')
    }
  }

  const handleTogglePremium = async (id: number, isPremium: boolean) => {
    // Apenas admin pode transformar em premium
    if (session.role !== 'admin') {
      alert('Apenas administradores podem transformar propriedades em premium')
      return
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPremium }),
      })

      if (response.ok) {
        fetchProperties()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao atualizar propriedade')
      }
    } catch (error) {
      alert('Erro ao atualizar propriedade')
    }
  }

  // Funções de seleção em massa
  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([])
    } else {
      setSelectedProperties(properties.map(p => p.id))
    }
  }

  const handleSelectProperty = (id: number) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(pid => pid !== id))
    } else {
      setSelectedProperties([...selectedProperties, id])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedProperties.length} propriedade(s)?`)) return

    try {
      const deletePromises = selectedProperties.map(id => 
        fetch(`/api/properties/${id}`, { method: 'DELETE' })
      )
      
      await Promise.all(deletePromises)
      setSelectedProperties([])
      fetchProperties()
    } catch (error) {
      alert('Erro ao excluir propriedades')
    }
  }

  const handleBulkApprove = async () => {
    if (selectedProperties.length === 0) return
    
    if (session.role !== 'admin') {
      alert('Apenas administradores podem aprovar propriedades')
      return
    }

    try {
      const updatePromises = selectedProperties.map(id => 
        fetch(`/api/properties/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visible: true }),
        })
      )
      
      await Promise.all(updatePromises)
      setSelectedProperties([])
      fetchProperties()
    } catch (error) {
      alert('Erro ao aprovar propriedades')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const isAdmin = session.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Propriedades
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/properties/new"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Propriedade
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por título, descrição..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <select
                  value={filters.visible}
                  onChange={(e) => setFilters({ ...filters, visible: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas (Visível/Oculto)</option>
                  <option value="true">Apenas Visíveis</option>
                  <option value="false">Apenas Ocultas</option>
                </select>
              </div>

              {isAdmin && (
                <div>
                  <select
                    value={filters.featured}
                    onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas (Destaque)</option>
                    <option value="true">Em Destaque</option>
                    <option value="false">Não Destacadas</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
              
              {/* Botão para transformar em premium - apenas para admin */}
              {isAdmin && selectedProperties.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Transformar ${selectedProperties.length} propriedade(s) em premium?`)) {
                      selectedProperties.forEach(id => handleTogglePremium(id, true))
                    }
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Crown className="w-4 h-4" />
                  Transformar em Premium
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Premium Properties Section */}
            {premiumProperties.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-8 h-8 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Propriedades Premium
                  </h2>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {premiumProperties.length} propriedade(s)
                  </span>
                </div>

                {/* Premium Bulk Actions */}
                {selectedPremiumProperties.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <p className="text-yellow-800 font-medium">
                        {selectedPremiumProperties.length} propriedade(s) premium selecionada(s)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleBulkDelete}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Excluir Selecionadas
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {premiumProperties.map((property) => (
                    <div key={property.id} className="relative group">
                      <input
                        type="checkbox"
                        checked={selectedPremiumProperties.includes(property.id)}
                        onChange={() => {
                          if (selectedPremiumProperties.includes(property.id)) {
                            setSelectedPremiumProperties(selectedPremiumProperties.filter(id => id !== property.id))
                          } else {
                            setSelectedPremiumProperties([...selectedPremiumProperties, property.id])
                          }
                        }}
                        className="absolute top-2 left-2 z-10 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      
                      {/* Premium Card - Layout Especial */}
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        {/* Imagem */}
                        <div className="relative h-48 bg-gray-700">
                          {property.bannerImage ? (
                            <img
                              src={property.bannerImage}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Crown className="w-12 h-12 opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              PREMIUM
                            </span>
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4">
                          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                          
                          {/* Ações Admin */}
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleEdit(property.id)}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleTogglePremium(property.id, false)}
                              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                            >
                              Remover Premium
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Properties Section */}
            {properties.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Propriedades Regulares
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {properties.length} propriedade(s)
                  </span>
                </div>

                {/* Regular Bulk Actions */}
                {selectedProperties.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <p className="text-blue-800 font-medium">
                        {selectedProperties.length} propriedade(s) selecionada(s)
                      </p>
                      <div className="flex gap-2">
                        {isAdmin && (
                          <button
                            onClick={handleBulkApprove}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Aprovar Selecionadas
                          </button>
                        )}
                        <button
                          onClick={handleBulkDelete}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Excluir Selecionadas
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property) => (
                    <div key={property.id} className="relative">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => handleSelectProperty(property.id)}
                        className="absolute top-2 left-2 z-10 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <PropertyCard
                        property={property}
                        showAdminActions
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleVisible={isAdmin ? handleToggleVisible : undefined}
                        onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {properties.length === 0 && premiumProperties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-4">
                  Nenhuma propriedade encontrada.
                </p>
                <Link
                  href="/admin/properties/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Criar Nova Propriedade
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

