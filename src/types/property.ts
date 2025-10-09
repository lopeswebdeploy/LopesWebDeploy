export interface Property {
  // Identificação
  id: number;
  title: string;
  description?: string;
  price: number | null;
  status: string;
  featured: boolean;
  authorId: number;
  bannerImage?: string | null;
  galleryImages: string[];
  floorPlans: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Relacionamentos
  author?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  leads?: any[];
  
  // Campos de compatibilidade (para manter funcionalidade existente)
  isFeatured?: boolean;
  isVisible?: boolean;
  category?: string;
  location?: string;
  developer?: string;
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
