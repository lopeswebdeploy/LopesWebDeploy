import { PrismaClient, User, Property, Image, Lead } from '@prisma/client';
import { Property as PropertyType } from '@/types/property';

const prisma = new PrismaClient();

export class Database {
  // ==================== CONEXÃO ====================
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

  // ==================== USUÁRIOS ====================
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (user) {
        console.log(`👤 Usuário encontrado: ${user.name} (${user.role})`);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    name: string;
    role: 'admin' | 'corretor';
    phone?: string;
    isActive?: boolean;
  }): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          isActive: userData.isActive ?? true
        }
      });
      
      console.log(`✅ Usuário criado: ${user.name} (${user.role})`);
      return user;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return [];
    }
  }

  // ==================== PROPRIEDADES ====================
  static async loadProperties(userId?: string, userRole?: string): Promise<PropertyType[]> {
    try {
      let whereClause: any = { isVisible: true };
      
      // Se for corretor, só pode ver suas próprias propriedades
      if (userRole === 'corretor' && userId) {
        whereClause.authorId = userId;
      }
      // Admin vê todas as propriedades
      
      const properties = await prisma.property.findMany({
        where: whereClause,
        include: {
          images: true,
          author: true,
          _count: {
            select: { leads: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`✅ Carregadas ${properties.length} propriedades do banco`);
      return properties.map(this.mapPrismaToProperty);
    } catch (error) {
      console.error('❌ Erro ao carregar propriedades:', error);
      return [];
    }
  }

  static async getPropertyById(id: string, userId?: string, userRole?: string): Promise<PropertyType | null> {
    try {
      let whereClause: any = { id };
      
      // Se for corretor, só pode ver suas próprias propriedades
      if (userRole === 'corretor' && userId) {
        whereClause.authorId = userId;
      }
      
      const property = await prisma.property.findFirst({
        where: whereClause,
        include: {
          images: true,
          author: true,
          leads: true
        }
      });
      
      if (property) {
        console.log(`✅ Propriedade ${id} encontrada`);
        return this.mapPrismaToProperty(property);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erro ao buscar propriedade:', error);
      return null;
    }
  }

  static async addProperty(property: Omit<PropertyType, 'id'>, authorId: string): Promise<PropertyType> {
    try {
      const newProperty = await prisma.property.create({
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
          characteristics: property.characteristics as any,
          locationBenefits: property.locationBenefits as any,
          differentials: property.differentials as any,
          status: property.status,
          isFeatured: property.isFeatured,
          isVisible: property.isVisible,
          authorId: authorId // Associar ao criador
        }
      });
      
      console.log(`✅ Propriedade ${newProperty.id} criada por usuário ${authorId}`);
      return this.mapPrismaToProperty(newProperty);
    } catch (error) {
      console.error('❌ Erro ao criar propriedade:', error);
      throw error;
    }
  }

  static async updateProperty(property: PropertyType, userId: string, userRole: string): Promise<PropertyType> {
    try {
      // Verificar permissões
      const existingProperty = await prisma.property.findUnique({
        where: { id: property.id }
      });

      if (!existingProperty) {
        throw new Error('Propriedade não encontrada');
      }

      // Corretor só pode editar suas próprias propriedades
      if (userRole === 'corretor' && existingProperty.authorId !== userId) {
        throw new Error('Sem permissão para editar esta propriedade');
      }

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
          characteristics: property.characteristics as any,
          locationBenefits: property.locationBenefits as any,
          differentials: property.differentials as any,
          status: property.status,
          isFeatured: property.isFeatured,
          isVisible: property.isVisible,
          updatedAt: new Date()
        },
        include: {
          images: true,
          author: true
        }
      });
      
      console.log(`✅ Propriedade ${property.id} atualizada`);
      return this.mapPrismaToProperty(updatedProperty);
    } catch (error) {
      console.error('❌ Erro ao atualizar propriedade:', error);
      throw error;
    }
  }

  static async deleteProperty(id: string, userId: string, userRole: string): Promise<boolean> {
    try {
      // Verificar permissões
      const property = await prisma.property.findUnique({
        where: { id }
      });

      if (!property) {
        throw new Error('Propriedade não encontrada');
      }

      // Corretor só pode deletar suas próprias propriedades
      if (userRole === 'corretor' && property.authorId !== userId) {
        throw new Error('Sem permissão para deletar esta propriedade');
      }

      // Deletar imagens relacionadas primeiro
      await prisma.image.deleteMany({
        where: { propertyId: id }
      });

      // Deletar propriedade
      await prisma.property.delete({
        where: { id }
      });
      
      console.log(`✅ Propriedade ${id} deletada`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar propriedade:', error);
      throw error;
    }
  }

  // ==================== IMAGENS ====================
  static async addImage(imageData: {
    url: string;
    type: string;
    propertyId: string;
    apartmentId?: string;
  }): Promise<Image> {
    try {
      const image = await prisma.image.create({
        data: {
          url: imageData.url,
          type: imageData.type,
          propertyId: imageData.propertyId
        }
      });
      
      console.log(`✅ Imagem ${image.id} adicionada à propriedade ${imageData.propertyId}`);
      return image;
    } catch (error) {
      console.error('❌ Erro ao adicionar imagem:', error);
      throw error;
    }
  }

  static async getPropertyImages(propertyId: string): Promise<Image[]> {
    try {
      return await prisma.image.findMany({
        where: { propertyId },
        orderBy: { createdAt: 'asc' }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar imagens:', error);
      return [];
    }
  }

  static async deleteImage(imageId: string): Promise<boolean> {
    try {
      await prisma.image.delete({
        where: { id: imageId }
      });
      
      console.log(`✅ Imagem ${imageId} deletada`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar imagem:', error);
      throw error;
    }
  }

  // ==================== LEADS ====================
  static async addLead(leadData: {
    name: string;
    phone: string;
    email?: string;
    propertyId?: string;
    ownerId?: string;
    source?: string;
    notes?: string;
  }): Promise<Lead> {
    try {
      const lead = await prisma.lead.create({
        data: {
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          propertyId: leadData.propertyId,
          ownerId: leadData.ownerId,
          source: leadData.source || 'website',
          notes: leadData.notes
        }
      });
      
      console.log(`✅ Lead ${lead.id} criado`);
      return lead;
    } catch (error) {
      console.error('❌ Erro ao criar lead:', error);
      throw error;
    }
  }

  static async getLeads(userId?: string, userRole?: string): Promise<Lead[]> {
    try {
      let whereClause: any = {};
      
      // Se for corretor, só pode ver seus próprios leads
      if (userRole === 'corretor' && userId) {
        whereClause.ownerId = userId;
      }
      
      return await prisma.lead.findMany({
        where: whereClause,
        include: {
          property: true,
          owner: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar leads:', error);
      return [];
    }
  }

  // ==================== UTILITÁRIOS ====================
  private static mapPrismaToProperty(prismaProperty: any): PropertyType {
    // Separar imagens por tipo
    const images = prismaProperty.images || [];
    const galleryImages = images.filter((img: any) => img.type === 'gallery').map((img: any) => img.url);
    const bannerImage = images.find((img: any) => img.type === 'banner')?.url;
    const floorPlan = images.find((img: any) => img.type === 'floorplan')?.url;
    
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
      images: images.map((img: any) => img.url), // Todas as imagens
      photoGallery: galleryImages, // Apenas galeria
      characteristics: prismaProperty.characteristics,
      locationBenefits: prismaProperty.locationBenefits,
      differentials: prismaProperty.differentials,
      status: prismaProperty.status,
      isFeatured: prismaProperty.isFeatured,
      isVisible: prismaProperty.isVisible,
      ownerId: prismaProperty.authorId, // Mapear authorId para ownerId
      createdAt: prismaProperty.createdAt,
      updatedAt: prismaProperty.updatedAt
    };
  }

  // ==================== ESTATÍSTICAS ====================
  static async getStats(userId?: string, userRole?: string): Promise<{
    totalProperties: number;
    visibleProperties: number;
    featuredProperties: number;
    totalLeads: number;
    totalImages: number;
  }> {
    try {
      let propertyWhere: any = {};
      let leadWhere: any = {};
      
      if (userRole === 'corretor' && userId) {
        propertyWhere.authorId = userId;
        leadWhere.ownerId = userId;
      }
      
      const [totalProperties, visibleProperties, featuredProperties, totalLeads, totalImages] = await Promise.all([
        prisma.property.count({ where: propertyWhere }),
        prisma.property.count({ where: { ...propertyWhere, isVisible: true } }),
        prisma.property.count({ where: { ...propertyWhere, isFeatured: true } }),
        prisma.lead.count({ where: leadWhere }),
        prisma.image.count({ where: propertyWhere })
      ]);
      
      return {
        totalProperties,
        visibleProperties,
        featuredProperties,
        totalLeads,
        totalImages
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return {
        totalProperties: 0,
        visibleProperties: 0,
        featuredProperties: 0,
        totalLeads: 0,
        totalImages: 0
      };
    }
  }
}