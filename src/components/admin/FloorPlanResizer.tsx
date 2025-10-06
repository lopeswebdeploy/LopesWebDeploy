"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Image, RotateCcw, Check, X } from "lucide-react";

interface FloorPlanResizerProps {
  imageUrl: string;
  onConfirm: (resizedImageUrl: string) => void;
  onCancel: () => void;
  targetWidth: number;
  targetHeight: number;
  title: string;
}

const FloorPlanResizer = ({
  imageUrl,
  onConfirm,
  onCancel,
  targetWidth,
  targetHeight,
  title
}: FloorPlanResizerProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.onload = () => {
        setImageDimensions({
          width: imageRef.current!.naturalWidth,
          height: imageRef.current!.naturalHeight
        });
        setImageLoaded(true);
        
        // Calcular escala inicial para caber na área de preview
        const containerWidth = 500;
        const containerHeight = 400;
        const scaleX = containerWidth / imageRef.current!.naturalWidth;
        const scaleY = containerHeight / imageRef.current!.naturalHeight;
        const initialScale = Math.min(scaleX, scaleY, 1);
        setScale(initialScale);
      };
    }
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const generateResizedImage = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas com dimensões finais
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Calcular área de corte
    const sourceWidth = imageRef.current.naturalWidth;
    const sourceHeight = imageRef.current.naturalHeight;
    
    // Calcular posição e tamanho da área de corte
    const scaledWidth = sourceWidth * scale;
    const scaledHeight = sourceHeight * scale;
    
    // Calcular offset para centralizar
    const offsetX = (500 - scaledWidth) / 2 + position.x;
    const offsetY = (400 - scaledHeight) / 2 + position.y;
    
    // Calcular área de corte na imagem original
    const sourceX = Math.max(0, -offsetX / scale);
    const sourceY = Math.max(0, -offsetY / scale);
    const sourceW = Math.min(sourceWidth, (500 - offsetX) / scale);
    const sourceH = Math.min(sourceHeight, (400 - offsetY) / scale);

    // Desenhar imagem redimensionada
    ctx.drawImage(
      imageRef.current,
      sourceX, sourceY, sourceW, sourceH,
      0, 0, targetWidth, targetHeight
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleConfirm = () => {
    const resizedImageUrl = generateResizedImage();
    if (resizedImageUrl) {
      onConfirm(resizedImageUrl);
    }
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Redimensionar {title}
          </CardTitle>
          <p className="text-sm text-gray-600">
            Ajuste a planta baixa para o formato {targetWidth}x{targetHeight}px (proporção 5:4)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controles */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Escala: {Math.round(scale * 100)}%</label>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetPosition}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar
              </Button>
            </div>
          </div>

          {/* Área de Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imagem Original */}
            <div>
              <h3 className="text-sm font-medium mb-2">Planta Original</h3>
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden" style={{ width: 500, height: 400 }}>
                <div
                  className="relative w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Original"
                    className="absolute"
                    style={{
                      width: imageDimensions.width * scale,
                      height: imageDimensions.height * scale,
                      left: (500 - imageDimensions.width * scale) / 2 + position.x,
                      top: (400 - imageDimensions.height * scale) / 2 + position.y,
                      pointerEvents: 'none'
                    }}
                  />
                  
                  {/* Overlay de área de corte */}
                  <div
                    className="absolute border-2 border-green-500 bg-green-500/20"
                    style={{
                      width: targetWidth * (500 / targetWidth),
                      height: targetHeight * (400 / targetHeight),
                      left: (500 - targetWidth * (500 / targetWidth)) / 2,
                      top: (400 - targetHeight * (400 / targetHeight)) / 2,
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Preview Final */}
            <div>
              <h3 className="text-sm font-medium mb-2">Preview Final ({targetWidth}x{targetHeight}px)</h3>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ width: targetWidth, height: targetHeight }}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  style={{ width: targetWidth, height: targetHeight }}
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              <Check className="h-4 w-4 mr-2" />
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloorPlanResizer;

