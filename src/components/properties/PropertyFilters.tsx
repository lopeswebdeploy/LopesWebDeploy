import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PropertyFiltersProps {
  filters: {
    search: string;
    location: string;
    category: string;
    type: string;
    bedrooms: string;
    bathrooms: string;
    parking: string;
    priceRange: [number, number];
  };
  onFilterChange: (field: string, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const PropertyFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters
}: PropertyFiltersProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card-luxury">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-2">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque por bairro, tipo ou características..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Localização</label>
          <Select value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os bairros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              <SelectItem value="Setor Oeste">Setor Oeste</SelectItem>
              <SelectItem value="Setor Marista">Setor Marista</SelectItem>
              <SelectItem value="Setor Bueno">Setor Bueno</SelectItem>
              <SelectItem value="Jardim Europa">Jardim Europa</SelectItem>
              <SelectItem value="Alto da Glória">Alto da Glória</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Categoria</label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="investimento">Investimento</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Exclusivo">Exclusivo</SelectItem>
              <SelectItem value="Lançamento">Lançamento</SelectItem>
              <SelectItem value="Pronto">Pronto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium mb-2">Quartos</label>
          <Select value={filters.bedrooms} onValueChange={(value) => onFilterChange('bedrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer</SelectItem>
              <SelectItem value="1">1+ quarto</SelectItem>
              <SelectItem value="2">2+ quartos</SelectItem>
              <SelectItem value="3">3+ quartos</SelectItem>
              <SelectItem value="4">4+ quartos</SelectItem>
              <SelectItem value="5">5+ quartos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium mb-2">Banheiros</label>
          <Select value={filters.bathrooms} onValueChange={(value) => onFilterChange('bathrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer</SelectItem>
              <SelectItem value="1">1+ banheiro</SelectItem>
              <SelectItem value="2">2+ banheiros</SelectItem>
              <SelectItem value="3">3+ banheiros</SelectItem>
              <SelectItem value="4">4+ banheiros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Parking */}
        <div>
          <label className="block text-sm font-medium mb-2">Vagas</label>
          <Select value={filters.parking} onValueChange={(value) => onFilterChange('parking', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer</SelectItem>
              <SelectItem value="1">1+ vaga</SelectItem>
              <SelectItem value="2">2+ vagas</SelectItem>
              <SelectItem value="3">3+ vagas</SelectItem>
              <SelectItem value="4">4+ vagas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium mb-2">Área mínima</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer</SelectItem>
              <SelectItem value="80">80m²+</SelectItem>
              <SelectItem value="120">120m²+</SelectItem>
              <SelectItem value="150">150m²+</SelectItem>
              <SelectItem value="200">200m²+</SelectItem>
              <SelectItem value="300">300m²+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="lg:col-span-4">
          <label className="block text-sm font-medium mb-4">
            Faixa de Preço: R$ {filters.priceRange[0].toLocaleString('pt-BR')} - R$ {filters.priceRange[1].toLocaleString('pt-BR')}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFilterChange('priceRange', value)}
            max={5000000}
            step={50000}
            className="w-full"
          />
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex gap-3 mt-6 pt-6 border-t">
        <Button variant="luxury" className="flex-1" onClick={onApplyFilters}>
          Aplicar Filtros
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
