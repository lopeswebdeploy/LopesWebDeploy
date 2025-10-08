import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    const type = formData.get('type') as string; // 'banner', 'gallery', 'floorplan'

    if (!file || !propertyId) {
      return Response.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Upload para Vercel Blob
    const blob = await put(`properties/${propertyId}/${type}-${file.name}`, file, {
      access: 'public',
    });

    // Atualizar property no banco
    if (type === 'banner') {
      await prisma.property.update({
        where: { id: parseInt(propertyId) },
        data: { bannerImage: blob.url }
      });
    } else if (type === 'gallery') {
      // Adicionar ao array de gallery
      const property = await prisma.property.findUnique({
        where: { id: parseInt(propertyId) }
      });
      
      if (property) {
        const currentGallery = property.galleryImages || [];
        await prisma.property.update({
          where: { id: parseInt(propertyId) },
          data: { galleryImages: [...currentGallery, blob.url] }
        });
      }
    } else if (type === 'floorplan') {
      // Adicionar ao array de floor plans
      const property = await prisma.property.findUnique({
        where: { id: parseInt(propertyId) }
      });
      
      if (property) {
        const currentFloorPlans = property.floorPlans || [];
        await prisma.property.update({
          where: { id: parseInt(propertyId) },
          data: { floorPlans: [...currentFloorPlans, blob.url] }
        });
      }
    }

    return Response.json({ success: true, url: blob.url });

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Erro no upload' }, { status: 500 });
  }
}
