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



