import { Metadata } from 'next'
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyFiltersClient from "@/components/properties/PropertyFiltersClient";
import SectionHeader from "@/components/common/SectionHeader";
import PropertiesPageClient from "./PropertiesPageClient";

export const metadata: Metadata = {
  title: 'Imóveis - Lopes Imóveis',
  description: 'Explore nossa seleção exclusiva de imóveis de alto padrão em Goiânia. Apartamentos, casas e coberturas premium.',
}

export default function PropertiesPage() {
  return <PropertiesPageClient />;
}
