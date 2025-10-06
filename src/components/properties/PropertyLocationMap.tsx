"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

interface PropertyLocationMapProps {
  coordinates: { lat: number; lng: number };
  address: string;
  title: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const PropertyLocationMap = ({ coordinates, address, title }: PropertyLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

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
  }, [coordinates]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: coordinates,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    // Adicionar marcador com info window
    const marker = new window.google.maps.Marker({
      position: coordinates,
      map: map,
      title: title,
      icon: {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJDMTAuNDc3IDIgNiA2LjQ3NyA2IDEyQzYgMTkuMjUgMTYgMzAgMTYgMzBTMjYgMTkuMjUgMjYgMTJDMjYgNi40NzcgMjEuNTIzIDIgMTYgMloiIGZpbGw9IiNlZjQ0NDQiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+',
        scaledSize: new window.google.maps.Size(32, 32),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(16, 32)
      }
    });

    // Info window com informações da propriedade
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">
            ${title}
          </h3>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            📍 ${address}
          </p>
        </div>
      `
    });

    // Abrir info window quando clicar no marcador
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Abrir info window automaticamente após 1 segundo
    setTimeout(() => {
      infoWindow.open(map, marker);
    }, 1000);
  };

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
          <div className="text-sm text-gray-600">
            <p className="font-medium">{address}</p>
          </div>
          
          {!mapsLoaded ? (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-brand-coral" />
                <p className="text-sm text-gray-600">Carregando mapa...</p>
              </div>
            </div>
          ) : (
            <div
              ref={mapRef}
              className="w-full h-64 rounded-lg border overflow-hidden"
            />
          )}
          
          <div className="text-xs text-gray-500">
            <p>📍 Clique no marcador para mais informações</p>
            <p>🗺️ Use os controles do mapa para navegar</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyLocationMap;
