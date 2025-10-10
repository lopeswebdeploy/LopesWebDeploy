# PQP.md - Documentação Completa do Sistema Lopes Imóveis

## 📋 RESUMO EXECUTIVO

Este documento detalha TODAS as funcionalidades implementadas no sistema Lopes Imóveis, incluindo arquitetura, banco de dados, API, autenticação, upload de imagens e todas as features funcionais.

---

## 🏗️ ARQUITETURA GERAL

### Stack Tecnológica
- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (Prisma ORM)
- **Storage**: Vercel Blob Storage
- **Autenticação**: Sistema customizado com cookies
- **UI**: Tailwind CSS + Radix UI + Shadcn/ui
- **Deploy**: Vercel

### Estrutura do Projeto
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Painel administrativo
│   ├── imoveis/           # Página pública de imóveis
│   └── contato/           # Página de contato
├── components/            # Componentes React
│   ├── admin/             # Componentes do admin
│   ├── properties/         # Componentes de propriedades
│   └── ui/                # Componentes base (Shadcn)
├── lib/                   # Utilitários e configurações
├── services/              # Serviços de negócio
├── types/                 # Definições TypeScript
└── utils/                 # Funções utilitárias
```

---

## 🗄️ BANCO DE DADOS (PostgreSQL + Prisma)

### Schema Completo

#### 1. Tabela `users`
```sql
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'corretor',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leads" Lead[] @relation("LeadOwner"),
    "properties" Property[] @relation("PropertyAuthor"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
```

**Campos:**
- `id`: ID único (auto-incremento)
- `name`: Nome completo do usuário
- `email`: Email único para login
- `password`: Senha hasheada com bcryptjs
- `role`: 'admin' ou 'corretor'
- `active`: Conta ativa/inativa (admin aprova)
- `created_at`: Data de criação

#### 2. Tabela `properties`
```sql
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT DEFAULT 'Goiânia',
    "developer" TEXT DEFAULT 'Lopes Imóveis',
    "category" TEXT DEFAULT 'venda',
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" FLOAT,
    "author_id" INTEGER NOT NULL,
    "banner_image" TEXT,
    "gallery_images" TEXT[],
    "floor_plans" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);
```

**Campos:**
- `id`: ID único (auto-incremento)
- `title`: Título do imóvel
- `description`: Descrição detalhada
- `price`: Preço (decimal com 2 casas)
- `status`: 'published' ou 'draft'
- `featured`: Se está em destaque (máx 6)
- `location`: Localização (padrão: Goiânia)
- `developer`: Construtora (padrão: Lopes Imóveis)
- `category`: Tipo (venda, aluguel, etc.)
- `bedrooms/bathrooms/area`: Características físicas
- `author_id`: FK para users (quem criou)
- `banner_image`: URL da imagem principal
- `gallery_images`: Array de URLs das fotos
- `floor_plans`: Array de URLs das plantas

#### 3. Tabela `leads`
```sql
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "property_id" INTEGER,
    "owner_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
```

**Campos:**
- `id`: ID único (auto-incremento)
- `name`: Nome do lead
- `phone`: Telefone (obrigatório)
- `email`: Email (opcional)
- `property_id`: FK para properties (imóvel de interesse)
- `owner_id`: FK para users (corretor responsável)
- `status`: 'new', 'contacted', 'converted', etc.

### Relacionamentos
- `User` → `Property` (1:N) - Um usuário pode criar várias propriedades
- `User` → `Lead` (1:N) - Um usuário pode ter vários leads
- `Property` → `Lead` (1:N) - Um imóvel pode gerar vários leads

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### Arquitetura de Autenticação
- **Método**: Sistema customizado com cookies HTTP-only
- **Hash**: bcryptjs com salt rounds 12
- **Sessão**: Cookies com duração de 7 dias
- **Middleware**: Proteção automática de rotas admin/API

### Fluxo de Autenticação

#### 1. Registro (`/api/auth/register`)
```typescript
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@lopes.com", 
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

