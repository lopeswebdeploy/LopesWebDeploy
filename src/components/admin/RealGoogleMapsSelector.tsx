"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Check, Loader2 } from "lucide-react";

interface RealGoogleMapsSelectorProps {
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  initialAddress?: string;
  initialCoordinates?: { lat: number; lng: number };
}

declare global {
  interface Window {
    google: any;
  }
}

const RealGoogleMapsSelector = ({ 
  onLocationSelect, 
  initialAddress = "", 
  initialCoordinates 
}: RealGoogleMapsSelectorProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: -16.6869, lng: -49.2648 });
  const [isLoading, setIsLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  // Verificar se o Google Maps está carregado
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setMapsLoaded(true);
        initializeMap();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Inicializar mapa centrado em Goiânia
    const map = new window.google.maps.Map(mapRef.current, {
      center: coordinates,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    // Adicionar marcador
    const marker = new window.google.maps.Marker({
      position: coordinates,
      map: map,
      draggable: true,
      title: "Localização da Propriedade"
    });

    markerRef.current = marker;

    // Listener para quando o marcador for arrastado
    marker.addListener('dragend', () => {
      const newPosition = marker.getPosition();
      const newCoords = {
        lat: newPosition.lat(),
        lng: newPosition.lng()
      };
      
      setCoordinates(newCoords);
      
      // Reverse geocoding para obter o endereço
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newCoords }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          
          const newLocation = {
            address: newAddress,
            coordinates: newCoords
          };
          
          setSelectedLocation(newLocation);
          onLocationSelect(newLocation);
        }
      });
    });

    // Listener para cliques no mapa
    map.addListener('click', (event: any) => {
      const newCoords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      setCoordinates(newCoords);
      marker.setPosition(event.latLng);
      
      // Reverse geocoding
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newCoords }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const newAddress = results[0].formatted_address;
          setAddress(newAddress);
          
          const newLocation = {
            address: newAddress,
            coordinates: newCoords
          };
          
          setSelectedLocation(newLocation);
          onLocationSelect(newLocation);
        }
      });
    });
  };

  const handleSearch = async () => {
    if (!address.trim() || !window.google) return;
    
    setIsLoading(true);
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 
      address: address + ", Goiânia, GO, Brasil" 
    }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newCoords = {
          lat: location.lat(),
          lng: location.lng()
        };
        
        setCoordinates(newCoords);
        
        // Atualizar mapa e marcador
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setCenter(newCoords);
          markerRef.current.setPosition(newCoords);
        }
        
        const newLocation = {
          address: results[0].formatted_address,
          coordinates: newCoords
        };
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
      } else {
        alert('Endereço não encontrado. Tente ser mais específico.');
      }
      
      setIsLoading(false);
    });
  };

  const goToGoianiaCenter = () => {
    const goianiaCenter = { lat: -16.6869, lng: -49.2648 };
    setCoordinates(goianiaCenter);
    setAddress("Centro de Goiânia, GO");
    
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setCenter(goianiaCenter);
      markerRef.current.setPosition(goianiaCenter);
    }
    
    const location = {
      address: "Centro de Goiânia, GO",
      coordinates: goianiaCenter
    };
    
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização no Google Maps
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
              disabled={isLoading || !mapsLoaded}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mapa Real */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Mapa Interativo - Clique ou arraste o marcador
          </label>
          
          {!mapsLoaded ? (
            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-brand-coral" />
                <p className="text-sm text-gray-600">Carregando Google Maps...</p>
              </div>
            </div>
          ) : (
            <div
              ref={mapRef}
              className="w-full h-80 rounded-lg border overflow-hidden"
            />
          )}
          
          {/* Botões de Localização Rápida */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const coords = { lat: -16.6869, lng: -49.2648 };
                setCoordinates(coords);
                if (mapInstanceRef.current && markerRef.current) {
                  mapInstanceRef.current.setCenter(coords);
                  markerRef.current.setPosition(coords);
                }
                setAddress("Setor Oeste, Goiânia - GO");
                const location = { address: "Setor Oeste", coordinates: coords };
                setSelectedLocation(location);
                onLocationSelect(location);
              }}
            >
              Setor Oeste
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const coords = { lat: -16.6908, lng: -49.2692 };
                setCoordinates(coords);
                if (mapInstanceRef.current && markerRef.current) {
                  mapInstanceRef.current.setCenter(coords);
                  markerRef.current.setPosition(coords);
                }
                setAddress("Setor Marista, Goiânia - GO");
                const location = { address: "Setor Marista", coordinates: coords };
                setSelectedLocation(location);
                onLocationSelect(location);
              }}
            >
              Marista
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const coords = { lat: -16.6750, lng: -49.2540 };
                setCoordinates(coords);
                if (mapInstanceRef.current && markerRef.current) {
                  mapInstanceRef.current.setCenter(coords);
                  markerRef.current.setPosition(coords);
                }
                setAddress("Setor Bueno, Goiânia - GO");
                const location = { address: "Setor Bueno", coordinates: coords };
                setSelectedLocation(location);
                onLocationSelect(location);
              }}
            >
              Bueno
            </Button>
          </div>
        </div>

        {/* Confirmação */}
        {selectedLocation && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Localização Selecionada e Salva
                </p>
                <p className="text-xs text-green-600 mb-1">
                  📍 <strong>Endereço:</strong> {selectedLocation.address}
                </p>
                <p className="text-xs text-green-500">
                  🌐 <strong>Coordenadas:</strong> {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                </p>
              </div>
              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• <strong>Busque</strong> por um endereço específico</p>
          <p>• <strong>Clique</strong> no mapa para definir a localização</p>
          <p>• <strong>Arraste</strong> o marcador para ajustar a posição</p>
          <p>• Use os botões para ir direto aos <strong>setores principais</strong></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealGoogleMapsSelector;
