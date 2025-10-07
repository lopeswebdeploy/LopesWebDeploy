export interface ImageData {
  id: string;
  url: string;
  type: ImageType;
  propertyId: string;
  apartmentId?: string; // Para plantas específicas de apartamentos
  filename: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

export type ImageType = 
  | 'banner'           // Imagem principal do banner (2:1)
  | 'gallery'          // Galeria de fotos (quadrado)
  | 'floorplan'        // Planta baixa geral do empreendimento
  | 'apartment-floorplan'; // Planta específica de apartamento

export interface ImageUploadConfig {
  type: ImageType;
  maxSize: number; // MB
  maxWidth?: number;
  maxHeight?: number;
  quality: number; // 0-100
  format: 'jpeg' | 'webp' | 'png';
  aspectRatio?: {
    width: number;
    height: number;
  };
}

export const IMAGE_CONFIGS: Record<ImageType, ImageUploadConfig> = {
  banner: {
    type: 'banner',
    maxSize: 5,
    maxWidth: 1920,
    maxHeight: 960,
    quality: 85,
    format: 'jpeg',
    aspectRatio: { width: 2, height: 1 }
  },
  gallery: {
    type: 'gallery',
    maxSize: 3,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 90,
    format: 'webp',
    aspectRatio: { width: 1, height: 1 }
  },
  floorplan: {
    type: 'floorplan',
    maxSize: 10,
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 95,
    format: 'png'
  },
  'apartment-floorplan': {
    type: 'apartment-floorplan',
    maxSize: 8,
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 95,
    format: 'png'
  }
};
