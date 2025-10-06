/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurar a porta padrão como 3001
  // Remover warning de múltiplos lockfiles
  outputFileTracingRoot: '/Users/sdr-lopes/Downloads/Downloads/Lopes Web 0.01',
  
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
    ],
  },
}

module.exports = nextConfig