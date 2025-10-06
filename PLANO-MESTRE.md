# 🏢 LOPES IMÓVEIS - PLANO MESTRE DE DESENVOLVIMENTO

## 📋 VISÃO GERAL DO PROJETO

**Objetivo:** Transformar o site Lopes Imóveis em uma plataforma profissional e funcional para captura de leads e gestão de propriedades.

**Status Atual:** ✅ Deploy funcionando no Vercel, mas com dados temporários no localStorage

**Meta:** Sistema completo com banco de dados, captura de leads automática e integração com WhatsApp

---

## 🎯 PRIORIDADES DEFINIDAS

### 🔥 **PRIORIDADE MÁXIMA (Semana 1)**
1. **🗄️ Banco de Dados Persistente**
   - Configurar Vercel Postgres
   - Migrar propriedades do localStorage para banco
   - Sistema de CRUD funcional

2. **🖼️ Sistema de Imagens Otimizado**
   - Configurar Vercel Blob Storage
   - Upload de imagens pelo admin
   - Imagens organizadas e otimizadas

3. **🔧 Correção de Bugs**
   - Verificar se as 5 propriedades estão funcionando
   - Corrigir problemas de navegação
   - Site 100% funcional

### 🚀 **PRIORIDADE ALTA (Semana 2)**
4. **📊 Sistema de Captura de Leads**
   - Formulários de contato funcionais
   - Captura automática de dados (nome, telefone, email)
   - Armazenamento no banco de dados

5. **📱 Integração WhatsApp**
   - Envio automático de leads para WhatsApp
   - Integração com funil de atendimento
   - Leads direcionados para "Ponto Frio" ou "Aguardando Atendimento"

### 🔐 **PRIORIDADE MÉDIA (Semana 3)**
6. **🔒 Sistema de Autenticação**
   - Login para administradores
   - Proteção da área admin
   - Controle de acesso

7. **📈 Analytics e Métricas**
   - Tracking de visitantes
   - Métricas de conversão
   - Dashboard de leads

---

## 🏗️ ARQUITETURA TÉCNICA

### **Stack Tecnológica**
```
Frontend: Next.js 15 + TypeScript + Tailwind CSS
Backend: Vercel Functions (Serverless)
Database: Vercel Postgres
Storage: Vercel Blob Storage
Authentication: NextAuth.js
Analytics: Vercel Analytics
```

### **Estrutura de Dados**

#### **Tabela: properties**
```sql
CREATE TABLE properties (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  location VARCHAR(255),
  address TEXT,
  embed_url TEXT,
  
  -- Imagens (URLs do Vercel Blob)
  banner_image TEXT,
  images JSONB DEFAULT '[]',
  photo_gallery JSONB DEFAULT '[]',
  floor_plan TEXT,
  
  -- Características
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  area VARCHAR(50),
  
  -- Controle
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'ativo',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: leads**
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  property_id VARCHAR(255),
  source VARCHAR(100) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'novo',
  notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Tabela: users**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 PLANO DE IMPLEMENTAÇÃO

### **FASE 1: FUNDAÇÃO (Dias 1-3)**

#### **Dia 1: Configuração do Banco**
- [ ] Configurar Vercel Postgres
- [ ] Criar schema das tabelas
- [ ] Configurar variáveis de ambiente
- [ ] Testar conexão com banco

#### **Dia 2: Migração de Dados**
- [ ] Criar script de migração do localStorage
- [ ] Migrar as 5 propriedades de exemplo
- [ ] Atualizar PropertyService para usar banco
- [ ] Testar CRUD completo

#### **Dia 3: Sistema de Imagens**
- [ ] Configurar Vercel Blob Storage
- [ ] Atualizar sistema de upload
- [ ] Migrar imagens existentes
- [ ] Testar upload pelo admin

### **FASE 2: FUNCIONALIDADES CORE (Dias 4-7)**

#### **Dia 4: Sistema de Leads**
- [ ] Criar tabela de leads
- [ ] Implementar captura de leads
- [ ] Formulários de contato funcionais
- [ ] Validação de dados

#### **Dia 5: Integração WhatsApp**
- [ ] Configurar API do WhatsApp Business
- [ ] Implementar envio automático
- [ ] Integrar com funil de atendimento
- [ ] Testar fluxo completo

#### **Dia 6: Autenticação**
- [ ] Configurar NextAuth.js
- [ ] Sistema de login para admin
- [ ] Proteção de rotas
- [ ] Gerenciamento de usuários

#### **Dia 7: Testes e Correções**
- [ ] Testes completos do sistema
- [ ] Correção de bugs
- [ ] Otimização de performance
- [ ] Deploy final

### **FASE 3: OTIMIZAÇÃO (Dias 8-10)**

#### **Dia 8: Analytics**
- [ ] Configurar Vercel Analytics
- [ ] Tracking de eventos
- [ ] Dashboard de métricas
- [ ] Relatórios de leads

#### **Dia 9: SEO e Performance**
- [ ] Otimização de SEO
- [ ] Compressão de imagens
- [ ] Cache otimizado
- [ ] Core Web Vitals

#### **Dia 10: Documentação e Deploy**
- [ ] Documentação completa
- [ ] Deploy em produção
- [ ] Monitoramento
- [ ] Treinamento da equipe

---

## 📊 SISTEMA DE LEADS E FUNIL

### **Fluxo de Captura de Leads**

```
Visitante no Site
       ↓
