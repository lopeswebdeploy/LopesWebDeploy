import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Home, Users, Mail, BarChart3 } from 'lucide-react'

async function getDashboardData(userId: number, role: string) {
  // Admin vê todas as propriedades, corretor só as suas
  const where = role === 'admin' ? {} : { authorId: userId }
  
  const [totalProperties, visibleProperties, featuredProperties, totalLeads] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.count({ where: { ...where, visible: true } }),
    prisma.property.count({ where: { ...where, featured: true } }),
    role === 'admin' ? prisma.lead.count() : 0,
  ])

  return {
    totalProperties,
    visibleProperties,
    featuredProperties,
    totalLeads,
  }
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  // Redirecionar corretores para seu dashboard específico
  if (session.role === 'corretor') {
    redirect('/admin/corretor')
  }

  const stats = await getDashboardData(session.userId, session.role)
  const isAdmin = session.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel {isAdmin ? 'Administrativo' : 'do Corretor'}
              </h1>
              <p className="text-gray-600">
                Bem-vindo, {session.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Ver Site
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Imóveis</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalProperties}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visíveis</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.visibleProperties}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Destaque</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {stats.featuredProperties}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leads</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {stats.totalLeads}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Nova Propriedade</p>
                <p className="text-sm text-gray-600">Adicionar imóvel</p>
              </div>
            </Link>

            <Link
              href="/admin/properties"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Gerenciar Imóveis</p>
                <p className="text-sm text-gray-600">Ver todas as propriedades</p>
              </div>
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/admin/leads"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ver Leads</p>
                    <p className="text-sm text-gray-600">Gerenciar contatos</p>
                  </div>
                </Link>

                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Gerenciar Usuários</p>
                    <p className="text-sm text-gray-600">Ativar contas e equipes</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Info for Corretores */}
        {!isAdmin && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Informações Importantes
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Propriedades criadas por você ficam invisíveis até aprovação do administrador</li>
              <li>• Você pode editar e excluir apenas suas propriedades</li>
              <li>• Após aprovação, você pode continuar editando suas propriedades</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

