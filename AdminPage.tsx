import React, { useState } from 'react';
import {
  ArrowLeft,
  ClipboardList,
  DatabaseBackup,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  Menu,
  Package,
  Settings,
  ShieldAlert,
  Stethoscope,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminHomeEditor } from './AdminHomeEditor';
import { AdminMedia } from './AdminMedia';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminServices } from './AdminServices';
import { AdminSettingsBackup } from './AdminSettingsBackup';

type AdminSection =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'home'
  | 'services'
  | 'media'
  | 'settings'
  | 'backup';

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'orders', label: 'Pedidos', icon: ClipboardList },
  { id: 'home', label: 'Editor da Home', icon: LayoutTemplate },
  { id: 'services', label: 'Serviços', icon: Stethoscope },
  { id: 'media', label: 'Galeria de Mídia', icon: ImageIcon },
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'backup', label: 'Backup e Restauração', icon: DatabaseBackup },
];

export const AdminPage: React.FC = () => {
  const { navigate, orders, products, settings } = useStore();
  const [enteredDemoAdmin, setEnteredDemoAdmin] = useState(false);
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeLabel = NAV_ITEMS.find((i) => i.id === section)?.label || 'Dashboard';

  // Visual Access Gate (explicitly discloses client-side demonstration nature)
  if (!enteredDemoAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F9F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#20322A]/12 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-[#E9F3ED] text-[#115C39] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20322A]/70 hover:text-[#115C39] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao site
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl text-[#073B2B]">
              Painel Administrativo
            </h1>
            <p className="text-sm text-[#20322A]/75 leading-relaxed">
              Gerencie catálogo, pedidos locais, serviços, imagens e conteúdo da página inicial da Fornazari.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 space-y-2 text-xs text-[#20322A]/80 leading-relaxed">
            <div className="font-bold text-[#073B2B] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#D73F38] shrink-0" />
              Ambiente Demonstrativo (localStorage)
            </div>
            <p>
              Esta tela representa visualmente o fluxo de acesso administrativo. Como os dados operam exclusivamente no navegador local (sem servidor nem autenticação backend), não há senha armazenada no cliente fingindo segurança real.
            </p>
            <p className="text-[#20322A]/65">
              Em produção, este acesso será protegido por autenticação em servidor e banco de dados compartilhado.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => setEnteredDemoAdmin(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
            >
              Acessar painel demonstrativo
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#20322A]/15 text-xs font-semibold text-[#20322A] hover:bg-[#F8F9F6] transition-colors cursor-pointer"
            >
              Retornar à loja pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-[#073B2B] text-white shrink-0 border-r border-white/10">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="font-display font-extrabold text-lg tracking-tight">
            Fornazari ADM
          </div>
          <div className="text-[11px] text-white/65 mt-0.5">
            {settings.demoMode ? 'Modo Demonstração (localStorage)' : 'Modo Comercial local'}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1" aria-label="Menu Administrativo">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            const countBadge =
              item.id === 'orders'
                ? orders.filter((o) => o.status === 'Novo').length
                : item.id === 'products'
                ? products.length
                : null;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-[#073B2B]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {countBadge !== null && countBadge > 0 && (
                  <span
                    className={`font-mono-num text-[11px] px-1.5 py-0.5 rounded ${
                      active ? 'bg-[#E9F3ED] text-[#115C39]' : 'bg-white/15 text-white'
                    }`}
                  >
                    {countBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/18 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver site público
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Nav */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/45"
          />
          <div className="relative w-64 bg-[#073B2B] text-white h-full flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-display font-bold">Fornazari ADM</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-lg bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSection(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      active ? 'bg-white text-[#073B2B]' : 'text-white/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 rounded-xl bg-white/10 text-xs font-semibold"
            >
              Ver site público
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#20322A]/10 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Abrir menu administrativo"
              className="lg:hidden w-9 h-9 rounded-lg border border-[#20322A]/15 flex items-center justify-center"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-xs sm:text-sm text-[#20322A]/60 truncate">
              <span>Administração</span>
              <span className="mx-2">/</span>
              <strong className="text-[#073B2B] font-display">{activeLabel}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/loja')}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-[#20322A]/15 text-xs font-semibold text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer"
            >
              Abrir Loja
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg bg-[#E9F3ED] text-xs font-semibold text-[#073B2B] hover:bg-[#d5eadf] cursor-pointer"
            >
              Ver Home
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto">
          {section === 'dashboard' && (
            <AdminDashboard onGoToSection={(s) => setSection(s as AdminSection)} />
          )}
          {section === 'products' && <AdminProducts />}
          {section === 'orders' && <AdminOrders />}
          {section === 'home' && <AdminHomeEditor />}
          {section === 'services' && <AdminServices />}
          {section === 'media' && <AdminMedia />}
          {section === 'settings' && <AdminSettingsBackup activeTab="settings" />}
          {section === 'backup' && <AdminSettingsBackup activeTab="backup" />}
        </main>
      </div>
    </div>
  );
};
