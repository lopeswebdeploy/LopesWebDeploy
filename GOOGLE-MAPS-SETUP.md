# 🗺️ Como Configurar Google Maps API (5 minutos)

## 🚀 **Obter API Key Gratuita**

### **1. Acesse o Google Cloud Console**
- Vá em: https://console.cloud.google.com/
- Faça login com sua conta Google

### **2. Criar/Selecionar Projeto**
- Clique em "Selecionar projeto" (topo da página)
- Clique em "NOVO PROJETO"
- Nome: "Lopes Imóveis"
- Clique em "CRIAR"

### **3. Habilitar APIs Necessárias**
- Vá em "APIs e Serviços" > "Biblioteca"
- Busque e HABILITE estas 3 APIs:
  - ✅ **Maps JavaScript API**
  - ✅ **Places API** 
  - ✅ **Geocoding API**

### **4. Criar API Key**
- Vá em "APIs e Serviços" > "Credenciais"
- Clique em "+ CRIAR CREDENCIAIS" > "Chave de API"
- Copie a chave gerada (ex: `AIzaSyABC123...`)

### **5. Configurar no Projeto**
- Abra o arquivo `.env.local` no projeto
- Substitua a linha por:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
```

### **6. Reiniciar Servidor**
```bash
npm run dev
```

## 💰 **Custos (Muito Baixo)**

- **Gratuito até:** 28.000 carregamentos de mapa/mês
- **Geocoding:** Gratuito até 40.000 requests/mês  
- **Para seu projeto:** Praticamente ZERO custo

## 🔒 **Segurança (Opcional para localhost)**

Para produção, configure restrições:
- Vá em "Credenciais" > clique na sua API key
- Em "Restrições de aplicativo":
  - Selecione "Referenciadores HTTP"
  - Adicione: `seu-dominio.com/*`

## ⚠️ **Se Não Quiser Criar API Key**

O sistema já tem **fallback automático**:
- ✅ Detecta se Google Maps não funciona
- ✅ Usa sistema offline com coordenadas aproximadas
- ✅ Continua funcionando normalmente
- ✅ Salva localização corretamente

## 🎯 **Resultado**

Com API key válida:
- 🗺️ Mapa real e interativo
- 🔍 Busca de endereços precisa
- 📍 Coordenadas exatas
- 🎯 Arrastar marcador

Sem API key:
- 📍 Sistema offline funcional
- 🔍 Busca por bairros principais
- ✅ Coordenadas aproximadas
- ✅ Salva tudo normalmente

**Ambos funcionam perfeitamente para seu projeto!**
