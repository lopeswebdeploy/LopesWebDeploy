'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ListChecks,
  Save,
  EyeOff,
  Star,
  StarOff
} from "lucide-react";
import { Property, ApartmentOption } from "@/types/property";
import { AuthUser } from "@/types/user";
import { PermissionService } from "@/lib/permissions";
import { ImageUploadSystem } from "./ImageUploadSystem";
import PropertyPreview from "./PropertyPreview";

interface PropertyFormUnifiedProps {
  property?: Property;
  onSubmit: (property: Property) => void;
  onCancel: () => void;
  user: AuthUser;
  mode: 'create' | 'edit';
}

const PropertyFormUnified = ({ 
  property, 
  onSubmit, 
  onCancel, 
  user, 
  mode 
}: PropertyFormUnifiedProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || 0,
    status: property?.status || "draft",
    featured: property?.featured || false,
    authorId: user.id,
    bannerImage: property?.bannerImage || "",
    galleryImages: property?.galleryImages || [],
    floorPlans: property?.floorPlans || [],
    fullDescription: "",
    address: "",
    suites: 0,
    characteristics: [],
    locationBenefits: [],
    differentials: [],
    balconyTypes: [],
    apartmentOptions: [],
    coordinates: { lat: -16.6869, lng: -49.2648 },
    photoGallery: [],
    isFeatured: false,
    isVisible: true
  });

  const [newCharacteristic, setNewCharacteristic] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newDifferential, setNewDifferential] = useState("");
  const [newBalconyType, setNewBalconyType] = useState("");

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        photoGallery: property.photoGallery || property.images || [],
        images: property.images || property.photoGallery || []
      });
    }
  }, [property]);

  const handleInputChange = (field: string, value: any) => {
    console.log("🔧 PropertyFormUnified - handleInputChange:", field, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log("🔧 PropertyFormUnified - Novo estado:", newData);
      return newData;
    });
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
    handleInputChange("apartmentOptions", options);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar dados obrigatórios
      if (!formData.title || !formData.location || !formData.price) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Criar propriedade completa
      const propertyData: Property = {
        id: formData.id || `temp-${Date.now()}`,
        title: formData.title || '',
        description: formData.description || '',
        fullDescription: formData.fullDescription || '',
        category: formData.category || 'venda',
        type: formData.type || '',
        propertyType: formData.propertyType || 'apartamento',
        location: formData.location || '',
        state: formData.state || 'Goiânia',
        address: formData.address || '',
        coordinates: formData.coordinates || { lat: -16.6869, lng: -49.2648 },
        embedUrl: formData.embedUrl || '',
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        suites: Number(formData.suites) || 0,
        parking: Number(formData.parking) || 0,
        area: formData.area || '',
        balconyTypes: formData.balconyTypes || [],
        price: formData.price || '',
        apartmentOptions: formData.apartmentOptions || [],
        developer: formData.developer || '',
        deliveryDate: formData.deliveryDate || '',
        availability: formData.availability || '',
        images: formData.images || [],
        photoGallery: formData.photoGallery || [],
        characteristics: formData.characteristics || [],
        locationBenefits: formData.locationBenefits || [],
        differentials: formData.differentials || [],
        status: formData.status || 'ativo',
        isFeatured: formData.isFeatured || false,
        isVisible: formData.isVisible !== false,
        ownerId: user.id,
        createdAt: formData.createdAt || new Date(),
        updatedAt: new Date()
      };

      console.log("🚀 PropertyFormUnified - Enviando propriedade:", propertyData);
      await onSubmit(propertyData);
      
    } catch (error) {
      console.error("❌ Erro ao salvar propriedade:", error);
      alert("Erro ao salvar propriedade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canFeature = PermissionService.canFeatureProperty(user);
  const canChangeVisibility = PermissionService.canChangeVisibility(user);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'create' ? 'Nova Propriedade' : 'Editar Propriedade'}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Crie uma nova propriedade para o seu portfólio' 
              : 'Edite as informações da propriedade'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="1">Básico</TabsTrigger>
                <TabsTrigger value="2">Detalhes</TabsTrigger>
                <TabsTrigger value="3">Imagens</TabsTrigger>
                <TabsTrigger value="4">Finalizar</TabsTrigger>
              </TabsList>

              {/* PASSO 1: INFORMAÇÕES BÁSICAS */}
              <TabsContent value="1" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Informações Básicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={formData.title || ""}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          placeholder="Ex: Apartamento 3 quartos no Setor Oeste"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Preço *</Label>
                        <Input
                          id="price"
                          value={formData.price || ""}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          placeholder="Ex: R$ 450.000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição Resumida</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Descrição breve da propriedade..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <select
                          id="category"
                          value={formData.category || "venda"}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="venda">Venda</option>
                          <option value="aluguel">Aluguel</option>
                          <option value="investimento">Investimento</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <select
                          id="type"
                          value={formData.type || "Premium"}
                          onChange={(e) => handleInputChange("type", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="Premium">Premium</option>
                          <option value="Exclusivo">Exclusivo</option>
                          <option value="Lançamento">Lançamento</option>
                          <option value="Pronto">Pronto</option>
                          <option value="Oportunidade">Oportunidade</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="propertyType">Tipo de Propriedade</Label>
                        <select
                          id="propertyType"
                          value={formData.propertyType || "apartamento"}
                          onChange={(e) => handleInputChange("propertyType", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="apartamento">Apartamento</option>
                          <option value="casa">Casa</option>
                          <option value="cobertura">Cobertura</option>
                          <option value="loft">Loft</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Localização *</Label>
                        <Input
                          id="location"
                          value={formData.location || ""}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Ex: Setor Oeste"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={formData.state || "Goiânia"}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Endereço Completo</Label>
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Rua, número, bairro..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PASSO 2: DETALHES */}
              <TabsContent value="2" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Características Físicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="bedrooms">Quartos</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={formData.bedrooms || 0}
                          onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bathrooms">Banheiros</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={formData.bathrooms || 0}
                          onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="suites">Suítes</Label>
                        <Input
                          id="suites"
                          type="number"
                          value={formData.suites || 0}
                          onChange={(e) => handleInputChange("suites", parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="parking">Vagas</Label>
                        <Input
                          id="parking"
                          type="number"
                          value={formData.parking || 0}
                          onChange={(e) => handleInputChange("parking", parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="area">Área</Label>
                      <Input
                        id="area"
                        value={formData.area || ""}
                        onChange={(e) => handleInputChange("area", e.target.value)}
                        placeholder="Ex: 85m²"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fullDescription">Descrição Completa</Label>
                      <Textarea
                        id="fullDescription"
                        value={formData.fullDescription || ""}
                        onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                        placeholder="Descrição detalhada da propriedade..."
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Características */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5" />
                      Características e Diferenciais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Características */}
                    <div>
                      <Label>Características</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newCharacteristic}
                          onChange={(e) => setNewCharacteristic(e.target.value)}
                          placeholder="Ex: Piscina, Academia, Playground"
                          onKeyPress={(e) => e.key === 'Enter' && addItem('characteristics', newCharacteristic, setNewCharacteristic)}
                        />
                        <Button
                          type="button"
                          onClick={() => addItem('characteristics', newCharacteristic, setNewCharacteristic)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.characteristics || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeItem('characteristics', index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Benefícios da Localização */}
                    <div>
                      <Label>Benefícios da Localização</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newBenefit}
                          onChange={(e) => setNewBenefit(e.target.value)}
                          placeholder="Ex: Próximo ao shopping, Metrô"
                          onKeyPress={(e) => e.key === 'Enter' && addItem('locationBenefits', newBenefit, setNewBenefit)}
                        />
                        <Button
                          type="button"
                          onClick={() => addItem('locationBenefits', newBenefit, setNewBenefit)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.locationBenefits || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeItem('locationBenefits', index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Diferenciais */}
                    <div>
                      <Label>Diferenciais</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newDifferential}
                          onChange={(e) => setNewDifferential(e.target.value)}
                          placeholder="Ex: Vista panorâmica, Terraço privativo"
                          onKeyPress={(e) => e.key === 'Enter' && addItem('differentials', newDifferential, setNewDifferential)}
                        />
                        <Button
                          type="button"
                          onClick={() => addItem('differentials', newDifferential, setNewDifferential)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.differentials || []).map((item, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {item}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeItem('differentials', index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PASSO 3: IMAGENS */}
              <TabsContent value="3" className="space-y-6">
                {formData.id && (
                  <>
                    {/* Galeria */}
                    <ImageUploadSystem
                      propertyId={formData.id}
                      type="gallery"
                      label="Galeria de Fotos"
                      description="Adicione fotos do empreendimento, apartamentos, áreas comuns, etc."
                      multiple={true}
                      maxImages={20}
                      currentImages={formData.galleryImages || []}
                      onImagesChange={(urls) => handleInputChange("galleryImages", urls)}
                    />
                  </>
                )}

                {!formData.id && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Salve a propriedade primeiro
                      </h3>
                      <p className="text-gray-500">
                        Após salvar as informações básicas, você poderá fazer upload das imagens.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* PASSO 4: FINALIZAR */}
              <TabsContent value="4" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Configurações Finais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="developer">Construtora/Desenvolvedora</Label>
                        <Input
                          id="developer"
                          value={formData.developer || ""}
                          onChange={(e) => handleInputChange("developer", e.target.value)}
                          placeholder="Nome da construtora"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryDate">Data de Entrega</Label>
                        <Input
                          id="deliveryDate"
                          value={formData.deliveryDate || ""}
                          onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                          placeholder="Ex: Dezembro 2024"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="availability">Disponibilidade</Label>
                      <Input
                        id="availability"
                        value={formData.availability || ""}
                        onChange={(e) => handleInputChange("availability", e.target.value)}
                        placeholder="Ex: Disponível para visita"
                      />
                    </div>

                    {/* Controles de visibilidade */}
                    <div className="flex gap-4">
                      {canFeature && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isFeatured || false}
                            onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                            className="rounded"
                          />
                          <Star className="h-4 w-4" />
                          <span>Destacar propriedade</span>
                        </label>
                      )}

                      {canChangeVisibility && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isVisible !== false}
                            onChange={(e) => handleInputChange("isVisible", e.target.checked)}
                            className="rounded"
                          />
                          <Eye className="h-4 w-4" />
                          <span>Propriedade visível</span>
                        </label>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Botões de ação */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Propriedade' : 'Salvar Alterações'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PropertyPreview 
                property={formData as Property} 
                onPreviewClick={() => {}} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFormUnified;
