"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Heart,
  Calendar,
  Ruler,
  Building,
  Star,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Property, ApartmentOption } from "@/types/property";
import ApartmentSelector from "@/components/properties/ApartmentSelector";
import Link from "next/link";

interface PropertyFullPageProps {
  property: Property;
}

const PropertyFullPage = ({ property }: PropertyFullPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedApartment, setSelectedApartment] = useState<ApartmentOption | null>(
    property.apartmentOptions?.[0] || null
  );

  // Debug: verificar dados da propriedade na página completa
  console.log("🏠 PropertyFullPage - Dados recebidos:", {
    title: property.title,
    bannerImage: property.images?.[0] ? property.images[0].substring(0, 50) + "..." : "VAZIO",
    images: property.images?.length || 0,
    photoGallery: property.photoGallery?.length || 0,
    currentImageIndex
  });

  const nextImage = () => {
    const galleryImages = property.photoGallery || property.images || [];
    if (galleryImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    const galleryImages = property.photoGallery || property.images || [];
    if (galleryImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? galleryImages.length - 1 : prev - 1
      );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'venda':
        return 'bg-green-500';
      case 'investimento':
        return 'bg-blue-500';
      case 'aluguel':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'venda':
        return 'Venda';
      case 'investimento':
        return 'Investimento';
      case 'aluguel':
        return 'Aluguel';
      default:
        return category;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Banner */}
      <div className="relative h-[500px] bg-gray-900">
        {property.images && property.images.length > 0 && (
          <>
            <img
              src={property.images[0]}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
              }}
            />
            {/* Overlay com gradiente suave para texto legível */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          </>
        )}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Badge className={`${getCategoryColor(property.category)} text-white font-medium`}>
              {getCategoryLabel(property.category)}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            {property.title}
          </h1>
          {property.developer && (
            <p className="text-xl text-white/90 mb-4 drop-shadow-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
              {property.developer}
            </p>
          )}
          <div className="flex items-center text-white/90">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">{property.location}, {property.state}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de Imagens */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {(() => {
                    const galleryImages = property.photoGallery || property.images || [];
                    return galleryImages.length > 0 ? (
                      <img
                        src={galleryImages[currentImageIndex]}
                        alt={property.title}
                        className="w-full h-96 object-cover rounded-t-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-t-lg">
                        <span className="text-gray-500 text-lg">Sem imagem disponível</span>
                      </div>
                    );
                  })()}
                  
                  {(() => {
                    const galleryImages = property.photoGallery || property.images || [];
                    return galleryImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                    );
                  })()}
                </div>

                {/* Miniaturas */}
                {(() => {
                  const galleryImages = property.photoGallery || property.images || [];
                  return galleryImages.length > 1 && (
                    <div className="p-4">
                      <div className="grid grid-cols-6 gap-2">
                        {galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex ? 'border-brand-coral' : 'border-transparent'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-16 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Seletor de Plantas - Novo Componente Inspirado no MySide */}
            {property.apartmentOptions && property.apartmentOptions.length > 0 && (
              <div className="mb-8">
                <ApartmentSelector
                  apartments={property.apartmentOptions}
                  selectedApartment={selectedApartment}
                  onApartmentSelect={setSelectedApartment}
                />
              </div>
            )}

            {/* Planta Baixa */}
            {property.images && property.images.some(img => img.includes('floorplan')) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Planta Baixa</h3>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <img
                      src={property.images.find(img => img.includes('floorplan')) || property.images[0]}
                      alt="Planta baixa"
                      className="w-full h-auto rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-floorplan.jpg';
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Descrição Completa */}
            {property.fullDescription && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Sobre o Empreendimento</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.fullDescription}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Características */}
            {property.characteristics && property.characteristics.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.characteristics.map((characteristic, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{characteristic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tipos de Sacadas */}
            {property.balconyTypes && property.balconyTypes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Tipos de Sacadas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.balconyTypes.map((balconyType, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{balconyType}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Diferenciais */}
            {property.differentials && property.differentials.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Diferenciais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.differentials.map((differential, index) => (
                      <div key={index} className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                        <span>{differential}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Localização */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  {property.embedUrl ? (
                    <div 
                      className="w-full h-96"
                      dangerouslySetInnerHTML={{ __html: property.embedUrl }}
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Mapa não disponível</p>
                        <p className="text-gray-400 text-sm">{property.location}, {property.state}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
                
            {property.locationBenefits && property.locationBenefits.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Benefícios da Localização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.locationBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preço e Ações */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-brand-coral mb-2">
                    A partir de {property.price}
                  </div>
                  {property.deliveryDate && (
                    <div className="flex items-center justify-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Entrega em {property.deliveryDate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-brand-coral hover:bg-brand-coral/90" size="lg">
                    Tenho Interesse
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Agendar Visita
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
              </CardContent>
            </Card>

            {/* Detalhes */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detalhes</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 text-brand-coral mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Quartos</div>
                      <div className="font-semibold">{property.bedrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 text-brand-coral mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Banheiros</div>
                      <div className="font-semibold">{property.bathrooms}</div>
                    </div>
                  </div>
                  {property.suites && property.suites > 0 && (
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-brand-coral mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Suítes</div>
                        <div className="font-semibold">{property.suites}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-brand-coral mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Vagas</div>
                      <div className="font-semibold">{property.parking}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="h-5 w-5 text-brand-coral mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Área</div>
                      <div className="font-semibold">{property.area}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informações</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Categoria:</span>
                    <span className="font-medium">{getCategoryLabel(property.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={property.status === 'ativo' ? 'default' : 'secondary'}>
                      {property.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  {property.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cadastrado em:</span>
                      <span className="font-medium">
                        {new Date(property.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFullPage;
