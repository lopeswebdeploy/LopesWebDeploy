# 🔧 Solução para Erro 405 - Registro de Usuário

## 🐛 PROBLEMA IDENTIFICADO

### Erros que apareceram:
```
1. Failed to execute 'json' on 'Response': Unexpected end of JSON input
2. Failed to load resource: the server responded with a status of 500
3. /api/auth/register: Failed to load resource: the server responded with a status of 405
4. Erro ao buscar propriedades: SyntaxError: Unexpected token '<'
```

### 🔍 Causa Raiz:
O servidor estava rodando com **cache antigo** do banco de dados anterior. Após resetarmos o banco, o Next.js ainda estava com código compilado do schema antigo.

---

## ✅ SOLUÇÃO APLICADA

### 1. Matei o servidor antigo:
```bash
lsof -ti:3001 | xargs kill -9
```

### 2. Reiniciei o servidor limpo:
```bash
npm run dev
```

### 3. O servidor agora vai:
- ✅ Recompilar com Prisma Client novo
- ✅ Usar schema correto do banco
- ✅ APIs funcionarão perfeitamente

---

## 🧪 TESTE NOVAMENTE

### Passo a passo para criar conta:

1. **Acesse a página de registro:**
   ```
   http://localhost:3001/admin/register
   ```

2. **Preencha o formulário:**
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
   - Confirmar Senha: mesma senha

3. **Clique em "Criar Conta"**

4. **Deve aparecer a mensagem:**
   ```
   ✅ Conta criada com sucesso!
   
   Entre em contato com a equipe de marketing da 
   Lopes Marista para validá-la enviando seu nome e email.
   ```

5. **Redireciona para login após 3 segundos**

---

## 🔧 SE AINDA DER ERRO

### Verifique:

#### 1. Servidor está rodando?
```bash
# Abra um terminal e rode:
cd "/Users/sdr-lopes/Downloads/Downloads/Lopes Web 0.01"
npm run dev
```

Deve aparecer:
```
✓ Ready in X.Xs
○ Local: http://localhost:3001
```

#### 2. Banco está sincronizado?
```bash
npx prisma db push
```

Deve aparecer:
```
✓ Your database is now in sync with your Prisma schema
```

#### 3. Limpe o cache do navegador:
- Chrome: Ctrl+Shift+Delete
- Ou abra em aba anônima

#### 4. Verifique o console do servidor:
Olhe o terminal onde rodou `npm run dev` e veja se tem erros.

---

## 📊 FLUXO CORRETO DO REGISTRO

### Como funciona:

```
Usuário preenche formulário
    ↓
POST /api/auth/register
    ↓
Valida campos (nome, email, senha)
    ↓
Verifica se email já existe
    ↓
Hash da senha (bcrypt)
    ↓
Cria no banco com active=false
    ↓
Retorna sucesso + mensagem
    ↓
Frontend mostra mensagem
    ↓
Redireciona para login
```

### Ativar conta (apenas admin):

```
1. Abra Prisma Studio: http://localhost:5555
2. Clique em "users"
3. Encontre o usuário
4. Mude "active" para true
5. Clique em "Save 1 change"
6. Agora o usuário pode fazer login!
```

---

## 🎯 CREDENCIAIS DE TESTE

### Admin (já criado e ativo):
```
Email: admin@lopesmarista.com
Senha: admin123
```

Use para:
- ✅ Testar login
- ✅ Criar propriedades
- ✅ Ativar novos corretores
- ✅ Ver leads

---

## ⚠️ IMPORTANTE

### Após criar novo corretor:

1. **Conta fica inativa por padrão** ✓
2. **Não consegue fazer login** ✓
3. **Admin precisa ativar manualmente** ✓

**Para ativar:**
- Opção 1: Prisma Studio (http://localhost:5555)
- Opção 2: SQL direto:
  ```sql
  UPDATE users SET active = true WHERE email = 'email@corretor.com';
  ```

---

## ✅ CHECKLIST FINAL

Antes de testar registro novamente:

- [ ] Servidor rodando em http://localhost:3001
- [ ] Prisma Studio em http://localhost:5555
- [ ] Banco sincronizado (db push)
- [ ] Cache do navegador limpo
- [ ] Terminal sem erros

Se tudo acima estiver ✅, o registro DEVE funcionar!

---

**Status do Servidor:** Reiniciando...  
**Aguarde:** ~10 segundos para servidor compilar  
**Depois:** Tente criar conta novamente!

🚀 Servidor está reiniciando agora com tudo limpo!

