import Link from 'next/link'
import Hero from '@/components/Hero'
import { prisma } from '@/lib/prisma'
import PropertyCard from '@/components/PropertyCard'
import { ChevronRight } from 'lucide-react'
import { Property } from '@/lib/types'

async function getFeaturedProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        featured: true,
        visible: true,
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return properties
  } catch (error) {
    console.error('Erro ao buscar propriedades em destaque:', error)
    return []
  }
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Imóveis em Destaque
              </h2>
              <p className="text-gray-600">
                Confira nossa seleção especial de propriedades
              </p>
            </div>
            <Link
              href="/imoveis"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Ver Todos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                Nenhuma propriedade em destaque no momento.
              </p>
              <Link
                href="/imoveis"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Ver todos os imóveis disponíveis
              </Link>
            </div>
          )}

          {featuredProperties.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Explorar Todos os Imóveis
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para Encontrar seu Imóvel dos Sonhos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nossa equipe está pronta para ajudá-lo em cada etapa do processo
          </p>
          <Link
            href="/imoveis"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Começar Agora
          </Link>
        </div>
      </section>
    </main>
  )
}
