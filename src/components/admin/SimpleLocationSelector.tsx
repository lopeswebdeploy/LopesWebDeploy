"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Check, ExternalLink, Copy } from "lucide-react";

interface SimpleLocationSelectorProps {
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  initialAddress?: string;
  initialCoordinates?: { lat: number; lng: number };
}

const SimpleLocationSelector = ({ 
  onLocationSelect, 
  initialAddress = "", 
  initialCoordinates 
}: SimpleLocationSelectorProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: -16.6869, lng: -49.2648 });
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  // 5 Setores de Alto Padrão de Goiânia
  const knownLocations = {
    "setor oeste": { lat: -16.6869, lng: -49.2648 },
    "setor marista": { lat: -16.6908, lng: -49.2692 },
    "setor bueno": { lat: -16.6750, lng: -49.2540 },
    "jardim europa": { lat: -16.7000, lng: -49.2800 },
    "alto da glória": { lat: -16.7200, lng: -49.2900 },
    // Outros setores
    "setor sul": { lat: -16.6500, lng: -49.2500 },
    "setor norte": { lat: -16.6000, lng: -49.2000 },
    "setor leste": { lat: -16.6800, lng: -49.2000 },
    "setor universitário": { lat: -16.6050, lng: -49.2700 },
    "setor pedro ludovico": { lat: -16.6200, lng: -49.2300 },
  };

  const extractCoordinatesFromUrl = (url: string) => {
    // Padrões para diferentes tipos de URLs do Google Maps
    const patterns = [
      // URL padrão: https://www.google.com/maps/@-16.6869,-49.2648,15z
      /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      
      // URL com query: https://www.google.com/maps?q=-16.6869,-49.2648
      /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      
      // URL embed: !3d-16.6869!4d-49.2648
      /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
      
      // URL place: /place/@-16.6869,-49.2648
      /place\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      
      // URL direta com coordenadas
      /(-?\d+\.?\d*),(-?\d+\.?\d*)/,
    ];

    console.log('Tentando extrair coordenadas de:', url);
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = url.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validar se as coordenadas são válidas para Goiânia (aproximadamente)
        if (lat >= -17.5 && lat <= -15.5 && lng >= -50.5 && lng <= -48.5) {
          console.log(`Coordenadas encontradas (padrão ${i + 1}):`, { lat, lng });
          return { lat, lng };
        }
      }
    }
    
    console.log('Nenhuma coordenada válida encontrada na URL');
    return null;
  };

  const handleSearch = () => {
    if (!address.trim()) return;

    // Tentar extrair coordenadas de URL do Google Maps
    if (googleMapsUrl.trim()) {
      const coords = extractCoordinatesFromUrl(googleMapsUrl);
      if (coords) {
        saveLocation(address, coords);
        return;
      }
    }

    // Buscar em localizações conhecidas
    const normalizedAddress = address.toLowerCase();
    let foundCoords = null;
    
    for (const [key, coords] of Object.entries(knownLocations)) {
      if (normalizedAddress.includes(key)) {
        foundCoords = coords;
        break;
      }
    }
    
    if (!foundCoords) {
      foundCoords = { lat: -16.6869, lng: -49.2648 }; // Default Goiânia Centro
    }
    
    saveLocation(address, foundCoords);
  };

  const saveLocation = (addr: string, coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    
    const location = {
      address: addr + (addr.includes("Goiânia") ? "" : ", Goiânia - GO"),
      coordinates: coords
    };
    
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleQuickLocation = (name: string, coords: { lat: number; lng: number }) => {
    setAddress(name);
    saveLocation(name, coords);
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Por favor, digite coordenadas válidas (números com ponto decimal)');
      return;
    }
    
    if (lat < -17.5 || lat > -15.5 || lng < -50.5 || lng > -48.5) {
      alert('Coordenadas fora da região de Goiânia. Verifique os valores.');
      return;
    }
    
    const coords = { lat, lng };
    saveLocation(address || `Coordenadas: ${lat}, ${lng}`, coords);
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={openGoogleMaps} 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Buscar no Google Maps
          </Button>
        </div>

        <div className="border-t pt-4">
          {/* Método 2: URL do Google Maps */}
          <div className="space-y-3">
            <label className="text-sm font-medium">🔗 Método 2: Cole URL do Google Maps (Coordenadas Precisas)</label>
            <Input
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="Cole aqui a URL do Google Maps"
            />
            <div className="text-xs text-gray-500 space-y-2">
              <div>
                <p className="font-medium text-gray-700">💡 Como obter URL correta:</p>
                <div className="ml-2 space-y-1">
                  <p><strong>✅ MÉTODO CERTO:</strong></p>
                  <p>1. Abra Google Maps no <strong>computador</strong> (não celular)</p>
                  <p>2. Busque o endereço</p>
                  <p>3. <strong>Clique com botão direito</strong> no local exato</p>
                  <p>4. Clique em <strong>"O que há aqui?"</strong></p>
                  <p>5. Aparecerão as coordenadas (ex: -16.6869, -49.2648)</p>
                  <p>6. <strong>Copie a URL da barra de endereço</strong></p>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="font-medium text-gray-700">❌ URLs que NÃO funcionam:</p>
                <div className="ml-2 space-y-1">
                  <p>• Links de compartilhamento (share.google/...)</p>
                  <p>• Links do celular</p>
                  <p>• URLs sem coordenadas</p>
                </div>
              </div>
              <div className="border-t pt-2">
                <p className="font-medium text-gray-700">✅ Exemplo de URL que funciona:</p>
                <p className="ml-2 text-xs bg-gray-100 p-1 rounded">
                  https://www.google.com/maps/@-16.6869,-49.2648,15z
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Método 3: Coordenadas Manuais */}
          <div className="space-y-3">
            <label className="text-sm font-medium">📐 Método 3: Digite Coordenadas Diretamente</label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="Latitude (ex: -16.6869)"
                className="text-sm"
              />
              <Input
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="Longitude (ex: -49.2648)"
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
            <div className="text-xs text-gray-500">
              <p>💡 No Google Maps: <strong>clique direito</strong> → <strong>"O que há aqui?"</strong> → copie os números</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Método 4: Setores de Alto Padrão */}
          <div className="space-y-3">
            <label className="text-sm font-medium">⭐ Setores de Alto Padrão de Goiânia</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(knownLocations).slice(0, 5).map(([name, coords]) => (
                <Button 
                  key={name}
                  size="sm" 
                  variant="default"
                  onClick={() => handleQuickLocation(name, coords)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {name.replace('setor ', 'S. ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              <p>💎 <strong>Setores Premium:</strong> Setor Oeste, Marista, Bueno, Jardim Europa e Alto da Glória</p>
            </div>
          </div>
          
          {/* Outros Setores */}
          <div className="space-y-3 mt-4">
            <label className="text-sm font-medium">📍 Outros Setores</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(knownLocations).slice(5).map(([name, coords]) => (
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
              </div>
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
            </div>
          </div>
        )}

        {/* Informações */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded space-y-2">
          <div>
            <p className="font-medium text-gray-700">⚠️ Sobre URLs de compartilhamento:</p>
            <p>• URLs como "share.google/..." NÃO funcionam</p>
            <p>• Use apenas URLs diretas do Google Maps com coordenadas</p>
            <p>• Ou use o Método 3 (coordenadas manuais) - mais fácil!</p>
          </div>
          <div className="border-t pt-2">
            <p><strong>💡 Dica:</strong> Quanto mais preciso, melhor a localização no mapa público</p>
            <p><strong>🎯 Resultado:</strong> Clientes verão mapa real com navegação Google Maps/Waze</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleLocationSelector;
