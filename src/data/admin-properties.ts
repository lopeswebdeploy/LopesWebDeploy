import { Property } from "@/types/property";

export const sampleProperties: Property[] = [
  {
    // 1. APARTAMENTO PREMIUM - SETOR OESTE
    id: 1,
    status: "published",
    featured: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),

    // Informações Básicas
    title: "Borges Landeiro Classic",
    description: "Apartamentos exclusivos no coração do Setor Oeste com acabamento de luxo e localização privilegiada.",
    price: 450000,
    authorId: 1,
    bannerImage: "/property-1.jpg",
    galleryImages: ["/property-1.jpg", "/property-2.jpg"],
    floorPlans: ["/placeholder-floorplan.jpg"],
  },
  {
    // 2. COBERTURA DE LUXO - SETOR MARISTA
    id: 2,
    status: "published",
    featured: true,
    createdAt: new Date("2024-10-02"),
    updatedAt: new Date("2024-10-02"),

    title: "Marista Sky Residences",
    description: "Coberturas de alto padrão com vista panorâmica e lazer completo no Setor Marista.",
    price: 1200000,
    authorId: 2,
    bannerImage: "/property-2.jpg",
    galleryImages: ["/property-2.jpg", "/property-3.jpg"],
    floorPlans: ["/placeholder-floorplan.jpg"],
  },
  {
    // 3. CASA COM PISCINA - JARDIM EUROPA
    id: 3,
    status: "published",
    featured: false,
    createdAt: new Date("2024-10-03"),
    updatedAt: new Date("2024-10-03"),

    title: "Casa Jardim Europa",
    description: "Casa térrea com 3 suítes, piscina e área gourmet em condomínio de luxo.",
    price: 980000,
    authorId: 1,
    bannerImage: "/property-3.jpg",
    galleryImages: ["/property-3.jpg", "/property-1.jpg"],
    floorPlans: ["/placeholder-floorplan.jpg"],
  },
  {
    // 4. LOFT URBANO - SETOR UNIVERSITÁRIO
    id: 4,
    status: "draft",
    featured: false,
    createdAt: new Date("2024-10-04"),
    updatedAt: new Date("2024-10-04"),

    title: "Loft Urbano Setor Universitário",
    description: "Loft moderno e compacto, ideal para estudantes ou jovens casais, próximo à universidade.",
    price: 280000,
    authorId: 2,
    bannerImage: "/hero-luxury-building.jpg",
    galleryImages: ["/hero-luxury-building.jpg", "/property-2.jpg"],
    floorPlans: ["/placeholder-floorplan.jpg"],
  }
];