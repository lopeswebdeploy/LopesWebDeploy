"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Building2, Waves, Mountain, TreePine } from "lucide-react";

interface PropertyTypeSelectorProps {
  onTypeSelect: (type: {
    propertyType: 'apartamento' | 'casa' | 'cobertura' | 'loft';
    category: 'venda' | 'investimento' | 'aluguel';
    context: 'urbano' | 'praia' | 'campo' | 'montanha';
  }) => void;
  selectedType?: {
    propertyType: 'apartamento' | 'casa' | 'cobertura' | 'loft';
    category: 'venda' | 'investimento' | 'aluguel';
    context: 'urbano' | 'praia' | 'campo' | 'montanha';
  };
}

const PropertyTypeSelector = ({ onTypeSelect, selectedType }: PropertyTypeSelectorProps) => {
  const [selected, setSelected] = useState(selectedType || {
    propertyType: 'apartamento' as const,
    category: 'venda' as const,
    context: 'urbano' as const
  });

  const propertyTypes = [
    {
      id: 'apartamento',
      label: 'Apartamento',
      icon: Building,
      description: 'Unidades em edifícios residenciais',
      features: ['Quartos', 'Banheiros', 'Suítes', 'Vagas', 'Área', 'Andar', 'Sacadas']
    },
    {
      id: 'casa',
      label: 'Casa',
      icon: Home,
      description: 'Residências unifamiliares',
      features: ['Quartos', 'Banheiros', 'Suítes', 'Vagas', 'Área', 'Quintal', 'Jardim']
    },
    {
      id: 'cobertura',
      label: 'Cobertura',
      icon: Building2,
      description: 'Apartamentos no último andar',
      features: ['Quartos', 'Banheiros', 'Suítes', 'Vagas', 'Área', 'Terraço', 'Piscina']
    },
    {
      id: 'loft',
      label: 'Loft',
      icon: Building,
      description: 'Espaços abertos e modernos',
      features: ['Área', 'Banheiros', 'Vagas', 'Mezanino', 'Pé-direito alto']
    }
  ];

  const categories = [
    {
      id: 'venda',
      label: 'Venda',
      color: 'bg-green-500',
      description: 'Propriedades para compra'
    },
    {
      id: 'investimento',
      label: 'Investimento',
      color: 'bg-blue-500',
      description: 'Oportunidades de investimento'
    },
    {
      id: 'aluguel',
      label: 'Aluguel',
      color: 'bg-purple-500',
      description: 'Propriedades para locação'
    }
  ];

  const contexts = [
    {
      id: 'urbano',
      label: 'Urbano',
      icon: Building,
      description: 'Centro da cidade, bairros residenciais'
    },
    {
      id: 'praia',
      label: 'Praia',
      icon: Waves,
      description: 'Região litorânea, proximidade ao mar'
    },
    {
      id: 'campo',
      label: 'Campo',
      icon: TreePine,
      description: 'Área rural, sítios, chácaras'
    },
    {
      id: 'montanha',
      label: 'Montanha',
      icon: Mountain,
      description: 'Região serrana, clima ameno'
    }
  ];

  const handlePropertyTypeSelect = (type: any) => {
    const newSelection = { ...selected, propertyType: type.id };
    setSelected(newSelection);
    onTypeSelect(newSelection);
  };

  const handleCategorySelect = (category: any) => {
    const newSelection = { ...selected, category: category.id };
    setSelected(newSelection);
    onTypeSelect(newSelection);
  };

  const handleContextSelect = (context: any) => {
    const newSelection = { ...selected, context: context.id };
    setSelected(newSelection);
    onTypeSelect(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Tipo de Propriedade */}
      <Card>
        <CardHeader>
          <CardTitle>1. Tipo de Propriedade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selected.propertyType === type.id ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selected.propertyType === type.id ? "bg-brand-coral hover:bg-brand-coral/90" : ""
                  }`}
                  onClick={() => handlePropertyTypeSelect(type)}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs opacity-75">{type.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>2. Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selected.category === category.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  selected.category === category.id ? category.color : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                <div className="text-center">
                  <div className="font-medium text-white">{category.label}</div>
                  <div className="text-xs opacity-75">{category.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contexto */}
      <Card>
        <CardHeader>
          <CardTitle>3. Contexto/Localização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contexts.map((context) => {
              const Icon = context.icon;
              return (
                <Button
                  key={context.id}
                  variant={selected.context === context.id ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${
                    selected.context === context.id ? "bg-brand-coral hover:bg-brand-coral/90" : ""
                  }`}
                  onClick={() => handleContextSelect(context)}
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{context.label}</div>
                    <div className="text-xs opacity-75">{context.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumo da Seleção */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Configuração Selecionada</h3>
            <div className="flex justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-white rounded-full border">
                {propertyTypes.find(t => t.id === selected.propertyType)?.label}
              </span>
              <span className="px-3 py-1 bg-white rounded-full border">
                {categories.find(c => c.id === selected.category)?.label}
              </span>
              <span className="px-3 py-1 bg-white rounded-full border">
                {contexts.find(c => c.id === selected.context)?.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              O formulário será personalizado com base nesta seleção
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyTypeSelector;



