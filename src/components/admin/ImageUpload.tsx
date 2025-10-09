'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  type: 'banner' | 'gallery' | 'floorplan';
  maxImages?: number;
  title: string;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  type, 
  maxImages = 10, 
  title 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          throw new Error('Apenas arquivos de imagem são permitidos');
        }

        // Validar tamanho (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Arquivo muito grande. Máximo 5MB');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erro ao fazer upload');
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Adicionar novas imagens às existentes
      const newImages = [...images, ...uploadedUrls];
      
      // Limitar número máximo de imagens
      if (newImages.length > maxImages) {
        onImagesChange(newImages.slice(0, maxImages));
        alert(`Máximo de ${maxImages} imagens permitidas`);
      } else {
        onImagesChange(newImages);
      }
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openFileDialog}
          disabled={isUploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Enviando...' : 'Adicionar Imagens'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={type !== 'banner'}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Preview das imagens */}
      {images.length > 0 ? (
        <div className={`grid gap-4 ${
          type === 'banner' ? 'grid-cols-1' : 
          type === 'floorplan' ? 'grid-cols-2' : 
          'grid-cols-3'
        }`}>
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Botão de remover */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Informações da imagem */}
                <div className="mt-2 text-xs text-gray-500 truncate">
                  {imageUrl.split('/').pop()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-4">
              {type === 'banner' && 'Nenhuma imagem de banner selecionada'}
              {type === 'gallery' && 'Nenhuma imagem da galeria adicionada'}
              {type === 'floorplan' && 'Nenhuma planta baixa adicionada'}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <FileImage className="h-4 w-4" />
              Selecionar Imagens
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre limites */}
      <div className="text-sm text-gray-500">
        {type === 'banner' && 'Imagem principal do imóvel (recomendado: 1200x800px)'}
        {type === 'gallery' && `Galeria de fotos (máximo ${maxImages} imagens)`}
        {type === 'floorplan' && 'Plantas baixas (obrigatório para apartamentos com múltiplas unidades)'}
      </div>
    </div>
  );
}
