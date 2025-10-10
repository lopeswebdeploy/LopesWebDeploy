'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'
import { Search, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminPropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
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

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                showAdminActions
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisible={isAdmin ? handleToggleVisible : undefined}
                onToggleFeatured={isAdmin ? handleToggleFeatured : undefined}
              />
            ))}
          </div>
        ) : (
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
    </div>
  )
}

