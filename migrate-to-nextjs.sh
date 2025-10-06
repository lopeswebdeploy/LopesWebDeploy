#!/bin/bash

echo "🚀 Iniciando migração de React + Vite para Next.js..."

# Fazer backup
echo "📦 Fazendo backup do projeto atual..."
cp -r . ../Lopes-Web-Backup-$(date +%Y%m%d-%H%M%S)

# Substituir arquivos de configuração
echo "⚙️ Substituindo arquivos de configuração..."
mv package-nextjs.json package.json
mv next.config.js next.config.js
mv tsconfig-nextjs.json tsconfig.json
mv tailwind-nextjs.config.js tailwind.config.js
mv postcss-nextjs.config.js postcss.config.js
mv .eslintrc-nextjs.json .eslintrc.json

# Substituir componentes
echo "🔄 Atualizando componentes para Next.js..."
mv src/components/Header-nextjs.tsx src/components/Header.tsx
mv src/components/Hero-nextjs.tsx src/components/Hero.tsx
mv src/components/FeaturedProperties-nextjs.tsx src/components/FeaturedProperties.tsx
mv src/components/About-nextjs.tsx src/components/About.tsx

# Remover arquivos do Vite
echo "🗑️ Removendo arquivos específicos do Vite..."
rm -f vite.config.ts
rm -f index.html
rm -f src/main.tsx
rm -f src/App.tsx
rm -f src/vite-env.d.ts

# Limpar e reinstalar dependências
echo "📦 Limpando e reinstalando dependências..."
rm -rf node_modules package-lock.json
npm install

echo "✅ Migração concluída com sucesso!"
echo ""
echo "🎯 Para executar o projeto:"
echo "   npm run dev    # Desenvolvimento"
echo "   npm run build  # Build para produção"
echo "   npm run start  # Servidor de produção"
echo ""
echo "📖 Consulte o MIGRATION-README.md para mais detalhes"
