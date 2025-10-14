import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import UsersManagement from '@/components/admin/UsersManagement'

async function getUsers(page = 1, search = '', equipe = '', role = '', active = '') {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...(search && { search }),
      ...(equipe && { equipe }),
      ...(role && { role }),
      ...(active && { active })
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/users?${params}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Erro ao carregar usuários')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return { users: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } }
  }
}

export default async function UsersPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  if (session.role !== 'admin') {
    redirect('/admin/dashboard')
  }

  const page = parseInt(searchParams.page as string) || 1
  const search = (searchParams.search as string) || ''
  const equipe = (searchParams.equipe as string) || ''
  const role = (searchParams.role as string) || ''
  const active = (searchParams.active as string) || ''

  const data = await getUsers(page, search, equipe, role, active)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gerenciar Usuários
              </h1>
              <p className="text-gray-600">
                Gerencie contas de corretores e administradores
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/admin/dashboard"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Voltar ao Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <UsersManagement 
          initialUsers={data.users}
          initialPagination={data.pagination}
          initialFilters={{
            search,
            equipe,
            role,
            active
          }}
        />
      </div>
    </div>
  )
}
