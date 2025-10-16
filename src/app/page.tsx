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
    <main className="min-h-screen bg-gray-100 mobile-pt-16 lg:pt-22">
      {/* Layout de 3 colunas como no template */}
      <div className="w-full mobile-container-xl mobile-section-lg">
        <div className="max-w-8xl mx-auto">
          <div className="mobile-grid-1 lg:grid-cols-12 mobile-gap-md lg:gap-4 mobile-h-auto lg:h-96">
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
      <section className="bg-gray-100 mobile-section-xl mobile-mt-2xl lg:mt-32">
        <div className="w-full mobile-container-xl">
          <div className="max-w-8xl mx-auto">
            {/* Botão Entrar em Contato */}
            <div className="text-center mobile-mb-xl lg:mb-16">
              <button className="mobile-btn-lg bg-black text-white hover:bg-gray-800 transition-colors mobile-touch-target mobile-focus-ring">
                ENTRAR EM CONTATO
              </button>
            </div>

            {/* Layout horizontal original */}
            <div className="mobile-flex-col lg:flex-row mobile-items-start mobile-gap-lg lg:gap-12">
              {/* Lado Esquerdo - Aspas e Texto */}
              <div className="flex-1 mobile-flex-col lg:flex-row mobile-items-start mobile-gap-md lg:gap-6">
                {/* Aspas grandes em vermelho */}
                <div className="mobile-text-6xl lg:text-8xl font-bold text-brand-coral leading-none">
                  "
                </div>
                
                {/* Texto */}
                <div className="flex-1 mobile-pt-sm lg:pt-4">
                  <p className="mobile-text-xl lg:text-2xl font-medium text-gray-900 leading-relaxed">
                    Realizar sonhos e conectar<br />
                    pessoas através da melhor<br />
                    experiência imobiliária
                  </p>
                </div>
              </div>

              {/* Linha divisória vertical */}
              <div className="hidden lg:block w-px h-32 bg-gray-300"></div>

              {/* Lado Direito - Estatísticas */}
              <div className="flex-1 mobile-pt-sm lg:pt-4">
                <div className="mobile-text-center lg:text-right">
                  <div className="mobile-text-5xl lg:text-6xl font-bold text-gray-900 mobile-mb-sm">
                    2.500
                  </div>
                  <div className="mobile-text-lg lg:text-xl text-gray-600">
                    clientes atendidos
                  </div>
                </div>
              </div>
            </div>

            {/* Linha horizontal inferior com quadrados */}
            <div className="mobile-mt-xl lg:mt-16 relative">
              <div className="flex items-center">
                {/* Quadrado esquerdo */}
                <div className="mobile-w-2 h-2 lg:w-3 lg:h-3 bg-black"></div>
                
                {/* Linha horizontal */}
                <div className="flex-1 h-px bg-black mobile-mx-sm lg:mx-4"></div>
                
                {/* Quadrado direito */}
                <div className="mobile-w-2 h-2 lg:w-3 lg:h-3 bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Propriedades em Destaque (abaixo das 3 colunas) */}
      {featuredProperties.length > 0 && (
        <section className="mobile-mt-2xl lg:mt-32">
          <div className="w-full mobile-container-xl">
            <div className="max-w-8xl mx-auto">
              <div className="mobile-text-center mobile-mb-xl lg:mb-16">
                <h2 className="mobile-text-3xl lg:text-4xl font-bold text-gray-900 mobile-mb-md">
                  Propriedades em Destaque
                </h2>
                <p className="mobile-text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                  Descubra nossas melhores opções de imóveis cuidadosamente selecionados para você
                </p>
              </div>

              <div className="mobile-grid-3 mobile-gap-lg lg:gap-8">
                {featuredProperties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="mobile-text-center mobile-mt-xl lg:mt-16">
                <Link
                  href="/imoveis"
                  className="inline-flex items-center mobile-gap-sm mobile-btn-lg bg-brand-coral hover:bg-brand-coral-dark text-white font-semibold transition-colors mobile-touch-target mobile-focus-ring"
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
