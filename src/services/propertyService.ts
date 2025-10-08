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
}