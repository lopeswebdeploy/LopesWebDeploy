import { Property } from "@/types/property";
import { sampleProperties } from "@/data/admin-properties";

const STORAGE_KEY = 'lopes_properties';

export class PropertyService {
  // Carregar propriedades - SEMPRE do localStorage, com fallback para dados de exemplo
  static loadProperties(): Property[] {
    console.log('🔍 PropertyService.loadProperties - Carregando propriedades...');
    
    if (typeof window === 'undefined') {
      console.log('🔍 PropertyService.loadProperties - Servidor, retornando dados de exemplo');
      return sampleProperties;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const properties = JSON.parse(saved);
        console.log('🔍 PropertyService.loadProperties - Carregadas do localStorage:', properties.length, 'propriedades');
        
        // Log detalhado de cada propriedade
        properties.forEach((prop: any, index: number) => {
          console.log(`🔍 Propriedade ${index + 1}:`, {
            id: prop.id,
            title: prop.title,
            bannerImage: prop.bannerImage ? `${prop.bannerImage.substring(0, 50)}...` : 'VAZIO',
            bannerImageType: prop.bannerImage ? (prop.bannerImage.startsWith('data:') ? 'BASE64' : 'URL') : 'VAZIO',
            images: prop.images?.length || 0,
            imagesTypes: prop.images?.map((img: string) => img.startsWith('data:') ? 'BASE64' : 'URL') || [],
            photoGallery: prop.photoGallery?.length || 0,
            photoGalleryTypes: prop.photoGallery?.map((img: string) => img.startsWith('data:') ? 'BASE64' : 'URL') || [],
            floorPlan: prop.floorPlan ? `${prop.floorPlan.substring(0, 50)}...` : 'VAZIO',
            floorPlanType: prop.floorPlan ? (prop.floorPlan.startsWith('data:') ? 'BASE64' : 'URL') : 'VAZIO',
            location: prop.location || 'VAZIO',
            embedUrl: prop.embedUrl ? 'PRESENTE' : 'VAZIO'
          });
        });
        
        return properties;
      } else {
        console.log('🔍 PropertyService.loadProperties - Nenhum dado salvo, usando dados de exemplo');
        return sampleProperties;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar propriedades:', error);
      console.log('🔍 PropertyService.loadProperties - Erro, usando dados de exemplo');
      return sampleProperties;
    }
  }

  // Salvar propriedades no localStorage - SIMPLES E DIRETO
  static async saveProperties(properties: Property[]): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      console.log('💾 PropertyService.saveProperties - Salvando', properties.length, 'propriedades...');
      
      const dataString = JSON.stringify(properties);
      const dataSize = dataString.length;
      console.log(`💾 Tamanho dos dados: ${(dataSize/1024).toFixed(1)}KB`);
      
      // Se for muito grande, comprimir imagens base64
      if (dataSize > 4 * 1024 * 1024) { // 4MB
        console.warn('⚠️ Dados muito grandes, comprimindo imagens...');
        const compressedProperties = await this.compressAllImages(properties);
        const compressedDataString = JSON.stringify(compressedProperties);
        const compressedSize = compressedDataString.length;
        console.log(`💾 Tamanho após compressão: ${(compressedSize/1024).toFixed(1)}KB`);
        localStorage.setItem(STORAGE_KEY, compressedDataString);
      } else {
        localStorage.setItem(STORAGE_KEY, dataString);
      }
      
