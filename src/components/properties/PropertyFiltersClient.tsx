'use client'

import { useState } from 'react'
import PropertyFilters from './PropertyFilters'

interface PropertyFiltersClientProps {
  onFilterChange?: (filters: any) => void;
}

const PropertyFiltersClient = ({ onFilterChange }: PropertyFiltersClientProps) => {
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    category: 'all',
    type: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    parking: 'all',
    priceRange: [500000, 5000000] as [number, number]
  })

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters)
    }
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      location: 'all',
      category: 'all',
      type: 'all',
      bedrooms: 'all',
      bathrooms: 'all',
      parking: 'all',
      priceRange: [500000, 5000000] as [number, number]
    }
    setFilters(clearedFilters)
    if (onFilterChange) {
      onFilterChange(clearedFilters)
    }
  }

  return (
    <PropertyFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
    />
  )
}

export default PropertyFiltersClient
