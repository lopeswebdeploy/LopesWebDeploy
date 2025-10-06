import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Award, Users, Shield, Star, TrendingUp, Building2 } from "lucide-react";

const AboutPage = () => {
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
    },
    {
      icon: TrendingUp,
      title: "Valorização",
      description: "Imóveis em regiões com alta valorização e infraestrutura"
    },
    {
      icon: Building2,
      title: "Portfólio Premium",
      description: "Seleção exclusiva de imóveis de alto padrão"
    }
  ];

  const stats = [
    { value: "500+", label: "Imóveis Vendidos" },
    { value: "20+", label: "Anos de Mercado" },
    { value: "98%", label: "Clientes Satisfeitos" },
    { value: "50+", label: "Consultores Especializados" }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Sobre a"
            highlight="Lopes"
            description="Conectando pessoas aos imóveis dos seus sonhos há mais de duas décadas"
          />

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-semibold text-foreground mb-6">
                Tradição e excelência em imóveis de alto padrão
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nossa missão é proporcionar uma experiência única na compra do seu imóvel de alto padrão. 
                Com um portfólio exclusivo de propriedades premium e uma equipe de consultores especializados, 
                garantimos que cada cliente encontre exatamente o que procura.
              </p>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                A Lopes é reconhecida como referência no mercado imobiliário de Goiânia, oferecendo não apenas 
                imóveis, mas experiências completas de moradia de luxo. Nosso compromisso é com a excelência 
                em cada detalhe do processo de compra.
              </p>

              <Button variant="luxury" size="lg">
                Conheça nossa história completa
              </Button>
            </div>

            <div className="bg-gradient-luxury rounded-2xl p-1">
              <div className="bg-card rounded-xl p-8">
                <h4 className="text-2xl font-semibold text-foreground mb-6">Nossos Números</h4>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold text-brand-coral mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">
              Por que escolher a <span className="text-brand-coral">Lopes</span>?
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="card-luxury text-center hover:glow-luxury transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-luxury rounded-xl mb-4 mx-auto">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Nossa <span className="text-brand-coral">Missão</span>
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Proporcionar experiências excepcionais na aquisição de imóveis de alto padrão, 
              conectando sonhos à realidade através de um atendimento personalizado, 
              transparência total e compromisso inabalável com a satisfação dos nossos clientes.
            </p>
            <Button variant="luxury" size="lg">
              Entre em contato
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
