"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Plus, 
  Eye, 
  MapPin, 
  Building, 
  Car, 
  Ruler,
  Upload,
  Trash2,
  Check,
  Home,
  DollarSign,
  Building2,
  LayoutGrid,
  Image,
  ListChecks
} from "lucide-react";
import { Property, ApartmentOption } from "@/types/property";
import PropertyPreview from "./PropertyPreview";
import PropertyTypeSelector from "./PropertyTypeSelector";
import ImageUpload from "./ImageUpload";
import ImageManager from "./ImageManager";
import BannerUpload from "./BannerUpload";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (property: Property) => void;
  onCancel: () => void;
}

const PropertyFormNew = ({ property, onSubmit, onCancel }: PropertyFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<{
    propertyType: 'apartamento' | 'casa' | 'cobertura' | 'loft';
    category: 'venda' | 'investimento' | 'aluguel';
    context: 'urbano' | 'praia' | 'campo' | 'montanha';
  }>({
    propertyType: 'apartamento',
    category: 'venda',
    context: 'urbano'
  });

  const [formData, setFormData] = useState<Partial<Property>>({
    images: [],
    price: "",
    title: "",
    description: "",
    location: "",
    state: "Goiânia",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    area: "",
    category: "venda",
    type: "Premium",
    status: "ativo",
    propertyType: "apartamento",
    developer: "",
    deliveryDate: "",
    fullDescription: "",
    address: "",
    suites: 0,
    characteristics: [],
    locationBenefits: [],
    differentials: [],
    balconyTypes: [],
    apartmentOptions: [],
    coordinates: { lat: -16.6869, lng: -49.2648 },
    bannerImage: "",
    floorPlan: "",
    photoGallery: []
  });

  const [newCharacteristic, setNewCharacteristic] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newDifferential, setNewDifferential] = useState("");
  const [newBalconyType, setNewBalconyType] = useState("");

  useEffect(() => {
    if (property) {
      // Garantir compatibilidade entre images e photoGallery
      const galleryImages = property.photoGallery || property.images || [];
      
      setFormData({
        ...property,
        photoGallery: galleryImages,
        images: galleryImages, // Sincronizar ambos os campos
      });
      
      setSelectedType({
        propertyType: property.propertyType || 'apartamento',
        category: property.category || 'venda',
        context: 'urbano' // Default context
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: any) => {
    console.log("🔧 PropertyFormNew - handleInputChange:", field, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log("🔧 PropertyFormNew - Novo estado:", newData);
      return newData;
    });
  };

  const handleTypeSelect = (type: any) => {
    setSelectedType(type);
    setFormData(prev => ({
      ...prev,
      propertyType: type.propertyType,
      category: type.category
    }));
  };

  // Função para lidar com mudanças no iframe
  const handleIframeChange = (iframeHtml: string) => {
    setFormData(prev => ({
      ...prev,
      embedUrl: iframeHtml
    }));
  };

  const addItem = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentItems = formData[field as keyof Property] as string[] || [];
      handleInputChange(field, [...currentItems, value.trim()]);
      setter("");
    }
  };

  const removeItem = (field: string, index: number) => {
    const currentItems = formData[field as keyof Property] as string[] || [];
    handleInputChange(field, currentItems.filter((_, i) => i !== index));
  };

  const addApartmentOption = () => {
    const newOption: ApartmentOption = {
      id: Date.now().toString(),
      bedrooms: 2,
      bathrooms: 2,
      suites: 1,
      parking: 1,
      area: "",
      price: "",
      floor: 1,
      available: true,
      features: [],
      unitType: "",
      description: "",
      floorPlan: ""
    };
    handleInputChange("apartmentOptions", [...(formData.apartmentOptions || []), newOption]);
  };

  const removeApartmentOption = (index: number) => {
    const options = formData.apartmentOptions || [];
    handleInputChange("apartmentOptions", options.filter((_, i) => i !== index));
  };

  const handleApartmentOptionChange = (index: number, field: string, value: any) => {
    const options = [...(formData.apartmentOptions || [])];
    options[index] = { ...options[index], [field]: value };
    
    // Debug: log das mudanças
    console.log(`🔧 Alterando apartamento ${index}, campo: ${field}, valor:`, value);
    console.log('📋 Opção atualizada:', options[index]);
    
    handleInputChange("apartmentOptions", options);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Só validar se estivermos no último passo
    if (currentStep !== 4) {
      return;
    }
    
    // Debug: mostrar dados atuais
    console.log("📝 Dados do formulário:", formData);
    console.log("🏠 Opções de apartamentos:", formData.apartmentOptions);
    console.log("🖼️ Banner:", formData.bannerImage);
    console.log("📸 Galeria:", formData.photoGallery);
    console.log("📸 Images:", formData.images);
    console.log("📐 Planta:", formData.floorPlan);
    
    if (!formData.title || !formData.price || !formData.location || !formData.embedUrl) {
      console.log("❌ Validação falhou:");
      console.log("  - Título:", formData.title || 'VAZIO');
      console.log("  - Preço:", formData.price || 'VAZIO');
      console.log("  - Localização:", formData.location || 'VAZIO');
      console.log("  - HTML do Mapa:", formData.embedUrl || 'VAZIO');
      
      alert(`Por favor, preencha os campos obrigatórios:
      - Título: ${formData.title ? '✓' : '✗'} (${formData.title || 'vazio'})
      - Preço: ${formData.price ? '✓' : '✗'} (${formData.price || 'vazio'})
      - Localização: ${formData.location ? '✓' : '✗'} (${formData.location || 'vazio'})
      - HTML do Mapa: ${formData.embedUrl ? '✓' : '✗'} (${formData.embedUrl ? 'preenchido' : 'vazio'})`);
      return;
    }

    // Organizando as imagens corretamente
    const photoGallery = formData.photoGallery || [];
    const images = photoGallery.length > 0 ? photoGallery : (formData.images || []);
    
    // Debug detalhado antes de salvar
    console.log("🔧 Processando imagens para salvar:");
    console.log("  photoGallery:", photoGallery);
    console.log("  images processadas:", images);
    console.log("  bannerImage:", formData.bannerImage);
    console.log("  floorPlan:", formData.floorPlan);
    
    const propertyData: Property = {
      ...formData,
      // Sistema de imagens organizado
      images: images, // Array principal de imagens para galeria
      photoGallery: photoGallery, // Backup/compatibilidade 
      bannerImage: formData.bannerImage || images[0] || "", // Banner principal ou primeira da galeria
      floorPlan: formData.floorPlan || "", // Planta baixa geral
      
      // Outros campos obrigatórios
      characteristics: formData.characteristics || [],
      locationBenefits: formData.locationBenefits || [],
      differentials: formData.differentials || [],
      balconyTypes: formData.balconyTypes || [],
      apartmentOptions: formData.apartmentOptions || [],
      status: formData.status || "ativo",
      propertyType: formData.propertyType || "apartamento",
      category: formData.category || "venda",
      type: formData.type || "Premium",
      state: formData.state || "Goiânia",
      bedrooms: formData.bedrooms || 2,
      bathrooms: formData.bathrooms || 2,
      parking: formData.parking || 1,
      suites: formData.suites || 0,
      coordinates: formData.coordinates || { lat: -16.6869, lng: -49.2648 }
    } as Property;

    onSubmit(propertyData);
  };

  const nextStep = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Configuração Inicial
              </h2>
              <p className="text-gray-600">
                Selecione o tipo de propriedade que você deseja cadastrar
              </p>
            </div>
            <PropertyTypeSelector 
              onTypeSelect={handleTypeSelect}
              selectedType={selectedType}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Informações Básicas
              </h2>
              <p className="text-gray-600">
                Preencha as informações principais da propriedade
              </p>
            </div>

            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Propriedade <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: Apartamento de Luxo no Setor Oeste"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição Curta</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descrição breve para o preview..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Tipo (Ex: Premium, Exclusivo)</Label>
                  <Input
                    value={formData.type || ""}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    placeholder="Ex: Premium"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nome do Setor */}
                <div>
                  <Label htmlFor="location">Setor/Bairro *</Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ex: Setor Oeste, Setor Marista, Setor Bueno..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Digite o nome do setor ou bairro onde está localizado o imóvel
                  </p>
                </div>

                {/* HTML do Iframe do Google Maps */}
                <div>
                  <Label htmlFor="embedUrl">HTML do Google Maps (Iframe) *</Label>
                  <Textarea
                    id="embedUrl"
                    value={formData.embedUrl || ""}
                    onChange={(e) => handleIframeChange(e.target.value)}
                    placeholder="Cole aqui o código HTML do iframe do Google Maps..."
                    className="mt-1 min-h-[100px] font-mono text-sm"
                  />
                  
                  {/* Preview do Mapa */}
                  {formData.embedUrl && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">Preview do Mapa:</Label>
                      <div className="mt-2 border rounded-lg overflow-hidden">
                        <div 
                          className="w-full h-48"
                          dangerouslySetInnerHTML={{ __html: formData.embedUrl }}
                        />
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        ✅ Mapa carregado com sucesso! Se o mapa aparecer acima, está funcionando.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
                    <p><strong>💡 Como obter o HTML:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 mt-1">
                      <li>Vá para o Google Maps</li>
                      <li>Digite o endereço do imóvel</li>
                      <li>Clique em "Compartilhar" → "Incorporar um mapa"</li>
                      <li>Copie todo o código HTML do iframe</li>
                      <li>Cole aqui no campo acima</li>
                    </ol>
                    <p className="mt-2 text-red-600"><strong>⚠️ Obrigatório:</strong> Este campo é obrigatório para salvar a propriedade.</p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Características Físicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Características Físicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Quartos</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5, 6, '4+'].map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.bedrooms === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("bedrooms", option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Banheiros</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.bathrooms === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("bathrooms", option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Suítes</Label>
                  <div className="flex gap-2 mt-2">
                    {[0, 1, 2, 3, 4].map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.suites === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("suites", option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Vagas de Garagem</Label>
                  <div className="flex gap-2 mt-2">
                    {[0, 1, 2, 3, 4, '4+'].map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.parking === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("parking", option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Área (m²)</Label>
                  <Input
                    value={formData.area || ""}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="Ex: 180m²"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Informações Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Preço (A partir de) <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="Ex: R$ 1.850.000"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Detalhes e Mídia
              </h2>
              <p className="text-gray-600">
                Adicione imagens e detalhes específicos da propriedade
              </p>
            </div>

            {/* Mídia */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BannerUpload
                label="Imagem do Banner"
                description="Imagem principal que aparece no topo da página (formato 2:1)"
                onImageChange={(url) => handleInputChange("bannerImage", url)}
                currentImage={formData.bannerImage}
              />

              <ImageUpload
                label="Planta Baixa Geral"
                description="Planta baixa do empreendimento ou unidade"
                onImageChange={(url) => handleInputChange("floorPlan", url)}
                currentImage={formData.floorPlan}
                type="floorplan"
              />
            </div>

            {/* Galeria de Fotos */}
            <ImageManager
              images={formData.photoGallery || []}
              onImagesChange={(images) => {
                console.log("📸 PropertyFormNew - Galeria atualizada:", images.length, "imagens");
                console.log("📸 PropertyFormNew - Estado atual photoGallery:", formData.photoGallery?.length || 0);
                console.log("📸 PropertyFormNew - Imagens recebidas:", images);
                handleInputChange("photoGallery", images);
              }}
              title="Galeria de Fotos"
              description="Adicione fotos do empreendimento, apartamentos, áreas comuns, etc. (formato quadrado)"
            />

            {/* Empreendimento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Detalhes do Empreendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Incorporadora</Label>
                  <Input
                    value={formData.developer || ""}
                    onChange={(e) => handleInputChange("developer", e.target.value)}
                    placeholder="Ex: Lopes Empreendimentos"
                  />
                </div>

                <div>
                  <Label>Data de Entrega</Label>
                  <Input
                    value={formData.deliveryDate || ""}
                    onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                    placeholder="Ex: Dezembro 2024"
                  />
                </div>

                <div>
                  <Label>Disponibilidade</Label>
                  <Input
                    value={formData.availability || ""}
                    onChange={(e) => handleInputChange("availability", e.target.value)}
                    placeholder="Ex: Apenas 3 unidades disponíveis"
                  />
                </div>

                <div>
                  <Label>Descrição Completa</Label>
                  <Textarea
                    value={formData.fullDescription || ""}
                    onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                    placeholder="Descrição detalhada do empreendimento..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Opções e Detalhes
              </h2>
              <p className="text-gray-600">
                Configure opções específicas e detalhes adicionais
              </p>
            </div>

            {/* Opções de Apartamentos */}
            {formData.propertyType === 'apartamento' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5" />
                    Opções de Apartamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.apartmentOptions?.map((option, index) => (
                    <div key={option.id} className="border p-4 rounded-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Opção {index + 1}</h4>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeApartmentOption(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Quartos</Label>
                          <Input
                            type="number"
                            value={option.bedrooms}
                            onChange={(e) => handleApartmentOptionChange(index, "bedrooms", parseInt(e.target.value))}
                            placeholder="Ex: 3"
                          />
                        </div>
                        <div>
                          <Label>Área (m²)</Label>
                          <Input
                            value={option.area}
                            onChange={(e) => handleApartmentOptionChange(index, "area", e.target.value)}
                            placeholder="Ex: 120m²"
                          />
                        </div>
                        <div>
                          <Label>Preço</Label>
                          <Input
                            value={option.price}
                            onChange={(e) => handleApartmentOptionChange(index, "price", e.target.value)}
                            placeholder="Ex: R$ 1.450.000"
                          />
                        </div>
                        <div>
                          <Label>Andar</Label>
                          <Input
                            type="number"
                            value={option.floor || ""}
                            onChange={(e) => handleApartmentOptionChange(index, "floor", parseInt(e.target.value))}
                            placeholder="Ex: 5"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={option.available}
                            onChange={(e) => handleApartmentOptionChange(index, "available", e.target.checked)}
                            className="mr-2"
                          />
                          <Label>Disponível</Label>
                        </div>
                      </div>

                      <div>
                        <Label>Tipo de Unidade</Label>
                        <Input
                          value={option.unitType || ""}
                          onChange={(e) => handleApartmentOptionChange(index, "unitType", e.target.value)}
                          placeholder="Ex: Padrão, Premium, Studio, Duplex"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Banheiros</Label>
                          <Input
                            type="number"
                            value={option.bathrooms || ""}
                            onChange={(e) => handleApartmentOptionChange(index, "bathrooms", parseInt(e.target.value))}
                            placeholder="Ex: 2"
                          />
                        </div>
                        <div>
                          <Label>Suítes</Label>
                          <Input
                            type="number"
                            value={option.suites || ""}
                            onChange={(e) => handleApartmentOptionChange(index, "suites", parseInt(e.target.value))}
                            placeholder="Ex: 1"
                          />
                        </div>
                        <div>
                          <Label>Vagas</Label>
                          <Input
                            type="number"
                            value={option.parking || ""}
                            onChange={(e) => handleApartmentOptionChange(index, "parking", parseInt(e.target.value))}
                            placeholder="Ex: 2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Descrição da Unidade</Label>
                        <Input
                          value={option.description || ""}
                          onChange={(e) => handleApartmentOptionChange(index, "description", e.target.value)}
                          placeholder="Ex: Apartamento moderno com excelente layout"
                        />
                      </div>

                      <div>
                        <Label>Planta Baixa da Unidade</Label>
                        <ImageUpload
                          label=""
                          onImageChange={(url) => handleApartmentOptionChange(index, "floorPlan", url)}
                          currentImage={option.floorPlan}
                          type="floorplan"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Dica: Faça upload da planta para redimensionamento visual
                        </p>
                      </div>

                      <div>
                        <Label>Diferenciais da Unidade (separados por vírgula)</Label>
                        <Input
                          value={option.features?.join(', ') || ""}
                          onChange={(e) => handleApartmentOptionChange(index, "features", e.target.value.split(',').map(f => f.trim()))}
                          placeholder="Ex: Varanda, Cozinha planejada"
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={addApartmentOption}>
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Opção de Apartamento
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Detalhes Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  Detalhes Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Characteristics */}
                <div>
                  <Label>Características</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ex: Piso porcelanato"
                      value={newCharacteristic}
                      onChange={(e) => setNewCharacteristic(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem("characteristics", newCharacteristic, setNewCharacteristic);
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addItem("characteristics", newCharacteristic, setNewCharacteristic)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.characteristics && formData.characteristics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.characteristics.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem("characteristics", index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Benefits */}
                <div>
                  <Label>Benefícios da Localização</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ex: 3 km do Shopping Flamboyant"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem("locationBenefits", newBenefit, setNewBenefit);
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addItem("locationBenefits", newBenefit, setNewBenefit)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.locationBenefits && formData.locationBenefits.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.locationBenefits.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem("locationBenefits", index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Differentials */}
                <div>
                  <Label>Diferenciais</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ex: Acabamento de alto padrão"
                      value={newDifferential}
                      onChange={(e) => setNewDifferential(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem("differentials", newDifferential, setNewDifferential);
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addItem("differentials", newDifferential, setNewDifferential)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.differentials && formData.differentials.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.differentials.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem("differentials", index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Balcony Types */}
                <div>
                  <Label>Tipos de Sacadas</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ex: Varanda gourmet"
                      value={newBalconyType}
                      onChange={(e) => setNewBalconyType(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addItem("balconyTypes", newBalconyType, setNewBalconyType);
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addItem("balconyTypes", newBalconyType, setNewBalconyType)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.balconyTypes && formData.balconyTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.balconyTypes.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem("balconyTypes", index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="xl:col-span-2 space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Passo {currentStep} de 4
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 4) * 100)}% concluído
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-brand-coral h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            
            {currentStep < 4 ? (
              <Button type="button" onClick={(e) => nextStep(e)}>
                Próximo
              </Button>
            ) : (
              <Button type="submit">
                {property ? "Atualizar" : "Adicionar"} Propriedade
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="xl:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview do Minicard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyPreview 
              property={formData as Property} 
              onPreviewClick={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyFormNew;