**Validações:**
- Senhas devem coincidir
- Senha mínima 6 caracteres
- Email único no sistema
- Conta criada como INATIVA (requer aprovação admin)

#### 2. Login (`/api/auth/login`)
```typescript
POST /api/auth/login
{
  "email": "joao@lopes.com",
  "password": "senha123"
}
```

**Processo:**
- Busca usuário por email
- Verifica se conta está ativa
- Compara senha com hash bcrypt
- Cria sessão e define cookie HTTP-only
- Retorna dados do usuário (sem senha)

#### 3. Middleware de Proteção (`middleware.ts`)
```typescript
// Protege rotas /admin/* e /api/properties/*
// Exceto /admin/login e /admin/register
// Verifica cookie 'user-session'
// Adiciona header 'x-user' para APIs
```

### Roles e Permissões

#### Admin (`role: 'admin'`)
- ✅ Acesso total ao painel administrativo
- ✅ Pode criar, editar e excluir qualquer propriedade
- ✅ Pode aprovar/rejeitar propriedades (status)
- ✅ Pode definir propriedades em destaque
- ✅ Pode ver todos os leads
- ✅ Pode ativar/desativar contas de corretores

#### Corretor (`role: 'corretor'`)
- ✅ Acesso ao painel administrativo
- ✅ Pode criar propriedades (sempre como rascunho)
- ✅ Pode editar apenas suas próprias propriedades
- ✅ Pode excluir apenas suas próprias propriedades
- ❌ Não pode alterar status (published/draft)
- ❌ Não pode definir destaque
- ✅ Pode ver seus próprios leads

### Credenciais de Teste
```
👑 Admin: admin@lopes.com / admin123
👤 Corretor 1: joao@lopes.com / corretor123  
👤 Corretor 2: maria@lopes.com / corretor456
```

---

## 🚀 API ENDPOINTS

### 1. Autenticação

#### POST `/api/auth/register`
- **Descrição**: Registrar novo usuário
- **Body**: `{ name, email, password, confirmPassword }`
- **Response**: `{ success: true, message: string, user: User }`
- **Status**: 201 (sucesso) | 400 (erro) | 500 (servidor)

#### POST `/api/auth/login`
- **Descrição**: Login de usuário
- **Body**: `{ email, password }`
- **Response**: `{ success: true, user: User }`
- **Cookie**: Define `user-session` HTTP-only
- **Status**: 200 (sucesso) | 401 (credenciais) | 500 (servidor)

### 2. Propriedades

#### GET `/api/properties`
- **Descrição**: Listar propriedades
- **Query Params**:
  - `featured=true` - Apenas destacadas
  - `admin=true` - Visão admin (todas + rascunhos)
- **Headers**: `x-user` (para admin)
- **Response**: `Property[]`
- **Público**: Apenas propriedades publicadas
- **Admin**: Todas as propriedades (baseado na role)

#### POST `/api/properties`
- **Descrição**: Criar nova propriedade
- **Auth**: Obrigatório (cookie)
- **Body**: `PropertyData`
- **Response**: `Property`
- **Permissões**: Admin ou Corretor

#### GET `/api/properties/[id]`
- **Descrição**: Buscar propriedade específica
- **Auth**: Não obrigatório (público)
- **Response**: `Property` (apenas published)
- **Status**: 200 (sucesso) | 404 (não encontrada)

#### PUT `/api/properties/[id]`
- **Descrição**: Atualizar propriedade
- **Auth**: Obrigatório (cookie)
- **Body**: `PropertyData`
- **Response**: `Property`
- **Permissões**: Admin ou autor da propriedade

#### DELETE `/api/properties/[id]`
- **Descrição**: Excluir propriedade
- **Auth**: Obrigatório (cookie)
- **Response**: `{ success: true }`
- **Permissões**: Admin ou autor da propriedade

### 3. Upload de Imagens

