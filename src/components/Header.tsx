'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">
              <span className="text-brand-coral">Lopes</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium ${
                isActive('/') ? 'text-brand-coral' : ''
              }`}
            >
              Início
            </Link>
            <Link 
              href="/imoveis" 
              className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium ${
                isActive('/imoveis') ? 'text-brand-coral' : ''
              }`}
            >
              Imóveis Disponíveis
            </Link>
            <Link 
              href="/lancamentos" 
              className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium ${
                isActive('/lancamentos') ? 'text-brand-coral' : ''
              }`}
            >
              Lançamentos
            </Link>
            <Link 
              href="/sobre" 
              className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium ${
                isActive('/sobre') ? 'text-brand-coral' : ''
              }`}
            >
              Sobre
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/admin/login"
              className="text-sm text-gray-600 hover:text-brand-coral transition-colors"
            >
              Sou Corretor
            </Link>
            <Button variant="luxury" size="lg">
              Entre em Contato
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card border-t border-border shadow-lg">
            <nav className="flex flex-col space-y-4 p-6">
              <Link 
                href="/" 
                className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium py-2 ${
                  isActive('/') ? 'text-brand-coral' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/imoveis" 
                className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium py-2 ${
                  isActive('/imoveis') ? 'text-brand-coral' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Imóveis Disponíveis
              </Link>
              <Link 
                href="/lancamentos" 
                className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium py-2 ${
                  isActive('/lancamentos') ? 'text-brand-coral' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lançamentos
              </Link>
              <Link 
                href="/sobre" 
                className={`text-foreground hover:text-brand-coral transition-colors duration-300 font-medium py-2 ${
                  isActive('/sobre') ? 'text-brand-coral' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                href="/admin/login"
                className="text-sm text-gray-600 hover:text-brand-coral transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sou Corretor
              </Link>
              <Button variant="luxury" size="lg" className="mt-4 w-full">
                Entre em Contato
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;