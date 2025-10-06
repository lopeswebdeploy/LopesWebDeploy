"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Check } from "lucide-react";

interface GoogleMapsSelectorProps {
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  initialAddress?: string;
  initialCoordinates?: { lat: number; lng: number };
}

const GoogleMapsSelector = ({ 
  onLocationSelect, 
  initialAddress = "", 
  initialCoordinates 
}: GoogleMapsSelectorProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: -16.6869, lng: -49.2648 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  // Mock de geocoding para Goiânia (em produção, usar Google Maps API)
  const mockGeocoding = (address: string) => {
    const mockLocations = {
      "setor oeste": { lat: -16.6869, lng: -49.2648 },
      "setor marista": { lat: -16.6908, lng: -49.2692 },
      "setor bueno": { lat: -16.6750, lng: -49.2540 },
      "jardim europa": { lat: -16.7000, lng: -49.2800 },
      "alto da glória": { lat: -16.7200, lng: -49.2900 },
      "setor sul": { lat: -16.6500, lng: -49.2500 },
      "setor norte": { lat: -16.6000, lng: -49.2000 },
      "setor leste": { lat: -16.6800, lng: -49.2000 },
    };

    const normalizedAddress = address.toLowerCase();
    for (const [key, coords] of Object.entries(mockLocations)) {
      if (normalizedAddress.includes(key)) {
        return coords;
      }
    }
    
    // Coordenadas padrão de Goiânia
    return { lat: -16.6869, lng: -49.2648 };
  };

  const handleSearch = async () => {
    if (!address.trim()) return;
    
    setIsLoading(true);
    
    // Simular delay da API
    setTimeout(() => {
      const coords = mockGeocoding(address);
      setCoordinates(coords);
      const newLocation = {
        address: address,
        coordinates: coords
      };
      setSelectedLocation(newLocation);
      // Confirmar automaticamente após a busca
      onLocationSelect(newLocation);
      setIsLoading(false);
    }, 1000);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    const newLocation = {
      address: address || "Localização selecionada",
      coordinates: { lat, lng }
    };
    setSelectedLocation(newLocation);
    // Confirmar automaticamente quando clicar no mapa
    onLocationSelect(newLocation);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização no Mapa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca de Endereço */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Endereço Completo</label>
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. T-10, Setor Oeste, Goiânia - GO"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              variant="outline"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mapa Mock */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mapa (Clique para selecionar)</label>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Mapa Interativo (Google Maps)
              </p>
              <p className="text-xs text-gray-400">
                Coordenadas: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleMapClick(-16.6869, -49.2648)}
                >
                  Setor Oeste
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleMapClick(-16.6908, -49.2692)}
                >
                  Marista
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleMapClick(-16.6750, -49.2540)}
                >
                  Bueno
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmação */}
        {selectedLocation && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Localização Selecionada
                </p>
                <p className="text-xs text-green-600">
                  {selectedLocation.address}
                </p>
                <p className="text-xs text-green-500">
                  {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleConfirmLocation}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleMapsSelector;