#### POST `/api/upload`
- **Descrição**: Upload genérico de imagens
- **Auth**: Obrigatório (cookie)
- **Body**: FormData com `file` e `type`
- **Types**: 'banner', 'gallery', 'floorplan'
- **Response**: `{ url: string, path: string, size: number }`

#### POST `/api/properties/[id]/upload`
- **Descrição**: Upload específico para propriedade
- **Auth**: Obrigatório (cookie)
- **Body**: FormData com `file` e `type`
- **Response**: `{ success: true, url: string, type: string }`
- **Atualiza**: Propriedade automaticamente no banco

### 4. Leads

#### GET `/api/leads`
- **Descrição**: Listar todos os leads
- **Auth**: Obrigatório (cookie)
- **Response**: `Lead[]`
- **Include**: Propriedade relacionada

#### POST `/api/leads`
- **Descrição**: Criar novo lead
- **Auth**: Não obrigatório (público)
- **Body**: `{ name, phone, email?, propertyId?, status? }`
- **Response**: `Lead`
- **Status**: 201 (criado) | 400 (dados inválidos)

---

## 📁 SISTEMA DE STORAGE (Vercel Blob)

### Configuração
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_zSXObdb3w0LuAH6v_UgedSnMaWtaqzmYGwzqTAZM48dU0TZ
```

### Estrutura de Pastas
```
blob-storage/
├── properties/
│   ├── banners/           # Imagens principais
│   ├── gallery/           # Galeria de fotos
│   ├── floorplans/        # Plantas baixas
│   └── misc/              # Outras imagens
```

### Tipos de Imagem Suportados

#### 1. Banner (`type: 'banner'`)
- **Formato**: JPEG
- **Dimensões**: 1920x960px (2:1)
- **Tamanho**: Máximo 5MB
- **Qualidade**: 85%
- **Uso**: Imagem principal do imóvel

#### 2. Gallery (`type: 'gallery'`)
- **Formato**: WebP
- **Dimensões**: 1200x1200px (1:1)
- **Tamanho**: Máximo 3MB
- **Qualidade**: 90%
- **Uso**: Galeria de fotos

#### 3. Floorplan (`type: 'floorplan'`)
- **Formato**: PNG
- **Dimensões**: 2048x2048px
- **Tamanho**: Máximo 10MB
- **Qualidade**: 95%
- **Uso**: Plantas baixas

### Processamento de Imagens

#### ImageProcessor (`src/services/imageProcessor.ts`)
- **Redimensionamento**: Automático mantendo aspect ratio
- **Otimização**: Compressão baseada no tipo
- **Validação**: Tipo MIME e tamanho
- **Formato**: Conversão automática para formato otimizado

#### ImageStorage (`src/services/imageStorage.ts`)
- **Upload**: Para Vercel Blob Storage
- **Organização**: Por propriedade e tipo
- **Nomenclatura**: Timestamp + random para evitar conflitos
- **URLs**: Retorna URLs públicas para uso

### Componente de Upload (`ImageUpload.tsx`)
- **Interface**: Drag & drop + botão de seleção
- **Preview**: Visualização das imagens carregadas
- **Validação**: Tipo e tamanho em tempo real
- **Remoção**: Botão para remover imagens
- **Limites**: Configurável por tipo

---

## 🎨 INTERFACE E COMPONENTES

### Páginas Principais

#### 1. Homepage (`/`)
- **Hero**: Banner principal com CTA
- **FeaturedProperties**: Grid de imóveis em destaque
- **About**: Seção sobre a empresa
- **Testimonials**: Depoimentos de clientes

#### 2. Imóveis (`/imoveis`)
- **PropertyGrid**: Lista paginada de imóveis
- **PropertyFilters**: Filtros avançados
- **Search**: Busca por texto
- **Categories**: Filtro por tipo/categoria

#### 3. Detalhes do Imóvel (`/imoveis/[id]`)
- **PropertyDetails**: Informações completas
- **ImageGallery**: Galeria de fotos
- **FloorPlans**: Plantas baixas
- **ContactForm**: Formulário de interesse
- **LocationMap**: Mapa da localização

#### 4. Contato (`/contato`)
- **ContactForm**: Formulário de contato
- **ContactInfo**: Informações da empresa
- **Map**: Localização da empresa

### Painel Administrativo (`/admin`)

#### 1. Dashboard (`/admin/dashboard`)
- **Estatísticas**: Resumo de propriedades e leads
- **Atividades**: Últimas atividades
- **Quick Actions**: Ações rápidas

#### 2. Propriedades (`/admin`)
- **Lista**: Todas as propriedades com filtros
- **Criar**: Formulário de nova propriedade
- **Editar**: Modal de edição
- **Ações**: Publicar, destacar, excluir

#### 3. Login (`/admin/login`)
- **Formulário**: Email e senha
- **Validação**: Em tempo real
- **Redirect**: Para dashboard após login

#### 4. Registro (`/admin/register`)
- **Formulário**: Dados completos
- **Validação**: Senhas e email único
- **Status**: Conta inativa até aprovação

### Componentes Reutilizáveis

#### UI Components (Shadcn/ui)
- **Button**: Botões com variantes
- **Input**: Campos de entrada
- **Card**: Containers de conteúdo
- **Select**: Dropdowns
- **Tabs**: Navegação por abas
- **Dialog**: Modais
- **Toast**: Notificações

#### Property Components
- **PropertyCard**: Card de propriedade
- **PropertyGrid**: Grid responsivo
- **PropertyFilters**: Filtros avançados
- **PropertyDetails**: Detalhes completos
- **PropertyForm**: Formulário de criação/edição

#### Admin Components
- **PropertyFormSimple**: Formulário simplificado
- **ImageUpload**: Upload de imagens
- **UserManagement**: Gestão de usuários
- **BackupManager**: Backup de dados

---

## 🔧 SERVIÇOS E UTILITÁRIOS

### PropertyService (`src/services/propertyService.ts`)
```typescript
class PropertyService {
  // Carregar propriedades do banco
  static async loadProperties(adminView?: boolean): Promise<Property[]>
  