      console.log('✅ Propriedades salvas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar propriedades:', error);
      throw new Error('Não foi possível salvar os dados. Tente novamente.');
    }
  }

  // Comprimir todas as imagens base64
  private static async compressAllImages(properties: Property[]): Promise<Property[]> {
    return Promise.all(properties.map(async (prop) => {
      const compressedProp = { ...prop };
      
      // Comprimir banner
      if (compressedProp.bannerImage && compressedProp.bannerImage.startsWith('data:')) {
        compressedProp.bannerImage = await this.compressImage(compressedProp.bannerImage, 0.5);
      }
      
      // Comprimir imagens
      if (compressedProp.images) {
        compressedProp.images = await Promise.all(
          compressedProp.images.map(async (img) => 
            img.startsWith('data:') ? await this.compressImage(img, 0.5) : img
          )
        );
      }
      
      // Comprimir galeria
      if (compressedProp.photoGallery) {
        compressedProp.photoGallery = await Promise.all(
          compressedProp.photoGallery.map(async (img) => 
            img.startsWith('data:') ? await this.compressImage(img, 0.5) : img
          )
        );
      }
      
      // Comprimir planta
      if (compressedProp.floorPlan && compressedProp.floorPlan.startsWith('data:')) {
        compressedProp.floorPlan = await this.compressImage(compressedProp.floorPlan, 0.5);
      }
      
      return compressedProp;
    }));
  }

  // Comprimir imagem base64
  private static compressImage(base64: string, quality: number = 0.5): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Redimensionar para máximo 600px mantendo proporção
        const maxSize = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(base64); // Fallback para original
      img.src = base64;
    });
  }

  // Adicionar nova propriedade
  static async addProperty(property: Property): Promise<Property> {
    console.log("💾 PropertyService.addProperty - Adicionando propriedade:", property.title);
    
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Carregar propriedades existentes
    const existingProperties = this.loadProperties();
    
    // Adicionar nova propriedade
    const updatedProperties = [...existingProperties, newProperty];
    
    // Salvar no localStorage
    await this.saveProperties(updatedProperties);
    
    console.log("✅ PropertyService.addProperty - Propriedade adicionada com ID:", newProperty.id);
    return newProperty;
  }

  // Atualizar propriedade existente
  static async updateProperty(property: Property): Promise<Property> {
    console.log("💾 PropertyService.updateProperty - Atualizando propriedade:", property.id);
    
    // Carregar propriedades existentes
    const existingProperties = this.loadProperties();
    
    // Encontrar e atualizar propriedade
    const updatedProperties = existingProperties.map(prop => 
      prop.id === property.id 
        ? { ...property, updatedAt: new Date() }
        : prop
    );
    
    // Salvar no localStorage
    await this.saveProperties(updatedProperties);
    
    console.log("✅ PropertyService.updateProperty - Propriedade atualizada");
    return property;
  }

  // Excluir propriedade
  static async deleteProperty(id: string): Promise<void> {
    console.log("💾 PropertyService.deleteProperty - Excluindo propriedade:", id);
    
    // Carregar propriedades existentes
    const existingProperties = this.loadProperties();
    
    // Remover propriedade
    const updatedProperties = existingProperties.filter(prop => prop.id !== id);
    
    // Salvar no localStorage
    await this.saveProperties(updatedProperties);
    
    console.log("✅ PropertyService.deleteProperty - Propriedade excluída");
  }

  // Buscar propriedade por ID
  static getPropertyById(id: string): Property | null {
    console.log("🔍 PropertyService.getPropertyById - Buscando ID:", id);
    
    const properties = this.loadProperties();
    console.log("🔍 PropertyService.getPropertyById - Total de propriedades:", properties.length);
    console.log("🔍 PropertyService.getPropertyById - IDs disponíveis:", properties.map(p => p.id));
    
    const foundProperty = properties.find(p => p.id === id) || null;
    
    console.log("🔍 PropertyService.getPropertyById:", {
      id,
      totalProperties: properties.length,
      found: !!foundProperty,
      propertyData: foundProperty ? {
        title: foundProperty.title,
        bannerImage: foundProperty.bannerImage ? `${foundProperty.bannerImage.substring(0, 50)}...` : "VAZIO",
        images: foundProperty.images?.length || 0,
        photoGallery: foundProperty.photoGallery?.length || 0
      } : null
    });
    
    if (!foundProperty) {
      console.log("❌ PropertyService.getPropertyById - Propriedade não encontrada!");
      console.log("❌ ID buscado:", id);
      console.log("❌ IDs disponíveis:", properties.map(p => ({ id: p.id, title: p.title })));
      console.log("❌ Comparação de tipos:", {
        buscado: typeof id,
        disponiveis: properties.map(p => ({ id: p.id, tipo: typeof p.id }))
      });
    }
    
    return foundProperty;
  }

  // Limpar todos os dados
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Todos os dados limpos');
  }

  // Forçar uso dos dados de exemplo
  static forceSampleData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    console.log('🔄 Forçando uso dos dados de exemplo');
  }

  // Exportar dados
  static exportData(): string {
    const properties = this.loadProperties();
    return JSON.stringify(properties, null, 2);
  }

  // Importar dados
  static async importData(jsonData: string): Promise<boolean> {
    try {
      const properties = JSON.parse(jsonData);
      await this.saveProperties(properties);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}