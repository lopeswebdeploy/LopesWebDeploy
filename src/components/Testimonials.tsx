import Image from "next/image";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marina Silva",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "Empresária",
      content: "A Lopes superou todas as minhas expectativas. Encontrei o apartamento perfeito no Setor Oeste e o atendimento foi impecável do início ao fim.",
      rating: 5
    },
    {
      name: "Roberto Costa",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "Médico",
      content: "Profissionais extremamente qualificados. A consultora me ajudou a encontrar exatamente o que eu procurava no Jardim Europa. Recomendo!",
      rating: 5
    },
    {
      name: "Ana Beatriz",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "Arquiteta",
      content: "Comprar meu primeiro apartamento de alto padrão foi uma experiência única com a Lopes. Suporte completo e transparência total.",
      rating: 5
    }
  ];

  return (
    <section className="section-luxury">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              O que nossos <span className="text-brand-coral">clientes</span> dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A satisfação dos nossos clientes é nossa maior conquista
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="card-luxury text-center hover:glow-luxury"
              >
                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 text-brand-coral fill-current" 
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Client Info */}
                <div className="flex flex-col items-center">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-brand-coral/20"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;