import { Property } from "@/types/property";

export const sampleProperties: Property[] = [
  {
    // 1. APARTAMENTO PREMIUM - SETOR OESTE
    id: "1",
    status: "ativo",
    isFeatured: true,
    isVisible: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),

    // Informações Básicas
    title: "Borges Landeiro Classic",
    description: "Apartamentos exclusivos no coração do Setor Oeste com acabamento de luxo e localização privilegiada.",
    fullDescription: "O Borges Landeiro Classic representa o que há de mais moderno em empreendimentos residenciais em Goiânia. Localizado no valorizado Setor Oeste, o projeto oferece apartamentos com acabamentos de primeira qualidade, incluindo piso porcelanato 80x80, bancadas em quartzo, cozinha gourmet integrada e automação residencial. O condomínio conta com área de lazer completa, incluindo piscina adulto e infantil, academia, salão de festas, playground e quadra poliesportiva.",
    category: "venda",
    type: "Premium",
    propertyType: "apartamento",

    // Localização
    location: "Setor Oeste",
    state: "Goiânia",
    address: "Rua T-25, Quadra 32, Setor Oeste, Goiânia - GO",
    coordinates: { lat: -16.6869, lng: -49.2648 },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.1!2d-49.2648!3d-16.6869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQxJzEzLjIiUyA0OcKwMTUnNTMuMyJX!5e0!3m2!1spt-BR!2sbr",

    // Características Físicas
    bedrooms: 4,
    bathrooms: 3,
    suites: 2,
    parking: 3,
    area: "165m²",
    balconyTypes: ["Varanda gourmet", "Terraço", "Sacada técnica"],

    // Financeiro
    price: "R$ 1.850.000",
    apartmentOptions: [
      {
        id: "apt-1-120",
        unitType: "Padrão",
        bedrooms: 3,
        bathrooms: 2,
        suites: 1,
        parking: 2,
        area: "120m²",
        price: "R$ 1.450.000",
        floor: 3,
        available: true,
        floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
        features: ["Varanda gourmet", "Cozinha americana", "Suíte master", "2 vagas"],
        description: "Apartamento moderno com excelente layout e acabamento premium."
      },
      {
        id: "apt-1-165",
        unitType: "Premium",
        bedrooms: 4,
        bathrooms: 3,
        suites: 2,
        parking: 3,
        area: "165m²",
        price: "R$ 1.850.000",
        floor: 8,
        available: true,
        floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
        features: ["Varanda gourmet", "Terraço", "2 suítes", "3 vagas", "Escritório"],
        description: "Planta ampla com escritório, ideal para home office e vida familiar."
      },
      {
        id: "apt-1-180",
        unitType: "Luxury",
        bedrooms: 4,
        bathrooms: 4,
        suites: 3,
        parking: 3,
        area: "180m²",
        price: "R$ 2.100.000",
        floor: 12,
        available: false,
        floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
        features: ["Varanda gourmet", "Terraço premium", "2 suítes", "3 vagas", "Lavabo"],
        description: "Unidade de cobertura com acabamento de luxo e vista panorâmica."
      }
    ],

    // Empreendimento
    developer: "Borges Landeiro Empreendimentos",
    deliveryDate: "Pronto para morar",
    availability: "5 unidades disponíveis",

    // Mídia
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    bannerImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
    floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    photoGallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],

    // Detalhes
    characteristics: [
      "Piso porcelanato 80x80",
      "Bancadas em quartzo",
      "Cozinha gourmet integrada",
      "Automação residencial",
      "Ar condicionado nos quartos",
      "Portaria 24h",
      "Sistema de segurança",
      "Elevador de alta velocidade"
    ],
    locationBenefits: [
      "2 km do Shopping Flamboyant",
      "300m do Parque Vaca Brava",
      "1.5 km do Hospital das Clínicas",
      "800m da UFG Campus Samambaia",
      "5 min do centro da cidade",
      "Próximo a restaurantes e cafés"
    ],
    differentials: [
      "Localização privilegiada no Setor Oeste",
      "Acabamento de alto luxo",
      "Área de lazer completa",
      "Projeto arquitetônico premiado",
      "Construtora renomada",
      "Valorização garantida"
    ]
  },

  {
    // 2. COBERTURA EXCLUSIVA - SETOR MARISTA
    id: "2",
    status: "ativo",
    isFeatured: true,
    isVisible: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),

    title: "Marista Sky Residences",
    description: "Cobertura duplex com vista panorâmica de 360° da cidade, piscina privativa e área gourmet completa.",
    fullDescription: "Uma cobertura única no Setor Marista, oferecendo o que há de mais exclusivo em moradia urbana. Com 250m² distribuídos em dois pavimentos, esta unidade conta com piscina privativa, sauna, área gourmet com churrasqueira, jardim suspenso e vista panorâmica deslumbrante de Goiânia. O acabamento inclui mármore travertino, madeira de demolição, sistema de som ambiente e iluminação LED automatizada.",
    category: "investimento",
    type: "Exclusivo",
    propertyType: "cobertura",

    location: "Setor Marista",
    state: "Goiânia",
    address: "Rua 1125, Quadra C-35, Setor Marista, Goiânia - GO",
    coordinates: { lat: -16.6908, lng: -49.2692 },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.2!2d-49.2692!3d-16.6908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQxJzI3LjAiUyA0OcKwMTYnMDkuMSJX!5e0!3m2!1spt-BR!2sbr",

    bedrooms: 5,
    bathrooms: 4,
    suites: 3,
    parking: 4,
    area: "250m²",
    balconyTypes: ["Terraço panorâmico", "Varanda gourmet", "Jardim suspenso"],

    price: "R$ 3.200.000",
    apartmentOptions: [
      {
        id: "cob-1",
        bedrooms: 5,
        area: "250m²",
        price: "R$ 3.200.000",
        floor: 15,
        available: true,
        features: ["Piscina privativa", "Sauna", "Vista 360°", "4 vagas", "Elevador privativo"]
      }
    ],

    developer: "Marista Construtora",
    deliveryDate: "Março 2025",
    availability: "Unidade única",

    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800"
    ],
    bannerImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
    floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    photoGallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
      "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800"
    ],

    characteristics: [
      "Mármore travertino",
      "Madeira de demolição",
      "Piscina com borda infinita",
      "Sauna finlandesa",
      "Sistema de som ambiente",
      "Iluminação LED automatizada",
      "Elevador privativo",
      "Jardim suspenso"
    ],
    locationBenefits: [
      "1 km do Shopping Bougainville",
      "500m da Av. 85 (principal via)",
      "2 km do Lago das Rosas",
      "1.5 km da UFG Campus Humanitas",
      "Área nobre consolidada",
      "Próximo a bancos e comércios"
    ],
    differentials: [
      "Vista panorâmica única",
      "Piscina privativa na cobertura",
      "Acabamento ultra luxo",
      "Localização premium",
      "Unidade exclusiva",
      "Alto potencial de valorização"
    ]
  },

  {
    // 3. LANÇAMENTO MODERNO - SETOR BUENO
    id: "3",
    status: "ativo",
    isFeatured: false,
    isVisible: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),

    title: "Bueno Lifestyle Residence",
    description: "Lançamento no Setor Bueno com conceito de lifestyle, smart home e área de lazer inovadora.",
    fullDescription: "O mais novo conceito em moradia inteligente chega ao Setor Bueno. O Bueno Lifestyle Residence oferece apartamentos com tecnologia smart home integrada, academia com personal trainer, coworking, pet place, rooftop com piscina e muito mais. Cada unidade foi projetada para o morador moderno que busca praticidade, conforto e qualidade de vida em um dos bairros mais valorizados de Goiânia.",
    category: "venda",
    type: "Lançamento",
    propertyType: "apartamento",

    location: "Setor Bueno",
    state: "Goiânia",
    address: "Avenida T-4, Quadra 115, Setor Bueno, Goiânia - GO",
    coordinates: { lat: -16.6750, lng: -49.2540 },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.0!2d-49.2540!3d-16.6750!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQwJzMwLjAiUyA0OcKwMTUnMTQuNCJX!5e0!3m2!1spt-BR!2sbr",

    bedrooms: 2,
    bathrooms: 2,
    suites: 1,
    parking: 2,
    area: "95m²",
    balconyTypes: ["Varanda integrada", "Terraço gourmet"],

    price: "R$ 850.000",
    apartmentOptions: [
      {
        id: "but-1-70",
        unitType: "Smart Studio",
        bedrooms: 2,
        bathrooms: 2,
        suites: 1,
        parking: 1,
        area: "70m²",
        price: "R$ 650.000",
        floor: 4,
        available: true,
        floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
        features: ["Smart home", "Varanda integrada", "1 suíte", "1 vaga"],
        description: "Apartamento compacto e inteligente, perfeito para jovens profissionais."
      },
      {
        id: "but-1-95",
        unitType: "Smart Living",
        bedrooms: 2,
        bathrooms: 2,
        suites: 1,
        parking: 2,
        area: "95m²",
        price: "R$ 850.000",
        floor: 8,
        available: true,
        floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
        features: ["Smart home", "Terraço gourmet", "1 suíte", "2 vagas"],
        description: "Apartamento com terraço gourmet e tecnologia smart home integrada."
      },
      {
        id: "but-1-110",
        unitType: "Smart Family",
        bedrooms: 3,
        bathrooms: 3,
        suites: 2,
        parking: 2,
        area: "110m²",
        price: "R$ 980.000",
        floor: 12,
        available: true,
        floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600",
        features: ["Smart home", "Terraço premium", "2 suítes", "2 vagas"],
        description: "Apartamento familiar com automação completa e espaços amplos."
      }
    ],

    developer: "Bueno Incorporações",
    deliveryDate: "Setembro 2025",
    availability: "12 unidades disponíveis",

    images: [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800"
    ],
    bannerImage: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1200",
    floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    photoGallery: [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
    ],

    characteristics: [
      "Tecnologia smart home",
      "Controle por aplicativo",
      "Piso laminado premium",
      "Cozinha americana integrada",
      "Banheiros com revestimento 3D",
      "Ar condicionado inverter",
      "Tomadas USB integradas",
      "Fechadura digital"
    ],
    locationBenefits: [
      "500m do Shopping Cerrado",
      "300m da Av. T-4 (transporte público)",
      "1 km do Parque Areião",
      "800m da Faculdade Alfa",
      "Área de fácil acesso",
      "Comércio diversificado próximo"
    ],
    differentials: [
      "Primeiro smart building de Goiânia",
      "Rooftop com piscina infinita",
      "Academia com personal trainer",
      "Coworking integrado",
      "Pet place completo",
      "Sustentabilidade certificada"
    ]
  },

  {
    // 4. CASA DE ALTO PADRÃO - JARDIM EUROPA
    id: "4",
    status: "ativo",
    isFeatured: true,
    isVisible: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),

    title: "Casa Europa Garden",
    description: "Casa térrea de alto padrão com piscina, jardim paisagístico e área gourmet em condomínio fechado.",
    fullDescription: "Localizada no exclusivo condomínio Jardim Europa Residence, esta casa representa o que há de melhor em moradia familiar. Com 280m² de área construída em terreno de 500m², a residência oferece amplos ambientes integrados, suíte master com closet e hidromassagem, piscina com cascata, jardim paisagístico assinado e área gourmet completa com forno a lenha. O condomínio oferece segurança 24h, clube, quadras e área verde preservada.",
    category: "venda",
    type: "Premium",
    propertyType: "casa",

    location: "Jardim Europa",
    state: "Goiânia",
    address: "Rua JE-15, Quadra 8, Jardim Europa, Goiânia - GO",
    coordinates: { lat: -16.7000, lng: -49.2800 },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.5!2d-49.2800!3d-16.7000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQyJzAwLjAiUyA0OcKwMTYnNDguMCJX!5e0!3m2!1spt-BR!2sbr",

    bedrooms: 4,
    bathrooms: 4,
    suites: 3,
    parking: 4,
    area: "280m²",
    balconyTypes: ["Varanda frontal", "Área gourmet coberta", "Terraço jardim"],

    price: "R$ 2.800.000",
    apartmentOptions: [
      {
        id: "casa-1",
        bedrooms: 4,
        area: "280m²",
        price: "R$ 2.800.000",
        floor: 1,
        available: true,
        features: ["Piscina com cascata", "Jardim paisagístico", "Área gourmet", "4 vagas cobertas"]
      }
    ],

    developer: "Europa Construtora",
    deliveryDate: "Pronto para morar",
    availability: "Unidade única",

    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800",
      "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    bannerImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200",
    floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    photoGallery: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800",
      "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800"
    ],

    characteristics: [
      "Piscina com cascata e iluminação LED",
      "Jardim paisagístico assinado",
      "Área gourmet com forno a lenha",
      "Suíte master com closet",
      "Banheira de hidromassagem",
      "Piso porcelanato retificado",
      "Sistema de segurança completo",
      "Garagem coberta para 4 carros"
    ],
    locationBenefits: [
      "Condomínio fechado com segurança 24h",
      "3 km do Shopping Passeio das Águas",
      "2 km do Hospital Jayme Santos Neves",
      "1.5 km da escola Objetivo",
      "Área nobre e valorizada",
      "Próximo a clubes e academias"
    ],
    differentials: [
      "Casa térrea sem escadas",
      "Projeto arquitetônico exclusivo",
      "Jardim com espécies nativas",
      "Localização privilegiada",
      "Condomínio com infraestrutura completa",
      "Alto padrão de acabamento"
    ]
  },

  {
    // 5. LOFT MODERNO - SETOR UNIVERSITÁRIO  
    id: "5",
    status: "ativo",
    isFeatured: false,
    isVisible: true,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),

    title: "University Loft Studios",
    description: "Lofts modernos para jovens profissionais e estudantes, com conceito inovador e localização estratégica.",
    fullDescription: "Pensado para a nova geração de profissionais e universitários, o University Loft Studios oferece conceito inovador de moradia urbana no Setor Universitário. Os lofts contam com pé direito duplo, mezanino funcional, cozinha integrada e design contemporâneo. O empreendimento oferece coworking, lavanderia compartilhada, bike sharing, academia 24h e localização estratégica próxima à UFG e principais corredores de transporte da cidade.",
    category: "aluguel",
    type: "Lançamento",
    propertyType: "loft",

    location: "Setor Universitário",
    state: "Goiânia",
    address: "Avenida Universitária, Quadra 86, Setor Universitário, Goiânia - GO",
    coordinates: { lat: -16.6050, lng: -49.2700 },
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.8!2d-49.2700!3d-16.6050!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDM2JzE4LjAiUyA0OcKwMTYnMTIuMCJX!5e0!3m2!1spt-BR!2sbr",

    bedrooms: 1,
    bathrooms: 1,
    suites: 0,
    parking: 1,
    area: "45m²",
    balconyTypes: ["Varanda americana"],

    price: "R$ 2.200",
    apartmentOptions: [
      {
        id: "loft-35",
        bedrooms: 1,
        area: "35m²",
        price: "R$ 1.800",
        floor: 3,
        available: true,
        features: ["Mezanino", "Cozinha integrada", "1 vaga", "Mobiliado"]
      },
      {
        id: "loft-45",
        bedrooms: 1,
        area: "45m²",
        price: "R$ 2.200",
        floor: 5,
        available: true,
        features: ["Mezanino premium", "Varanda", "1 vaga", "Semi-mobiliado"]
      },
      {
        id: "loft-55",
        bedrooms: 1,
        area: "55m²",
        price: "R$ 2.600",
        floor: 8,
        available: true,
        features: ["Mezanino duplo", "Terraço", "1 vaga", "Totalmente mobiliado"]
      }
    ],

    developer: "University Incorporações",
    deliveryDate: "Junho 2025",
    availability: "20 unidades para locação",

    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    bannerImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
    floorPlan: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    photoGallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],

    characteristics: [
      "Pé direito duplo",
      "Mezanino funcional",
      "Cozinha integrada moderna",
      "Iluminação LED",
      "Piso laminado",
      "Banheiro com box de vidro",
      "Ar condicionado split",
      "Móveis planejados"
    ],
    locationBenefits: [
      "300m da UFG Campus Samambaia",
      "500m da Av. Universitária (ônibus)",
      "1 km da Praça Universitária",
      "800m de restaurantes e bares",
      "Área jovem e dinâmica",
      "Fácil acesso ao centro"
    ],
    differentials: [
      "Conceito loft inovador",
      "Perfeito para jovens profissionais",
      "Coworking integrado ao prédio",
      "Bike sharing disponível",
      "Academia 24h",
      "Valor acessível de aluguel"
    ]
  }
];