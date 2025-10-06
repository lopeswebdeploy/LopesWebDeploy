"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApartmentOption } from "@/types/property";
import { Bed, Bath, Car, Maximize2, MapPin, Check } from "lucide-react";
import Image from "next/image";

interface ApartmentSelectorProps {
  apartments: ApartmentOption[];
  selectedApartment: ApartmentOption | null;
  onApartmentSelect: (apartment: ApartmentOption) => void;
  className?: string;
}

const ApartmentSelector = ({ 
  apartments, 
  selectedApartment, 
  onApartmentSelect,
  className = ""
}: ApartmentSelectorProps) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!apartments || apartments.length === 0) {
    return null;
  }

  const formatPrice = (price: string) => {
    // Remove qualquer formatação existente e formata o preço
    const numericValue = price.replace(/[^\d,]/g, '');
    return price.includes('R$') ? price : `R$ ${numericValue}`;
  };

  return (
    <div className={`apartment-selector ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Maximize2 className="h-5 w-5 text-brand-coral" />
          Opções de Plantas
        </h3>
        <p className="text-gray-600 text-sm">
          Selecione a planta que melhor se adequa às suas necessidades
        </p>
      </div>

      {/* Grid de Plantas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {apartments.map((apartment) => {
          const isSelected = selectedApartment?.id === apartment.id;
          const isAvailable = apartment.available;
          
          return (
            <Card 
              key={apartment.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-brand-coral border-brand-coral shadow-lg' 
                  : isAvailable 
                    ? 'border-gray-200 hover:border-brand-coral/50' 
                    : 'border-gray-100 opacity-60'
              }`}
              onClick={() => isAvailable && onApartmentSelect(apartment)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {apartment.unitType || `${apartment.bedrooms} Quarto${apartment.bedrooms > 1 ? 's' : ''}`}
                    </h4>
                    <p className="text-sm text-gray-600">{apartment.area}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={isAvailable ? "default" : "secondary"}
                      className={isAvailable ? "bg-green-100 text-green-800" : ""}
                    >
                      {isAvailable ? "Disponível" : "Vendido"}
                    </Badge>
                    {isSelected && (
                      <Badge variant="outline" className="border-brand-coral text-brand-coral">
                        <Check className="h-3 w-3 mr-1" />
                        Selecionado
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-3">
                  <div className="text-xl font-bold text-brand-coral">
                    {formatPrice(apartment.price)}
                  </div>
                  {apartment.floor && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {apartment.floor}º andar
                    </div>
                  )}
                </div>

                {/* Características */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Bed className="h-4 w-4 text-gray-500" />
                    <span>{apartment.bedrooms} quarto{apartment.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  {apartment.bathrooms && (
                    <div className="flex items-center gap-1 text-sm">
                      <Bath className="h-4 w-4 text-gray-500" />
                      <span>{apartment.bathrooms} banheiro{apartment.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {apartment.suites && apartment.suites > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Bed className="h-4 w-4 text-gray-500" />
                      <span>{apartment.suites} suíte{apartment.suites > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {apartment.parking && apartment.parking > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Car className="h-4 w-4 text-gray-500" />
                      <span>{apartment.parking} vaga{apartment.parking > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Planta Baixa Preview */}
                {apartment.floorPlan && (
                  <div className="mb-3">
                    <div className="relative h-24 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={apartment.floorPlan}
                        alt={`Planta ${apartment.unitType || apartment.area}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                          Ver Planta
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                {apartment.features && apartment.features.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {apartment.features.slice(0, 2).map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs px-2 py-1"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {apartment.features.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{apartment.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {apartment.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {apartment.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Área de Planta - Separada das Opções */}
      {selectedApartment && (
        <>
          {/* Resumo da Seleção */}
          <Card className="border-brand-coral/20 bg-brand-coral/5 mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">
                    {selectedApartment.unitType || `Apartamento ${selectedApartment.area}`}
                  </h4>
                  <p className="text-brand-coral font-bold text-xl">
                    {formatPrice(selectedApartment.price)}
                  </p>
                </div>
                {selectedApartment.floorPlan && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? 'Ocultar' : 'Ver'} Planta
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Área da Planta - Separada e Destacada */}
          {selectedApartment.floorPlan && showDetails && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Maximize2 className="h-5 w-5 text-brand-coral" />
                  Planta Baixa - {selectedApartment.unitType || selectedApartment.area}
                </h3>
                
                <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={selectedApartment.floorPlan}
                    alt={`Planta ${selectedApartment.unitType || selectedApartment.area}`}
                    className="w-full h-auto max-h-96 object-contain"
                    style={{ minHeight: '200px' }}
                  />
                </div>
                
                {/* Características da Planta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <Bed className="h-6 w-6 text-brand-coral mx-auto mb-1" />
                    <div className="text-sm font-medium">{selectedApartment.bedrooms}</div>
                    <div className="text-xs text-gray-600">Quarto{selectedApartment.bedrooms > 1 ? 's' : ''}</div>
                  </div>
                  {selectedApartment.bathrooms && (
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <Bath className="h-6 w-6 text-brand-coral mx-auto mb-1" />
                      <div className="text-sm font-medium">{selectedApartment.bathrooms}</div>
                      <div className="text-xs text-gray-600">Banheiro{selectedApartment.bathrooms > 1 ? 's' : ''}</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <Maximize2 className="h-6 w-6 text-brand-coral mx-auto mb-1" />
                    <div className="text-sm font-medium">{selectedApartment.area}</div>
                    <div className="text-xs text-gray-600">Área Total</div>
                  </div>
                  {selectedApartment.parking && (
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <Car className="h-6 w-6 text-brand-coral mx-auto mb-1" />
                      <div className="text-sm font-medium">{selectedApartment.parking}</div>
                      <div className="text-xs text-gray-600">Vaga{selectedApartment.parking > 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detalhes Adicionais */}
          <Card className="border-brand-coral/20 bg-brand-coral/5">
            <CardContent className="p-6">

            {/* Resumo das Características */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-coral">{selectedApartment.bedrooms}</div>
                <div className="text-sm text-gray-600">Quarto{selectedApartment.bedrooms > 1 ? 's' : ''}</div>
              </div>
              {selectedApartment.bathrooms && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-coral">{selectedApartment.bathrooms}</div>
                  <div className="text-sm text-gray-600">Banheiro{selectedApartment.bathrooms > 1 ? 's' : ''}</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-coral">{selectedApartment.area}</div>
                <div className="text-sm text-gray-600">Área Total</div>
              </div>
            </div>

            {/* Features Completas */}
            {selectedApartment.features && selectedApartment.features.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Características incluídas:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedApartment.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}


            {/* Description */}
            {selectedApartment.description && (
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Descrição:</h5>
                <p className="text-sm text-gray-700">
                  {selectedApartment.description}
                </p>
              </div>
            )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ApartmentSelector;
