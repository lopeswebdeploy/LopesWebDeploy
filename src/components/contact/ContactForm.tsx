'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  return (
    <div className="card-luxury">
      <h3 className="text-2xl font-semibold text-foreground mb-6">
        Ou envie uma mensagem
      </h3>

      <form className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome
            </label>
            <Input placeholder="Seu nome completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Telefone
            </label>
            <Input placeholder="(62) 99999-9999" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            E-mail
          </label>
          <Input type="email" placeholder="seu@email.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interesse
          </label>
          <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground">
            <option>Comprar apartamento</option>
            <option>Comprar casa</option>
            <option>Vender imóvel</option>
            <option>Avaliação</option>
            <option>Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mensagem
          </label>
          <Textarea 
            placeholder="Conte-nos mais sobre o que você está procurando..."
            rows={4}
          />
        </div>

        <Button variant="luxury" size="lg" className="w-full">
          Enviar Mensagem
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
