"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Upload, X, Eye, Trash2 } from "lucide-react";
import { ImageStorage } from "@/services/imageStorage";

interface BannerUploadProps {
  label: string;
  description?: string;
  onImageChange: (imageUrl: string) => void;
  currentImage?: string;
  maxSize?: number; // em MB
}

const BannerUpload = ({
  label,
  description,
  onImageChange,
  currentImage,
  maxSize = 10
}: BannerUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (aumentado para 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 20MB.');
      return;
    }

    // Upload para Vercel Blob Storage
    setIsUploading(true);
    const propertyId = Date.now().toString();
    
    ImageStorage.uploadPropertyImage(file, propertyId, 'banner')
      .then((imageUrl) => {
        console.log("🖼️ BannerUpload - Imagem enviada para Vercel Blob:", imageUrl);
        setPreview(imageUrl);
        onImageChange(imageUrl);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("❌ Erro ao fazer upload:", error);
        alert('Erro ao fazer upload da imagem. Tente novamente.');
        setIsUploading(false);
      });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Funções de redimensionamento removidas - imagens já vêm prontas

  const handleRemove = () => {
    setPreview(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {label}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          <p><strong>📐 Resolução Recomendada:</strong> 1200x600px (formato 2:1)</p>
          <p><strong>💡 Dica:</strong> Imagens já vêm prontas e padronizadas - qualquer resolução será aceita!</p>
        </div>
      </CardHeader>
      <CardContent>
        {preview ? (
          <div className="space-y-4">
            {/* Preview da imagem */}
            <div className="relative">
              <div className="relative aspect-[2/1] rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Botões de ação */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(preview, '_blank')}
                  className="bg-white/90 hover:bg-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="bg-red-500/90 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Área de upload */
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto"></div>
                <p className="text-gray-600">Processando banner...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Clique para fazer upload do banner
                  </p>
                  <p className="text-sm text-gray-500">
                    ou arraste e solte uma imagem aqui
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Formato recomendado: 2:1 (1200x600px) • Máximo: {maxSize}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BannerUpload;
