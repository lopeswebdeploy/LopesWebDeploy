"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Check, Code, ExternalLink } from "lucide-react";

interface IframeLocationSelectorProps {
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
    embedUrl?: string;
  }) => void;
  initialAddress?: string;
  initialCoordinates?: { lat: number; lng: number };
}

const IframeLocationSelector = ({ 
  onLocationSelect, 
  initialAddress = "", 
  initialCoordinates 
}: IframeLocationSelectorProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: -16.6869, lng: -49.2648 });
  const [iframeCode, setIframeCode] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
    embedUrl?: string;
  } | null>(null);

  // Localizações conhecidas de Goiânia
  const knownLocations = {
    "setor oeste": { lat: -16.6869, lng: -49.2648 },
    "setor marista": { lat: -16.6908, lng: -49.2692 },
    "setor bueno": { lat: -16.6750, lng: -49.2540 },
    "jardim europa": { lat: -16.7000, lng: -49.2800 },
    "alto da glória": { lat: -16.7200, lng: -49.2900 },
    "setor sul": { lat: -16.6500, lng: -49.2500 },
  };

  const extractFromIframe = (iframeHtml: string) => {
    try {
      // Extrair URL do src do iframe
      const srcMatch = iframeHtml.match(/src="([^"]+)"/);
      if (!srcMatch) return null;
      
      const embedUrl = srcMatch[1];
      
      // Extrair coordenadas do iframe do Google Maps
      // Padrão: !2d longitude !3d latitude
      const coordMatch = embedUrl.match(/!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
      if (coordMatch) {
        const lng = parseFloat(coordMatch[1]);
        const lat = parseFloat(coordMatch[2]);
        
        // Validar coordenadas para região de Goiânia
        if (lat >= -17.5 && lat <= -15.5 && lng >= -50.5 && lng <= -48.5) {
          return { lat, lng, embedUrl };
        }
      }
      
      // Tentar padrão alternativo
      const altMatch = embedUrl.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
      if (altMatch) {
        const lat = parseFloat(altMatch[1]);
        const lng = parseFloat(altMatch[2]);
        
        if (lat >= -17.5 && lat <= -15.5 && lng >= -50.5 && lng <= -48.5) {
          return { lat, lng, embedUrl };
        }
      }
      
      return { embedUrl }; // Retorna só a URL se não conseguir extrair coordenadas
    } catch (error) {
      console.error('Erro ao extrair iframe:', error);
      return null;
    }
  };

  const saveLocation = (addr: string, coords: { lat: number; lng: number }, embedUrl?: string) => {
    setCoordinates(coords);
    
    const location = {
      address: addr + (addr.includes("Goiânia") ? "" : ", Goiânia - GO"),
      coordinates: coords,
      embedUrl: embedUrl
    };
    
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleIframeSubmit = () => {
    if (!iframeCode.trim()) {
      alert('Por favor, cole o código iframe do Google Maps');
      return;
    }

    const extracted = extractFromIframe(iframeCode);
    if (extracted) {
      if (extracted.lat && extracted.lng) {
        // Conseguiu extrair coordenadas
        saveLocation(
          address || "Localização do iframe", 
          { lat: extracted.lat, lng: extracted.lng }, 
          extracted.embedUrl
        );
      } else if (extracted.embedUrl) {
        // Só conseguiu a URL do embed, usar coordenadas padrão
        saveLocation(
          address || "Localização do iframe", 
          coordinates, 
          extracted.embedUrl
        );
      }
    } else {
      alert('Não foi possível extrair informações do iframe. Verifique se é um iframe válido do Google Maps.');
    }
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Por favor, digite coordenadas válidas');
      return;
    }
    
    if (lat < -17.5 || lat > -15.5 || lng < -50.5 || lng > -48.5) {
      alert('Coordenadas fora da região de Goiânia');
      return;
    }
    
    saveLocation(address || `${lat}, ${lng}`, { lat, lng });
  };

  const handleQuickLocation = (name: string, coords: { lat: number; lng: number }) => {
    setAddress(name);
    saveLocation(name, coords);
  };

  const openGoogleMaps = () => {
    const searchQuery = encodeURIComponent(address + " Goiânia GO");
    window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização da Propriedade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Método 1: Endereço Simples */}
        <div className="space-y-3">
          <label className="text-sm font-medium">📍 Método 1: Digite o Endereço</label>
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. T-10, Setor Oeste"
            />
            <Button onClick={openGoogleMaps} variant="outline">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Método 2: Iframe do Google Maps */}
          <div className="space-y-3">
            <label className="text-sm font-medium">🗺️ Método 2: Cole Iframe do Google Maps (RECOMENDADO)</label>
            <textarea
              value={iframeCode}
              onChange={(e) => setIframeCode(e.target.value)}
              placeholder='Cole aqui o código iframe completo do Google Maps
