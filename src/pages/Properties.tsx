import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/common/SectionHeader";
import PropertyFiltersClient from "@/components/properties/PropertyFiltersClient";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { SlidersHorizontal } from "lucide-react";
import { Property } from "@/types/property";
import { PropertyService } from "@/services/propertyService";

const Properties = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      const loadedProperties = await PropertyService.loadProperties();
      // Filtrar apenas propriedades visíveis
      const visibleProperties = loadedProperties.filter(property => property.isVisible !== false);
      setProperties(visibleProperties);
    };
    loadProperties();
  }, []);

  const handleFilterChange = (filters: any) => {
    // Implementar lógica de filtros se necessário
    console.log("Filters changed:", filters);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Explore Nossos"
            highlight="Imóveis"
            description="Encontre o imóvel perfeito com nossos filtros avançados de busca"
          />

          {/* Filter Toggle */}
          <div className="mb-8 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{properties.length}</span> imóveis disponíveis
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Ocultar" : "Mostrar"} Filtros
            </Button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="mb-8">
              <PropertyFiltersClient onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Properties Grid */}
          <PropertyGrid properties={properties} />

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="navy-outline" size="lg">
              Carregar Mais Imóveis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
