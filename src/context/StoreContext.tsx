import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_MEDIA,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_SETTINGS,
  INITIAL_SITE_CONTENT,
} from '../data/initialData';
import {
  AppRoute,
  BackupPayload,
  CartItem,
  MediaAsset,
  Order,
  OrderStatus,
  Product,
  Service,
  ServiceTab,
  SiteContent,
  StoreSettings,
} from '../types/fornazari';
import {
  generateUniqueProtocol,
  loadInitialData,
  mergeSettings,
  mergeSiteContent,
  safeWriteStorage,
  STORAGE_KEYS,
} from '../utils/storage';

interface ToastMessage {
  id: string;
  text: string;
  tone: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextValue {
  route: AppRoute;
  serviceTab: ServiceTab;
  navigate: (to: AppRoute, options?: { tab?: ServiceTab; scrollTop?: boolean }) => void;
  setServiceTab: (tab: ServiceTab) => void;

  products: Product[];
  services: Service[];
  orders: Order[];
  cart: CartItem[];
  media: MediaAsset[];
  settings: StoreSettings;
  content: SiteContent;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;
  isPrivacyModalOpen: boolean;
  setIsPrivacyModalOpen: (open: boolean) => void;

  toasts: ToastMessage[];
  showToast: (text: string, tone?: ToastMessage['tone']) => void;

  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  createOrder: (input: {
    customerName: string;
    customerPhone: string;
    notes: string;
    fulfillmentMethod: Order['fulfillmentMethod'];
  }) => { ok: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus, internalNotes?: string) => void;

  saveProduct: (product: Product) => { ok: boolean; error?: string };
  deleteProduct: (productId: string) => void;
  clearDemoProducts: () => void;

  saveService: (service: Service) => void;
  deleteService: (serviceId: string) => void;

  addMediaAsset: (asset: MediaAsset) => { ok: boolean; error?: string };
  updateMediaAsset: (asset: MediaAsset) => { ok: boolean; error?: string };
  deleteMediaAsset: (assetId: string) => void;

  updateSettings: (next: StoreSettings) => { ok: boolean; error?: string };
  updateContent: (next: SiteContent) => { ok: boolean; error?: string };
  resetContentToDefault: () => void;

  exportBackupJson: () => BackupPayload;
  importBackupPayload: (payload: BackupPayload) => void;
  restoreAllDemoData: () => void;
}

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/loja',
  '/servicos',
  '/sobre',
  '/galeria',
  '/contato',
  '/admin',
];