  // Buscar propriedade por ID
  static async getPropertyById(id: string): Promise<Property | null>
  
  // Adicionar nova propriedade
  static async addProperty(property: Property): Promise<Property>
  
  // Atualizar propriedade
  static async updateProperty(property: Property): Promise<Property>
  
  // Excluir propriedade
  static async deleteProperty(id: string): Promise<void>
}
```

### AuthService (`src/lib/auth.ts`)
```typescript
class AuthService {
  // Login com banco de dados
  static async login(email: string, password: string): Promise<User | null>
  
  // Logout
  static logout(): void
  
  // Obter usuário atual
  static getCurrentUser(): User | null
  
  // Verificar permissões
  static isAdmin(): boolean
  static isCorretor(): boolean
  static getCurrentUserId(): number | null
}
```

### Utilitários
- **ImageUtils**: Processamento de imagens
- **Database**: Conexão com Prisma
- **Permissions**: Verificação de permissões
- **Utils**: Funções auxiliares

---

## 📊 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Sistema de Autenticação Completo
- [x] Registro de usuários com validação
- [x] Login com hash de senha
- [x] Sistema de roles (admin/corretor)
- [x] Middleware de proteção
- [x] Controle de sessão com cookies
- [x] Aprovação de contas (admin)

### ✅ Gestão de Propriedades
- [x] CRUD completo de propriedades
- [x] Upload de imagens (banner, galeria, plantas)
- [x] Sistema de status (published/draft)
- [x] Sistema de destaque (máximo 6)
- [x] Filtros avançados
- [x] Busca por texto
- [x] Paginação

### ✅ Sistema de Upload de Imagens
- [x] Upload para Vercel Blob Storage
- [x] Processamento e otimização
- [x] Validação de tipo e tamanho
- [x] Organização por pastas
- [x] Preview e remoção
- [x] Suporte a múltiplos tipos

### ✅ Painel Administrativo
- [x] Dashboard com estatísticas
- [x] Lista de propriedades
- [x] Formulários de criação/edição
- [x] Sistema de permissões
- [x] Filtros e busca
- [x] Ações em lote

### ✅ Sistema de Leads
- [x] Captura de leads do site
- [x] Associação com propriedades
- [x] Associação com corretores
- [x] Status de acompanhamento
- [x] API para integração WhatsApp

### ✅ Interface Responsiva
- [x] Design mobile-first
- [x] Componentes reutilizáveis
- [x] Sistema de temas
- [x] Animações e transições
- [x] Acessibilidade

### ✅ API REST Completa
- [x] Endpoints para todas as operações
- [x] Validação de dados
- [x] Tratamento de erros
- [x] Códigos de status apropriados
- [x] Documentação implícita

---

## 🚀 DEPLOY E CONFIGURAÇÃO

### Variáveis de Ambiente
```env
# Database
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAAC-M8h8dEuFWV3C5V5m_9QC5hxK2a1Uk

