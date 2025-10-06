-- Schema do banco de dados para Lopes Imóveis
-- Execute este script no Vercel Postgres

-- Tabela de propriedades
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  full_description TEXT,
  category VARCHAR(50) DEFAULT 'venda',
  type VARCHAR(100),
  property_type VARCHAR(50) NOT NULL,
  
  -- Localização
  location VARCHAR(255),
  state VARCHAR(100) DEFAULT 'Goiânia',
  address TEXT,
  coordinates JSONB,
  embed_url TEXT,
  
  -- Características físicas
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  suites INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  area VARCHAR(50),
  balcony_types JSONB DEFAULT '[]',
  
  -- Financeiro
  price VARCHAR(100),
  apartment_options JSONB DEFAULT '[]',
  
  -- Empreendimento
  developer VARCHAR(255),
  delivery_date VARCHAR(100),
  availability VARCHAR(255),
  
  -- Imagens (URLs do Vercel Blob)
  banner_image TEXT,
  images JSONB DEFAULT '[]',
  photo_gallery JSONB DEFAULT '[]',
  floor_plan TEXT,
  
  -- Detalhes
  characteristics JSONB DEFAULT '[]',
  location_benefits JSONB DEFAULT '[]',
  differentials JSONB DEFAULT '[]',
  
  -- Controle
  status VARCHAR(20) DEFAULT 'ativo',
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  property_id VARCHAR(255),
  source VARCHAR(100) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'novo',
  notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Tabela de usuários (para autenticação)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_properties_visible ON properties(is_visible);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_property ON leads(property_id);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (email, name, role) 
VALUES ('admin@lopesimoveis.com', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;