function parseLocation(): { route: AppRoute; tab: ServiceTab } {
  if (typeof window === 'undefined') return { route: '/', tab: 'clinica' };
  const rawPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const route = VALID_ROUTES.includes(rawPath as AppRoute) ? (rawPath as AppRoute) : '/';
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  const validTabs: ServiceTab[] = ['clinica', 'especialidades', 'exames', 'banho'];
  const tab = validTabs.includes(tabParam as ServiceTab) ? (tabParam as ServiceTab) : 'clinica';
  return { route, tab };
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(() => loadInitialData(), []);
  const initialLoc = useMemo(() => parseLocation(), []);

  const [route, setRoute] = useState<AppRoute>(initialLoc.route);
  const [serviceTab, setServiceTabState] = useState<ServiceTab>(initialLoc.tab);

  const [products, setProducts] = useState<Product[]>(initial.products);
  const [services, setServices] = useState<Service[]>(initial.services);
  const [orders, setOrders] = useState<Order[]>(initial.orders);
  const [cart, setCart] = useState<CartItem[]>(initial.cart);
  const [media, setMedia] = useState<MediaAsset[]>(initial.media);
  const [settings, setSettings] = useState<StoreSettings>(initial.settings);
  const [content, setContent] = useState<SiteContent>(initial.content);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, tone: ToastMessage['tone'] = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  // Browser back/forward sync
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseLocation();
      setRoute(parsed.route);
      setServiceTabState(parsed.tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cross-tab storage sync in same browser
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || !e.key.startsWith('fornazari:v1:')) return;
      const fresh = loadInitialData();
      setProducts(fresh.products);
      setServices(fresh.services);
      setOrders(fresh.orders);
      setCart(fresh.cart);
      setMedia(fresh.media);
      setSettings(fresh.settings);
      setContent(fresh.content);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Update dynamic document title
  useEffect(() => {
    const titles: Record<AppRoute, string> = {
      '/': `${settings.businessName} | Itaberaba e Freguesia do Ó`,
      '/loja': `Loja Digital | ${settings.businessName}`,
      '/servicos': `Serviços Veterinários e Banho e Tosa | ${settings.businessName}`,
      '/sobre': `Sobre a Fornazari | Desde 1997`,
      '/galeria': `Galeria de Instalações | ${settings.businessName}`,
      '/contato': `Localização e Contato | ${settings.businessName}`,
      '/admin': `Painel Administrativo | ${settings.businessName}`,
    };
    document.title = titles[route] || settings.businessName;
  }, [route, settings.businessName]);

  const navigate = useCallback(
    (to: AppRoute, options?: { tab?: ServiceTab; scrollTop?: boolean }) => {
      const nextTab = options?.tab || (to === '/servicos' ? serviceTab : 'clinica');
      setRoute(to);
      if (options?.tab) {
        setServiceTabState(options.tab);
      }
      setIsMenuOpen(false);
      const url = to === '/servicos' ? `${to}?tab=${nextTab}` : to;
      if (window.location.pathname + window.location.search !== url) {
        window.history.pushState({}, '', url);
      }
      if (options?.scrollTop !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [serviceTab]
  );

  const setServiceTab = useCallback((tab: ServiceTab) => {
    setServiceTabState(tab);
    const url = `/servicos?tab=${tab}`;
    if (window.location.pathname === '/servicos') {
      window.history.replaceState({}, '', url);
    }
  }, []);

  // Persist cart changes
  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.cart, cart);
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId && p.active);
      if (!product) return sum;
      const effectivePrice =
        product.promoPrice && product.promoPrice > 0 && product.promoPrice < product.price
          ? product.promoPrice
          : product.price;
      return sum + effectivePrice * item.quantity;
    }, 0);
  }, [cart, products]);

  const addToCart = useCallback(
    (productId: string, quantity = 1): boolean => {
      const product = products.find((p) => p.id === productId);
      if (!product || !product.active) {
        showToast('Este produto não está disponível no momento.', 'warning');
        return false;
      }
      if (product.stock <= 0) {
        showToast('Produto sem estoque disponível.', 'warning');
        return false;
      }
      const qtyToAdd = Math.max(1, Math.floor(quantity));
      let added = false;
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        const currentQty = existing ? existing.quantity : 0;
        const nextQty = currentQty + qtyToAdd;
        if (nextQty > product.stock) {
          showToast(
            `Quantidade limitada ao estoque disponível (${product.stock} un.).`,
            'warning'
          );
          if (currentQty >= product.stock) return prev;
          added = true;
          if (existing) {
            return prev.map((i) =>
              i.productId === productId ? { ...i, quantity: product.stock } : i
            );
          }
          return [...prev, { productId, quantity: product.stock }];
        }
        added = true;
        if (existing) {
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: nextQty } : i
          );
        }
        return [...prev, { productId, quantity: qtyToAdd }];
      });
      if (added) {
        showToast(`${product.name} adicionado ao carrinho.`, 'success');
      }
      return added;
    },
    [products, showToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      if (quantity <= 0) {
        setCart((prev) => prev.filter((i) => i.productId !== productId));
        return;
      }
      const clamped = Math.min(Math.floor(quantity), Math.max(1, product.stock));
      if (quantity > product.stock) {
        showToast(`Estoque máximo disponível: ${product.stock} un.`, 'warning');
      }
      setCart((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: clamped } : i))
      );
    },
    [products, showToast]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const createOrder = useCallback(
    (input: {
      customerName: string;
      customerPhone: string;
      notes: string;
      fulfillmentMethod: Order['fulfillmentMethod'];
    }): { ok: boolean; order?: Order; error?: string } => {
      const cleanName = input.customerName.trim();
      const cleanPhone = input.customerPhone.trim();
      if (cleanName.length < 3) {
        return { ok: false, error: 'Informe seu nome completo.' };
      }
      if (cleanPhone.replace(/\D/g, '').length < 10) {
        return { ok: false, error: 'Informe um telefone ou WhatsApp válido com DDD.' };
      }

      const validItems = cart
        .map((ci) => {
          const prod = products.find((p) => p.id === ci.productId && p.active);
          if (!prod || prod.stock <= 0) return null;
          const safeQty = Math.min(ci.quantity, prod.stock);
          const unitPrice =
            prod.promoPrice && prod.promoPrice > 0 && prod.promoPrice < prod.price
              ? prod.promoPrice
              : prod.price;
          return {
            productId: prod.id,
            sku: prod.sku,
            name: prod.name,
            brand: prod.brand,
            unitPrice,
            quantity: safeQty,
            image: prod.image,
            isDemo: prod.isDemo,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      if (validItems.length === 0) {
        return { ok: false, error: 'Seu carrinho está vazio ou sem itens disponíveis.' };
      }

      const total = validItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const protocol = generateUniqueProtocol(orders);
      const newOrder: Order = {
        id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        protocol,
        createdAt: new Date().toISOString(),
        customerName: cleanName,
        customerPhone: cleanPhone,
        notes: input.notes.trim(),
        internalNotes: '',
        fulfillmentMethod: input.fulfillmentMethod,
        paymentMethod: 'A combinar com a loja',
        items: validItems,
        total,
        status: 'Novo',
        isDemoOrder: settings.demoMode || validItems.some((i) => i.isDemo),
      };

      const nextOrders = [newOrder, ...orders];
      const writeRes = safeWriteStorage(STORAGE_KEYS.orders, nextOrders);
      if (!writeRes.ok) {
        return { ok: false, error: writeRes.error };
      }

      setOrders(nextOrders);
      setCart([]);
      return { ok: true, order: newOrder };
    },
    [cart, orders, products, settings.demoMode]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus, internalNotes?: string) => {
      setOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
                internalNotes: internalNotes !== undefined ? internalNotes : o.internalNotes,
              }
            : o
        );
        safeWriteStorage(STORAGE_KEYS.orders, next);
        return next;
      });
      showToast('Pedido atualizado no painel.', 'success');
    },
    [showToast]
  );

  const saveProduct = useCallback(
    (product: Product): { ok: boolean; error?: string } => {
      const exists = products.some((p) => p.id === product.id);
      const next = exists
        ? products.map((p) => (p.id === product.id ? { ...product, updatedAt: new Date().toISOString() } : p))
        : [{ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...products];
      const res = safeWriteStorage(STORAGE_KEYS.products, next);
      if (!res.ok) {
        showToast(res.error || 'Erro ao salvar produto.', 'error');
        return res;
      }
      setProducts(next);
      showToast(exists ? 'Produto atualizado na loja.' : 'Produto cadastrado na loja.', 'success');
      return { ok: true };
    },
    [products, showToast]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      const next = products.filter((p) => p.id !== productId);
      setProducts(next);
      safeWriteStorage(STORAGE_KEYS.products, next);
      setCart((prev) => prev.filter((c) => c.productId !== productId));
      showToast('Produto removido.', 'info');
    },
    [products, showToast]
  );

  const clearDemoProducts = useCallback(() => {
    const next = products.filter((p) => !p.isDemo);
    setProducts(next);
    safeWriteStorage(STORAGE_KEYS.products, next);
    setCart((prev) => prev.filter((c) => next.some((p) => p.id === c.productId)));
    showToast('Produtos demonstrativos removidos.', 'info');
  }, [products, showToast]);

  const saveService = useCallback(
    (service: Service) => {
      const exists = services.some((s) => s.id === service.id);
      const next = exists
        ? services.map((s) => (s.id === service.id ? service : s))
        : [...services, service];
      setServices(next);
      safeWriteStorage(STORAGE_KEYS.services, next);
      showToast(exists ? 'Serviço atualizado.' : 'Serviço adicionado.', 'success');
    },
    [services, showToast]
  );

  const deleteService = useCallback(
    (serviceId: string) => {
      const next = services.filter((s) => s.id !== serviceId);
      setServices(next);
      safeWriteStorage(STORAGE_KEYS.services, next);
      showToast('Serviço excluído.', 'info');
    },
    [services, showToast]
  );

  const addMediaAsset = useCallback(
    (asset: MediaAsset): { ok: boolean; error?: string } => {
      const next = [asset, ...media];
      const res = safeWriteStorage(STORAGE_KEYS.media, next);
      if (!res.ok) {
        showToast(res.error || 'Falha ao salvar mídia.', 'error');
        return res;
      }
      setMedia(next);
      showToast('Imagem adicionada à galeria.', 'success');
      return { ok: true };
    },
    [media, showToast]
  );

  const updateMediaAsset = useCallback(
    (asset: MediaAsset): { ok: boolean; error?: string } => {
      const next = media.map((m) => (m.id === asset.id ? asset : m));
      const res = safeWriteStorage(STORAGE_KEYS.media, next);
      if (!res.ok) {
        showToast(res.error || 'Falha ao atualizar mídia.', 'error');
        return res;
      }
      setMedia(next);
      showToast('Mídia atualizada.', 'success');
      return { ok: true };
    },
    [media, showToast]
  );

  const deleteMediaAsset = useCallback(
    (assetId: string) => {
      const next = media.filter((m) => m.id !== assetId);
      setMedia(next);
      safeWriteStorage(STORAGE_KEYS.media, next);
      showToast('Imagem removida da galeria.', 'info');
    },
    [media, showToast]
  );

  const updateSettings = useCallback(
    (next: StoreSettings): { ok: boolean; error?: string } => {
      const merged = mergeSettings(next);
      const res = safeWriteStorage(STORAGE_KEYS.settings, merged);
      if (!res.ok) {
        showToast(res.error || 'Falha ao salvar configurações.', 'error');
        return res;
      }
      setSettings(merged);
      showToast('Configurações da empresa salvas.', 'success');
      return { ok: true };
    },
    [showToast]
  );

  const updateContent = useCallback(
    (next: SiteContent): { ok: boolean; error?: string } => {
      const merged = mergeSiteContent(next);
      const res = safeWriteStorage(STORAGE_KEYS.content, merged);
      if (!res.ok) {
        showToast(res.error || 'Falha ao salvar conteúdo.', 'error');
        return res;
      }
      setContent(merged);
      showToast('Página inicial atualizada com sucesso.', 'success');
      return { ok: true };
    },
    [showToast]
  );

  const resetContentToDefault = useCallback(() => {
    setContent(INITIAL_SITE_CONTENT);
    safeWriteStorage(STORAGE_KEYS.content, INITIAL_SITE_CONTENT);
    showToast('Conteúdo padrão da página inicial restaurado.', 'info');
  }, [showToast]);

  const exportBackupJson = useCallback((): BackupPayload => {
    return {
      version: 'fornazari:v1',
      exportedAt: new Date().toISOString(),
      settings,
      content,
      products,
      services,
      orders,
      media,
    };
  }, [settings, content, products, services, orders, media]);

  const importBackupPayload = useCallback(
    (payload: BackupPayload) => {
      safeWriteStorage(STORAGE_KEYS.settings, payload.settings);
      safeWriteStorage(STORAGE_KEYS.content, payload.content);
      safeWriteStorage(STORAGE_KEYS.products, payload.products);
      safeWriteStorage(STORAGE_KEYS.services, payload.services);
      safeWriteStorage(STORAGE_KEYS.orders, payload.orders);
      safeWriteStorage(STORAGE_KEYS.media, payload.media);

      setSettings(payload.settings);
      setContent(payload.content);
      setProducts(payload.products);
      setServices(payload.services);
      setOrders(payload.orders);
      setMedia(payload.media);
      showToast('Backup importado e aplicado com sucesso.', 'success');
    },
    [showToast]
  );

  const restoreAllDemoData = useCallback(() => {
    safeWriteStorage(STORAGE_KEYS.settings, INITIAL_SETTINGS);
    safeWriteStorage(STORAGE_KEYS.content, INITIAL_SITE_CONTENT);
    safeWriteStorage(STORAGE_KEYS.products, INITIAL_PRODUCTS);
    safeWriteStorage(STORAGE_KEYS.services, INITIAL_SERVICES);
    safeWriteStorage(STORAGE_KEYS.media, INITIAL_MEDIA);
    safeWriteStorage(STORAGE_KEYS.orders, []);
    safeWriteStorage(STORAGE_KEYS.cart, []);

    setSettings(INITIAL_SETTINGS);
    setContent(INITIAL_SITE_CONTENT);
    setProducts(INITIAL_PRODUCTS);
    setServices(INITIAL_SERVICES);
    setMedia(INITIAL_MEDIA);
    setOrders([]);
    setCart([]);
    showToast('Dados demonstrativos originais restaurados.', 'info');
  }, [showToast]);

  const value: StoreContextValue = {
    route,
    serviceTab,
    navigate,
    setServiceTab,
    products,
    services,
    orders,
    cart,
    media,
    settings,
    content,
    isCartOpen,
    setIsCartOpen,
    isMenuOpen,
    setIsMenuOpen,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    toasts,
    showToast,
    cartCount,
    cartSubtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    clearDemoProducts,
    saveService,
    deleteService,
    addMediaAsset,
    updateMediaAsset,
    deleteMediaAsset,
    updateSettings,
    updateContent,
    resetContentToDefault,
    exportBackupJson,
    importBackupPayload,
    restoreAllDemoData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
