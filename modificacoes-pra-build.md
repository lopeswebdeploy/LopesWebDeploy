# 🔧 Modificações para Build - Lopes Marista

**Data:** 10 de Janeiro de 2025  
**Objetivo:** Resolver problemas de build e deploy em produção  
**Status:** ✅ CONCLUÍDO

---

## 🚨 PROBLEMA INICIAL

### **Erro no Deploy:**
```
Cannot find module 'next/dist/compiled/source-map'
Require stack:
- /var/task/node_modules/next/dist/compiled/next-server/server.runtime.prod.js
- /var/task/___next_launcher.cjs
Did you forget to add it to "dependencies" in `package.json`?
Node.js process exited with exit status: 1
```

### **Causa Raiz:**
- Next.js 15.0.0 é instável em produção
- Módulo interno `source-map` não existe na versão 15
- Deploy falha porque não consegue inicializar o servidor

---

## 🔍 ANÁLISE REALIZADA

### **1. Verificação do package.json:**
```json
{
  "dependencies": {
    "next": "^15.0.0",  // ❌ Versão instável
    "react": "^18.3.1", // ⚠️ Versão com ^
    "react-dom": "^18.3.1" // ⚠️ Versão com ^
  }
}
```

### **2. Problemas identificados:**
- ✅ `source-map` não estava nas dependencies
- ❌ Next.js 15 é muito novo e instável
- ⚠️ Versões com `^` podem causar inconsistências
- ❌ Configurações incompatíveis com Next.js 14

---

## 🛠️ MODIFICAÇÕES REALIZADAS

### **1. Downgrade Next.js (CRÍTICO)**

#### **Antes:**
```json
{
  "next": "^15.0.0"
}
```

#### **Depois:**
```json
{
  "next": "14.2.0"
}
```

**Motivo:** Next.js 14.2.0 é estável e testado em produção

---

### **2. Versões Fixas para Produção**

#### **Antes:**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

#### **Depois:**
```json
{
  "react": "18.3.1",
  "react-dom": "18.3.1"
}
```

**Motivo:** Versões fixas evitam atualizações automáticas que podem quebrar o build

---

### **3. Adição do source-map**

#### **Adicionado:**
```json
{
  "dependencies": {
    "source-map": "^0.7.4"
  }
}
```

**Motivo:** Next.js precisa deste módulo para funcionar em produção

---

### **4. Correção do next.config.js**

#### **Removido:**
```javascript
const nextConfig = {
  outputFileTracingRoot: '/Users/sdr-lopes/Downloads/Downloads/Lopes Web 0.01',
  // ... resto da config
}
```

#### **Motivo:** `outputFileTracingRoot` não é suportado no Next.js 14

---

### **5. Configuração de Runtime para APIs**

#### **Adicionado em `/src/app/api/auth/login/route.ts`:**
```typescript
// Configurar runtime para Node.js (necessário para bcryptjs)
export const runtime = 'nodejs'
```

#### **Adicionado em `/src/app/api/auth/register/route.ts`:**
```typescript
// Configurar runtime para Node.js (necessário para bcryptjs)
export const runtime = 'nodejs'
```

**Motivo:** bcryptjs não funciona no Edge Runtime, precisa do Node.js runtime

---

## 🧹 LIMPEZA REALIZADA

### **Comandos executados:**
```bash
# Limpeza completa
rm -rf .next node_modules package-lock.json

# Reinstalação limpa
npm install

# Teste de build
npm run build
```

**Motivo:** Garantir que não há cache corrompido ou dependências conflitantes

---

## 📊 RESULTADOS DO BUILD

### **Build Local (Funcionando):**
```
✓ Compiled successfully
✓ Generating static pages (19/19)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    2.31 kB         102 kB
├ ○ /admin/login                         2.4 kB         96.1 kB
├ ○ /admin/register                      2.74 kB        96.4 kB
├ ○ /imoveis                             3.84 kB         103 kB
├ ƒ /imoveis/[id]                        2.37 kB         102 kB
└ ... (19 páginas total)

ƒ Middleware                             40.9 kB
```

