"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Ruler, Car, Bed, Bath, Star, Share2, Heart } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);

  const galleryImages = property.galleryImages || [];
  const floorPlans = property.floorPlans || [];

  const nextImage = () => {
    if (galleryImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (galleryImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? galleryImages.length - 1 : prev - 1
      );
    }
  };

  const nextFloorPlan = () => {
    if (floorPlans.length > 1) {
      setCurrentFloorPlanIndex((prev) => 
        prev === floorPlans.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevFloorPlan = () => {
    if (floorPlans.length > 1) {
      setCurrentFloorPlanIndex((prev) => 
        prev === 0 ? floorPlans.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/imoveis">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Imóveis
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galeria de Imagens */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {galleryImages.length > 0 ? (
                    <>
                      <div className="relative h-[500px] bg-gray-200">
                        <Image
                          src={galleryImages[currentImageIndex]}
                          alt={property.title}
                          fill
                          className="object-cover rounded-t-lg"
                          priority
                        />
                        
                        {/* Controles de navegação */}
                        {galleryImages.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            >
                              ←
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            >
                              →
                            </Button>
                          </>
                        )}
                        
                        {/* Indicador de imagem atual */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {galleryImages.length}
                        </div>
                      </div>
                      
                      {/* Miniaturas */}
                      {galleryImages.length > 1 && (
                        <div className="p-4">
                          <div className="flex gap-2 overflow-x-auto">
                            {galleryImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                                  index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                                }`}
                              >
                                <Image
                                  src={image}
                                  alt={`${property.title} - Imagem ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-[500px] bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500">Sem imagens disponíveis</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Planta Baixa */}
            {floorPlans.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Plantas Baixas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={floorPlans[currentFloorPlanIndex]}
                        alt={`Planta baixa ${currentFloorPlanIndex + 1}`}
                        fill
                        className="object-contain"
                      />
                      
                      {/* Controles de navegação para plantas */}
                      {floorPlans.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={prevFloorPlan}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          >
                            ←
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={nextFloorPlan}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                          >
                            →
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Miniaturas das plantas */}
                    {floorPlans.length > 1 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {floorPlans.map((plan, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentFloorPlanIndex(index)}
                            className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                              index === currentFloorPlanIndex ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <Image
                              src={plan}
                              alt={`Planta ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Informações do Imóvel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location || 'Goiânia, GO'}</span>
                    </div>
                  </div>
                  {property.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                </div>
                
                <div className="text-3xl font-bold text-blue-600">
                  {property.price ? 
                    new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(Number(property.price)) : 
                    'Sob consulta'
                  }
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Descrição */}
                {property.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Entrar em Contato
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Favoritar
                    </Button>
                  </div>
                </div>

                {/* Informações do Corretor */}
                {property.author && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Corretor Responsável</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {property.author.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{property.author.name}</p>
                        <p className="text-sm text-gray-600">{property.author.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
