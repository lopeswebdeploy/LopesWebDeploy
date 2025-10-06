"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Eye, MapPin, Building, Car, Ruler } from "lucide-react";
import { Property, ApartmentOption } from "@/types/property";
import PropertyPreview from "./PropertyPreview";

interface PropertyFormProps {
  property?: Property;
  onSubmit: (property: Property) => void;
  onCancel: () => void;
}

const PropertyForm = ({ property, onSubmit, onCancel }: PropertyFormProps) => {
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
    coordinates: { lat: -16.6869, lng: -49.2648 }
  });

  const [newImage, setNewImage] = useState("");
  const [newCharacteristic, setNewCharacteristic] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newDifferential, setNewDifferential] = useState("");
  const [newBalconyType, setNewBalconyType] = useState("");
  const [newApartmentOption, setNewApartmentOption] = useState({
    bedrooms: 2,
    area: "",
    price: "",
    floor: 1,
    available: true
  });

  // Opções pré-definidas
  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const bathroomOptions = [1, 2, 3, 4, 5];
  const parkingOptions = [1, 2, 3, 4, 5];
  const areaOptions = ["50m²", "60m²", "70m²", "80m²", "90m²", "100m²", "120m²", "150m²", "180m²", "200m²", "250m²", "300m²"];
  const categoryOptions = [
    { value: "venda", label: "Venda", color: "bg-green-500" },
    { value: "investimento", label: "Investimento", color: "bg-blue-500" },
    { value: "aluguel", label: "Aluguel", color: "bg-purple-500" }
  ];
  const typeOptions = ["Premium", "Exclusivo", "Lançamento", "Pronto", "Oportunidade"];
  const propertyTypeOptions = ["apartamento", "casa", "cobertura", "loft"];
  const locationOptions = [
    "Setor Oeste", "Setor Marista", "Setor Bueno", "Jardim Europa", 
    "Alto da Glória", "Setor Sul", "Setor Norte", "Setor Leste"
  ];
  const balconyTypeOptions = [
    "Varanda gourmet", "Sacada tradicional", "Terraço", "Varanda com churrasqueira",
    "Sacada com jardim", "Terraço com piscina", "Varanda panorâmica"
  ];

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = (field: keyof Property, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
      setter("");
    }
  };

  const removeItem = (field: keyof Property, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()]
      }));
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const addApartmentOption = () => {
    if (newApartmentOption.area && newApartmentOption.price) {
      const option: ApartmentOption = {
        id: Date.now().toString(),
        ...newApartmentOption
      };
      setFormData(prev => ({
        ...prev,
        apartmentOptions: [...(prev.apartmentOptions || []), option]
      }));
      setNewApartmentOption({
        bedrooms: 2,
        area: "",
        price: "",
        floor: 1,
        available: true
      });
    }
  };

  const removeApartmentOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      apartmentOptions: prev.apartmentOptions?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.location) {
      alert("Por favor, preencha os campos obrigatórios: Título, Preço e Localização");
      return;
    }

    const propertyData: Property = {
      ...formData,
      images: formData.images || [],
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="xl:col-span-2 space-y-6">
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
              <Label>Título *</Label>
              <Input
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Apartamento de Luxo no Setor Oeste"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria *</Label>
                <div className="flex gap-2 mt-2">
                  {categoryOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.category === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("category", option.value)}
                      className={formData.category === option.value ? option.color : ""}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tipo de Propriedade</Label>
                <div className="flex gap-2 mt-2">
                  {propertyTypeOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={formData.propertyType === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("propertyType", option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>Descrição Curta</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descrição breve da propriedade..."
                rows={3}
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
            <div>
              <Label>Localização *</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {locationOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={formData.location === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("location", option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Endereço Completo</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Ex: Av. T-10, Setor Oeste, Goiânia - GO"
              />
            </div>
          </CardContent>
        </Card>

        {/* Características Físicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Características Físicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quartos *</Label>
                <div className="flex gap-2 mt-2">
                  {bedroomOptions.map((option) => (
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
                  {bathroomOptions.map((option) => (
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vagas de Garagem</Label>
                <div className="flex gap-2 mt-2">
                  {parkingOptions.map((option) => (
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
            </div>

            <div>
              <Label>Área</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {areaOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={formData.area === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("area", option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tipos de Sacadas</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {balconyTypeOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={formData.balconyTypes?.includes(option) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const current = formData.balconyTypes || [];
                      const updated = current.includes(option)
                        ? current.filter(item => item !== option)
                        : [...current, option];
                      handleInputChange("balconyTypes", updated);
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle>Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Preço *</Label>
              <Input
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="Ex: R$ 1.850.000"
              />
            </div>

            <div>
              <Label>Tipo</Label>
              <div className="flex gap-2 mt-2">
                {typeOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={formData.type === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("type", option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empreendimento */}
        <Card>
          <CardHeader>
            <CardTitle>Empreendimento</CardTitle>
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
          </CardContent>
        </Card>

        {/* Opções de Apartamentos */}
        {formData.propertyType === "apartamento" && (
          <Card>
            <CardHeader>
              <CardTitle>Opções de Apartamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quartos</Label>
                  <Input
                    type="number"
                    value={newApartmentOption.bedrooms}
                    onChange={(e) => setNewApartmentOption(prev => ({
                      ...prev,
                      bedrooms: parseInt(e.target.value) || 0
                    }))}
                  />
                </div>
                <div>
                  <Label>Área</Label>
                  <Input
                    value={newApartmentOption.area}
                    onChange={(e) => setNewApartmentOption(prev => ({
                      ...prev,
                      area: e.target.value
                    }))}
                    placeholder="Ex: 120m²"
                  />
                </div>
                <div>
                  <Label>Preço</Label>
                  <Input
                    value={newApartmentOption.price}
                    onChange={(e) => setNewApartmentOption(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                    placeholder="Ex: R$ 1.450.000"
                  />
                </div>
                <div>
                  <Label>Andar</Label>
                  <Input
                    type="number"
                    value={newApartmentOption.floor}
                    onChange={(e) => setNewApartmentOption(prev => ({
                      ...prev,
                      floor: parseInt(e.target.value) || 1
                    }))}
                  />
                </div>
              </div>
              <Button type="button" onClick={addApartmentOption}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Opção
              </Button>

              {formData.apartmentOptions && formData.apartmentOptions.length > 0 && (
                <div className="space-y-2">
                  {formData.apartmentOptions.map((option, index) => (
                    <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{option.bedrooms} quartos</span>
                        <span className="text-gray-500 ml-2">{option.area}</span>
                        <span className="text-brand-coral ml-2 font-medium">{option.price}</span>
                        {option.floor && <span className="text-gray-500 ml-2">{option.floor}º andar</span>}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeApartmentOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mídia */}
        <Card>
          <CardHeader>
            <CardTitle>Mídia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Imagem Banner</Label>
              <Input
                value={formData.bannerImage || ""}
                onChange={(e) => handleInputChange("bannerImage", e.target.value)}
                placeholder="URL da imagem banner"
              />
            </div>

            <div>
              <Label>Planta Baixa</Label>
              <Input
                value={formData.floorPlan || ""}
                onChange={(e) => handleInputChange("floorPlan", e.target.value)}
                placeholder="URL da planta baixa"
              />
            </div>

            <div>
              <Label>Imagens</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="URL da imagem"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <Button type="button" onClick={addImage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Descrição Completa</Label>
              <Textarea
                value={formData.fullDescription || ""}
                onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                placeholder="Descrição detalhada do empreendimento..."
                rows={4}
              />
            </div>

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
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {property ? "Atualizar" : "Adicionar"} Propriedade
          </Button>
        </div>
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

export default PropertyForm;
