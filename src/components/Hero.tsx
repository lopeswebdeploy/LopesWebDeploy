import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/hero-luxury-building.jpg')` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto fade-in-up animate">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Seu novo lar de <span className="text-brand-coral">alto padrão</span> em Goiânia
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light max-w-2xl mx-auto">
            Descubra imóveis exclusivos que combinam luxo, conforto e a melhor localização da capital
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/imoveis">
              <Button variant="luxury" size="xl" className="min-w-48">
                Ver Imóveis
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="luxury-outline" size="xl" className="min-w-48 border-white text-white hover:bg-white hover:text-primary">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
