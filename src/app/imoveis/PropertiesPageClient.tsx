"use client";

import { useState, useEffect } from "react";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyFiltersClient from "@/components/properties/PropertyFiltersClient";
import SectionHeader from "@/components/common/SectionHeader";
import { Property } from "@/types/property";
import { PropertyService } from "@/services/propertyService";

export default function PropertiesPageClient() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const loadedProperties = await PropertyService.loadProperties();
        setProperties(loadedProperties);
        setFilteredProperties(loadedProperties);
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
        // Fallback para dados de exemplo
        const fallbackProperties = PropertyService.loadPropertiesSync();
        setProperties(fallbackProperties);
        setFilteredProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = properties;

    // Filtro por busca
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (property.location && property.location.toLowerCase().includes(filters.search.toLowerCase())) ||
        property.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por localização
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(property =>
        property.location === filters.location
      );
    }

    // Filtro por categoria
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(property =>
        property.category === filters.category
      );
    }

    // Filtro por tipo
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(property =>
        property.type === filters.type
      );
    }

    // Filtro por quartos
    if (filters.bedrooms && filters.bedrooms !== 'all') {
      filtered = filtered.filter(property => {
        return property.bedrooms >= parseInt(filters.bedrooms);
      });
    }

    // Filtro por banheiros
    if (filters.bathrooms && filters.bathrooms !== 'all') {
      filtered = filtered.filter(property =>
        property.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    // Filtro por vagas
    if (filters.parking && filters.parking !== 'all') {
      filtered = filtered.filter(property =>
        property.parking >= parseInt(filters.parking)
      );
    }

    // Filtro por faixa de preço
    if (filters.priceRange && filters.priceRange.length === 2) {
      filtered = filtered.filter(property => {
        if (!property.price) return false;
        const price = parseFloat(property.price.replace(/[^\d]/g, ''));
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    setFilteredProperties(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="section-luxury">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Nossos"
              highlight="imóveis"
              description="Descubra nossa seleção exclusiva de imóveis de alto padrão em Goiânia"
            />

            <div className="mb-8">
              <PropertyFiltersClient onFilterChange={handleFilterChange} />
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros para encontrar mais opções
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    {filteredProperties.length} imóvel(is) encontrado(s)
                  </p>
                </div>
                <PropertyGrid properties={filteredProperties} />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

