"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PropertyFullPage from "@/components/admin/PropertyFullPage";
import { Property } from "@/types/property";
import { PropertyService } from "@/services/propertyService";

export default function PropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar propriedade pelo ID usando o PropertyService
    if (params?.id) {
      console.log("🔍 PropertyPage - Buscando propriedade com ID:", params.id);
      const foundProperty = PropertyService.getPropertyById(params.id as string);
      console.log("🔍 PropertyPage - Propriedade encontrada:", !!foundProperty);
      if (foundProperty) {
        console.log("🔍 PropertyPage - Título da propriedade:", foundProperty.title);
      }
      setProperty(foundProperty);
    }
    setLoading(false);
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando propriedade...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Propriedade não encontrada</h1>
          <p className="text-gray-600 mb-6">A propriedade que você está procurando não existe.</p>
          <a href="/admin" className="text-brand-coral hover:underline">
            Voltar para o Admin
          </a>
        </div>
      </div>
    );
  }

  return <PropertyFullPage property={property} />;
}
