import { Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">
              <span className="text-brand-coral">Lopes</span> Imóveis
            </h3>
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              Há mais de 20 anos realizando sonhos em Goiânia. Especialistas em imóveis de alto padrão 
              com atendimento personalizado e exclusivo.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-brand-coral rounded-lg flex items-center justify-center transition-colors text-white hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-brand-coral rounded-lg flex items-center justify-center transition-colors text-white hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-brand-coral rounded-lg flex items-center justify-center transition-colors text-white hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-brand-coral mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="text-white/80 hover:text-brand-coral transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#imoveis" className="text-white/80 hover:text-brand-coral transition-colors">
                  Imóveis
                </a>
              </li>
              <li>
                <a href="#sobre" className="text-white/80 hover:text-brand-coral transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#contato" className="text-white/80 hover:text-brand-coral transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-brand-coral mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-brand-coral flex-shrink-0" />
                <span className="text-white/80">(62) 3555-0123</span>
              </li>
              <li className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-3 text-brand-coral flex-shrink-0" />
                <span className="text-white/80">(62) 99999-8888</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-brand-coral flex-shrink-0" />
                <span className="text-white/80">contato@lopes.com.br</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-brand-coral flex-shrink-0 mt-0.5" />
                <span className="text-white/80">
                  Rua T-25, 123 - Setor Bueno<br />
                  Goiânia, GO
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/60">
          <p>
            © 2024 Lopes Imóveis. Todos os direitos reservados. | 
            <a href="#" className="hover:text-brand-coral transition-colors ml-1">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;