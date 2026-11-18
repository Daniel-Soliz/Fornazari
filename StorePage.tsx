import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Info,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_CATEGORIES } from '../data/initialData';
import { CategoryName, Product } from '../types/fornazari';
import { formatBRL } from '../utils/formatters';
import { SmartImage } from '../components/SmartImage';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export const StorePage: React.FC = () => {
  const { products, settings, addToCart, setIsCartOpen } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | CategoryName>('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);

  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = activeProducts.filter((p) => {
      if (selectedCategory !== 'Todas' && p.category !== selectedCategory) return false;
      if (onlyAvailable && p.stock <= 0) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });

    const getEffectivePrice = (p: Product) =>
      p.promoPrice && p.promoPrice > 0 && p.promoPrice < p.price ? p.promoPrice : p.price;

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === 'price-desc') return getEffectivePrice(b) - getEffectivePrice(a);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'pt-BR');
      // featured first
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name, 'pt-BR');
    });
  }, [activeProducts, search, selectedCategory, onlyAvailable, sortBy]);

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setModalQty(1);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header & Demo Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-[#115C39]">
              Pet Shop Fornazari · Retirada na unidade (Itaberaba)
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#073B2B] tracking-tight">
              Loja Digital
            </h1>
            <p className="text-sm sm:text-base text-[#20322A]/75 max-w-2xl">
              Pesquise rações, petiscos, brinquedos, acessórios e itens de higiene. Monte sua solicitação para retirada na Rua Parapuã, 747.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E9F3ED] text-[#073B2B] text-sm font-semibold hover:bg-[#d6eadf] transition-colors self-start md:self-auto cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-[#115C39]" />
            Abrir carrinho
          </button>
        </div>

        {settings.demoMode && (
          <div className="p-4 rounded-xl bg-white border border-[#20322A]/12 flex items-start gap-3 text-xs sm:text-sm text-[#20322A]/80">
            <Info className="w-5 h-5 text-[#115C39] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#073B2B]">
                Demonstração — preços ilustrativos:
              </strong>{' '}
              os itens sinalizados como demonstração servem para apresentação do catálogo digital. O catálogo real e os valores confirmados pela Fornazari podem ser cadastrados no painel administrativo.
            </div>
          </div>
        )}
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl border border-[#20322A]/10 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#20322A]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, marca, categoria ou SKU..."
              aria-label="Buscar produtos na loja"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/15 text-sm focus:outline-none focus:border-[#115C39]"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#20322A]/55 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Ordenar produtos"
              className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/15 text-sm text-[#20322A] focus:outline-none focus:border-[#115C39]"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name-asc">Ordem alfabética (A–Z)</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3">
            <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#20322A] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#115C39] rounded"
              />
              Apenas em estoque
            </label>
          </div>
        </div>

        {/* Interactive Category Tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Categorias da loja"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('Todas')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'Todas'
                ? 'bg-[#115C39] text-white'
                : 'bg-[#F8F9F6] text-[#20322A]/75 hover:bg-[#E9F3ED]'
            }`}
          >
            Todas ({activeProducts.length})
          </button>
          {STORE_CATEGORIES.map((cat) => {
            const count = activeProducts.filter((p) => p.category === cat.name).length;
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#115C39] text-white'
                    : 'bg-[#F8F9F6] text-[#20322A]/75 hover:bg-[#E9F3ED]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-[#20322A]/65">
        <span>
          Exibindo <strong className="font-mono-num text-[#20322A]">{filteredProducts.length}</strong>{' '}
          {filteredProducts.length === 1 ? 'produto' : 'produtos'}
        </span>
        {(search || selectedCategory !== 'Todas' || onlyAvailable) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('Todas');
              setOnlyAvailable(false);
            }}
            className="text-[#115C39] font-semibold hover:underline cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-10 text-center space-y-3">
          <h2 className="font-display font-bold text-lg text-[#073B2B]">
            Nenhum produto encontrado
          </h2>
          <p className="text-sm text-[#20322A]/65 max-w-md mx-auto">
            Tente ajustar os termos da busca ou selecione outra categoria para visualizar os itens disponíveis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const hasPromo =
              product.promoPrice && product.promoPrice > 0 && product.promoPrice < product.price;
            const finalPrice = hasPromo ? product.promoPrice! : product.price;
            const outOfStock = product.stock <= 0;

            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl border border-[#20322A]/10 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => openProductModal(product)}
                    className="w-full text-left block cursor-pointer group"
                  >
                    <div className="aspect-[4/3] bg-[#F8F9F6] overflow-hidden border-b border-[#20322A]/8">
                      <SmartImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-5 pb-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#20322A]/60 truncate">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.brand}</span>
                      </div>

                      <h2 className="font-display font-bold text-base text-[#20322A] leading-snug group-hover:text-[#115C39] transition-colors line-clamp-2 min-h-[2.75rem]">
                        {product.name}
                      </h2>

                      <div className="text-xs text-[#20322A]/65 flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
                        <span className="font-mono-num">
                          {outOfStock
                            ? 'Indisponível'
                            : product.stock <= 5
                            ? `Últimas ${product.stock} un.`
                            : `Disponível (${product.stock} un.)`}
                        </span>
                        {product.isDemo && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#D73F38] font-medium">
                              Demonstração — preço ilustrativo
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#20322A]/6 flex items-center justify-between gap-3">
                  <div>
                    {hasPromo && (
                      <div className="text-xs line-through text-[#20322A]/45 font-mono-num">
                        {formatBRL(product.price)}
                      </div>
                    )}
                    <div className="text-lg font-extrabold font-mono-num text-[#073B2B]">
                      {formatBRL(finalPrice)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openProductModal(product)}
                      className="px-3 py-2 rounded-xl border border-[#20322A]/15 text-xs font-semibold text-[#20322A] hover:bg-[#F8F9F6] cursor-pointer"
                    >
                      Detalhes
                    </button>
                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={() => addToCart(product.id, 1)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] disabled:bg-[#20322A]/15 disabled:text-[#20322A]/45 transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {outOfStock ? 'Esgotado' : 'Adicionar'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={activeProduct.name}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="fixed inset-0 bg-[#073B2B]/50 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#20322A]/10"
            >
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                aria-label="Fechar detalhes do produto"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-white/90 border border-[#20322A]/15 flex items-center justify-center hover:bg-[#E9F3ED] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-[#F8F9F6] aspect-[4/3] md:aspect-auto md:h-full border-b md:border-b-0 md:border-r border-[#20322A]/10 overflow-hidden">
                  <SmartImage
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-[#20322A]/60">
                      {activeProduct.category} · {activeProduct.brand} · SKU{' '}
                      <span className="font-mono-num">{activeProduct.sku}</span>
                    </div>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#073B2B] leading-tight">
                      {activeProduct.name}
                    </h2>

                    {activeProduct.isDemo && (
                      <div className="text-xs font-semibold text-[#D73F38]">
                        Demonstração — preço e estoque ilustrativos
                      </div>
                    )}

                    <div className="pt-1">
                      {activeProduct.promoPrice &&
                        activeProduct.promoPrice > 0 &&
                        activeProduct.promoPrice < activeProduct.price && (
                          <div className="text-xs line-through text-[#20322A]/45 font-mono-num">
                            {formatBRL(activeProduct.price)}
                          </div>
                        )}
                      <div className="text-2xl font-extrabold font-mono-num text-[#073B2B]">
                        {formatBRL(
                          activeProduct.promoPrice &&
                            activeProduct.promoPrice > 0 &&
                            activeProduct.promoPrice < activeProduct.price
                            ? activeProduct.promoPrice
                            : activeProduct.price
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-[#20322A]/80 leading-relaxed pt-1">
                      {activeProduct.description}
                    </p>

                    <div className="pt-2 text-xs text-[#20322A]/70 space-y-1">
                      {activeProduct.weightOrSize && (
                        <div>
                          Apresentação: <strong>{activeProduct.weightOrSize}</strong>
                        </div>
                      )}
                      <div>
                        Disponibilidade:{' '}
                        <strong className="font-mono-num">
                          {activeProduct.stock > 0
                            ? `${activeProduct.stock} unidades para retirada`
                            : 'Indisponível no momento'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#20322A]/10 space-y-3">
                    {activeProduct.stock > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center border border-[#20322A]/18 rounded-xl bg-[#F8F9F6]">
                          <button
                            type="button"
                            onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                            aria-label="Diminuir quantidade"
                            className="w-10 h-10 flex items-center justify-center hover:bg-[#E9F3ED] rounded-l-xl cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-mono-num font-bold">
                            {modalQty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setModalQty((q) => Math.min(activeProduct.stock, q + 1))
                            }
                            aria-label="Aumentar quantidade"
                            className="w-10 h-10 flex items-center justify-center hover:bg-[#E9F3ED] rounded-r-xl cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            addToCart(activeProduct.id, modalQty);
                            setActiveProduct(null);
                          }}
                          className="flex-1 py-3 px-4 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Adicionar ao carrinho
                        </button>
                      </div>
                    ) : (
                      <div className="py-3 px-4 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 text-center text-xs font-semibold text-[#20322A]/60">
                        Produto indisponível no estoque demonstrativo
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
