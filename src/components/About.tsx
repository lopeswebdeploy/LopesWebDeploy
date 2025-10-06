import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, Users, Shield, Star } from "lucide-react";

const About = () => {
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
    <section id="sobre" className="section-luxury bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sobre a <span className="text-brand-coral">Lopes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Há mais de duas décadas conectamos pessoas aos imóveis dos seus sonhos em Goiânia, 
              oferecendo um atendimento personalizado e exclusivo para quem busca o melhor.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h3 className="text-3xl font-semibold text-foreground mb-6">
                Tradição e excelência em imóveis de alto padrão
              </h3>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Nossa missão é proporcionar uma experiência única na compra do seu imóvel de alto padrão. 
                Com um portfólio exclusivo de propriedades premium e uma equipe de consultores especializados, 
                garantimos que cada cliente encontre exatamente o que procura.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-brand-coral mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Imóveis vendidos</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-brand-coral mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
                </div>
              </div>

              <Link href="/sobre">
                <Button variant="luxury" size="lg">
                  Conheça nossa história
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="card-luxury text-center hover:glow-luxury"
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
      </div>
    </section>
  );
};

export default About;
