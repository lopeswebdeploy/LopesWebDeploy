# 🚀 Guia de Início Rápido - Lopes Marista

## Passo a Passo para Começar

### 1️⃣ Criar o Primeiro Admin

Execute o script para criar o usuário administrador:

```bash
npx tsx scripts/create-admin.ts
```

Credenciais padrão criadas:
- **Email:** admin@lopesmarista.com
- **Senha:** admin123

⚠️ **IMPORTANTE:** Mude a senha após o primeiro login!

---

### 2️⃣ Iniciar o Servidor

```bash
npm run dev
```

O site estará disponível em: **http://localhost:3001**

---

### 3️⃣ Primeiro Login

1. Acesse: http://localhost:3001/admin/login
2. Entre com:
   - Email: `admin@lopesmarista.com`
   - Senha: `admin123`
3. Você será redirecionado para o Dashboard

---

### 4️⃣ Criar sua Primeira Propriedade

1. No Dashboard, clique em **"Nova Propriedade"**
2. Preencha o formulário:
   - **Título:** Ex: "Casa de Luxo no Centro"
   - **Tipo:** Casa / Apartamento / Terreno / Comercial
   - **Transação:** Venda / Aluguel / Investimento
   - **Preço:** Valor do imóvel
   - **Características:** Quartos, banheiros, etc.

3. **Upload de Imagens:**
   - Banner (1 imagem)
   - Galeria (até 15 imagens)
   - Plantas (até 5 imagens)

4. **Google Maps (Opcional):**
   - Acesse Google Maps no computador
   - Pesquise o endereço
   - Clique em "Compartilhar" → "Incorporar um mapa"
   - Copie o código HTML completo
   - Cole no campo

5. Clique em **"Criar Propriedade"**

---

### 5️⃣ Tornar Propriedade Visível

Como admin, você pode:
1. Ir em **"Gerenciar Imóveis"**
2. Clicar em **"Publicar"** na propriedade
3. Opcionalmente, clicar em **"Destacar"** para aparecer na homepage

---

### 6️⃣ Ver no Site Público

1. Acesse: http://localhost:3001
2. Veja as propriedades em destaque
3. Navegue em **"Imóveis"** para ver todas
4. Clique em uma propriedade para ver detalhes completos

---

## 👥 Registrar Novos Corretores

### Para o Corretor:
1. Acesse: http://localhost:3001/admin/register
2. Preencha o formulário
3. Conta será criada como **inativa**
4. Mensagem aparecerá para contatar o marketing

### Para o Admin (Ativar Corretor):

**Opção 1 - Prisma Studio:**
```bash
npx prisma studio
```
1. Abra a tabela `users`
2. Encontre o corretor
3. Marque `active` como `true`
4. Salve

**Opção 2 - SQL:**
```sql
UPDATE users 
SET active = true 
WHERE email = 'corretor@email.com';
```

---

## 🔑 Diferenças de Permissões

### 👨‍💼 Corretor (role: "corretor")
- ✅ Criar propriedades (sempre invisíveis)
- ✅ Editar suas propriedades
- ✅ Excluir suas propriedades
- ❌ Não pode tornar propriedades visíveis
- ❌ Não pode destacar propriedades
- ❌ Não vê leads
- ❌ Não vê propriedades de outros

### 👑 Admin (role: "admin")
- ✅ Todas permissões do corretor
- ✅ Aprovar propriedades (tornar visíveis)
- ✅ Destacar propriedades
- ✅ Ver todas as propriedades
- ✅ Ver e gerenciar leads
- ✅ Filtrar por criador

---

## 📋 Checklist de Configuração

- [ ] Criar primeiro admin (`npx tsx scripts/create-admin.ts`)
- [ ] Iniciar servidor (`npm run dev`)
- [ ] Fazer login como admin
- [ ] Criar propriedade de teste
- [ ] Upload de imagens
- [ ] Tornar propriedade visível
- [ ] Destacar propriedade
- [ ] Verificar no site público
- [ ] Registrar corretor de teste
- [ ] Ativar corretor
- [ ] Testar como corretor

---

## 🎯 URLs Importantes

| Rota | Descrição |
|------|-----------|
| `/` | Homepage |
| `/imoveis` | Lista de imóveis |
| `/admin/login` | Login admin/corretor |
| `/admin/register` | Registro de corretor |
| `/admin/dashboard` | Dashboard |
| `/admin/properties` | Gerenciar propriedades |
| `/admin/leads` | Leads (só admin) |

---

## 🐛 Problemas Comuns

### "Não autenticado"
- Faça login novamente em `/admin/login`

### "Conta não ativada"
- Admin precisa ativar no banco de dados

### "Propriedade não aparece no site"
- Verifique se está marcada como `visible = true`
- Apenas admin pode tornar visível

### "Upload falha"
- Verifique `BLOB_READ_WRITE_TOKEN` no `.env`
- Verifique tamanho da imagem (máx. 10MB)

---

## 📞 Comandos Úteis

```bash
# Rodar desenvolvimento
npm run dev

# Criar admin
npx tsx scripts/create-admin.ts

# Abrir Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate

# Atualizar banco
npx prisma db push

# Build para produção
npm run build
```

---

**Pronto para começar! 🎉**

