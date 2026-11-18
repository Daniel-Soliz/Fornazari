import React, { useEffect, useRef, useState } from 'react';
import { Menu, MessageCircle, ShoppingBag, Stethoscope, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AppRoute } from '../types/fornazari';
import { buildPetShopWhatsAppUrl, buildVetWhatsAppUrl } from '../utils/formatters';

export const Header: React.FC = () => {
  const {
    route,
    navigate,
    cartCount,
    setIsCartOpen,
    setIsMenuOpen,
    content,
    settings,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [whatsOpen, setWhatsOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const whatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setLogoFailed(false);
  }, [content.logoUrl]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (whatsRef.current && !whatsRef.current.contains(e.target as Node)) {
        setWhatsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const navItems: { label: string; to: AppRoute }[] = [
    { label: 'Início', to: '/' },
    { label: 'Loja', to: '/loja' },
    { label: 'Serviços', to: '/servicos' },
  ];

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
              className="h-9 w-auto max-w-[120px] object-contain"
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

        {/* Zone 2: 3 Primary Routes */}
        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-5 sm:gap-8"
        >
          {navItems.map((item) => {
            const active = route === item.to;
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className={`relative py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#115C39] ${
                  active
                    ? 'text-[#115C39]'
                    : 'text-[#20322A]/75 hover:text-[#115C39]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0 h-0.5 transition-transform duration-200 origin-left ${
                    active ? 'scale-x-100 bg-[#115C39]' : 'scale-x-0 bg-[#115C39]/50'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: WhatsApp, Cart, Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative" ref={whatsRef}>
            <button
              type="button"
              onClick={() => setWhatsOpen((v) => !v)}
              aria-expanded={whatsOpen}
              aria-label="Canais de atendimento WhatsApp"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-2.5 sm:px-3.5 rounded-lg border border-[#115C39]/25 bg-white text-[#115C39] hover:bg-[#E9F3ED] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115C39]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden md:inline">WhatsApp</span>
            </button>

            {whatsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#20322A]/12 shadow-lg p-2 z-50">
                <p className="px-3 py-1.5 text-[11px] font-semibold text-[#20322A]/60">
                  Escolha o canal de atendimento
                </p>
                <a
                  href={buildVetWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setWhatsOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#E9F3ED] transition-colors"
                >
                  <Stethoscope className="w-4 h-4 text-[#115C39] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[#20322A]">
                      Clínica Veterinária
                    </div>
                    <div className="text-xs text-[#20322A]/65 font-mono-num">
                      +55 11 95966-0208
                    </div>
                  </div>
                </a>
                <a
                  href={buildPetShopWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setWhatsOpen(false)}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#E9F3ED] transition-colors"
                >
                  <Store className="w-4 h-4 text-[#D73F38] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[#20322A]">
                      Pet Shop e Banho e Tosa
                    </div>
                    <div className="text-xs text-[#20322A]/65 font-mono-num">
                      +55 11 98221-1059
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

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
            aria-label="Abrir menu lateral de navegação"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#20322A]/15 bg-white text-[#20322A] hover:bg-[#E9F3ED] hover:text-[#115C39] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#115C39]"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
