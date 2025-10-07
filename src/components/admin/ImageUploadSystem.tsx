'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Eye, 
  Trash2, 
  Image as ImageIcon,
  Download,
  RotateCcw,
  Maximize2
} from "lucide-react";
import { ImageType, ImageUploadConfig, IMAGE_CONFIGS } from '@/types/image';
import { ImageProcessor } from '@/services/imageProcessor';

interface ImageUploadSystemProps {
  propertyId: string;
  type: ImageType;
  label: string;
  description?: string;
  currentImage?: string;
  onImageChange?: (url: string) => void; // Opcional para galeria
  onImageRemove?: () => void;
  apartmentId?: string; // Para plantas específicas de apartamentos
  multiple?: boolean; // Para galeria
  maxImages?: number; // Para galeria
  onImagesChange?: (urls: string[]) => void; // Para galeria
  currentImages?: string[]; // Para galeria
}

export function ImageUploadSystem({ 
  propertyId, 
  type, 
  label, 
  description, 
  currentImage, 
  onImageChange, 
  onImageRemove,
  apartmentId,
  multiple = false,
  maxImages = 10,
  onImagesChange,
  currentImages = []
}: ImageUploadSystemProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const config = IMAGE_CONFIGS[type];

  const handleUpload = async (files: FileList) => {
    if (!files || !propertyId) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Validar arquivo
        const validation = ImageProcessor.validateImage(file, type);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Processar imagem (otimizar)
        const processedFile = await ImageProcessor.processImage(file, type);
        
        // Gerar nome do arquivo
        const filename = ImageProcessor.generateFilename(propertyId, type, apartmentId);
        
        // Upload para Vercel Blob
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('type', type);
        if (apartmentId) {
          formData.append('apartmentId', apartmentId);
        }

        const response = await fetch(`/api/properties/${propertyId}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        
        // Atualizar progresso
        setUploadProgress(((index + 1) / files.length) * 100);
        
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (multiple && onImagesChange) {
        // Galeria - adicionar às imagens existentes
        onImagesChange([...currentImages, ...uploadedUrls]);
      } else if (onImageChange) {
        // Imagem única - usar a primeira
        onImageChange(uploadedUrls[0]);
      }
      
      console.log('✅ Upload concluído:', uploadedUrls);
      
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      alert(`Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleRemove = (index?: number) => {
    if (multiple && typeof index === 'number' && onImagesChange) {
      // Remover imagem específica da galeria
      const newImages = currentImages.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } else if (onImageRemove) {
      // Remover imagem única
      onImageRemove();
    } else if (onImageChange) {
      // Fallback
      onImageChange('');
    }
  };

  const renderImagePreview = (url: string, index?: number) => (
    <div key={index || 0} className="relative group">
      <img
        src={url}
        alt={`${label} ${index !== undefined ? index + 1 : ''}`}
        className="w-full h-48 object-cover rounded-lg border"
      />
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(url, '_blank')}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {url.split('/').pop()}
      </div>
    </div>
  );

  const renderUploadArea = () => (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Processando imagens...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">{Math.round(uploadProgress)}% concluído</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Upload className="h-16 w-16 text-gray-400 mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-600">
              {multiple ? 'Arraste múltiplas imagens aqui' : 'Arraste uma imagem aqui'}
            </p>
            <p className="text-sm text-gray-500">
              ou clique para selecionar
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="outline">{config.format.toUpperCase()}</Badge>
              <Badge variant="outline">Máx {config.maxSize}MB</Badge>
              {config.maxWidth && (
                <Badge variant="outline">{config.maxWidth}x{config.maxHeight}</Badge>
              )}
              {config.aspectRatio && (
                <Badge variant="outline">
                  {config.aspectRatio.width}:{config.aspectRatio.height}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {label}
          {multiple && (
            <Badge variant="secondary">
              {currentImages.length}/{maxImages}
            </Badge>
          )}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {(!currentImage && currentImages.length === 0) && renderUploadArea()}
        
        {/* Imagem única */}
        {currentImage && !multiple && renderImagePreview(currentImage)}
        
        {/* Galeria de imagens */}
        {multiple && currentImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentImages.map((url, index) => renderImagePreview(url, index))}
          </div>
        )}
        
        {/* Controles */}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileInput}
            disabled={uploading || !propertyId}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !propertyId}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {multiple ? 'Adicionar Imagens' : 'Selecionar Imagem'}
          </Button>
          
          {!propertyId && (
            <p className="text-red-500 text-sm flex items-center">
              Salve a propriedade primeiro
            </p>
          )}
        </div>
        
        {/* Informações técnicas */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Formato: {config.format.toUpperCase()}</p>
          <p>• Tamanho máximo: {config.maxSize}MB</p>
          <p>• Qualidade: {config.quality}%</p>
          {config.aspectRatio && (
            <p>• Proporção: {config.aspectRatio.width}:{config.aspectRatio.height}</p>
          )}
          <p>• Otimização automática aplicada</p>
        </div>
      </CardContent>
    </Card>
  );
}
