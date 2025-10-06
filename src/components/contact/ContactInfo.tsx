import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Phone,
      title: "Telefone",
      content: "(62) 3555-0123"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "(62) 99999-8888"
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@lopes.com.br"
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "Rua T-25, 123 - Setor Bueno\nGoiânia, GO - CEP: 74210-030"
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Segunda à Sexta: 8h às 18h\nSábado: 8h às 12h"
    }
  ];

  return (
    <div>
      <h3 className="text-2xl font-semibold text-foreground mb-8">
        Fale com nossos consultores especializados
      </h3>

      <div className="space-y-6 mb-8">
        {contactDetails.map((detail, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-luxury rounded-lg flex items-center justify-center flex-shrink-0">
              <detail.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">{detail.title}</h4>
              <p className="text-muted-foreground whitespace-pre-line">{detail.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button variant="luxury" size="lg" className="flex-1">
          <Phone className="h-5 w-5 mr-2" />
          Ligar agora
        </Button>
        <Button variant="navy-outline" size="lg" className="flex-1">
          <MessageCircle className="h-5 w-5 mr-2" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default ContactInfo;