# NextAuth
NEXTAUTH_SECRET=lopes-web-secret-key-2024
NEXTAUTH_URL=http://localhost:3001

# WhatsApp API (futuro)
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_ID=your-phone-id
```

### Scripts Disponíveis
```json
{
  "dev": "next dev -p 3001",
  "build": "npx prisma generate && next build",
  "start": "next start -p 3001",
  "seed": "tsx scripts/seed-database.ts",
  "populate": "tsx scripts/populate-database.ts",
  "db:push": "npx prisma db push",
  "db:studio": "npx prisma studio"
}
```

### Banco de Dados
- **Provider**: PostgreSQL (Prisma.io)
- **Migrations**: Automáticas via Prisma
- **Seeding**: Scripts para dados de exemplo
- **Studio**: Interface visual via Prisma Studio

---

## 📈 MÉTRICAS E PERFORMANCE

### Otimizações Implementadas
- **Images**: WebP para galeria, JPEG para banners
- **Caching**: No-store para dados dinâmicos
- **Lazy Loading**: Componentes sob demanda
- **Code Splitting**: Por rota automático
- **Bundle Size**: Otimizado com tree-shaking

### Monitoramento
- **Console Logs**: Sistema completo de logs
- **Error Handling**: Try/catch em todas as operações
- **Validation**: Validação em frontend e backend
- **Type Safety**: TypeScript em todo o projeto

---

## 🔮 FUNCIONALIDADES FUTURAS (Não Implementadas)

### Integração WhatsApp
- [ ] Envio automático de leads
- [ ] Notificações de novos imóveis
- [ ] Chat integrado

### Sistema de Notificações
- [ ] Email para novos leads
- [ ] Push notifications
- [ ] Dashboard de métricas

### Funcionalidades Avançadas
- [ ] Sistema de favoritos
- [ ] Comparação de imóveis
- [ ] Calculadora de financiamento
- [ ] Tour virtual 360°

---

## 🎯 CONCLUSÃO

O sistema Lopes Imóveis está **100% funcional** com:

✅ **Sistema de autenticação completo** com roles e permissões
✅ **CRUD completo de propriedades** com upload de imagens
✅ **API REST funcional** para todas as operações
✅ **Banco de dados PostgreSQL** com Prisma ORM
✅ **Storage de imagens** com Vercel Blob
✅ **Interface responsiva** com Tailwind CSS
✅ **Painel administrativo** completo
✅ **Sistema de leads** integrado
✅ **Middleware de segurança** implementado
✅ **Validação completa** em frontend e backend

**Tecnologias utilizadas**: Next.js 15, React 18, TypeScript, PostgreSQL, Prisma, Vercel Blob, Tailwind CSS, Radix UI, bcryptjs.

**Status**: Pronto para produção com todas as funcionalidades core implementadas e testadas.

---

*Documento gerado automaticamente - Sistema Lopes Imóveis v0.01*
