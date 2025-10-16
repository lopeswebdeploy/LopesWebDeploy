'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Fechar busca ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redireciona para a página de imóveis com o termo de busca
      router.push(`/imoveis?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="w-full max-w-7xl mx-auto px-mobile-md lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-preta.png"
              alt="Lopes Imóveis"
              width={120}
              height={40}
              className="h-8 lg:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/lancamentos" 
              className={`text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-sm uppercase tracking-wide ${
                isActive('/lancamentos') ? 'text-gray-600' : ''
              }`}
            >
              Lançamentos
            </Link>
            <Link 
              href="/imoveis" 
              className={`text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-sm uppercase tracking-wide ${
                isActive('/imoveis') ? 'text-gray-600' : ''
              }`}
            >
              Apartamentos a Venda
            </Link>
            <Link 
              href="#" 
              className="text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-sm uppercase tracking-wide"
            >
              Trabalhe Conosco
            </Link>
            <Link 
              href="#" 
              className="text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-sm uppercase tracking-wide"
            >
              Vender Meu Imóvel
            </Link>
            <Link 
              href="#" 
              className="text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-sm uppercase tracking-wide"
            >
              Aluguel
            </Link>
          </nav>

          {/* Search and CTA */}
          <div className="hidden lg:flex items-center space-x-4" ref={searchRef}>
            {/* Search Icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-900 hover:text-gray-600 transition-all duration-300 border border-gray-300 rounded-lg hover:border-gray-400"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Search Input */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showSearch ? 'max-w-80 opacity-100' : 'max-w-0 opacity-0'
            }`}>
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar imóveis..."
                  className="bg-white text-gray-900 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 w-48"
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white border border-gray-900 border-l-0 rounded-r-lg px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
            
            {/* CTA Button */}
            <Button 
              className="bg-brand-coral hover:bg-brand-coral-dark text-white rounded-full w-10 h-10 lg:w-12 lg:h-12 p-0"
              onClick={() => router.push('/admin/login')}
            >
              <span className="sr-only">Login</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-900 hover:text-gray-600"
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <nav className="mobile-nav p-mobile-lg">
              <Link 
                href="/lancamentos" 
                className={`mobile-nav-item text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-mobile-sm uppercase tracking-wide ${
                  isActive('/lancamentos') ? 'text-gray-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Lançamentos
              </Link>
              <Link 
                href="/imoveis" 
                className={`mobile-nav-item text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-mobile-sm uppercase tracking-wide ${
                  isActive('/imoveis') ? 'text-gray-600' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Apartamentos a Venda
              </Link>
              <Link 
                href="#" 
                className="mobile-nav-item text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-mobile-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Trabalhe Conosco
              </Link>
              <Link 
                href="#" 
                className="mobile-nav-item text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-mobile-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Vender Meu Imóvel
              </Link>
              <Link 
                href="#" 
                className="mobile-nav-item text-gray-900 hover:text-gray-600 transition-colors duration-300 font-medium text-mobile-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Aluguel
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center mt-mobile-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar imóveis..."
                  className="bg-white text-gray-900 border border-gray-300 rounded-l-lg px-mobile-sm py-mobile-sm text-mobile-sm focus:outline-none focus:border-gray-400 flex-1"
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white border border-gray-900 border-l-0 rounded-r-lg px-mobile-md py-mobile-sm text-mobile-sm hover:bg-gray-800 transition-colors"
                >
                  Buscar
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;