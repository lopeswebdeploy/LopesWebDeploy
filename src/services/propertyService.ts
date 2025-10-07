import { Property } from "@/types/property";
import { sampleProperties } from "@/data/admin-properties";
import { Database } from "@/lib/database";
import { AuthService } from "@/lib/auth";
import { ImageReorganizer } from "./imageReorganizer";

const STORAGE_KEY = 'lopes_properties';

export class PropertyService {
  // Carregar propriedades - PRIMEIRO do banco, depois dados de exemplo
  static async loadProperties(): Promise<Property[]> {
    console.log('🔍 PropertyService.loadProperties - Carregando propriedades...');
    
    try {
      // Obter informações do usuário atual
      const currentUser = AuthService.getCurrentUser();
      const userId = currentUser?.id;
      const userRole = currentUser?.role;
      
      // Tentar carregar do banco de dados primeiro
      const dbProperties = await Database.loadProperties(userId, userRole);
      if (dbProperties.length > 0) {
        console.log('✅ PropertyService.loadProperties - Carregadas do banco:', dbProperties.length, 'propriedades');
        return dbProperties;
      }
    } catch (error) {
      console.log('⚠️ PropertyService.loadProperties - Erro no banco:', error);
    }

    // Fallback: dados de exemplo (apenas para desenvolvimento)
    console.log('🔍 PropertyService.loadProperties - Usando dados de exemplo');
    return sampleProperties;
  }

