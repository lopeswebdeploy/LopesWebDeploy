# 🚀 Plano de Deploy e Migração para Produção

## 📋 Visão Geral

Este documento detalha o plano completo para migrar o sistema de imóveis do desenvolvimento local (localStorage) para produção com Vercel, focando especialmente na **resolução e qualidade das imagens**.

## 🎯 Objetivos Principais

- ✅ **Imagens em qualidade original** (sem compressão desnecessária)
- ✅ **Performance otimizada** com CDN global
- ✅ **Escalabilidade ilimitada** para milhares de propriedades
- ✅ **Confiabilidade 99.9%** com backup automático
- ✅ **Migração sem perda de dados**

## 🏗️ Arquitetura Futura

### Stack Tecnológica
```
Frontend: Next.js 14 (App Router)
Backend: Vercel Functions (Serverless)
Database: Vercel Postgres
Storage: Vercel Blob Storage
CDN: Vercel Edge Network
```

### Estrutura de Dados
```typescript
// Propriedade no banco de dados
interface Property {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  embedUrl: string;
  
  // URLs das imagens (não base64)
  bannerImage: string; // https://blob.vercel-storage.com/...
  images: string[];    // Array de URLs
  photoGallery: string[];
  floorPlan: string;
  
  // Metadados
  bedrooms: number;
  bathrooms: number;
  parking: number;
  suites: number;
  
  // Controle
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── api/
│   │   ├── properties/
│   │   │   ├── route.ts          # CRUD de propriedades
│   │   │   └── [id]/route.ts     # Operações específicas
│   │   └── upload/
│   │       ├── banner/route.ts   # Upload de banner
│   │       ├── gallery/route.ts  # Upload de galeria
│   │       └── floorplan/route.ts # Upload de planta
│   └── admin/
│       └── page.tsx              # Admin panel
├── services/
│   ├── propertyService.ts        # Serviço de propriedades
│   ├── uploadService.ts          # Serviço de upload
│   └── database.ts               # Conexão com banco
├── types/
│   └── property.ts               # Tipos TypeScript
└── utils/
    ├── imageUtils.ts             # Utilitários de imagem
    └── validation.ts             # Validações
```

## 🔧 Implementação Detalhada

### 1. Configuração do Vercel

#### vercel.json
```json
{
  "functions": {
    "app/api/upload/*/route.ts": {
      "maxDuration": 30
    },
    "app/api/properties/route.ts": {
      "maxDuration": 10
    }
  },
  "env": {
    "BLOB_READ_WRITE_TOKEN": "@blob-read-write-token",
    "POSTGRES_URL": "@postgres-url"
  }
}
```

#### package.json (dependências)
```json
{
  "dependencies": {
    "@vercel/blob": "^0.15.0",
    "@vercel/postgres": "^0.5.0",
    "sharp": "^0.32.0"
  }
}
```

### 2. Serviço de Upload Otimizado

#### src/services/uploadService.ts
```typescript
import { put } from '@vercel/blob';
import sharp from 'sharp';

export class UploadService {
  // Upload com otimização inteligente
  static async uploadImage(
    file: File, 
    propertyId: string, 
    type: 'banner' | 'gallery' | 'floorplan',
    options: {
      maxWidth?: number;
      quality?: number;
      format?: 'jpeg' | 'webp' | 'png';
    } = {}
  ): Promise<string> {
    const { maxWidth = 1920, quality = 90, format = 'jpeg' } = options;
    
    // Processar imagem com Sharp (servidor)
    const buffer = await file.arrayBuffer();
    const processedBuffer = await sharp(buffer)
      .resize(maxWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality })
      .toBuffer();
    
    // Upload para Vercel Blob
    const filename = `properties/${propertyId}/${type}-${Date.now()}.${format}`;
    const blob = await put(filename, processedBuffer, {
      access: 'public',
      contentType: `image/${format}`
    });
    
    return blob.url;
  }
  
  // Upload múltiplo para galeria
  static async uploadGallery(
    files: File[], 
    propertyId: string
  ): Promise<string[]> {
    const uploads = files.map(file => 
      this.uploadImage(file, propertyId, 'gallery', {
        maxWidth: 1200,
        quality: 85
      })
    );
    
    return Promise.all(uploads);
  }
}
```

### 3. API Routes

#### src/app/api/properties/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { UploadService } from '@/services/uploadService';

// GET - Listar propriedades
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM properties 
      WHERE is_visible = true 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao carregar propriedades' }, { status: 500 });
  }
}

