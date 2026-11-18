export type AppRoute =
  | '/'
  | '/loja'
  | '/servicos'
  | '/sobre'
  | '/galeria'
  | '/contato'
  | '/admin';

export type ServiceTab = 'clinica' | 'especialidades' | 'exames' | 'banho';

export type CategoryName =
  | 'Rações para cães'
  | 'Rações para gatos'
  | 'Petiscos'
  | 'Brinquedos'
  | 'Acessórios'
  | 'Higiene e cuidados'
  | 'Outros produtos';

export interface Category {
  id: string;
  name: CategoryName;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: CategoryName;
  price: number;
  promoPrice?: number;
  stock: number;
  active: boolean;
  featured: boolean;
  isDemo: boolean;
  image: string;
  gallery?: string[];
  description: string;
  weightOrSize?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategoryTab = 'clinica' | 'especialidades' | 'exames' | 'banho';

export type ServiceAvailability = 'Disponível' | 'Sob consulta' | 'Oculto';

export interface Service {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: ServiceCategoryTab;
  image: string;
  availability: ServiceAvailability;
  priceLabel: string;
  requiresReferral?: boolean;
  orderIndex: number;
}

export type OrderStatus =
  | 'Novo'
  | 'Em preparação'
  | 'Pronto para retirada'
  | 'Retirado'
  | 'Cancelado';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  brand: string;
  unitPrice: number;
  quantity: number;
  image: string;
  isDemo: boolean;
}

export interface Order {
  id: string;
  protocol: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  internalNotes: string;
  fulfillmentMethod: 'Retirada na loja' | 'Consultar futura entrega (a combinar)';
  paymentMethod: 'A combinar com a loja';
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  isDemoOrder: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type MediaCategory =
  | 'Fachada e Marca'
  | 'Ambientes'
  | 'Clínica'
  | 'Pet Shop'
  | 'Banho e Tosa'
  | 'Produtos';

export interface MediaAsset {
  id: string;
  name: string;
  alt: string;
  category: MediaCategory;
  url: string;
  source: 'local' | 'oficial' | 'upload';
  createdAt: string;
}

export interface StoreSettings {
  businessName: string;
  founderName: string;
  crmv: string;
  foundedYear: string;
  petShopExpansionYear: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappVet: string;
  whatsappPetShop: string;
  email: string;
  address: string;
  neighborhood: string;
  googleMapsUrl: string;
  clinicHours: string;
  groomingHoursWeekdays: string;
  groomingHoursWeekend: string;
  pickupNotice: string;
  futureDeliveryNotice: string;
  demoMode: boolean;
  primaryColor: string;
  deepColor: string;
  accentRed: string;
  footerCopyright: string;
  privacySummary: string;
}

export interface HomeAreaCard {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  targetRoute: AppRoute;
  targetTab?: ServiceTab;
  image: string;
  imageAlt: string;
}

export interface SiteContent {
  logoUrl: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryBtnText: string;
  heroPrimaryBtnRoute: AppRoute;
  heroSecondaryBtnText: string;
  heroSecondaryBtnRoute: AppRoute;
  areasTitle: string;
  areaCards: [HomeAreaCard, HomeAreaCard, HomeAreaCard];
  institutionalTitle: string;
  institutionalSummary: string;
  institutionalFullStory: string;
  institutionalImage: string;
  featuredTitle: string;
  featuredSubtitle: string;
  quickContactTitle: string;
  quickContactSubtitle: string;
  footerDescription: string;
  servicesBanhoImage: string;
  servicesClinicaImage: string;
  servicesExamesImage: string;
}

export interface BackupPayload {
  version: 'fornazari:v1';
  exportedAt: string;
  settings: StoreSettings;
  content: SiteContent;
  products: Product[];
  services: Service[];
  orders: Order[];
  media: MediaAsset[];
}
