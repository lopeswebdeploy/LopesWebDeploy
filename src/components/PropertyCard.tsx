'use client';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: number | null;
    bannerImage?: string | null;
    galleryImages?: string[];
    status: string;
    featured: boolean;
    author?: {
      name: string;
    };
  };
  showAdminActions?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleFeatured?: (id: number, featured: boolean) => void;
}

export default function PropertyCard({ 
  property, 
  showAdminActions = false,
  onEdit,
  onDelete,
  onToggleFeatured
}: PropertyCardProps) {
  
  // Usar bannerImage ou primeira imagem da galeria ou placeholder
  const imageUrl = property.bannerImage || 
                   (property.galleryImages && property.galleryImages[0]) || 
                   '/placeholder-property.jpg';

  const formattedPrice = property.price 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)
    : 'Sob consulta';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagem */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback para imagem quebrada
            (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
          }}
        />
        {property.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Destaque
          </div>
        )}
        {property.status === 'draft' && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Rascunho
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <p className="text-xl font-bold text-blue-600 mb-3">
          {formattedPrice}
        </p>

        {/* Ações do Admin */}
        {showAdminActions && onEdit && onDelete && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => onEdit(property.id)}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(property.id)}
              className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
            {onToggleFeatured && (
              <button
                onClick={() => onToggleFeatured(property.id, !property.featured)}
                className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                  property.featured 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {property.featured ? 'Remover Destaque' : 'Destacar'}
              </button>
            )}
          </div>
        )}

        {/* Link para página do imóvel (apenas se publicado) */}
        {property.status === 'published' && (
          <Link 
            href={`/imoveis/${property.id}`}
            className="block w-full bg-gray-100 text-gray-800 text-center py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            Ver Detalhes
          </Link>
        )}
      </div>
    </div>
  );
}