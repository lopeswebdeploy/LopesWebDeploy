import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Providers from "@/components/Providers"

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
  openGraph: {
    title: 'Lopes Imóveis - Imóveis de Alto Padrão em Goiânia',
    description: 'Há mais de 20 anos realizando sonhos em Goiânia. Especialistas em imóveis de alto padrão.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHHzd'}&libraries=places`}
        ></script>
      </head>
      <body className="min-h-screen bg-background font-body antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
