import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyCardProps extends Property {}

const PropertyCard = ({
  id,
  bannerImage,
  galleryImages,
  price,
  title,
  description,
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Garantir que a propriedade tenha valores padrão
  const safeProperty = {
    title: title || "Sem título",
    description: description || "",
    price: price || 0,
    // Usar bannerImage ou galleryImages
    images: bannerImage ? [bannerImage, ...galleryImages] : galleryImages || []
  };

  // Debug: verificar imagens
  console.log("🔍 PropertyCard - Propriedade:", {
    title: safeProperty.title,
    images: safeProperty.images,
    imagesLength: safeProperty.images?.length || 0
  });

  // Reset do índice quando as imagens mudam
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [safeProperty.images]);

  // Função para navegar para a próxima imagem
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    if (safeProperty.images && safeProperty.images.length > 1) {
      setCurrentImageIndex((prev) => {
        const newIndex = prev === safeProperty.images.length - 1 ? 0 : prev + 1;
        console.log("🔄 PropertyCard - Próxima imagem:", newIndex, "de", safeProperty.images.length);
        return newIndex;
      });
    }
  };

  // Função para navegar para a imagem anterior
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    if (safeProperty.images && safeProperty.images.length > 1) {
      setCurrentImageIndex((prev) => {
        const newIndex = prev === 0 ? safeProperty.images.length - 1 : prev - 1;
        console.log("🔄 PropertyCard - Imagem anterior:", newIndex, "de", safeProperty.images.length);
        return newIndex;
      });
    }
  };

  // Função para ir diretamente para uma imagem específica
  const goToImage = (index: number) => {
    if (safeProperty.images && index >= 0 && index < safeProperty.images.length) {
      setCurrentImageIndex(index);
      console.log("🔄 PropertyCard - Ir para imagem:", index);
    }
  };


  const handleViewDetails = () => {
    console.log("🔍 PropertyCard - handleViewDetails chamado");
    console.log("🔍 PropertyCard - ID da propriedade:", id);
    console.log("🔍 PropertyCard - Título da propriedade:", title);
    
    if (id) {
      console.log("🔍 PropertyCard - Abrindo URL:", `/property/${id}`);
      window.open(`/property/${id}`, '_blank');
    } else {
      console.log("❌ PropertyCard - ID não encontrado!");
    }
  };
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card-luxury hover:shadow-luxury transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden group">
        {/* Imagem Principal */}
        {safeProperty.images && safeProperty.images.length > 0 ? (
          <div className="relative w-full h-64">
            <img
              key={`${id}-${currentImageIndex}`} // Force re-render when image changes
              src={safeProperty.images[currentImageIndex]}
              alt={`${safeProperty.title} - Imagem ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
              onLoad={() => {
                console.log("✅ PropertyCard - Imagem carregada:", currentImageIndex + 1, "de", safeProperty.images.length);
              }}
              onError={(e) => {
                console.log("❌ PropertyCard - Erro ao carregar imagem:", currentImageIndex);
                // Fallback para a primeira imagem da galeria se a imagem atual falhar
                (e.target as HTMLImageElement).src = safeProperty.images[0] || '/placeholder-image.jpg';
              }}
            />
            
            {/* Overlay para melhorar visibilidade das setinhas */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sem imagem (Total: {safeProperty.images?.length || 0})</span>
          </div>
        )}
        
        {/* Setinhas de Navegação - Sempre Visíveis */}
        {safeProperty.images && safeProperty.images.length > 1 && (
          <>
            {/* Botão Anterior */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              onClick={prevImage}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Botão Próximo */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              onClick={nextImage}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Indicadores de Imagem */}
        {safeProperty.images && safeProperty.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {safeProperty.images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/60 hover:bg-white/80 hover:scale-110'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador de Imagens */}
        {safeProperty.images && safeProperty.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentImageIndex + 1} / {safeProperty.images.length}
          </div>
        )}

        <div className="absolute top-4 left-4">
          <Badge className="bg-brand-coral text-white font-semibold">
            Venda
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <div className="text-2xl font-semibold text-brand-coral mb-2">
            R$ {safeProperty.price?.toLocaleString()}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-brand-coral transition-colors">
            {safeProperty.title}
          </h3>
          {safeProperty.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {safeProperty.description}
            </p>
          )}
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Goiânia, GO</span>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>3</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>2</span>
          </div>
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-1" />
            <span>1</span>
          </div>
          <div className="font-medium">
            120m²
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
          >
            Ver Mais
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex-1 bg-brand-coral hover:bg-brand-coral/90"
            onClick={handleViewDetails}
          >
            Tenho Interesse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;