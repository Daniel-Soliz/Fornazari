import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Camera,
  FlaskConical,
  Home,
  Info,
  MapPin,
  Phone,
  Scissors,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AppRoute, ServiceTab } from '../types/fornazari';

interface DrawerNavItem {
  label: string;
  route: AppRoute;
  tab?: ServiceTab;
  icon: React.ComponentType<{ className?: string }>;
}

const DRAWER_LINKS: DrawerNavItem[] = [
  {
    label: 'Clínica Veterinária',
    route: '/servicos',
    tab: 'clinica',
    icon: Stethoscope,
  },
  {
    label: 'Especialidades',
    route: '/servicos',
    tab: 'especialidades',
    icon: Sparkles,
  },
  {
    label: 'Exames',
    route: '/servicos',
    tab: 'exames',
    icon: FlaskConical,
  },
  {
    label: 'Banho e Tosa',
    route: '/servicos',
    tab: 'banho',
    icon: Scissors,
  },
  {
    label: 'Sobre a Fornazari',
    route: '/sobre',
    icon: Info,
  },
  {
    label: 'Galeria',
    route: '/galeria',
    icon: Camera,
  },
  {
    label: 'Localização',
    route: '/contato',
    icon: MapPin,
  },
  {
    label: 'Contato',
    route: '/contato',
    icon: Phone,
  },
];

export const HamburgerDrawer: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen, navigate } = useStore();

  useEffect(() => {
    if (!isMenuOpen) return;
    const dialog = document.getElementById('site-catalog');
    const buttons = dialog?.querySelectorAll<HTMLButtonElement>('button');
    buttons?.[0]?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMenuOpen(false);
      if (e.key !== 'Tab' || !buttons?.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
      document.getElementById('catalog-trigger')?.focus({ preventScroll: true });
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" id="site-catalog" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-[#073B2B]/45 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm bg-[#F8F9F6] h-full shadow-2xl border-l border-[#20322A]/10 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="px-6 py-5 border-b border-[#20322A]/10 flex items-center justify-between bg-white">
                <div>
                  <div className="font-display font-bold text-base text-[#073B2B]">
                    Catálogo Fornazari
                  </div>

                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="w-10 h-10 rounded-lg border border-[#20322A]/12 flex items-center justify-center text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick primary links for mobile */}
              <div className="px-4 pt-3 pb-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-[#20322A]/10 text-sm font-semibold text-[#073B2B]"
                >
                  <Home className="w-4 h-4 text-[#115C39]" />
                  Início
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/loja')}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-[#20322A]/10 text-sm font-semibold text-[#073B2B]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#115C39]" />
                  Loja Digital
                </button>
              </div>

              <nav className="grid grid-cols-2 gap-2.5 px-4 pt-1 pb-4" aria-label="Menu completo">
                {DRAWER_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigate(item.route, { tab: item.tab })}
                      className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl w-full border border-[#DCE7DF] bg-white px-2 text-center text-sm font-semibold leading-tight text-[#073B2B] hover:bg-[#E9F3ED] focus-visible:outline-2 focus-visible:outline-[#115C39] cursor-pointer"
                    >
                      <span className="grid place-items-center size-10 rounded-xl bg-[#E9F3ED] text-[#115C39]">
                        <Icon className="size-5" />
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
