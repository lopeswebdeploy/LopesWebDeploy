import { Property } from "@/types/property";
import { AuthService } from "@/lib/auth";

export class PropertyService {
  // Carregar propriedades - APENAS do banco de dados
  static async loadProperties(): Promise<Property[]> {
    console.log('🔍 PropertyService.loadProperties - Carregando propriedades do banco...');
    
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const properties = await response.json();
        console.log('✅ PropertyService.loadProperties - Carregadas do banco:', properties.length, 'propriedades');
        return properties;
      }
      
      console.error('❌ PropertyService.loadProperties - Erro na API:', response.status);
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
      const response = await fetch(`/api/properties/${id}`);
      if (response.ok) {
        const property = await response.json();
        console.log("✅ PropertyService.getPropertyById - Propriedade encontrada:", property.title);
        return property;
      }
    } catch (error) {
      console.error("❌ PropertyService.getPropertyById - Erro:", error);
      return null;
    }
    
    console.log("❌ PropertyService.getPropertyById - Propriedade não encontrada!");
    return null;
  }

  // Versão síncrona para compatibilidade
  static getPropertyByIdSync(id: string): Property | null {
    return null;
  }

  // Adicionar propriedade
  static async addProperty(property: Property): Promise<Property> {
    console.log('🔍 PropertyService.addProperty - Adicionando propriedade:', property.title);
    
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });
      
      if (response.ok) {
        const newProperty = await response.json();
        console.log('✅ PropertyService.addProperty - Propriedade adicionada:', newProperty.id);
        return newProperty;
      }
      
      throw new Error(`Erro na API: ${response.status}`);
    } catch (error) {
      console.error('❌ PropertyService.addProperty - Erro:', error);
      throw error;
    }
  }

  // Atualizar propriedade
  static async updateProperty(property: Property): Promise<Property> {
    console.log('🔍 PropertyService.updateProperty - Atualizando propriedade:', property.id);
    
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });
      
      if (response.ok) {
        const updatedProperty = await response.json();
        console.log('✅ PropertyService.updateProperty - Propriedade atualizada:', updatedProperty.id);
        return updatedProperty;
      }
      
      throw new Error(`Erro na API: ${response.status}`);
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