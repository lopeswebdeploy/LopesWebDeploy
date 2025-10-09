import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyPreviewProps {
  property: Property;
  onPreviewClick: () => void;
}

const PropertyPreview = ({ property, onPreviewClick }: PropertyPreviewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Garantir que a propriedade tenha valores padrão
  const safeProperty = {
    ...property,
    title: property.title || "Sem título",
    description: property.description || "",
    location: property.location || "",
    state: property.state || "Goiânia",
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    parking: property.parking || 0,
    area: property.area || "",
    price: property.price || "R$ 0",
    category: property.category || "venda",
    // Usar apenas a galeria de fotos para navegação
    images: property.images || property.photoGallery || []
  };

  // Debug: verificar imagens
  console.log("🔍 PropertyPreview - Propriedade:", {
    title: safeProperty.title,
    images: safeProperty.images,
    photoGallery: property.photoGallery,
    imagesOriginal: property.images,
    imagesLength: safeProperty.images?.length || 0
  });

  const nextImage = () => {
    if (safeProperty.images && safeProperty.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === safeProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (safeProperty.images && safeProperty.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? safeProperty.images.length - 1 : prev - 1
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
    <div className="space-y-4">
      {/* Imagem com navegação */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg">
          {safeProperty.images && safeProperty.images.length > 0 ? (
            <img
              src={safeProperty.images[currentImageIndex]}
              alt={safeProperty.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.log("❌ PropertyPreview - Erro ao carregar imagem:", safeProperty.images[currentImageIndex]);
                // Fallback para a primeira imagem da galeria se a imagem atual falhar
                (e.target as HTMLImageElement).src = safeProperty.images[0] || '/placeholder-image.jpg';
              }}
              onLoad={() => {
                console.log("✅ PropertyPreview - Imagem carregada com sucesso:", safeProperty.images[currentImageIndex]);
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sem imagem (Total: {safeProperty.images?.length || 0})</span>
            </div>
          )}
          
          {/* Setinhas de navegação */}
          {safeProperty.images && safeProperty.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-80 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-80 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Indicadores de imagem */}
          {safeProperty.images && safeProperty.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {safeProperty.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Badge de categoria */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(safeProperty.category)} text-white font-medium`}>
            {getCategoryLabel(safeProperty.category)}
          </Badge>
        </div>
      </div>

      {/* Informações da propriedade */}
      <div className="space-y-3">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {safeProperty.title}
        </h3>

        {/* Descrição */}
        {safeProperty.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {safeProperty.description}
          </p>
        )}

        {/* Localização */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{safeProperty.location}, {safeProperty.state}</span>
        </div>

        {/* Características */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{safeProperty.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{safeProperty.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-1" />
            <span>{safeProperty.parking}</span>
          </div>
          <div className="font-medium">
            {safeProperty.area}
          </div>
        </div>

        {/* Preço */}
        <div className="text-lg font-semibold text-brand-coral">
          A partir de {safeProperty.price}
        </div>

        {/* Botões */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onPreviewClick}
          >
            Ver Mais
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-brand-coral hover:bg-brand-coral/90"
          >
            Tenho Interesse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreview;