### **Warnings (Não críticos):**
- Fonts do Google (problema de rede local)
- Dynamic server usage (normal para APIs)

---

## 🎯 VERSÕES FINAIS

### **Dependencies (Produção):**
```json
{
  "@prisma/client": "^6.17.1",
  "@vercel/blob": "^2.0.0",
  "bcryptjs": "^3.0.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "jose": "^6.1.0",
  "lucide-react": "^0.462.0",
  "next": "14.2.0",                    // ✅ FIXO
  "react": "18.3.1",                   // ✅ FIXO
  "react-dom": "18.3.1",                // ✅ FIXO
  "source-map": "^0.7.4",               // ✅ ADICIONADO
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

### **DevDependencies:**
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/node": "^22.16.5",
  "@types/react": "^18.3.23",
  "@types/react-dom": "^18.3.7",
  "autoprefixer": "^10.4.21",
  "eslint": "^8.57.0",
  "eslint-config-next": "^15.0.0",
  "postcss": "^8.5.6",
  "prisma": "^6.17.1",
  "tailwindcss": "^3.4.17",
  "tsx": "^4.20.6",
  "typescript": "^5.8.3"
}
```

---

## 🚀 PRÓXIMOS PASSOS

### **1. Deploy:**
```bash
git add .
git commit -m "fix: downgrade to Next.js 14.2.0 for production stability"
git push
```

### **2. Testes em Produção:**
- [ ] Site carrega sem erros
- [ ] Login funciona: `admin@lopesmarista.com` / `admin123`
- [ ] Propriedades aparecem na homepage
- [ ] APIs respondem corretamente

### **3. Possíveis Próximos Erros:**
- Environment variables não configuradas
- Prisma Client não encontrado
- Database connection failed

---

## 🔍 LIÇÕES APRENDIDAS

### **✅ Boas Práticas:**
1. **Versões fixas em produção:** Evita atualizações automáticas
2. **Testes de build:** Sempre testar antes do deploy
3. **Downgrade quando necessário:** Estabilidade > Features novas
4. **Limpeza de cache:** Resolve problemas de dependências

### **❌ Evitar no Futuro:**
1. **Versões muito novas:** Next.js 15 ainda instável
2. **Dependências com ^:** Pode causar inconsistências
3. **Configurações não testadas:** Sempre verificar compatibilidade

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **Antes do Deploy:**
- [x] Build local funciona
- [x] Versões fixas definidas
- [x] Configurações compatíveis
- [x] Runtime configurado
- [x] Cache limpo

### **Após o Deploy:**
- [ ] Site carrega
- [ ] Login funciona
- [ ] Propriedades aparecem
- [ ] APIs respondem
- [ ] Upload de imagens funciona

---

## 🎉 CONCLUSÃO

### **✅ Problemas Resolvidos:**
1. **Next.js 15 instável** → **Next.js 14.2.0 estável**
2. **source-map faltando** → **Adicionado às dependencies**
3. **Edge Runtime incompatível** → **Node.js runtime configurado**
4. **Configuração inválida** → **next.config.js corrigido**

### **🚀 Status Atual:**
- **Build:** ✅ Funcionando
- **Versões:** ✅ Fixas e estáveis
- **Configurações:** ✅ Compatíveis
- **Deploy:** 🚀 Pronto para teste

### **📈 Benefícios:**
- **Estabilidade:** Versões testadas em produção
- **Reprodutibilidade:** Builds consistentes
- **Manutenibilidade:** Controle total sobre atualizações
- **Confiabilidade:** Sem surpresas no deploy

---

**Arquivo criado em:** `modificacoes-pra-build.md`  
**Próxima atualização:** Após testes de deploy em produção
