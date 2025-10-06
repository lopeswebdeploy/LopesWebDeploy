import SectionHeader from "@/components/common/SectionHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import { MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Entre em"
            highlight="contato"
            description="Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos"
          />

          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            <ContactInfo />
            <ContactForm />
          </div>

          {/* Map Placeholder */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Nossa Localização
            </h3>
            <div className="bg-muted rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-brand-coral mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Mapa interativo de Goiânia será exibido aqui
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
