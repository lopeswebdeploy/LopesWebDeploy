import { Property } from "@/types/property";
import { sampleProperties } from "@/data/admin-properties";
import { Database } from "@/lib/database";

const STORAGE_KEY = 'lopes_properties';

export class PropertyService {
  // Carregar propriedades - PRIMEIRO do banco, depois localStorage, depois dados de exemplo
  static async loadProperties(): Promise<Property[]> {
    console.log('🔍 PropertyService.loadProperties - Carregando propriedades...');
    
    try {
      // Tentar carregar do banco de dados primeiro
      const dbProperties = await Database.loadProperties();
      if (dbProperties.length > 0) {
        console.log('✅ PropertyService.loadProperties - Carregadas do banco:', dbProperties.length, 'propriedades');
        return dbProperties;
      }
    } catch (error) {
      console.log('⚠️ PropertyService.loadProperties - Erro no banco, tentando localStorage:', error);
    }

    // Fallback para localStorage (desenvolvimento)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const properties = JSON.parse(saved);
          console.log('🔍 PropertyService.loadProperties - Carregadas do localStorage:', properties.length, 'propriedades');
          return properties;
        }
      } catch (error) {
        console.error('❌ Erro ao carregar do localStorage:', error);
      }
    }

    // Último fallback: dados de exemplo
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
      const newProperty = await Database.addProperty({
        ...property,
        id: property.id || Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log("✅ PropertyService.addProperty - Propriedade adicionada no banco com ID:", newProperty.id);
      return newProperty;
    } catch (error) {
      console.log("⚠️ PropertyService.addProperty - Erro no banco, salvando no localStorage:", error);
      
      // Fallback para localStorage
      const newProperty = {
        ...property,
        id: Date.now().toString(),
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