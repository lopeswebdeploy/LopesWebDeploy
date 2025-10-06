"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Check, Loader2, AlertCircle } from "lucide-react";

interface HybridMapsSelectorProps {
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

const HybridMapsSelector = ({ 
  onLocationSelect, 
  initialAddress = "", 
  initialCoordinates 
}: HybridMapsSelectorProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: -16.6869, lng: -49.2648 });
  const [isLoading, setIsLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Localizações mockadas para Goiânia
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

  // Verificar se o Google Maps está carregado
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        try {
          // Testar se podemos criar um mapa
          const testDiv = document.createElement('div');
          new window.google.maps.Map(testDiv, {
            center: { lat: -16.6869, lng: -49.2648 },
            zoom: 13,
          });
          setMapsLoaded(true);
          setMapsError(false);
          initializeGoogleMap();
        } catch (error) {
          console.warn('Google Maps API error:', error);
          setMapsError(true);
          setMapsLoaded(false);
        }
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    
    const timeout = setTimeout(() => {
      if (!mapsLoaded) {
        setMapsError(true);
      }
    }, 5000);

    checkGoogleMaps();
    
    return () => clearTimeout(timeout);
  }, []);

  const initializeGoogleMap = () => {
    if (!mapRef.current || !window.google || mapsError) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      const marker = new window.google.maps.Marker({
        position: coordinates,
        map: map,
        draggable: true,
        title: "Localização da Propriedade"
      });

      markerRef.current = marker;

      // Event listeners
      marker.addListener('dragend', handleMarkerDrag);
      map.addListener('click', handleMapClick);

    } catch (error) {
      console.warn('Error initializing Google Map:', error);
      setMapsError(true);
    }
  };

  const handleMarkerDrag = () => {
    if (!markerRef.current) return;
    
    const newPosition = markerRef.current.getPosition();
    const newCoords = {
      lat: newPosition.lat(),
      lng: newPosition.lng()
    };
    
    updateLocation(newCoords, "Localização arrastada");
  };

  const handleMapClick = (event: any) => {
    const newCoords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    
    if (markerRef.current) {
      markerRef.current.setPosition(event.latLng);
    }
    
    updateLocation(newCoords, "Localização clicada");
  };

  const updateLocation = (coords: { lat: number; lng: number }, source: string) => {
    setCoordinates(coords);
    
    const newLocation = {
      address: address || `${source} - ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
      coordinates: coords
    };
    
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  };

  const handleSearch = async () => {
    if (!address.trim()) return;
    
    setIsLoading(true);
    
    if (mapsLoaded && window.google && !mapsError) {
      // Usar Google Geocoding se disponível
      try {
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
            // Fallback para busca mock
            handleMockSearch();
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.warn('Geocoding error:', error);
        handleMockSearch();
      }
    } else {
      // Usar sistema mock
      handleMockSearch();
    }
  };

  const handleMockSearch = () => {
    const normalizedAddress = address.toLowerCase();
    let foundCoords = null;
    
    for (const [key, coords] of Object.entries(mockLocations)) {
      if (normalizedAddress.includes(key)) {
        foundCoords = coords;
        break;
      }
    }
    
    if (!foundCoords) {
      foundCoords = { lat: -16.6869, lng: -49.2648 }; // Default Goiânia
    }
    
    setCoordinates(foundCoords);
    
    const newLocation = {
      address: address + ", Goiânia - GO",
      coordinates: foundCoords
    };
    
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
    setIsLoading(false);
  };

  const handleQuickLocation = (name: string, coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    setAddress(name + ", Goiânia - GO");
    
    if (mapInstanceRef.current && markerRef.current && !mapsError) {
      mapInstanceRef.current.setCenter(coords);
      markerRef.current.setPosition(coords);
    }
    
    const location = {
      address: name + ", Goiânia - GO",
      coordinates: coords
    };
    
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {mapsError ? "Localização (Modo Offline)" : "Localização com Google Maps"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert para modo offline */}
        {mapsError && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Google Maps indisponível. Usando sistema de localização offline.
              </p>
            </div>
          </div>
        )}

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
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mapa */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {mapsError ? "Localização Selecionada" : "Mapa Interativo"}
          </label>
          
          {mapsError ? (
            // Modo offline - mostrar coordenadas
            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">Modo Offline</p>
                <p className="text-xs text-gray-500 mb-3">
                  {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
                <p className="text-xs text-gray-400">
                  Localização será salva com coordenadas aproximadas
                </p>
              </div>
            </div>
          ) : !mapsLoaded ? (
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
              onClick={() => handleQuickLocation("Setor Oeste", mockLocations["setor oeste"])}
            >
              Setor Oeste
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleQuickLocation("Setor Marista", mockLocations["setor marista"])}
            >
              Marista
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleQuickLocation("Setor Bueno", mockLocations["setor bueno"])}
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
          {mapsError ? (
            <>
              <p>• <strong>Digite</strong> o endereço e clique em buscar</p>
              <p>• Use os <strong>botões rápidos</strong> para setores principais</p>
              <p>• Sistema offline com <strong>coordenadas aproximadas</strong></p>
            </>
          ) : (
            <>
              <p>• <strong>Busque</strong> por um endereço específico</p>
              <p>• <strong>Clique</strong> no mapa para definir a localização</p>
              <p>• <strong>Arraste</strong> o marcador para ajustar a posição</p>
              <p>• Use os botões para ir direto aos <strong>setores principais</strong></p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HybridMapsSelector;
