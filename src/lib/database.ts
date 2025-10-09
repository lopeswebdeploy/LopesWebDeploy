import { PrismaClient, User, Property, Lead } from '@prisma/client';
import { Property as PropertyType } from '@/types/property';

const prisma = new PrismaClient();

export class Database {
  // ==================== USUÁRIOS ====================
  static async createUser(userData: {
    email: string;
    name: string;
    role: 'admin' | 'corretor';
    password?: string;
    active?: boolean;
  }): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: userData.password || 'temp123',
          active: userData.active ?? true
        }
      });
      
      console.log(`✅ Usuário criado: ${user.name} (${user.role})`);
      return user;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      return null;
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
  static async createProperty(property: PropertyType, authorId: number): Promise<Property> {
    try {
      const newProperty = await prisma.property.create({
        data: {
          title: property.title,
          description: property.description,
          price: property.price,
          status: property.status,
          featured: property.featured,
          authorId: authorId,
          bannerImage: property.bannerImage,
          galleryImages: property.galleryImages || [],
          floorPlans: property.floorPlans || []
        }
      });
      
      console.log(`✅ Propriedade criada: ${newProperty.title}`);
      return newProperty;
    } catch (error) {
      console.error('❌ Erro ao criar propriedade:', error);
      throw error;
    }
  }

  static async getPropertyById(id: number): Promise<Property | null> {
    try {
      return await prisma.property.findUnique({
        where: { id },
        include: {
          author: true
        }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar propriedade:', error);
      return null;
    }
  }

  static async getAllProperties(userId?: number, userRole?: string): Promise<Property[]> {
    try {
      let whereClause: any = {};
      
      if (userRole === 'corretor' && userId) {
        whereClause.authorId = userId;
      }
      
      return await prisma.property.findMany({
        where: whereClause,
        include: {
          author: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar propriedades:', error);
      return [];
    }
  }

  static async updateProperty(id: number, property: Partial<PropertyType>): Promise<Property | null> {
    try {
      const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
          title: property.title,
          description: property.description,
          price: property.price,
          status: property.status,
          featured: property.featured,
          bannerImage: property.bannerImage,
          galleryImages: property.galleryImages,
          floorPlans: property.floorPlans,
          updatedAt: new Date()
        },
        include: {
          author: true
        }
      });
      
      console.log(`✅ Propriedade atualizada: ${updatedProperty.title}`);
      return updatedProperty;
    } catch (error) {
      console.error('❌ Erro ao atualizar propriedade:', error);
      return null;
    }
  }

  static async deleteProperty(id: number): Promise<boolean> {
    try {
      await prisma.property.delete({
        where: { id }
      });
      
      console.log(`✅ Propriedade ${id} deletada`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar propriedade:', error);
      return false;
    }
  }

  // ==================== LEADS ====================
  static async createLead(leadData: {
    name: string;
    phone: string;
    email?: string;
    propertyId: number;
    ownerId: number;
    status?: string;
  }): Promise<Lead> {
    try {
      const lead = await prisma.lead.create({
        data: {
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          status: leadData.status || 'new',
          propertyId: leadData.propertyId,
          ownerId: leadData.ownerId
        }
      });
      
      console.log(`✅ Lead criado: ${lead.name}`);
      return lead;
    } catch (error) {
      console.error('❌ Erro ao criar lead:', error);
      throw error;
    }
  }

  static async getAllLeads(userId?: number, userRole?: string): Promise<Lead[]> {
    try {
      let whereClause: any = {};
      
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

  // ==================== ESTATÍSTICAS ====================
  static async getStats(userId?: number, userRole?: string): Promise<{
    totalProperties: number;
    visibleProperties: number;
    featuredProperties: number;
    totalLeads: number;
  }> {
    try {
      let propertyWhere: any = {};
      let leadWhere: any = {};
      
      if (userRole === 'corretor' && userId) {
        propertyWhere.authorId = userId;
        leadWhere.ownerId = userId;
      }
      
      const [totalProperties, visibleProperties, featuredProperties, totalLeads] = await Promise.all([
        prisma.property.count({ where: propertyWhere }),
        prisma.property.count({ where: { ...propertyWhere, status: 'published' } }),
        prisma.property.count({ where: { ...propertyWhere, featured: true } }),
        prisma.lead.count({ where: leadWhere }),
      ]);
      
      return {
        totalProperties,
        visibleProperties,
        featuredProperties,
        totalLeads
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return {
        totalProperties: 0,
        visibleProperties: 0,
        featuredProperties: 0,
        totalLeads: 0
      };
    }
  }
}

export default prisma;