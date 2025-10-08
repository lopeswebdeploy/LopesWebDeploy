"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/common/SectionHeader";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { Property } from "@/types/property";
import { PropertyService } from "@/services/propertyService";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedProperties = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  
  const maxVisible = 6;
  const sectors = [
    { value: "all", label: "Todos os Setores" },
    { value: "Setor Oeste", label: "Setor Oeste" },
    { value: "Setor Marista", label: "Setor Marista" },
    { value: "Setor Bueno", label: "Setor Bueno" },
    { value: "Jardim Europa", label: "Jardim Europa" },
    { value: "Setor Universitário", label: "Setor Universitário" }
  ];

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const loadedProperties = await PropertyService.loadProperties();
        setAllProperties(loadedProperties);
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
        // Fallback para dados de exemplo
        const fallbackProperties = PropertyService.loadPropertiesSync();
        setAllProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    // Primeiro filtrar por propriedades em destaque
    let filtered = allProperties.filter(property => 
      property.featured
    );
    
    // Se não houver propriedades em destaque, usar as primeiras 6
    if (filtered.length === 0) {
      filtered = allProperties.slice(0, 6);
    }
    
    // Filtrar por setor
    if (selectedSector !== "all") {
      filtered = filtered.filter(property => property.location === selectedSector);
    }
    
    setFeaturedProperties(filtered);
    setCurrentIndex(0); // Reset index when filter changes
  }, [allProperties, selectedSector]);

  const nextProperties = () => {
    const maxIndex = Math.max(0, featuredProperties.length - maxVisible);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevProperties = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const visibleProperties = featuredProperties.slice(currentIndex, currentIndex + maxVisible);
  const canGoNext = currentIndex + maxVisible < featuredProperties.length;
  const canGoPrev = currentIndex > 0;

  if (loading) {
    return (
      <section id="imoveis" className="section-luxury">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Imóveis em"
              highlight="destaque"
              description="Selecionamos os melhores imóveis de alto padrão em Goiânia para você"
            />
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando imóveis em destaque...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="imoveis" className="section-luxury">
      <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Imóveis em"
            highlight="destaque"
            description="Selecionamos os melhores imóveis de alto padrão em Goiânia para você"
          />

          {allProperties.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum imóvel cadastrado ainda
              </h3>
              <p className="text-gray-500 mb-4">
                Cadastre imóveis no painel administrativo para vê-los aqui
              </p>
              <Link href="/admin">
                <Button variant="default" size="lg">
                  Ir para Admin
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Filtro por Setor */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {sectors.map((sector) => (
                    <Button
                      key={sector.value}
                      variant={selectedSector === sector.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSector(sector.value)}
                      className="text-sm"
                    >
                      {sector.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Controles de Navegação e Grid */}
              <div className="relative">
                {/* Botão Anterior */}
                {canGoPrev && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevProperties}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}

                {/* Botão Próximo */}
                {canGoNext && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextProperties}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}

                {/* Grid de Propriedades */}
                <div className="mb-12">
                  {visibleProperties.length > 0 ? (
                    <PropertyGrid properties={visibleProperties} />
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum imóvel encontrado neste setor
                      </h3>
                      <p className="text-gray-500">
                        Tente selecionar outro setor ou cadastre novos imóveis
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link href="/imoveis">
                  <Button variant="navy-outline" size="xl">
                    Ver Todos os Imóveis
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
