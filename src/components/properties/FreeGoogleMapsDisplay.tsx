"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FreeGoogleMapsDisplayProps {
  coordinates: { lat: number; lng: number };
  address: string;
  title: string;
  embedUrl?: string; // URL do iframe se disponível
}

const FreeGoogleMapsDisplay = ({ coordinates, address, title, embedUrl: customEmbedUrl }: FreeGoogleMapsDisplayProps) => {
  // Usar iframe customizado se disponível, senão gerar URL padrão
  const embedUrl = customEmbedUrl || `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1spt-BR!2sbr!4v1635000000000!5m2!1spt-BR!2sbr&q=${coordinates.lat},${coordinates.lng}`;
  
  // URL para abrir no Google Maps (navegação)
  const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
  
  // URL para abrir no Waze
  const wazeUrl = `https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-brand-coral" />
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Endereço */}
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">{title}</p>
            <p className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-brand-coral" />
              {address}
            </p>
          </div>
          
          {/* Mapa Embed Gratuito */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Localização de ${title}`}
            />
          </div>
          
          {/* Botões de Navegação */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(googleMapsUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir no Google Maps
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(wazeUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Navegar no Waze
            </Button>
          </div>
          
          {/* Informações Adicionais */}
          <div className="text-xs text-gray-500 border-t pt-3">
            <p className="flex items-center justify-between">
              <span>📍 Coordenadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</span>
            </p>
            <p className="mt-1">
              💡 <strong>Dica:</strong> Clique nos botões acima para navegar até o local
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeGoogleMapsDisplay;
