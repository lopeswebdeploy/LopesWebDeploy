import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Mail, Phone, Calendar, ArrowLeft } from 'lucide-react'

async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return leads
  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return []
  }
}

export default async function LeadsPage() {
  const session = await getSession()

  if (!session || session.role !== 'admin') {
    redirect('/admin/dashboard')
  }

  const leads = await getLeads()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Leads
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {leads.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {lead.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {lead.status === 'new' ? 'Novo' : lead.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {lead.phone}
                    </a>
                  </div>

                  {lead.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {lead.email}
                      </a>
                    </div>
                  )}

                  {lead.property && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-blue-700">
                        Interesse em:{' '}
                        <Link
                          href={`/imoveis/${lead.property.id}`}
                          className="font-semibold hover:underline"
                          target="_blank"
                        >
                          {lead.property.title}
                        </Link>
                      </p>
                    </div>
                  )}

                  {lead.message && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {lead.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              Nenhum lead encontrado ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

