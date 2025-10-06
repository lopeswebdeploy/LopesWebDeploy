/**
 * Utilitários para processamento de imagens
 */

// Função para processar imagem sem redimensionamento - mantém qualidade original
export const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log("🔧 processImage - Processando imagem:", file.name, file.size, "bytes");
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      console.log("🔧 processImage - Imagem processada:", imageUrl.length, "caracteres");
      resolve(imageUrl);
    };

    reader.onerror = (error) => {
      console.error("❌ processImage - Erro ao processar imagem:", error);
      reject(new Error('Erro ao processar imagem'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Função para processar banner (mantém qualidade original)
export const processBanner = (file: File): Promise<string> => {
  return processImage(file); // Banner: mantém resolução original
};

// Função para processar galeria (mantém qualidade original)
export const processGallery = (file: File): Promise<string> => {
  console.log("🔧 processGallery - Processando galeria:", file.name);
  return processImage(file); // Galeria: mantém resolução original
};

// Função para processar planta baixa (mantém qualidade original)
export const processFloorPlan = (file: File): Promise<string> => {
  return processImage(file); // Planta: mantém resolução original
};

// Funções de recorte removidas - imagens já vêm prontas e padronizadas
