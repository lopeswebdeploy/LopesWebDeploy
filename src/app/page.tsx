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
    <main className="min-h-screen bg-gray-100 pt-16 lg:pt-22">
      {/* Layout de 3 colunas como no template */}
      <div className="w-full px-mobile-md lg:px-24 py-mobile-xl lg:py-20">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-mobile-md lg:gap-4 h-auto lg:h-96">
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
      </div>

      {/* Seção de Contato e Estatísticas - COMPLETAMENTE SEPARADA */}
      <section className="bg-gray-100 py-mobile-xl lg:py-20 mt-mobile-2xl lg:mt-32">
        <div className="w-full px-mobile-md lg:px-24">
          <div className="max-w-8xl mx-auto">
            {/* Botão Entrar em Contato */}
            <div className="text-center mb-mobile-xl lg:mb-16">
              <button className="bg-black text-white px-mobile-lg lg:px-8 py-mobile-md lg:py-4 rounded-lg font-semibold text-mobile-base lg:text-base hover:bg-gray-800 transition-colors">
                ENTRAR EM CONTATO
              </button>
            </div>

            {/* Layout horizontal original */}
            <div className="flex flex-col lg:flex-row items-start gap-mobile-lg lg:gap-12">
              {/* Lado Esquerdo - Aspas e Texto */}
              <div className="flex-1 flex items-start gap-mobile-md lg:gap-6">
                {/* Aspas grandes em vermelho */}
                <div className="text-mobile-6xl lg:text-8xl font-bold text-brand-coral leading-none">
                  "
                </div>
                
                {/* Texto */}
                <div className="flex-1 pt-mobile-sm lg:pt-4">
                  <p className="text-mobile-xl lg:text-2xl font-medium text-gray-900 leading-relaxed">
                    Realizar sonhos e conectar<br />
                    pessoas através da melhor<br />
                    experiência imobiliária
                  </p>
                </div>
              </div>

              {/* Linha divisória vertical */}
              <div className="hidden lg:block w-px h-32 bg-gray-300"></div>

              {/* Lado Direito - Estatísticas */}
              <div className="flex-1 pt-mobile-sm lg:pt-4">
                <div className="text-center lg:text-right">
                  <div className="text-mobile-5xl lg:text-6xl font-bold text-gray-900 mb-2">
                    2.500
                  </div>
                  <div className="text-mobile-lg lg:text-xl text-gray-600">
                    clientes atendidos
                  </div>
                </div>
              </div>
            </div>

            {/* Linha horizontal inferior com quadrados */}
            <div className="mt-mobile-xl lg:mt-16 relative">
              <div className="flex items-center">
                {/* Quadrado esquerdo */}
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-black"></div>
                
                {/* Linha horizontal */}
                <div className="flex-1 h-px bg-black mx-mobile-sm lg:mx-4"></div>
                
                {/* Quadrado direito */}
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Propriedades em Destaque (abaixo das 3 colunas) */}
      {featuredProperties.length > 0 && (
        <section className="mt-mobile-2xl lg:mt-32">
          <div className="w-full px-mobile-md lg:px-24">
            <div className="max-w-8xl mx-auto">
              <div className="text-center mb-mobile-xl lg:mb-16">
                <h2 className="text-mobile-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Propriedades em Destaque
                </h2>
                <p className="text-mobile-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                  Descubra nossas melhores opções de imóveis cuidadosamente selecionados para você
                </p>
              </div>

              <div className="mobile-grid-3 gap-mobile-lg lg:gap-8">
                {featuredProperties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center mt-mobile-xl lg:mt-16">
                <Link
                  href="/imoveis"
                  className="inline-flex items-center gap-2 bg-brand-coral hover:bg-brand-coral-dark text-white px-mobile-lg lg:px-8 py-mobile-md lg:py-4 rounded-lg font-semibold transition-colors text-mobile-base lg:text-base"
                >
                  Ver Todos os Imóveis
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
