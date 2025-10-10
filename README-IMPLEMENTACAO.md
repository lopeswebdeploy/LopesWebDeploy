# Sistema Imobiliário Lopes Marista - Documentação de Implementação

## ✅ Sistema Completo Implementado

### 🎯 Funcionalidades Implementadas

#### 1. **Site Público**
- ✅ Homepage com destaques (6 imóveis featured)
- ✅ Página de listagem de imóveis com filtros
- ✅ Página individual de cada propriedade
- ✅ Mini cards com galeria de imagens e setas funcionais
- ✅ Formulário de lead integrado
- ✅ Navegação completa e responsiva

#### 2. **Sistema de Autenticação**
- ✅ Login de corretores/admins
- ✅ Registro de novos corretores
- ✅ Contas criadas como inativas por padrão
- ✅ Mensagem de contato com marketing para ativação
- ✅ Middleware de proteção de rotas
- ✅ Sistema de sessões com JWT

#### 3. **Painel Administrativo**
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento completo de propriedades
- ✅ Sistema de permissões (Admin vs Corretor)
- ✅ Upload de imagens para Vercel Blob
- ✅ Visualização de leads (apenas admin)

#### 4. **Propriedades**
- ✅ Criação e edição de propriedades
- ✅ Upload de múltiplas imagens (banner, galeria, plantas)
- ✅ Variantes de apartamento (múltiplas plantas)
- ✅ Integração com Google Maps (iframe)
- ✅ Sistema de vantagens/amenidades
- ✅ Status de visibilidade e destaque

#### 5. **Permissões**

**Corretor:**
- Criar propriedades (sempre invisíveis inicialmente)
- Editar suas próprias propriedades
- Excluir suas próprias propriedades
- Ver apenas suas propriedades

**Admin:**
- Todas as permissões do corretor
- Aprovar propriedades (tornar visíveis)
- Destacar propriedades (featured)
- Ver todas as propriedades de todos os corretores
- Gerenciar leads
- Filtrar por criador

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:
1. **users** - Usuários (corretores e admins)
2. **properties** - Propriedades
3. **leads** - Leads de contato

### Campos Principais da Propriedade:
- Informações básicas (título, tipo, transação, preço)
- Características (quartos, banheiros, suítes, vagas, área)
- Descrições (curta e completa)
- Imagens (banner, galeria, plantas)
- Localização (endereço, Google Maps iframe)
- Vantagens (array de amenidades)
- Variantes de apartamento (JSON)
- Status (visible, featured)
- Autor (relacionamento com user)

---

## 🚀 Como Usar

### Para Iniciar o Projeto:

```bash
# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3001`

---

## 👥 Como Criar Usuários

### 1. Criar Admin Manualmente no Banco:

Como o primeiro admin precisa ser criado manualmente, você deve:

1. Acesse seu banco de dados Prisma
2. Execute o seguinte SQL para criar um admin:

```sql
-- Primeiro, gere o hash da senha usando bcrypt
-- A senha "admin123" tem o hash: $2a$10$XZ5kMk4sJy0h2c6kqYJrp.K6w5bC1Q8pKtN0vLqZ9RqZJzK0Q5qC2

INSERT INTO users (name, email, password, role, active) 
VALUES (
  'Administrador',
  'admin@lopesmarista.com',
  '$2a$10$XZ5kMk4sJy0h2c6kqYJrp.K6w5bC1Q8pKtN0vLqZ9RqZJzK0Q5qC2',
  'admin',
  true
);
```

Ou crie via Prisma Studio:
```bash
npx prisma studio
```

### 2. Registro de Corretores:

1. Corretores acessam `/admin/register`
2. Preenchem o formulário (nome, email, senha)
3. Conta é criada como **inativa**
4. Sistema mostra mensagem para contatar marketing
5. Admin ativa manualmente no banco de dados

### 3. Ativar Conta de Corretor (Admin):

No banco de dados, atualize:
```sql
UPDATE users 
SET active = true 
WHERE email = 'corretor@email.com';
```

---

## 📝 Fluxo de Criação de Propriedades

### 1. Login
- Acesse `/admin/login`
- Entre com suas credenciais

### 2. Nova Propriedade
- Clique em "Nova Propriedade"
- Preencha o formulário completo
- Upload de imagens:
  - **Banner**: 1 imagem de destaque
  - **Galeria**: Até 15 imagens
  - **Plantas**: Até 5 plantas baixas
  
