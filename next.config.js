/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurar a porta padrão como 3001
  // Remover warning de múltiplos lockfiles
  // outputFileTracingRoot removido - não suportado no Next.js 14
  
  // Desabilitar ESLint temporariamente para focar nos erros de TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    domains: ['images.unsplash.com', 'blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig