'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Green top bar */}
      <div className="bg-green-800 py-1 sm:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Link 
            href="tel:+905523557506" 
            className="text-white text-sm sm:text-base px-4 sm:px-8 py-1 sm:py-2 border-2 border-white hover:bg-white hover:text-green-700 transition-colors font-bold tracking-wide"
          >
            HEMEN ARA
          </Link>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo - completely aligned to left edge */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.jpg"
                alt="GreenPark" 
                className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-3 object-contain"
              />
              <div className="hidden sm:block">
                <div className="text-xs sm:text-sm text-gray-600">www.mimozabotanik.com</div>
              </div>
            </Link>

            {/* Navigation - completely aligned to right edge */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className={pathname === '/' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                Ana Sayfa
              </Link>
              <Link href="/hakkimizda" className={pathname === '/hakkimizda' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                Hakkımızda
              </Link>
              <Link href="/hizmetlerimiz" className={pathname === '/hizmetlerimiz' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                Hizmetlerimiz
              </Link>
              <Link href="/referanslarimiz" className={pathname === '/referanslarimiz' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                Referanslarımız
              </Link>
              <Link href="/galeri" className={pathname === '/galeri' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                Galeri
              </Link>
              <Link href="/blog" className={pathname === '/blog' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                Blog
              </Link>
              <Link href="/iletisim" className={pathname === '/iletisim' ? 'bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors' : 'text-gray-700 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-600 pb-1'}>
                İletişim
              </Link>
              <button className="text-gray-700 hover:text-green-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link href="/" className={pathname === '/' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
                <Link href="/hakkimizda" className={pathname === '/hakkimizda' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>Hakkımızda</Link>
                <Link href="/hizmetlerimiz" className={pathname === '/hizmetlerimiz' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>Hizmetlerimiz</Link>
                <Link href="/referanslarimiz" className={pathname === '/referanslarimiz' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>Referanslarımız</Link>
                <Link href="/galeri" className={pathname === '/galeri' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>Galeri</Link>
                <Link href="/blog" className={pathname === '/blog' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <Link href="/iletisim" className={pathname === '/iletisim' ? 'bg-gray-800 text-white px-4 py-2' : 'text-gray-700 px-4 py-2 hover:bg-gray-100'} onClick={() => setIsMenuOpen(false)}>İletişim</Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}