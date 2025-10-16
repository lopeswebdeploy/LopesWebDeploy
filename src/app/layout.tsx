import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lopes Imóveis - Imóveis de Alto Padrão em Goiânia',
  description: 'Há mais de 20 anos realizando sonhos em Goiânia. Especialistas em imóveis de alto padrão com atendimento personalizado e exclusivo.',
  keywords: 'imóveis, Goiânia, alto padrão, apartamentos, casas, luxo, imobiliária',
  authors: [{ name: 'Lopes Imóveis' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-body antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}