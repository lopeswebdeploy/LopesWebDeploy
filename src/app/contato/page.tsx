import { Metadata } from 'next'
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import SectionHeader from "@/components/common/SectionHeader";

export const metadata: Metadata = {
  title: 'Contato - Lopes Imóveis',
  description: 'Entre em contato com a Lopes Imóveis. Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos em Goiânia.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="section-luxury">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Entre em"
              highlight="contato"
              description="Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos"
            />

            <div className="grid lg:grid-cols-2 gap-16">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
