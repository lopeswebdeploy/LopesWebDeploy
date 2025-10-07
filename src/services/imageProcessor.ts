import { ImageType, ImageUploadConfig, IMAGE_CONFIGS } from '@/types/image';

export class ImageProcessor {
  /**
   * Processa e otimiza uma imagem antes do upload
   */
  static async processImage(
    file: File, 
    type: ImageType
  ): Promise<File> {
    const config = IMAGE_CONFIGS[type];
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calcular dimensões otimizadas
          const { width, height } = this.calculateOptimalDimensions(
            img.width, 
            img.height, 
            config
          );
          
          // Configurar canvas
          canvas.width = width;
          canvas.height = height;
          
          // Desenhar imagem redimensionada
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converter para blob com qualidade otimizada
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const processedFile = new File([blob], file.name, {
                  type: this.getMimeType(config.format),
                  lastModified: Date.now()
                });
                resolve(processedFile);
              } else {
                reject(new Error('Falha ao processar imagem'));
              }
            },
            this.getMimeType(config.format),
            config.quality / 100
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Calcula dimensões otimizadas mantendo aspect ratio
   */
  private static calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    config: ImageUploadConfig
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };
    
    // Aplicar limites máximos
    if (config.maxWidth && width > config.maxWidth) {
      height = (height * config.maxWidth) / width;
      width = config.maxWidth;
    }
    
    if (config.maxHeight && height > config.maxHeight) {
      width = (width * config.maxHeight) / height;
      height = config.maxHeight;
    }
    
    // Aplicar aspect ratio específico se definido
    if (config.aspectRatio) {
      const targetRatio = config.aspectRatio.width / config.aspectRatio.height;
      const currentRatio = width / height;
      
      if (currentRatio > targetRatio) {
        // Muito largo, ajustar largura
        width = height * targetRatio;
      } else {
        // Muito alto, ajustar altura
        height = width / targetRatio;
      }
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }
  
  /**
   * Obtém MIME type baseado no formato
   */
  private static getMimeType(format: string): string {
    switch (format) {
      case 'webp': return 'image/webp';
      case 'png': return 'image/png';
      case 'jpeg': 
      default: return 'image/jpeg';
    }
  }
  
  /**
   * Valida se o arquivo é uma imagem válida
   */
  static validateImage(file: File, type: ImageType): { valid: boolean; error?: string } {
    const config = IMAGE_CONFIGS[type];
    
    // Verificar tipo MIME
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Arquivo deve ser uma imagem' };
    }
    
    // Verificar tamanho
    const maxSizeBytes = config.maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        valid: false, 
        error: `Arquivo deve ter no máximo ${config.maxSize}MB` 
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Gera nome de arquivo otimizado
   */
  static generateFilename(propertyId: string, type: ImageType, apartmentId?: string): string {
    const timestamp = Date.now();
    const config = IMAGE_CONFIGS[type];
    
    if (type === 'apartment-floorplan' && apartmentId) {
      return `properties/${propertyId}/apartments/${apartmentId}/floorplan-${timestamp}.${config.format}`;
    }
    
    return `properties/${propertyId}/${type}-${timestamp}.${config.format}`;
  }
}
