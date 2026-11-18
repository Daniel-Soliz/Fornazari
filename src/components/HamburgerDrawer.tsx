import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Camera,
  ChevronRight,
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
  subtitle: string;
  route: AppRoute;
  tab?: ServiceTab;
  icon: React.ComponentType<{ className?: string }>;
}

const DRAWER_LINKS: DrawerNavItem[] = [
  {
    label: 'Sobre a Fornazari',
    subtitle: 'História desde 1997 e equipe',
    route: '/sobre',
    icon: Info,
  },
  {
    label: 'Clínica Veterinária',
    subtitle: 'Consultas, vacinação e cirurgias',
    route: '/servicos',
    tab: 'clinica',
    icon: Stethoscope,
  },
  {
    label: 'Especialidades',
    subtitle: '9 áreas clínicas especializadas',
    route: '/servicos',
    tab: 'especialidades',
    icon: Sparkles,
  },
  {
    label: 'Exames',
    subtitle: 'Diagnóstico com agendamento',
    route: '/servicos',
    tab: 'exames',
    icon: FlaskConical,
  },
  {
    label: 'Banho e Tosa',
    subtitle: 'Higiene, estética e horários',
    route: '/servicos',
    tab: 'banho',
    icon: Scissors,
  },
  {
    label: 'Galeria',
    subtitle: 'Fotos reais das instalações',
    route: '/galeria',
    icon: Camera,
  },
  {
    label: 'Localização',
    subtitle: 'Rua Parapuã, 747 – Itaberaba',
    route: '/contato',
    icon: MapPin,
  },
  {
    label: 'Contato',
    subtitle: 'Telefones, WhatsApp e atendimento',
    route: '/contato',
    icon: Phone,
  },
];

export const HamburgerDrawer: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen, navigate, settings } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Menu de navegação">
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
                    Navegação Fornazari
                  </div>
                  <div className="text-xs text-[#20322A]/60">
                    {settings.neighborhood}
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
              <div className="px-4 pt-4 pb-2 grid grid-cols-2 gap-2 sm:hidden">
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

              <nav className="p-4 space-y-1.5" aria-label="Menu completo">
                {DRAWER_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigate(item.route, { tab: item.tab })}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white hover:bg-[#E9F3ED]/70 border border-[#20322A]/8 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#E9F3ED] text-[#115C39] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#20322A] truncate">
                            {item.label}
                          </div>
                          <div className="text-xs text-[#20322A]/60 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#20322A]/35 group-hover:text-[#115C39] shrink-0" />
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-5 bg-white border-t border-[#20322A]/10 space-y-2 text-xs text-[#20322A]/75">
              <div className="font-semibold text-[#073B2B]">{settings.businessName}</div>
              <div>{settings.address}</div>
              <div className="font-mono-num">
                {settings.phonePrimary} · {settings.phoneSecondary}
              </div>
              <div className="text-[#20322A]/55">{settings.crmv}</div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
