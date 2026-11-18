import React, { useEffect, useState } from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    isMenuOpen,
    navigate,
    cartCount,
    setIsCartOpen,
    setIsMenuOpen,
    content,
    settings,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setLogoFailed(false);
  }, [content.logoUrl]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-[#20322A]/10 shadow-sm'
          : 'bg-[#F8F9F6]/95 backdrop-blur-sm border-[#20322A]/8'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Logotype */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115C39] rounded-md cursor-pointer"
          aria-label="Ir para a página inicial da Fornazari"
        >
          {content.logoUrl && !logoFailed ? (
            <img
              src={content.logoUrl}
              alt="Logotipo Fornazari"
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
              className="h-9 w-auto max-w-[70px] sm:max-w-[120px] object-contain"
            />
          ) : (
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white font-display font-extrabold text-lg"
              style={{ backgroundColor: settings.primaryColor }}
            >
              F
            </span>
          )}
          <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#073B2B] whitespace-nowrap">
            Fornazari
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Abrir carrinho de compras (${cartCount} itens)`}
            className="relative inline-flex items-center justify-center gap-2 h-10 px-3 rounded-lg bg-[#115C39] text-white hover:bg-[#073B2B] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115C39]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Carrinho</span>
            <span className="font-mono-num text-xs font-bold bg-white/18 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            id="catalog-trigger" aria-haspopup="dialog" aria-expanded={isMenuOpen} aria-controls="site-catalog" aria-label="Abrir catálogo de navegação"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#20322A]/15 bg-[#073B2B] text-white hover:bg-[#E9F3ED] hover:text-[#115C39] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115C39]"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
