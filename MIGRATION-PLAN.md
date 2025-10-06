# 🚀 Plano de Migração - Vercel KV + Blob Storage

## 📋 Contexto
- Empresa grande com volume alto de leads/propriedades
- Integração futura com API Facilita para leads
- Necessidade de performance e confiabilidade

## 🎯 Arquitetura Final

### **Backend:**
```
📦 Vercel KV (Redis)
├── Properties Collection
├── Leads Collection  
├── Cache Layer
└── Session Management

📦 Vercel Blob Storage
├── Property Images
├── Floor Plans
├── Banner Images
└── Gallery Photos

📦 Next.js API Routes
├── /api/properties/*
├── /api/leads/*
├── /api/facilita-webhook
└── /api/upload/*
```

### **Integração Facilita:**
```typescript
// Fluxo de Lead:
Website → Vercel KV → API Facilita → Chatbot Existente
```

## 🔧 Implementação

### **1. Setup Vercel KV**
```bash
npm install @vercel/kv
```

```typescript
// lib/kv.ts
import { kv } from '@vercel/kv'

export class PropertyKV {
  static async getAll(): Promise<Property[]> {
    return await kv.get('properties') || []
  }
  
  static async save(properties: Property[]) {
    await kv.set('properties', properties)
  }
  
  static async add(property: Property) {
    const properties = await this.getAll()
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    properties.push(newProperty)
    await this.save(properties)
    return newProperty
  }
}

export class LeadKV {
  static async add(lead: Lead) {
    const leads = await kv.get('leads') || []
    const newLead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    leads.push(newLead)
    await kv.set('leads', leads)
    
    // Enviar para Facilita
    await this.sendToFacilita(newLead)
    return newLead
  }
  
  static async sendToFacilita(lead: Lead) {
    // API call para o Facilita
    await fetch('SUA_API_FACILITA_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    })
  }
}
```

### **2. Setup Vercel Blob**
```bash
npm install @vercel/blob
```

```typescript
// lib/blob.ts
import { put, del } from '@vercel/blob'

export class ImageBlob {
  static async upload(file: File, path: string): Promise<string> {
    const blob = await put(path, file, {
      access: 'public',
    })
    return blob.url
  }
  
  static async delete(url: string) {
    await del(url)
  }
}
```

### **3. APIs**
```typescript
// app/api/properties/route.ts
import { PropertyKV } from '@/lib/kv'

export async function GET() {
  const properties = await PropertyKV.getAll()
  return Response.json(properties)
}

export async function POST(request: Request) {
  const property = await request.json()
  const newProperty = await PropertyKV.add(property)
  return Response.json(newProperty)
}

// app/api/leads/route.ts
import { LeadKV } from '@/lib/kv'

export async function POST(request: Request) {
  const lead = await request.json()
  const newLead = await LeadKV.add(lead)
  return Response.json(newLead)
}

// app/api/upload/route.ts
import { ImageBlob } from '@/lib/blob'

export async function POST(request: Request) {
  const data = await request.formData()
  const file = data.get('file') as File
  const path = `properties/${Date.now()}-${file.name}`
  const url = await ImageBlob.upload(file, path)
  return Response.json({ url })
}
```

## 📊 Performance para Alto Volume

### **1. Cache Estratégico**
```typescript
// Cache de propriedades por 5 minutos
const CACHE_TTL = 300 // 5 minutos

export async function getCachedProperties() {
  const cached = await kv.get('properties:cache')
  if (cached) return cached
  
  const properties = await PropertyKV.getAll()
  await kv.setex('properties:cache', CACHE_TTL, properties)
  return properties
}
```

### **2. CDN para Imagens**
- Vercel Blob tem CDN automático
- Images otimizadas automaticamente
- Cache global de imagens

### **3. API Rate Limiting**
```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
})

export async function middleware(request: Request) {
  const { success } = await ratelimit.limit(
    request.headers.get('x-forwarded-for') ?? 'anonymous'
  )
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

## 🔄 Migração dos Dados Atuais

### **Script de Migração**
```typescript
// scripts/migrate-to-kv.ts
import { PropertyService } from '@/services/propertyService'
import { PropertyKV } from '@/lib/kv'

async function migrate() {
  // 1. Exportar dados atuais
  const currentData = PropertyService.exportData()
  const properties = JSON.parse(currentData)
  
  // 2. Upload das imagens para Blob
  for (const property of properties) {
    // Converter base64 para Blob Storage
    if (property.bannerImage?.startsWith('data:')) {
      const blob = await uploadBase64ToBlob(property.bannerImage)
      property.bannerImage = blob.url
    }
    // Repetir para outras imagens...
  }
  
  // 3. Salvar no KV
  await PropertyKV.save(properties)
  
  console.log(`Migrados ${properties.length} propriedades`)
}
```

## 📈 Monitoramento

### **Dashboard Admin**
```typescript
// Adicionar métricas no admin:
- Total de propriedades
- Leads por dia/semana/mês  
- Performance de imagens
- Status da integração Facilita
```

## 🚀 Timeline

### **Semana 1:** Setup Vercel KV + Blob
### **Semana 2:** Migração dos dados + APIs
### **Semana 3:** Integração Facilita + Testes
### **Semana 4:** Deploy + Monitoramento

## 💡 Vantagens Desta Arquitetura

✅ **Escala:** Suporta milhares de propriedades/leads
✅ **Performance:** Redis + CDN global
✅ **Confiabilidade:** 99.9% uptime do Vercel
✅ **Integração:** API nativa para Facilita  
✅ **Custo:** Muito baixo para o valor entregue
✅ **Manutenção:** Zero infraestrutura para gerenciar
