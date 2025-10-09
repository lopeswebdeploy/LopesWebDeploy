import { Property } from "@/types/property";
import { AuthService } from "@/lib/auth";

export class PropertyService {
  // Carregar propriedades - APENAS do banco de dados
  static async loadProperties(adminView: boolean = false): Promise<Property[]> {
    console.log('🔍 PropertyService.loadProperties - Carregando propriedades do banco...');
    
    try {
      const url = adminView ? '/api/properties?admin=true' : '/api/properties';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Evitar cache para dados sempre atualizados
      });
      
      if (response.ok) {
        const properties = await response.json();
        console.log('✅ PropertyService.loadProperties - Carregadas do banco:', properties.length, 'propriedades');
        
        // Converter propriedades do banco para o formato esperado pelo frontend
        const convertedProperties = properties.map((prop: any) => ({
          ...prop,
          // Mapear campos do banco para campos esperados pelo frontend
          isFeatured: prop.featured,
          isVisible: prop.status === 'published',
          category: prop.category || 'venda',
          location: prop.location || 'Goiânia',
          developer: prop.developer || 'Lopes Imóveis'
        }));
        
        return convertedProperties;
      }
      
      console.error('❌ PropertyService.loadProperties - Erro na API:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('❌ PropertyService.loadProperties - Detalhes do erro:', errorData);
      return [];
    } catch (error) {
      console.error('❌ PropertyService.loadProperties - Erro no banco:', error);
      return [];
    }
  }

  // Versão síncrona para compatibilidade (retorna vazio - use loadProperties async)
  static loadPropertiesSync(): Property[] {
    console.log('🔍 PropertyService.loadPropertiesSync - Retornando array vazio (use loadProperties async)');
    return [];
  }

  // Buscar propriedade por ID
  static async getPropertyById(id: string): Promise<Property | null> {
    console.log("🔍 PropertyService.getPropertyById - Buscando ID:", id);
    
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const property = await response.json();
        console.log("✅ PropertyService.getPropertyById - Propriedade encontrada:", property.title);
        
        // Converter propriedade do banco para o formato esperado pelo frontend
        const convertedProperty = {
          ...property,
          isFeatured: property.featured,
          isVisible: property.status === 'published',
          category: property.category || 'venda',
          location: property.location || 'Goiânia',
          developer: property.developer || 'Lopes Imóveis'
        };
        
        return convertedProperty;
      }
      
      console.error("❌ PropertyService.getPropertyById - Erro na API:", response.status, response.statusText);
      return null;
    } catch (error) {
      console.error("❌ PropertyService.getPropertyById - Erro:", error);
      return null;
    }
  }

  // Versão síncrona para compatibilidade
  static getPropertyByIdSync(id: string): Property | null {
    return null;
  }

  // Adicionar propriedade
  static async addProperty(property: Property): Promise<Property> {
    console.log('🔍 PropertyService.addProperty - Adicionando propriedade:', property.title);
    
    try {
      // Converter propriedade do frontend para o formato do banco
      const propertyData = {
        title: property.title,
        description: property.description,
        price: property.price,
        status: property.status || 'draft',
        featured: property.isFeatured || false,
        bannerImage: property.bannerImage,
        galleryImages: property.galleryImages || [],
        floorPlans: property.floorPlans || []
      };
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (response.ok) {
        const newProperty = await response.json();
        console.log('✅ PropertyService.addProperty - Propriedade adicionada:', newProperty.id);
        
        // Converter de volta para o formato do frontend
        return {
          ...newProperty,
          isFeatured: newProperty.featured,
          isVisible: newProperty.status === 'published',
          category: newProperty.category || 'venda',
          location: newProperty.location || 'Goiânia',
          developer: newProperty.developer || 'Lopes Imóveis'
        };
      }
      
      const errorData = await response.text();
      console.error('❌ PropertyService.addProperty - Erro na API:', response.status, errorData);
      throw new Error(`Erro na API: ${response.status} - ${errorData}`);
    } catch (error) {
      console.error('❌ PropertyService.addProperty - Erro:', error);
      throw error;
    }
  }

  // Atualizar propriedade
  static async updateProperty(property: Property): Promise<Property> {
    console.log('🔍 PropertyService.updateProperty - Atualizando propriedade:', property.id);
    
    try {
      // Converter propriedade do frontend para o formato do banco
      const propertyData = {
        title: property.title,
        description: property.description,
        price: property.price,
        status: property.status || 'draft',
        featured: property.isFeatured || false,
        bannerImage: property.bannerImage,
        galleryImages: property.galleryImages || [],
        floorPlans: property.floorPlans || []
      };
      
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (response.ok) {
        const updatedProperty = await response.json();
        console.log('✅ PropertyService.updateProperty - Propriedade atualizada:', updatedProperty.id);
        
        // Converter de volta para o formato do frontend
        return {
          ...updatedProperty,
          isFeatured: updatedProperty.featured,
          isVisible: updatedProperty.status === 'published',
          category: updatedProperty.category || 'venda',
          location: updatedProperty.location || 'Goiânia',
          developer: updatedProperty.developer || 'Lopes Imóveis'
        };
      }
      
      const errorData = await response.text();
      console.error('❌ PropertyService.updateProperty - Erro na API:', response.status, errorData);
      throw new Error(`Erro na API: ${response.status} - ${errorData}`);
    } catch (error) {
      console.error('❌ PropertyService.updateProperty - Erro:', error);
      throw error;
    }
  }

  // Excluir propriedade
  static async deleteProperty(id: string): Promise<void> {
    console.log('🔍 PropertyService.deleteProperty - Excluindo propriedade:', id);
    
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('✅ PropertyService.deleteProperty - Propriedade excluída:', id);
        return;
      }
      
      throw new Error(`Erro na API: ${response.status}`);
    } catch (error) {
      console.error('❌ PropertyService.deleteProperty - Erro:', error);
      throw error;
    }
  }

  // Métodos de compatibilidade (para manter funcionalidade existente)
  static forceSampleData(): void {
    console.log('🔍 PropertyService.forceSampleData - Método não implementado');
  }

  static exportData(): string {
    console.log('🔍 PropertyService.exportData - Método não implementado');
    return '{}';
  }

  static async importData(data: string): Promise<boolean> {
    console.log('🔍 PropertyService.importData - Método não implementado');
    return false;
  }

  static clearAllData(): void {
    console.log('🔍 PropertyService.clearAllData - Método não implementado');
  }
}