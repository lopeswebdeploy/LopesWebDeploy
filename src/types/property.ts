export interface Property {
  // Identificação
  id?: string;
  status: 'ativo' | 'inativo';
  isFeatured?: boolean; // Para destaque (máximo 6)
  isVisible?: boolean; // Para visibilidade nas páginas públicas
  ownerId?: string; // ID do corretor proprietário
  createdAt?: Date;
  updatedAt?: Date;

  // Informações Básicas
  title: string;
  description: string;
  fullDescription?: string;
  category: 'venda' | 'investimento' | 'aluguel';
  type: string;
  propertyType: 'apartamento' | 'casa' | 'cobertura' | 'loft';

  // Localização
  location: string;
  state: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  embedUrl?: string; // URL do iframe do Google Maps

  // Características Físicas
  bedrooms: number | string;
  bathrooms: number;
  suites?: number;
  parking: number;
  area: string;
  balconyTypes?: string[];

  // Financeiro
  price: string;
  apartmentOptions?: ApartmentOption[];

  // Empreendimento
  developer?: string;
  deliveryDate?: string;
  availability?: string;

  // Mídia
  images: string[];
  bannerImage?: string;
  floorPlan?: string;
  photoGallery?: string[];

  // Detalhes
  characteristics?: string[];
  locationBenefits?: string[];
  differentials?: string[];
}

export interface ApartmentOption {
  id: string;
  bedrooms: number;
  area: string;
  price: string;
  floor?: number;
  available: boolean;
  features?: string[];
  floorPlan?: string;
  // Novos campos para plantas diferentes
  unitType?: string; // ex: "Studio", "Padrão", "Duplex", "Cobertura"
  bathrooms?: number;
  suites?: number;
  parking?: number;
  balcony?: string;
  description?: string;
}

export interface PropertyFilters {
  search: string;
  location: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  area: string;
  priceRange: [number, number];
}