Preenche Formulário
       ↓
Lead Salvo no Banco
       ↓
Envio Automático WhatsApp
       ↓
Lead no Funil (Ponto Frio)
       ↓
IA entra em contato
       ↓
Lead vai para "Aguardando Atendimento"
```

### **Pontos de Captura**
1. **Formulário de Contato** (página /contato)
2. **Formulário "Quero Comprar"** (botões CTA)
3. **Formulário de Interesse** (páginas de propriedades)
4. **WhatsApp Direto** (botão flutuante)

### **Dados Capturados**
- Nome completo
- Telefone (obrigatório)
- Email (opcional)
- Propriedade de interesse
- Fonte da captura
- Data/hora

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### **Variáveis de Ambiente**
```env
# Database
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# WhatsApp API
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://seu-dominio.com

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### **Dependências a Instalar**
```json
{
  "@vercel/postgres": "^0.5.0",
  "@vercel/blob": "^0.15.0",
  "next-auth": "^4.24.0",
  "sharp": "^0.32.0",
  "zod": "^3.25.76"
}
```

---

## 🎯 RESULTADOS ESPERADOS

### **Funcionalidades Finais**
- ✅ Site 100% funcional sem erros
- ✅ Banco de dados persistente
- ✅ Upload de imagens otimizado
- ✅ Captura automática de leads
- ✅ Integração com WhatsApp
- ✅ Sistema de autenticação
- ✅ Analytics e métricas
- ✅ Performance otimizada

### **Métricas de Sucesso**
- **Tempo de carregamento:** < 2 segundos
- **Taxa de conversão:** > 3% de visitantes em leads
- **Disponibilidade:** > 99.9%
- **Leads por dia:** 10-50 (dependendo do tráfego)

---

## 🚨 AÇÕES IMEDIATAS - STATUS ATUAL

### ✅ **CONCLUÍDO (Hoje)**
1. ✅ **Código do banco implementado** - Database.ts, APIs, PropertyService atualizado
2. ✅ **Sistema híbrido funcionando** - Banco → localStorage → dados exemplo
3. ✅ **APIs REST criadas** - /api/properties e /api/leads
4. ✅ **Componentes atualizados** - Todas as páginas usando novas APIs
5. ✅ **Fallbacks implementados** - Site funciona mesmo sem banco

### 🔥 **PRÓXIMOS PASSOS (AGORA)**

#### **PASSO 1: Configurar Vercel Postgres (15 min)**
1. **Acessar painel Vercel:**
   - Ir em https://vercel.com/dashboard
   - Selecionar projeto "lopes-imoveis-nextjs"
   - Ir em "Storage" → "Create Database" → "Postgres"

2. **Configurar banco:**
   - Nome: `lopes-imoveis-db`
   - Região: `São Paulo` (mais próximo)
   - Plano: `Hobby` (gratuito)

3. **Copiar variáveis de ambiente:**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`

#### **PASSO 2: Adicionar variáveis no projeto (5 min)**
1. **No painel Vercel:**
   - Ir em "Settings" → "Environment Variables"
   - Adicionar as variáveis do Postgres
   - Adicionar também: `BLOB_READ_WRITE_TOKEN=vercel_blob_rw_zSXObdb3w0LuAH6v_UgedSnMaWtaqzmYGwzqTAZM48dU0TZ`

2. **No arquivo .env.local (desenvolvimento):**
   ```env
   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAAC-M8h8dEuFWV3C5V5m_9QC5hxK2a1Uk
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_zSXObdb3w0LuAH6v_UgedSnMaWtaqzmYGwzqTAZM48dU0TZ
   
   # Database (ADICIONAR ESTAS)
   POSTGRES_URL=postgresql://...
   POSTGRES_PRISMA_URL=postgresql://...
   
   # NextAuth (opcional)
   NEXTAUTH_SECRET=lopes-web-secret-key-2024
   NEXTAUTH_URL=http://localhost:3001
   ```

#### **PASSO 3: Executar schema no banco (10 min)**
1. **No painel Vercel Postgres:**
   - Ir em "Query" ou "SQL Editor"
   - Copiar e colar o conteúdo do arquivo `database/schema.sql`
   - Executar o script

#### **PASSO 4: Migrar propriedades (5 min)**
1. **Executar script de migração:**
   ```bash
   cd "/Users/sdr-lopes/Downloads/Downloads/Lopes Web 0.01"
   npm run dev
   ```
   - Acessar http://localhost:3001/admin
   - As propriedades serão migradas automaticamente

#### **PASSO 5: Testar sistema completo (10 min)**
1. **Verificar se tudo funciona:**
   - Site carregando propriedades do banco
   - Admin funcionando
   - Upload de imagens funcionando
   - Páginas individuais funcionando

### **Esta Semana**
- ✅ Banco de dados implementado
- 🔄 Sistema de leads funcionando
- 🔄 Integração WhatsApp ativa
- 🔄 Autenticação para admin

---

## 📞 SUPORTE E COMUNICAÇÃO

**Status Updates:** A cada implementação importante
**Testes:** Sempre que uma funcionalidade for concluída
**Deploy:** Imediato após cada fase concluída
**Documentação:** Atualizada em tempo real

---

*Este plano será atualizado conforme o progresso e feedback recebido.*
