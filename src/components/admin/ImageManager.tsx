"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Eye, Trash2, Image as ImageIcon, Move, Upload } from "lucide-react";
import { ImageStorage } from "@/services/imageStorage";

interface ImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  title: string;
  description?: string;
  maxImages?: number;
}

const ImageManager = ({
  images,
  onImagesChange,
  title,
  description,
  maxImages = 10
}: ImageManagerProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  console.log("📸 ImageManager - Renderizando com", images.length, "imagens");

  const addImageByUrl = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...images, newImageUrl.trim()];
      console.log("📸 ImageManager - Adicionando imagem:", newImageUrl.trim());
      console.log("📸 Array atualizado:", updatedImages);
      onImagesChange(updatedImages);
      setNewImageUrl("");
    }
  };

  const handleFile = (file: File) => {
    console.log("📸 ImageManager - Arquivo selecionado:", file);

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      console.log("📸 ImageManager - Tipo de arquivo inválido:", file.type);
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (20MB)
    if (file.size > 20 * 1024 * 1024) {
      console.log("📸 ImageManager - Arquivo muito grande:", file.size);
      alert('O arquivo deve ter no máximo 20MB.');
      return;
    }

    // Upload via API Route
    setIsUploading(true);
    const propertyId = 'temp-' + Date.now().toString(); // ID temporário até salvar a propriedade
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    formData.append('type', 'gallery');
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          console.log("📸 ImageManager - Imagem enviada para Vercel Blob:", data.url);
          const updatedImages = [...images, data.url];
          onImagesChange(updatedImages);
        } else {
          throw new Error(data.error || 'Erro no upload');
        }
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
    // Limpar input
    e.target.value = '';
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Funções de redimensionamento removidas - imagens já vêm prontas

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [removed] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, removed);
    onImagesChange(updatedImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          <p><strong>📐 Resolução Recomendada:</strong> 800x800px (formato quadrado)</p>
          <p><strong>💡 Dica:</strong> Imagens da galeria já vêm prontas e padronizadas - qualquer resolução será aceita!</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar nova imagem */}
        {canAddMore && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {/* Área de upload - Quadradinho clicável */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer ${
                dragActive
                  ? "border-brand-coral bg-brand-coral/5"
                  : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto"></div>
                  <p className="text-gray-600">Processando imagem...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Clique para adicionar foto
                    </p>
                    <p className="text-sm text-gray-500">
                      ou arraste e solte uma imagem aqui
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Formato recomendado: quadrado (800x800px) • Máximo: 20MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid de imagens */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(image, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Indicador de ordem */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>

                  {/* Controles de ordenação */}
                  {images.length > 1 && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveImage(index, index - 1)}
                          className="h-6 w-6 p-0"
                        >
                          ←
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveImage(index, index + 1)}
                          className="h-6 w-6 p-0"
                        >
                          →
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informações */}
        <div className="text-xs text-gray-500">
          <p>• Total: {images.length}/{maxImages} imagens</p>
          <p>• Qualidade original mantida - sem redimensionamento</p>
          <p>• A primeira imagem será usada como principal</p>
          {images.length > 1 && <p>• Use as setas para reordenar as imagens</p>}
        </div>
      </CardContent>
    </Card>
    
    {/* Redimensionador removido - imagens já vêm prontas */}
  </>
  );
};

export default ImageManager;
