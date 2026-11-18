import {
  INITIAL_MEDIA,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_SETTINGS,
  INITIAL_SITE_CONTENT,
} from '../data/initialData';
import {
  BackupPayload,
  CartItem,
  MediaAsset,
  Order,
  Product,
  Service,
  SiteContent,
  StoreSettings,
} from '../types/fornazari';

export const STORAGE_KEYS = {
  products: 'fornazari:v1:products',
  orders: 'fornazari:v1:orders',
  settings: 'fornazari:v1:settings',
  content: 'fornazari:v1:content',
  cart: 'fornazari:v1:cart',
  services: 'fornazari:v1:services',
  media: 'fornazari:v1:media',
  orderSeq: 'fornazari:v1:order_seq',
} as const;

export function safeReadStorage<T>(
  key: string,
  fallback: T,
  validator?: (val: unknown) => val is T
): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function safeWriteStorage<T>(key: string, value: T): { ok: boolean; error?: string } {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'QuotaExceededError'
        ? 'Limite de armazenamento local do navegador atingido. Remova imagens antigas ou reduza o tamanho dos uploads.'
        : 'Não foi possível salvar no armazenamento local.';
    return { ok: false, error: message };
  }
}

export const isProductArray = (val: unknown): val is Product[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Product).id === 'string' &&
      typeof (item as Product).name === 'string' &&
      typeof (item as Product).price === 'number'
  );

export const isServiceArray = (val: unknown): val is Service[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Service).id === 'string' &&
      typeof (item as Service).title === 'string'
  );

export const isOrderArray = (val: unknown): val is Order[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Order).id === 'string' &&
      typeof (item as Order).protocol === 'string' &&
      Array.isArray((item as Order).items)
  );

export const isCartArray = (val: unknown): val is CartItem[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as CartItem).productId === 'string' &&
      typeof (item as CartItem).quantity === 'number' &&
      (item as CartItem).quantity > 0
  );

export const isMediaArray = (val: unknown): val is MediaAsset[] =>
  Array.isArray(val) &&
  val.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as MediaAsset).id === 'string' &&
      typeof (item as MediaAsset).url === 'string'
  );

export function mergeSettings(raw: unknown): StoreSettings {
  if (typeof raw !== 'object' || raw === null) return INITIAL_SETTINGS;
  return { ...INITIAL_SETTINGS, ...(raw as Partial<StoreSettings>) };
}

export function mergeSiteContent(raw: unknown): SiteContent {
  if (typeof raw !== 'object' || raw === null) return INITIAL_SITE_CONTENT;
  const partial = raw as Partial<SiteContent>;
  return {
    ...INITIAL_SITE_CONTENT,
    ...partial,
    areaCards:
      Array.isArray(partial.areaCards) && partial.areaCards.length === 3
        ? (partial.areaCards as SiteContent['areaCards'])
        : INITIAL_SITE_CONTENT.areaCards,
  };
}

export function loadInitialData() {
  const products = safeReadStorage<Product[]>(
    STORAGE_KEYS.products,
    INITIAL_PRODUCTS,
    isProductArray
  ).map((product) => {
    if (!product.isDemo || product.updatedAt !== product.createdAt ||
        !product.brand?.startsWith('Linha Demonstração ') ||
        !product.image?.startsWith('data:image/svg+xml')) return product;
    const current = INITIAL_PRODUCTS.find((item) => item.id === product.id && item.sku === product.sku);
    if (!current) return product;
    return { ...product, name: current.name, brand: current.brand, description: current.description,
      weightOrSize: current.weightOrSize, image: current.image, sourceUrl: current.sourceUrl };
  });
  const services = safeReadStorage<Service[]>(
    STORAGE_KEYS.services,
    INITIAL_SERVICES,
    isServiceArray
  );
  const orders = safeReadStorage<Order[]>(STORAGE_KEYS.orders, [], isOrderArray);
  const cart = safeReadStorage<CartItem[]>(STORAGE_KEYS.cart, [], isCartArray);
  const media = safeReadStorage<MediaAsset[]>(STORAGE_KEYS.media, INITIAL_MEDIA, isMediaArray);

  let settings = INITIAL_SETTINGS;
  try {
    const rawSettings = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (rawSettings) settings = mergeSettings(JSON.parse(rawSettings));
  } catch {
    settings = INITIAL_SETTINGS;
  }

  let content = INITIAL_SITE_CONTENT;
  try {
    const rawContent = window.localStorage.getItem(STORAGE_KEYS.content);
    if (rawContent) content = mergeSiteContent(JSON.parse(rawContent));
  } catch {
    content = INITIAL_SITE_CONTENT;
  }

  // Ensure initial keys exist on first visit without overwriting existing user edits
  if (!window.localStorage.getItem(STORAGE_KEYS.products)) {
    safeWriteStorage(STORAGE_KEYS.products, products);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.services)) {
    safeWriteStorage(STORAGE_KEYS.services, services);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.settings)) {
    safeWriteStorage(STORAGE_KEYS.settings, settings);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.content)) {
    safeWriteStorage(STORAGE_KEYS.content, content);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.media)) {
    safeWriteStorage(STORAGE_KEYS.media, media);
  }

  return { products, services, orders, cart, media, settings, content };
}

