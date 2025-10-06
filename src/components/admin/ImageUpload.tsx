"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Upload, X, Eye, Trash2 } from "lucide-react";
import { ImageStorage } from "@/services/imageStorage";

interface ImageUploadProps {
  label: string;
  description?: string;
  onImageChange: (imageUrl: string) => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // em MB
  type?: 'general' | 'floorplan'; // Tipo de redimensionamento
}

const ImageUpload = ({ 
  label, 
  description, 
  onImageChange, 
  currentImage,
  accept = "image/*",
  maxSize = 5,
  type = 'general'
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFile = (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (aumentado para 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 20MB.');
      return;
    }

    // Upload via API Route
    setIsUploading(true);
    const propertyId = 'temp-' + Date.now().toString(); // ID temporário até salvar a propriedade
    const uploadType = type === 'floorplan' ? 'floorplan' : 'banner';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    formData.append('type', uploadType);
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        console.log('📤 Response status:', response.status);
        console.log('📤 Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      })
      .then(data => {
        console.log('📤 Response data:', data);
        if (data.url) {
          console.log(`🖼️ ImageUpload - Imagem ${type} enviada para Vercel Blob:`, data.url);
          setPreview(data.url);
          onImageChange(data.url);
        } else {
          throw new Error(data.error || 'Erro no upload');
        }
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("❌ Erro ao fazer upload:", error);
        alert(`Erro ao fazer upload da imagem: ${error.message}`);
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
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
          {type === 'floorplan' ? (
            <>
              <p><strong>📐 Resolução Recomendada:</strong> 1000x800px (formato 5:4)</p>
              <p><strong>💡 Dica:</strong> Plantas baixas já vêm prontas e padronizadas - qualquer resolução será aceita!</p>
            </>
          ) : (
            <>
              <p><strong>📐 Resolução Recomendada:</strong> 1200x800px ou superior</p>
              <p><strong>💡 Dica:</strong> Imagens já vêm prontas e padronizadas - qualquer resolução será aceita!</p>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(preview, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={handleClick}>
                <Upload className="h-4 w-4 mr-2" />
                Alterar Imagem
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragActive
                ? "border-brand-coral bg-brand-coral/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-coral mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Enviando...</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Clique ou arraste uma imagem aqui
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF até {maxSize}MB
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Formatos aceitos: PNG, JPG, GIF</p>
          <p>• Tamanho máximo: 20MB</p>
          <p>• Qualidade original mantida - sem redimensionamento</p>
        </div>
      </CardContent>
    </Card>
    
    {/* Redimensionador removido - imagens já vêm prontas */}
  </>
  );
};

export default ImageUpload;

