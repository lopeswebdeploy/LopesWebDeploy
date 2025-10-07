import { put, del } from '@vercel/blob';

export class ImageReorganizer {
  // Reorganizar imagens de temp para ID real
  static async reorganizeImages(
    tempUrls: string[], 
    realPropertyId: string
  ): Promise<string[]> {
    console.log('🔄 ImageReorganizer - Reorganizando imagens...');
    console.log('  URLs temporárias:', tempUrls.length);
    console.log('  ID real:', realPropertyId);
    
    const reorganizedUrls: string[] = [];
    
    for (const tempUrl of tempUrls) {
      try {
        // Extrair informações da URL temporária
        const urlParts = tempUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const type = this.extractTypeFromFilename(filename);
        
        // Criar nova URL com ID real
        const newFilename = `properties/${realPropertyId}/${type}-${Date.now()}.jpg`;
        
        // Fazer download da imagem temporária
        const response = await fetch(tempUrl);
        if (!response.ok) {
          console.warn('⚠️ Não foi possível baixar imagem temporária:', tempUrl);
          continue;
        }
        
        const blob = await response.blob();
        
        // Upload para nova localização
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
          throw new Error('BLOB_READ_WRITE_TOKEN não configurado');
        }
        
        const newBlob = await put(newFilename, blob, {
          access: 'public',
          contentType: 'image/jpeg',
          token: token
        });
        
        reorganizedUrls.push(newBlob.url);
        console.log('✅ Imagem reorganizada:', tempUrl, '→', newBlob.url);
        
        // Deletar imagem temporária (opcional)
        try {
          await del(tempUrl, { token });
          console.log('🗑️ Imagem temporária deletada:', tempUrl);
        } catch (deleteError) {
          console.warn('⚠️ Não foi possível deletar imagem temporária:', deleteError);
        }
        
      } catch (error) {
        console.error('❌ Erro ao reorganizar imagem:', tempUrl, error);
        // Manter URL original em caso de erro
        reorganizedUrls.push(tempUrl);
      }
    }
    
    console.log('🎉 Reorganização concluída:', reorganizedUrls.length, 'imagens');
    return reorganizedUrls;
  }
  
  // Extrair tipo da imagem do filename
  private static extractTypeFromFilename(filename: string): string {
    if (filename.includes('banner')) return 'banner';
    if (filename.includes('floorplan')) return 'floorplan';
    if (filename.includes('gallery')) return 'gallery';
    return 'gallery'; // default
  }
  
  // Reorganizar uma única imagem
  static async reorganizeSingleImage(
    tempUrl: string, 
    realPropertyId: string, 
    type: 'banner' | 'gallery' | 'floorplan'
  ): Promise<string> {
    try {
      const newFilename = `properties/${realPropertyId}/${type}-${Date.now()}.jpg`;
      
      // Fazer download da imagem temporária
      const response = await fetch(tempUrl);
      if (!response.ok) {
        throw new Error(`Erro ao baixar imagem: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Upload para nova localização
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        throw new Error('BLOB_READ_WRITE_TOKEN não configurado');
      }
      
      const newBlob = await put(newFilename, blob, {
        access: 'public',
        contentType: 'image/jpeg',
        token: token
      });
      
      console.log('✅ Imagem reorganizada:', tempUrl, '→', newBlob.url);
      
      // Deletar imagem temporária
      try {
        await del(tempUrl, { token });
        console.log('🗑️ Imagem temporária deletada:', tempUrl);
      } catch (deleteError) {
        console.warn('⚠️ Não foi possível deletar imagem temporária:', deleteError);
      }
      
      return newBlob.url;
    } catch (error) {
      console.error('❌ Erro ao reorganizar imagem:', error);
      return tempUrl; // Retornar URL original em caso de erro
    }
  }
}