export function generateUniqueProtocol(existingOrders: Order[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const datePart = `${y}${m}${d}`;

  let seq = 1;
  try {
    const rawSeq = window.localStorage.getItem(STORAGE_KEYS.orderSeq);
    if (rawSeq) {
      const parsed = parseInt(rawSeq, 10);
      if (!Number.isNaN(parsed) && parsed >= 1) {
        seq = parsed + 1;
      }
    }
  } catch {
    seq = 1;
  }

  const usedProtocols = new Set(existingOrders.map((o) => o.protocol));
  let candidate = `FNZ-${datePart}-${String(seq).padStart(4, '0')}`;
  while (usedProtocols.has(candidate)) {
    seq += 1;
    candidate = `FNZ-${datePart}-${String(seq).padStart(4, '0')}`;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.orderSeq, String(seq));
  } catch {
    // ignore
  }

  return candidate;
}

export function validateBackupPayload(raw: unknown): {
  valid: boolean;
  error?: string;
  payload?: BackupPayload;
} {
  if (typeof raw !== 'object' || raw === null) {
    return { valid: false, error: 'Arquivo JSON inválido.' };
  }
  const obj = raw as Record<string, unknown>;
  if (obj.version !== 'fornazari:v1') {
    return { valid: false, error: 'Versão de backup incompatível (esperado fornazari:v1).' };
  }
  if (!isProductArray(obj.products)) {
    return { valid: false, error: 'Lista de produtos inválida no backup.' };
  }
  if (!isServiceArray(obj.services)) {
    return { valid: false, error: 'Lista de serviços inválida no backup.' };
  }
  if (!isOrderArray(obj.orders)) {
    return { valid: false, error: 'Lista de pedidos inválida no backup.' };
  }
  if (!isMediaArray(obj.media)) {
    return { valid: false, error: 'Lista de mídias inválida no backup.' };
  }

  const payload: BackupPayload = {
    version: 'fornazari:v1',
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    settings: mergeSettings(obj.settings),
    content: mergeSiteContent(obj.content),
    products: obj.products,
    services: obj.services,
    orders: obj.orders,
    media: obj.media,
  };

  return { valid: true, payload };
}

export function getLocalStorageUsageInfo(): {
  usedKB: number;
  estimatedLimitKB: number;
  percent: number;
  nearLimit: boolean;
} {
  let totalBytes = 0;
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('fornazari:')) {
        const val = window.localStorage.getItem(key) || '';
        totalBytes += (key.length + val.length) * 2;
      }
    }
  } catch {
    totalBytes = 0;
  }
  const usedKB = Math.round(totalBytes / 1024);
  const estimatedLimitKB = 4500;
  const percent = Math.min(100, Math.round((usedKB / estimatedLimitKB) * 100));
  return {
    usedKB,
    estimatedLimitKB,
    percent,
    nearLimit: percent >= 70,
  };
}

export async function compressImageFile(
  file: File,
  maxDimension = 900,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selecione um arquivo de imagem válido (PNG, JPG ou WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Não foi possível processar esta imagem.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contexto gráfico indisponível no navegador.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === 'image/png' && width <= 420 ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
