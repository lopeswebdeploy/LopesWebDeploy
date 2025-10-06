import { put } from '@vercel/blob';

export class ImageStorage {
  static async uploadPropertyImage(
    file: File, 
    propertyId: string, 
    type: 'banner' | 'gallery' | 'floorplan'
  ): Promise<string> {
    const filename = `properties/${propertyId}/${type}-${Date.now()}.jpg`;
    
    const blob = await put(filename, file, {
      access: 'public',
      contentType: 'image/jpeg'
    });
    
    return blob.url; // https://blob.vercel-storage.com/...
  }
  
  // Upload múltiplo para galeria
  static async uploadGallery(files: File[], propertyId: string): Promise<string[]> {
    const uploads = files.map(file => 
      this.uploadPropertyImage(file, propertyId, 'gallery')
    );
    
    return Promise.all(uploads);
  }
}
