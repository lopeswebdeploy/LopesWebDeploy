import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PropertyCard from '@/components/PropertyCard'
import PremiumPropertyCard from '@/components/PremiumPropertyCard'
import PremiumPropertiesCarousel from '@/components/PremiumPropertiesCarousel'
import PropertyFilter from '@/components/PropertyFilter'
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

async function getPremiumProperties() {
  try {
    // Busca todas as propriedades visíveis
    const properties = await prisma.property.findMany({
      where: {
        visible: true,
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Filtra as propriedades premium
    const premiumProperties = properties.filter(property => {
      return (property as any).isPremium === true
    }).slice(0, 6) // Máximo 6 propriedades
    
    console.log('Propriedades premium encontradas:', premiumProperties.length)
    
    return premiumProperties
  } catch (error) {
    console.error('Erro ao buscar propriedades premium:', error)
    return []
  }
}

export default async function HomePage() {
  const [featuredProperties, premiumProperties] = await Promise.all([
    getFeaturedProperties(),
    getPremiumProperties()
  ])

  return (
        <main className="min-h-screen bg-gray-100 pt-22">
          {/* Layout de 3 colunas como no template */}
          <div className="w-full px-24 py-20">
            <div className="max-w-8xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-96">
            
            {/* Coluna 1: Filtro Gigante Preto */}
            <div className="lg:col-span-4">
              <PropertyFilter />
            </div>

            {/* Coluna 2 e 3: Carrossel de Propriedades Premium */}
            <div className="lg:col-span-8">
              <PremiumPropertiesCarousel properties={premiumProperties} />
            </div>
          </div>
        </div>

        {/* Seção de Propriedades em Destaque (abaixo das 3 colunas) */}
        {featuredProperties.length > 0 && (
          <section className="mt-32">
            <div className="w-full px-24">
              <div className="max-w-8xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Imóveis em Destaque
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Confira nossa seleção especial de propriedades
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
                </div>

                <div className="text-center mt-12">
                  <Link
                    href="/imoveis"
                    className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                  >
                    Ver Todos os Imóveis
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
