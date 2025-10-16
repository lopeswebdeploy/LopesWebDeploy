// Types para o sistema imobiliário
import { Property, User, Lead } from '@prisma/client'

export type { Property, User, Lead }

export interface PropertyWithAuthor extends Property {
  author: User
}

export interface PropertyFormData {
  title: string
  shortDescription: string
  fullDescription: string
  propertyType: string
  transactionType: string
  price: number
  bedrooms: number
  bathrooms: number
  suites: number
  parkingSpaces: number
  area: number
  amenities: string[]
  address: string
  googleMapsIframe: string
  bannerImage?: string
  galleryImages: string[]
  floorPlans: string[]
  apartmentVariants?: ApartmentVariant[]
  isLancamento: boolean
  regionAdvantages: string
}

export interface ApartmentVariant {
  id: string
  name: string
  bedrooms: number
  bathrooms: number
  area: number
  floorPlan: string
  gallery: string[]
  price?: number
}

export interface LeadFormData {
  name: string
  phone: string
  email?: string
  message?: string
  propertyId?: number
}

export interface UserFormData {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface PropertyFilters {
  propertyType?: string
  transactionType?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  featured?: boolean
  visible?: boolean
  authorId?: number
  search?: string
}