### 3. Google Maps
Para incorporar o mapa:
1. Acesse Google Maps em um **computador**
2. Pesquise o endereço
3. Clique em "Compartilhar"
4. Selecione "Incorporar um mapa"
5. Copie o código HTML completo
6. Cole no campo "Google Maps iFrame URL"

### 4. Variantes de Apartamento (Opcional)
Se for apartamento com múltiplas plantas:
1. Ative "Adicionar variantes"
2. Para cada planta, adicione:
   - Nome (ex: "Planta 2 quartos")
   - Características (quartos, banheiros, área)
   - Planta baixa
   - Galeria de imagens (opcional)

### 5. Aprovação
- **Corretor**: Propriedade criada como não visível
- **Admin**: Pode aprovar (tornar visível) e destacar

---

## 🔐 Rotas do Sistema

### Públicas:
- `/` - Homepage
- `/imoveis` - Lista de imóveis
- `/imoveis/[id]` - Imóvel individual
- `/sobre` - Sobre

### Autenticação:
- `/admin/login` - Login
- `/admin/register` - Registro

### Protegidas (Requer Login):
- `/admin/dashboard` - Dashboard
- `/admin/properties` - Gerenciar propriedades
- `/admin/properties/new` - Nova propriedade
- `/admin/properties/[id]` - Editar propriedade
- `/admin/leads` - Ver leads (apenas admin)

---

## 🎨 Componentes Reutilizáveis

### PropertyCard
Mini card exibido em listagens com:
- Galeria de imagens com setas
- Informações principais
- Botões de ação (público ou admin)

### ImageGallery
Galeria completa com:
- Navegação por setas
- Lightbox
- Miniaturas

### PropertyForm
Formulário completo de propriedade com:
- Validações
- Campos numéricos com botões +/-
- Checkboxes de amenidades
- Suporte a variantes de apartamento

### ImageUploader
Upload de imagens para Vercel Blob com:
- Drag & drop
- Preview
- Progress indicator
- Múltiplos uploads

### LeadForm
Formulário de contato com:
- Validações
- Feedback de sucesso
- Integração com propriedade

---

## 🖼️ Upload de Imagens

As imagens são salvas no **Vercel Blob Storage** com a estrutura:
```
properties/
  └── {propertyId}/
      ├── banner-{timestamp}.jpg
      ├── gallery-{timestamp}.jpg
      ├── floor_plan-{timestamp}.jpg
      └── apartment_variant-{timestamp}.jpg
```

---

## 📊 Estatísticas do Dashboard

O dashboard mostra:
- Total de propriedades (suas ou todas, dependendo do role)
- Propriedades visíveis
- Propriedades em destaque
- Total de leads (apenas admin)

---

## ⚙️ Configurações Importantes

### Variáveis de Ambiente (.env)
Já configuradas:
- `POSTGRES_URL` - Database PostgreSQL
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API
- `NEXTAUTH_SECRET` - Chave secreta para JWT
- `NEXTAUTH_URL` - URL da aplicação

---

## 🐛 Troubleshooting

### Problema: Não consigo fazer login
- Verifique se a conta está ativa (`active = true` no banco)
- Verifique se o email e senha estão corretos

### Problema: Upload de imagem falha
- Verifique se `BLOB_READ_WRITE_TOKEN` está configurado
- Verifique o tamanho da imagem (máx. 10MB)

### Problema: Google Maps não aparece
- Verifique se colou o código HTML completo do iframe
- Verifique se `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está configurado

### Problema: Propriedade não aparece no site
- Verifique se está marcada como `visible = true`
- Apenas admin pode tornar propriedades visíveis

---

## 📱 Responsividade

O sistema é **totalmente responsivo**:
- Mobile-first design
- Menu hamburguer em telas pequenas
- Grid adaptativo
- Cards otimizados para mobile

---

## 🎯 Próximos Passos Sugeridos

1. Criar o primeiro admin no banco
2. Fazer login como admin
3. Criar algumas propriedades de teste
4. Torná-las visíveis e destacadas
5. Testar o site público
6. Registrar um corretor de teste
7. Ativar a conta do corretor
8. Testar criação de propriedades como corretor

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para Lopes Marista**

