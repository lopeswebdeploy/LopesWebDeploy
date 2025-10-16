'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface FilterState {
  minPrice: number
  maxPrice: number
  minArea: number
  maxArea: number
  propertyType: string
  location: string
}

export default function PropertyFilter() {
  const router = useRouter()
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 15000, // Default value 15 thousand
    minArea: 0,
    maxArea: 40,
    propertyType: '',
    location: ''
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice < 2000000) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.minArea > 0) params.set('minArea', filters.minArea.toString())
    if (filters.maxArea < 500) params.set('maxArea', filters.maxArea.toString())
    if (filters.propertyType) params.set('propertyType', filters.propertyType)
    if (filters.location) params.set('location', filters.location)

    // Redireciona para a página de imóveis com os filtros
    router.push(`/imoveis?${params.toString()}`)
  }

  const propertyTypes = [
    { value: 'lancamentos', label: 'Lançamentos' },
    { value: 'pronto-morar', label: 'Pronto p/ Morar' },
    { value: 'salas-comerciais', label: 'Salas Comerciais' },
    { value: 'lotes', label: 'Lotes' },
    { value: 'condominios', label: 'Condomínios' }
  ]

        return (
          <div className="text-white p-8 rounded-2xl h-full flex flex-col" style={{ backgroundColor: '#000000' }}>
      <h2 className="text-2xl font-bold mb-8 text-left">
        <div>Encontre o que</div>
        <div>procura aqui<span className="text-brand-coral">.</span></div>
      </h2>

            <div className="space-y-6 flex-1 flex flex-col justify-between">
        {/* Valor */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold">VALOR</label>
            <span className="text-sm text-gray-300">
              {formatPrice(filters.maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="5000000" // Max value 5 million
            step="10000"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer slider"
            style={{ backgroundColor: '#1a1a1a' }}
          />
        </div>

        {/* Metragem */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-semibold">METRAGEM</label>
            <span className="text-sm text-gray-300">
              {filters.maxArea}m²
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="5"
            value={filters.maxArea}
            onChange={(e) => setFilters(prev => ({ ...prev, maxArea: Number(e.target.value) }))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer slider"
            style={{ backgroundColor: '#1a1a1a' }}
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-lg font-semibold mb-4">TIPO</label>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  propertyType: prev.propertyType === type.value ? '' : type.value 
                }))}
                       className={`p-3 rounded-lg border transition-all duration-200 ${
                         filters.propertyType === type.value
                           ? 'border-gray-400 text-white'
                           : 'border-gray-500 text-gray-300'
                       }`}
                       style={{
                         backgroundColor: filters.propertyType === type.value ? '#333333' : '#1a1a1a'
                       }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase">{type.label}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    filters.propertyType === type.value ? 'bg-black' : 'bg-gray-600'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Localização */}
        <div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-semibold whitespace-nowrap">LOCALIZAÇÃO</label>
                   <input
                     type="text"
                     placeholder="NOME DO BAIRRO/SETOR"
                     value={filters.location}
                     onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                     className="flex-1 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-coral"
                     style={{ backgroundColor: '#1a1a1a' }}
                   />
            <button
              onClick={handleSearch}
              className="bg-brand-coral hover:bg-brand-coral-dark text-white w-10 h-10 rounded-full font-semibold text-xs flex items-center justify-center"
            >
              IR
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
               .slider::-webkit-slider-track {
                 background: #1a1a1a;
                 border-radius: 10px;
                 height: 8px;
               }

               .slider::-moz-range-track {
                 background: #1a1a1a;
                 border-radius: 10px;
                 height: 8px;
               }

               .slider::-webkit-slider-runnable-track {
                 background: linear-gradient(to right, white 0%, white var(--value, 0%), #1a1a1a var(--value, 0%), #1a1a1a 100%);
                 border-radius: 10px;
                 height: 8px;
               }

               .slider {
                 background: linear-gradient(to right, white 0%, white 4%, #1a1a1a 4%, #1a1a1a 100%);
               }
      `}</style>
    </div>
  )
}
