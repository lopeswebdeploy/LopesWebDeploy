'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Users,
  Mail,
  Calendar,
  Building
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  equipe?: string
  active: boolean
  createdAt: string
  updatedAt: string
  _count: {
    properties: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface Filters {
  search: string
  equipe: string
  role: string
  active: string
}

interface UsersManagementProps {
  initialUsers: User[]
  initialPagination: Pagination
  initialFilters: Filters
}

export default function UsersManagement({
  initialUsers,
  initialPagination,
  initialFilters
}: UsersManagementProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const loadUsers = async (newFilters?: Partial<Filters>, newPage = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: newPage.toString(),
        limit: '10',
        ...(newFilters?.search && { search: newFilters.search }),
        ...(newFilters?.equipe && { equipe: newFilters.equipe }),
        ...(newFilters?.role && { role: newFilters.role }),
        ...(newFilters?.active && { active: newFilters.active })
      })

      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilters = { ...filters }
    setFilters(newFilters)
    loadUsers(newFilters, 1)
    router.push(`/admin/users?${new URLSearchParams(newFilters as any).toString()}`)
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    loadUsers(newFilters, 1)
    router.push(`/admin/users?${new URLSearchParams(newFilters as any).toString()}`)
  }

  const handlePageChange = (page: number) => {
    loadUsers(filters, page)
    router.push(`/admin/users?${new URLSearchParams({ ...filters, page: page.toString() } as any).toString()}`)
  }

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, active: !currentStatus } : user
        ))
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const deleteUser = async (userId: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao excluir usuário')
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    }
  }

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Corretor'
  }

  const getEquipeLabel = (equipe?: string) => {
    if (!equipe) return 'Não definida'
    return equipe
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Usuários ({pagination.total})
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome ou email..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipe
              </label>
              <select
                value={filters.equipe}
                onChange={(e) => handleFilterChange('equipe', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="Lopes Marista">Lopes Marista</option>
                <option value="Lopes Bueno">Lopes Bueno</option>
                <option value="Lopes Jardim Goias">Lopes Jardim Goias</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="admin">Administrador</option>
                <option value="corretor">Corretor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.active}
                onChange={(e) => handleFilterChange('active', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
              </select>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriedades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building className="w-3 h-3" />
                      {getEquipeLabel(user.equipe)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.active)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                        user.active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.active ? (
                        <>
                          <UserCheck className="w-3 h-3" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          Inativo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {user._count.properties}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir usuário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} até{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} resultados
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {pagination.page} de {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}