  // Versão síncrona para compatibilidade (usa dados de exemplo)
  static loadPropertiesSync(): Property[] {
    console.log('🔍 PropertyService.loadPropertiesSync - Carregando dados de exemplo');
    return sampleProperties;
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
    
    try {
      // Tentar salvar no banco de dados primeiro
      const { id, ...propertyWithoutId } = property;
      const currentUser = AuthService.getCurrentUser();
      
      const newProperty = await Database.addProperty({
        ...propertyWithoutId,
        ownerId: currentUser?.id, // Associar propriedade ao usuário atual
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log("✅ PropertyService.addProperty - Propriedade adicionada no banco com ID:", newProperty.id);
      
      // 🔄 REORGANIZAR IMAGENS COM ID REAL
      if (newProperty.id) {
        await this.reorganizePropertyImages(property, newProperty.id);
      }
      
      return newProperty;
    } catch (error) {
      console.log("⚠️ PropertyService.addProperty - Erro no banco, salvando no localStorage:", error);
      
      // Fallback para localStorage
      const newProperty = {
        ...property,
        id: property.id || `temp-${Date.now()}`, // Usar ID existente ou gerar temporário
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const existingProperties = this.loadPropertiesSync();
      const updatedProperties = [...existingProperties, newProperty];
      await this.saveProperties(updatedProperties);
      
      console.log("✅ PropertyService.addProperty - Propriedade adicionada no localStorage com ID:", newProperty.id);
      return newProperty;
    }
  }
  
  // Reorganizar imagens da propriedade com ID real
  private static async reorganizePropertyImages(originalProperty: Property, realPropertyId: string): Promise<void> {
    try {
      console.log("🔄 PropertyService - Reorganizando imagens para ID real:", realPropertyId);
      
      const imagesToReorganize: { url: string; type: 'banner' | 'gallery' | 'floorplan' }[] = [];
      
      // Coletar todas as imagens que precisam ser reorganizadas
      if (originalProperty.bannerImage && originalProperty.bannerImage.includes('temp-')) {
        imagesToReorganize.push({ url: originalProperty.bannerImage, type: 'banner' });
      }
      
      if (originalProperty.floorPlan && originalProperty.floorPlan.includes('temp-')) {
        imagesToReorganize.push({ url: originalProperty.floorPlan, type: 'floorplan' });
      }
      
      if (originalProperty.photoGallery) {
        originalProperty.photoGallery.forEach(url => {
          if (url.includes('temp-')) {
            imagesToReorganize.push({ url, type: 'gallery' });
          }
        });
      }
      
      if (originalProperty.images) {
        originalProperty.images.forEach(url => {
          if (url.includes('temp-')) {
            imagesToReorganize.push({ url, type: 'gallery' });
          }
        });
      }
      
      if (imagesToReorganize.length === 0) {
        console.log("✅ PropertyService - Nenhuma imagem temporária encontrada");
        return;
      }
      
      console.log(`🔄 PropertyService - Reorganizando ${imagesToReorganize.length} imagens...`);
      
      // Reorganizar cada imagem
      const reorganizedUrls: string[] = [];
      for (const { url, type } of imagesToReorganize) {
        const newUrl = await ImageReorganizer.reorganizeSingleImage(url, realPropertyId, type);
        reorganizedUrls.push(newUrl);
      }
      
      // Atualizar propriedade no banco com URLs reorganizadas
      const updatedProperty = {
        ...originalProperty,
        id: realPropertyId,
        bannerImage: originalProperty.bannerImage?.includes('temp-') 
          ? reorganizedUrls.find(url => url.includes('banner')) || originalProperty.bannerImage
          : originalProperty.bannerImage,
        floorPlan: originalProperty.floorPlan?.includes('temp-')
          ? reorganizedUrls.find(url => url.includes('floorplan')) || originalProperty.floorPlan
          : originalProperty.floorPlan,
        photoGallery: originalProperty.photoGallery?.map(url => 
          url.includes('temp-') 
            ? reorganizedUrls.find(newUrl => newUrl.includes('gallery')) || url
            : url
        ) || [],
        images: originalProperty.images?.map(url => 
          url.includes('temp-') 
            ? reorganizedUrls.find(newUrl => newUrl.includes('gallery')) || url
            : url
        ) || []
      };
      
      // Atualizar no banco
      await Database.updateProperty(updatedProperty);
      
      console.log("✅ PropertyService - Imagens reorganizadas e propriedade atualizada!");
      
    } catch (error) {
      console.error("❌ PropertyService - Erro ao reorganizar imagens:", error);
      // Não falhar a criação da propriedade por causa das imagens
    }
  }

  // Atualizar propriedade existente
  static async updateProperty(property: Property): Promise<Property> {
    console.log("💾 PropertyService.updateProperty - Atualizando propriedade:", property.id);
    
    try {
      // Tentar atualizar no banco de dados primeiro
      const updatedProperty = await Database.updateProperty({
        ...property,
        updatedAt: new Date(),
      });
      
      console.log("✅ PropertyService.updateProperty - Propriedade atualizada no banco");
      return updatedProperty;
    } catch (error) {
      console.log("⚠️ PropertyService.updateProperty - Erro no banco, atualizando no localStorage:", error);
      
      // Fallback para localStorage
      const existingProperties = this.loadPropertiesSync();
      const updatedProperties = existingProperties.map(prop => 
        prop.id === property.id 
          ? { ...property, updatedAt: new Date() }
          : prop
      );
      
      await this.saveProperties(updatedProperties);
      console.log("✅ PropertyService.updateProperty - Propriedade atualizada no localStorage");
      return property;
    }
  }

  // Excluir propriedade
  static async deleteProperty(id: string): Promise<void> {
    console.log("💾 PropertyService.deleteProperty - Excluindo propriedade:", id);
    
    try {
      // Tentar excluir do banco de dados primeiro
      await Database.deleteProperty(id);
      console.log("✅ PropertyService.deleteProperty - Propriedade excluída do banco");
    } catch (error) {
      console.log("⚠️ PropertyService.deleteProperty - Erro no banco, excluindo do localStorage:", error);
      
      // Fallback para localStorage
      const existingProperties = this.loadPropertiesSync();
      const updatedProperties = existingProperties.filter(prop => prop.id !== id);
      await this.saveProperties(updatedProperties);
      
      console.log("✅ PropertyService.deleteProperty - Propriedade excluída do localStorage");
    }
  }

  // Buscar propriedade por ID
  static async getPropertyById(id: string): Promise<Property | null> {
    console.log("🔍 PropertyService.getPropertyById - Buscando ID:", id);
    
    try {
      // Tentar buscar no banco de dados primeiro
      const property = await Database.getPropertyById(id);
      if (property) {
        console.log("✅ PropertyService.getPropertyById - Propriedade encontrada no banco:", property.title);
        return property;
      }
    } catch (error) {
      console.log("⚠️ PropertyService.getPropertyById - Erro no banco, buscando no localStorage:", error);
    }
    
    // Fallback para localStorage
    const properties = this.loadPropertiesSync();
    const foundProperty = properties.find(p => p.id === id) || null;
    
    if (foundProperty) {
      console.log("✅ PropertyService.getPropertyById - Propriedade encontrada no localStorage:", foundProperty.title);
    } else {
      console.log("❌ PropertyService.getPropertyById - Propriedade não encontrada!");
    }
    
    return foundProperty;
  }

  // Versão síncrona para compatibilidade
  static getPropertyByIdSync(id: string): Property | null {
    const properties = this.loadPropertiesSync();
    return properties.find(p => p.id === id) || null;
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