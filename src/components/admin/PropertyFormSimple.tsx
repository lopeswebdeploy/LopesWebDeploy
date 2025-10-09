'use client';
import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface PropertyFormSimpleProps {
  property?: any;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'corretor';
  };
  onSubmit: (property: any) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export default function PropertyFormSimple({ 
  property, 
  user, 
  onSubmit, 
  onCancel, 
  mode 
}: PropertyFormSimpleProps) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price ? Number(property.price) : '',
    location: property?.location || 'Goiânia',
    developer: property?.developer || 'Lopes Imóveis',
    category: property?.category || 'venda',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    area: property?.area || '',
    status: property?.status || 'draft',
    featured: property?.featured || false,
    bannerImage: property?.bannerImage || '',
    galleryImages: property?.galleryImages || [],
    floorPlans: property?.floorPlans || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const propertyData = {
        id: property?.id || Date.now(),
        title: formData.title,
        description: formData.description,
        price: formData.price === '' ? null : Number(formData.price),
        location: formData.location,
        developer: formData.developer,
        category: formData.category,
        bedrooms: formData.bedrooms === '' ? null : Number(formData.bedrooms),
        bathrooms: formData.bathrooms === '' ? null : Number(formData.bathrooms),
        area: formData.area === '' ? null : Number(formData.area),
        status: formData.status,
        featured: formData.featured,
        authorId: user.id,
        bannerImage: formData.bannerImage,
        galleryImages: formData.galleryImages,
        floorPlans: formData.floorPlans,
        createdAt: property?.createdAt || new Date(),
        updatedAt: new Date()
      };

      await onSubmit(propertyData);
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error);
      alert('Erro ao salvar propriedade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Nova Propriedade' : 'Editar Propriedade'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Preço *
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Localização
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="developer" className="block text-sm font-medium text-gray-700 mb-2">
              Construtora
            </label>
            <input
              type="text"
              id="developer"
              value={formData.developer}
              onChange={(e) => handleInputChange('developer', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Quartos
            </label>
            <input
              type="number"
              id="bedrooms"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Banheiros
            </label>
            <input
              type="number"
              id="bathrooms"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              Área (m²)
            </label>
            <input
              type="number"
              id="area"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {user.role === 'admin' ? (
          <>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Destacar propriedade
              </label>
            </div>
          </>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Informações para Corretores</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Suas propriedades são criadas como <strong>rascunho</strong></li>
              <li>• Elas ficam <strong>invisíveis no site</strong> até aprovação do admin</li>
              <li>• Você pode <strong>editar e excluir</strong> apenas suas propriedades</li>
              <li>• Apenas o <strong>admin pode publicar</strong> e destacar propriedades</li>
            </ul>
          </div>
        )}

        {/* Upload de Imagem Banner */}
        <ImageUpload
          images={formData.bannerImage ? [formData.bannerImage] : []}
          onImagesChange={(images) => handleInputChange('bannerImage', images[0] || '')}
          type="banner"
          maxImages={1}
          title="Imagem Banner"
        />

        {/* Upload de Galeria */}
        <ImageUpload
          images={formData.galleryImages}
          onImagesChange={(images) => handleInputChange('galleryImages', images)}
          type="gallery"
          maxImages={10}
          title="Galeria de Fotos"
        />

        {/* Upload de Plantas Baixas */}
        <ImageUpload
          images={formData.floorPlans}
          onImagesChange={(images) => handleInputChange('floorPlans', images)}
          type="floorplan"
          maxImages={5}
          title="Plantas Baixas"
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}



