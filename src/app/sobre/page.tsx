import { Metadata } from 'next'
import { Award, Users, Shield, Star, MapPin, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nós - Lopes Imóveis',
  description: 'Conheça a história da Lopes Imóveis, mais de 20 anos realizando sonhos em Goiânia com imóveis de alto padrão.',
}

export default function AboutPage() {
  const features = [
    {
      icon: Award,
      title: "Tradição",
      description: "Mais de 20 anos de experiência no mercado imobiliário de Goiânia"
    },
    {
      icon: Shield,
      title: "Confiança",
      description: "Negócios seguros e transparentes com total suporte jurídico"
    },
    {
      icon: Users,
      title: "Atendimento",
      description: "Consultores especializados em imóveis de alto padrão"
    },
    {
      icon: Star,
      title: "Exclusividade",
      description: "Acesso aos melhores imóveis premium da capital"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-luxury bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Sobre a <span className="text-brand-coral">Lopes</span> Imóveis
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Há mais de duas décadas conectamos pessoas aos imóveis dos seus sonhos em Goiânia, 
              oferecendo um atendimento personalizado e exclusivo para quem busca o melhor.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-luxury">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Nossa História
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Fundada em 2003, a Lopes Imóveis nasceu com a missão de revolucionar o mercado 
                  imobiliário de Goiânia, focando exclusivamente em imóveis de alto padrão e 
                  oferecendo um atendimento diferenciado.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Ao longo dos anos, construímos uma reputação sólida baseada na confiança, 
                  transparência e excelência no atendimento. Nossa equipe de consultores 
                  especializados garante que cada cliente tenha uma experiência única e 
                  personalizada.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-card rounded-xl">
                    <div className="text-4xl font-bold text-brand-coral mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Imóveis vendidos</div>
                  </div>
                  <div className="text-center p-6 bg-card rounded-xl">
                    <div className="text-4xl font-bold text-brand-coral mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="card-luxury text-center hover:glow-luxury"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-xl mb-4 mx-auto">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-luxury bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Nossa Missão
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Proporcionar uma experiência única na compra do seu imóvel de alto padrão. 
              Com um portfólio exclusivo de propriedades premium e uma equipe de consultores 
              especializados, garantimos que cada cliente encontre exatamente o que procura.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-coral mb-2">20+</div>
                <div className="text-sm text-muted-foreground">Anos de experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-coral mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Foco em alto padrão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-coral mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte ao cliente</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-luxury">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Entre em <span className="text-brand-coral">Contato</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 card-luxury">
                <Phone className="h-8 w-8 text-brand-coral mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Telefone</h3>
                <p className="text-muted-foreground">(62) 3555-0123</p>
              </div>
              <div className="text-center p-6 card-luxury">
                <Mail className="h-8 w-8 text-brand-coral mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">contato@lopes.com.br</p>
              </div>
              <div className="text-center p-6 card-luxury">
                <MapPin className="h-8 w-8 text-brand-coral mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Endereço</h3>
                <p className="text-muted-foreground">Rua T-25, 123 - Setor Bueno</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
