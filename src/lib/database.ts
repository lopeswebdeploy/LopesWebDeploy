import { PrismaClient } from '@prisma/client';
import { Property } from '@/types/property';

const prisma = new PrismaClient();

export class Database {
  // Testar conexão com o banco
  static async testConnection(): Promise<boolean> {
    try {
      await prisma.$connect();
      console.log('✅ Conexão com banco de dados estabelecida');
      return true;
    } catch (error) {
      console.error('❌ Erro na conexão com banco:', error);
      return false;
    }
  }

  // Carregar todas as propriedades
  static async loadProperties(): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: { isVisible: true },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`📊 Carregadas ${properties.length} propriedades do banco`);
      return properties.map(this.mapPrismaToProperty);
    } catch (error) {
      console.error('❌ Erro ao carregar propriedades:', error);
      return [];
    }
  }

  // Carregar propriedades em destaque
  static async loadFeaturedProperties(): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: { 
          isVisible: true, 
          isFeatured: true 
        },
        orderBy: { createdAt: 'desc' },
        take: 6
      });
      
      console.log(`⭐ Carregadas ${properties.length} propriedades em destaque`);
      return properties.map(this.mapPrismaToProperty);
    } catch (error) {
      console.error('❌ Erro ao carregar propriedades em destaque:', error);
      return [];
    }
  }

  // Buscar propriedade por ID
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const property = await prisma.property.findFirst({
        where: { 
          id: id,
          isVisible: true 
        }
      });
      
      if (!property) {
        console.log(`❌ Propriedade ${id} não encontrada`);
        return null;
      }
      
      console.log(`✅ Propriedade ${id} encontrada`);
      return this.mapPrismaToProperty(property);
    } catch (error) {
      console.error('❌ Erro ao buscar propriedade:', error);
      return null;
    }
  }

  // Adicionar nova propriedade
  static async addProperty(property: Property): Promise<Property> {
    try {
      const newProperty = await prisma.property.create({
        data: {
          id: property.id || undefined,
          title: property.title,
          description: property.description,
          fullDescription: property.fullDescription,
          category: property.category,
          type: property.type,
          propertyType: property.propertyType,
          location: property.location,
          state: property.state,
          address: property.address,
          coordinates: property.coordinates,
          embedUrl: property.embedUrl,
          bedrooms: typeof property.bedrooms === 'string' ? parseInt(property.bedrooms) || 0 : property.bedrooms,
          bathrooms: property.bathrooms,
          suites: property.suites,
          parking: property.parking,
          area: property.area,
          balconyTypes: property.balconyTypes as any,
          price: property.price,
          apartmentOptions: property.apartmentOptions as any,
          developer: property.developer,
          deliveryDate: property.deliveryDate,
          availability: property.availability,
          bannerImage: property.bannerImage,
          images: property.images as any,
          photoGallery: property.photoGallery as any,
          floorPlan: property.floorPlan,
          characteristics: property.characteristics as any,
          locationBenefits: property.locationBenefits as any,
          differentials: property.differentials as any,
          status: property.status,
          isFeatured: property.isFeatured,
          isVisible: property.isVisible
        }
      });
      
      console.log(`✅ Propriedade ${newProperty.id} adicionada ao banco`);
      return this.mapPrismaToProperty(newProperty);
    } catch (error) {
      console.error('❌ Erro ao adicionar propriedade:', error);
      throw error;
    }
  }

  // Atualizar propriedade
  static async updateProperty(property: Property): Promise<Property> {
    try {
      const updatedProperty = await prisma.property.update({
        where: { id: property.id },
        data: {
          title: property.title,
          description: property.description,
          fullDescription: property.fullDescription,
          category: property.category,
          type: property.type,
          propertyType: property.propertyType,
          location: property.location,
          state: property.state,
          address: property.address,
          coordinates: property.coordinates,
          embedUrl: property.embedUrl,
          bedrooms: typeof property.bedrooms === 'string' ? parseInt(property.bedrooms) || 0 : property.bedrooms,
          bathrooms: property.bathrooms,
          suites: property.suites,
          parking: property.parking,
          area: property.area,
          balconyTypes: property.balconyTypes as any,
          price: property.price,
          apartmentOptions: property.apartmentOptions as any,
          developer: property.developer,
          deliveryDate: property.deliveryDate,
          availability: property.availability,
          bannerImage: property.bannerImage,
          images: property.images as any,
          photoGallery: property.photoGallery as any,
          floorPlan: property.floorPlan,
          characteristics: property.characteristics as any,
          locationBenefits: property.locationBenefits as any,
          differentials: property.differentials as any,
          status: property.status,
          isFeatured: property.isFeatured,
          isVisible: property.isVisible
        }
      });
      
      console.log(`✅ Propriedade ${property.id} atualizada no banco`);
      return this.mapPrismaToProperty(updatedProperty);
    } catch (error) {
      console.error('❌ Erro ao atualizar propriedade:', error);
      throw error;
    }
  }

  // Excluir propriedade
  static async deleteProperty(id: string): Promise<void> {
    try {
      await prisma.property.delete({
        where: { id }
      });
      console.log(`✅ Propriedade ${id} excluída do banco`);
    } catch (error) {
      console.error('❌ Erro ao excluir propriedade:', error);
      throw error;
    }
  }

  // Adicionar lead
  static async addLead(lead: {
    name: string;
    phone: string;
    email?: string;
    propertyId?: string;
    source?: string;
    notes?: string;
  }): Promise<void> {
    try {
      await prisma.lead.create({
        data: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          propertyId: lead.propertyId,
          source: lead.source || 'website',
          notes: lead.notes
        }
      });
      
      console.log(`✅ Lead adicionado: ${lead.name} - ${lead.phone}`);
    } catch (error) {
      console.error('❌ Erro ao adicionar lead:', error);
      throw error;
    }
  }

  // Carregar leads
  static async loadLeads(): Promise<any[]> {
    try {
      const leads = await prisma.lead.findMany({
        include: {
          property: {
            select: {
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`📊 Carregados ${leads.length} leads do banco`);
      return leads.map((lead: any) => ({
        ...lead,
        property_title: lead.property?.title
      }));
    } catch (error) {
      console.error('❌ Erro ao carregar leads:', error);
      return [];
    }
  }

  // Migrar propriedades de exemplo
  static async migrateSampleProperties(): Promise<void> {
    try {
      const { sampleProperties } = await import('@/data/admin-properties');
      
      console.log(`🔄 Migrando ${sampleProperties.length} propriedades de exemplo...`);
      
      for (const property of sampleProperties) {
        try {
          await this.addProperty(property);
          console.log(`✅ Migrada: ${property.title}`);
        } catch (error) {
          console.error(`❌ Erro ao migrar ${property.title}:`, error);
        }
      }
      
      console.log('🎉 Migração concluída!');
    } catch (error) {
      console.error('❌ Erro durante a migração:', error);
      throw error;
    }
  }

  // Mapear dados do Prisma para interface Property
  private static mapPrismaToProperty(prismaProperty: any): Property {
    return {
      id: prismaProperty.id,
      title: prismaProperty.title,
      description: prismaProperty.description,
      fullDescription: prismaProperty.fullDescription,
      category: prismaProperty.category,
      type: prismaProperty.type,
      propertyType: prismaProperty.propertyType,
      location: prismaProperty.location,
      state: prismaProperty.state,
      address: prismaProperty.address,
      coordinates: prismaProperty.coordinates,
      embedUrl: prismaProperty.embedUrl,
      bedrooms: prismaProperty.bedrooms,
      bathrooms: prismaProperty.bathrooms,
      suites: prismaProperty.suites,
      parking: prismaProperty.parking,
      area: prismaProperty.area,
      balconyTypes: prismaProperty.balconyTypes,
      price: prismaProperty.price,
      apartmentOptions: prismaProperty.apartmentOptions,
      developer: prismaProperty.developer,
      deliveryDate: prismaProperty.deliveryDate,
      availability: prismaProperty.availability,
      bannerImage: prismaProperty.bannerImage,
      images: prismaProperty.images,
      photoGallery: prismaProperty.photoGallery,
      floorPlan: prismaProperty.floorPlan,
      characteristics: prismaProperty.characteristics,
      locationBenefits: prismaProperty.locationBenefits,
      differentials: prismaProperty.differentials,
      status: prismaProperty.status,
      isFeatured: prismaProperty.isFeatured,
      isVisible: prismaProperty.isVisible,
      createdAt: prismaProperty.createdAt,
      updatedAt: prismaProperty.updatedAt
    };
  }
}