// POST - Criar propriedade
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const propertyData = JSON.parse(formData.get('property') as string);
    
    // Upload das imagens
    const bannerFile = formData.get('banner') as File;
    const galleryFiles = formData.getAll('gallery') as File[];
    const floorplanFile = formData.get('floorplan') as File;
    
    const propertyId = Date.now().toString();
    
    // Upload banner
    if (bannerFile) {
      propertyData.bannerImage = await UploadService.uploadImage(
        bannerFile, 
        propertyId, 
        'banner',
        { maxWidth: 1920, quality: 90 }
      );
    }
    
    // Upload galeria
    if (galleryFiles.length > 0) {
      propertyData.images = await UploadService.uploadGallery(galleryFiles, propertyId);
    }
    
    // Upload planta
    if (floorplanFile) {
      propertyData.floorPlan = await UploadService.uploadImage(
        floorplanFile, 
        propertyId, 
        'floorplan',
        { maxWidth: 1200, quality: 85 }
      );
    }
    
    // Salvar no banco
    const { rows } = await sql`
      INSERT INTO properties (
        id, title, price, description, location, embed_url,
        banner_image, images, photo_gallery, floor_plan,
        bedrooms, bathrooms, parking, suites,
        is_featured, is_visible, created_at, updated_at
      ) VALUES (
        ${propertyId}, ${propertyData.title}, ${propertyData.price}, 
        ${propertyData.description}, ${propertyData.location}, ${propertyData.embedUrl},
        ${propertyData.bannerImage}, ${JSON.stringify(propertyData.images)}, 
        ${JSON.stringify(propertyData.photoGallery)}, ${propertyData.floorPlan},
        ${propertyData.bedrooms}, ${propertyData.bathrooms}, 
        ${propertyData.parking}, ${propertyData.suites},
        ${propertyData.isFeatured || false}, ${propertyData.isVisible !== false},
        NOW(), NOW()
      ) RETURNING *
    `;
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar propriedade:', error);
    return NextResponse.json({ error: 'Erro ao criar propriedade' }, { status: 500 });
  }
}
```

### 4. Schema do Banco de Dados

#### migrations/001_create_properties.sql
```sql
CREATE TABLE properties (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  embed_url TEXT,
  
  -- Imagens (URLs)
  banner_image TEXT,
  images JSONB DEFAULT '[]',
  photo_gallery JSONB DEFAULT '[]',
  floor_plan TEXT,
  
  -- Características
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  
  -- Controle
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_properties_visible ON properties(is_visible);
CREATE INDEX idx_properties_featured ON properties(is_featured);
CREATE INDEX idx_properties_created ON properties(created_at DESC);
```

### 5. PropertyService Atualizado

#### src/services/propertyService.ts
```typescript
export class PropertyService {
  // Carregar propriedades da API
  static async loadProperties(): Promise<Property[]> {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Erro ao carregar propriedades');
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      return [];
    }
  }
  
  // Criar propriedade via API
  static async addProperty(property: Property, files: {
    banner?: File;
    gallery?: File[];
    floorplan?: File;
  }): Promise<Property> {
    const formData = new FormData();
    formData.append('property', JSON.stringify(property));
    
    if (files.banner) formData.append('banner', files.banner);
    if (files.gallery) files.gallery.forEach(file => formData.append('gallery', file));
    if (files.floorplan) formData.append('floorplan', files.floorplan);
    
    const response = await fetch('/api/properties', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Erro ao criar propriedade');
    return await response.json();
  }
  
  // Buscar propriedade por ID
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar propriedade:', error);
      return null;
    }
  }
}
```

## 🚀 Plano de Migração

### Fase 1: Preparação (1-2 dias)
- [ ] Configurar projeto Vercel
- [ ] Instalar dependências (@vercel/blob, @vercel/postgres, sharp)
- [ ] Configurar variáveis de ambiente
- [ ] Criar schema do banco de dados

### Fase 2: Desenvolvimento (3-5 dias)
- [ ] Implementar UploadService
- [ ] Criar API routes
- [ ] Atualizar PropertyService
- [ ] Migrar componentes do admin
- [ ] Testes locais

### Fase 3: Migração de Dados (1 dia)
- [ ] Script para migrar dados do localStorage
- [ ] Upload de imagens existentes
- [ ] Validação de integridade

### Fase 4: Deploy e Testes (1-2 dias)
- [ ] Deploy para Vercel
- [ ] Testes em produção
- [ ] Otimizações de performance
- [ ] Monitoramento

## 📊 Benefícios da Migração

### Performance
- **CDN Global**: Imagens servidas do edge mais próximo
- **Otimização Automática**: Sharp processa imagens no servidor
- **Cache Inteligente**: Vercel cacheia automaticamente
- **Lazy Loading**: Carregamento sob demanda

### Qualidade das Imagens
- **Resolução Original**: Sem compressão desnecessária
- **Formatos Otimizados**: WebP quando suportado
- **Múltiplas Resoluções**: Diferentes tamanhos para diferentes usos
- **Qualidade Configurável**: 90% para banners, 85% para galeria

### Escalabilidade
- **Storage Ilimitado**: Vercel Blob sem limites
- **Banco Robusto**: Postgres com índices otimizados
- **Serverless**: Escala automaticamente
- **Global**: Disponível mundialmente

## 🔍 Monitoramento

### Métricas Importantes
- **Tempo de upload**: < 5s para imagens
- **Tempo de carregamento**: < 2s para páginas
- **Disponibilidade**: > 99.9%
- **Erro rate**: < 0.1%

### Ferramentas
- **Vercel Analytics**: Performance e uso
- **Vercel Speed Insights**: Core Web Vitals
- **Sentry**: Monitoramento de erros
- **Postgres Metrics**: Performance do banco

## 💰 Estimativa de Custos

### Vercel Pro Plan
- **Bandwidth**: $40/TB
- **Function Executions**: $2/milhão
- **Postgres**: $20/mês (1GB)
- **Blob Storage**: $0.15/GB/mês

### Estimativa Mensal
- **Desenvolvimento**: ~$50-100/mês
- **Produção (médio)**: ~$100-200/mês
- **Produção (alto)**: ~$200-500/mês

## 🎯 Conclusão

Esta migração transformará o sistema de um protótipo funcional para uma **aplicação profissional de produção**, com:

- ✅ **Imagens em qualidade máxima**
- ✅ **Performance otimizada**
- ✅ **Escalabilidade ilimitada**
- ✅ **Confiabilidade empresarial**

O investimento em tempo e recursos será **amplamente compensado** pela qualidade e confiabilidade do sistema final.