Ex: <iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450"...'
              className="w-full h-20 p-3 border rounded-md text-xs font-mono"
            />
            <Button 
              onClick={handleIframeSubmit}
              variant="default"
              disabled={!iframeCode.trim()}
              className="w-full"
            >
              <Code className="h-4 w-4 mr-2" />
              Usar Este Iframe
            </Button>
            
            <div className="text-xs text-gray-500 space-y-2">
              <div>
                <p className="font-medium text-gray-700">💡 Como obter iframe do Google Maps:</p>
                <div className="ml-2 space-y-1">
                  <p>1. Vá no <strong>Google Maps</strong> (computador)</p>
                  <p>2. Busque o endereço da propriedade</p>
                  <p>3. Clique em <strong>"Compartilhar"</strong></p>
                  <p>4. Clique em <strong>"Incorporar um mapa"</strong></p>
                  <p>5. <strong>Copie todo o código</strong> que aparece</p>
                  <p>6. Cole acima ✅</p>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="font-medium text-green-700">✅ Vantagens do iframe:</p>
                <p>• Localização exata da propriedade</p>
                <p>• Mapa interativo para clientes</p>
                <p>• Funciona mesmo com endereços difíceis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Método 3: Coordenadas Manuais */}
          <div className="space-y-3">
            <label className="text-sm font-medium">📐 Método 3: Coordenadas Manuais</label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="Latitude"
                className="text-sm"
              />
              <Input
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="Longitude"
                className="text-sm"
              />
              <Button 
                onClick={handleManualCoordinates}
                variant="outline"
                disabled={!manualLat || !manualLng}
              >
                Usar
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Método 4: Botões Rápidos */}
          <div className="space-y-3">
            <label className="text-sm font-medium">⚡ Método 4: Setores Principais</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(knownLocations).map(([name, coords]) => (
                <Button 
                  key={name}
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQuickLocation(name, coords)}
                  className="text-xs"
                >
                  {name.replace('setor ', 'S. ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview do iframe */}
        {selectedLocation?.embedUrl && (
          <div className="border-t pt-4">
            <label className="text-sm font-medium mb-2 block">🗺️ Preview do Mapa:</label>
            <div className="w-full h-64 border rounded-lg overflow-hidden">
              <iframe
                src={selectedLocation.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Confirmação */}
        {selectedLocation && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Localização Definida
                </p>
                <p className="text-xs text-green-600 mb-1">
                  📍 <strong>Endereço:</strong> {selectedLocation.address}
                </p>
                <p className="text-xs text-green-500">
                  🌐 <strong>Coordenadas:</strong> {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                </p>
                {selectedLocation.embedUrl && (
                  <p className="text-xs text-blue-600">
                    🗺️ <strong>Iframe:</strong> Mapa interativo configurado
                  </p>
                )}
              </div>
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded space-y-2">
          <div>
            <p className="font-medium text-gray-700">🎯 Sobre o seu exemplo:</p>
            <p>• O iframe que você mostrou funciona perfeitamente!</p>
            <p>• Mostra o "Borges Landeiro Classic" no local exato</p>
            <p>• Clientes poderão interagir com o mapa (zoom, navegação)</p>
          </div>
          <div className="border-t pt-2">
            <p><strong>💡 Melhor método:</strong> Use o Método 2 (iframe) para máxima precisão</p>
            <p><strong>🎯 Resultado:</strong> Mapa real e interativo na página da propriedade</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IframeLocationSelector;
