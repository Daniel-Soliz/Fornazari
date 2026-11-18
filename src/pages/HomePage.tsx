import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  buildPetShopWhatsAppUrl,
  buildVetWhatsAppUrl,
  formatBRL,
} from '../utils/formatters';
import { SmartImage } from '../components/SmartImage';

export const HomePage: React.FC = () => {
  const {
    content,
    settings,
    products,
    navigate,
    addToCart,
    setIsHistoryModalOpen,
  } = useStore();

  const featuredProducts = products
    .filter((p) => p.active && p.featured)
    .slice(0, 4);

  const displayProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : products.filter((p) => p.active).slice(0, 4);

  return (
    <div>
      {/* 4.1 HERO PRINCIPAL */}
      <section id="apresentacao" className="scroll-mt-24 relative overflow-hidden bg-[#073B2B]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="relative rounded-2xl overflow-hidden min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-end lg:items-center shadow-xl border border-white/10">
            <motion.div
              initial={{ scale: 1.04, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <SmartImage
                src={content.heroImageUrl}
                alt={content.heroImageAlt}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Measured contrast scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#073B2B]/95 via-[#073B2B]/70 to-[#073B2B]/20 lg:bg-gradient-to-r lg:from-[#073B2B]/92 lg:via-[#073B2B]/72 lg:to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl space-y-5 text-white"
            >
              <div className="text-xs sm:text-sm font-medium text-[#E9F3ED]/90 tracking-wide">
                {settings.neighborhood} · Desde {settings.foundedYear}
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.12] tracking-tight text-balance text-white">
                {content.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
                {content.heroSubtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(content.heroPrimaryBtnRoute)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D73F38] hover:bg-[#b9322c] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                >
                  {content.heroPrimaryBtnText}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(content.heroSecondaryBtnRoute)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/14 hover:bg-white/22 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {content.heroSecondaryBtnText}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <nav aria-label="Tópicos da página inicial" className="border-b border-[#115C39]/15 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-x-6 gap-y-1 px-4 py-3 sm:px-6">
          {[
            ['areas', content.areasTitle],
            ['historia', content.institutionalTitle],
            ['destaques', content.featuredTitle],
            ['contato', content.quickContactTitle],
          ].map(([id, title]) => (
            <a key={id} href={`#${id}`} className="py-2 text-sm font-semibold text-[#115C39] hover:underline">
              {title}
            </a>
          ))}
        </div>
      </nav>

      {/* 4.2 TRÊS CARDS DE NAVEGAÇÃO */}
      <section id="areas" className="scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="mb-6 font-display text-2xl font-extrabold text-[#073B2B] sm:text-3xl">{content.areasTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.areaCards.map((card, idx) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -3 }}
              className="group bg-white rounded-2xl border border-[#20322A]/10 overflow-hidden flex flex-col justify-between transition-shadow hover:shadow-md"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-[#E9F3ED]">
                  <SmartImage
                    src={card.image}
                    alt={card.imageAlt || card.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-display font-bold text-xl text-[#073B2B]">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#20322A]/75 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => navigate(card.targetRoute, { tab: card.targetTab })}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#115C39] group-hover:text-[#073B2B] transition-colors cursor-pointer"
                >
                  <span>{card.buttonLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4.3 FAIXA INSTITUCIONAL */}
      <section id="historia" className="scroll-mt-24 bg-[#E9F3ED]/65 border-y border-[#115C39]/12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold text-[#115C39]">
                {settings.founderName} · {settings.crmv}
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#073B2B] text-balance">
                {content.institutionalTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#20322A]/80 leading-relaxed max-w-2xl">
                {content.institutionalSummary}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
                >
                  Conheça nossa história
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-[#115C39]/15 bg-white">
                <SmartImage
                  src={content.institutionalImage}
                  alt="Dr. Marcos Roberto de Castro Fornazari na Clínica Veterinária Fornazari"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.4 PRODUTOS EM DESTAQUE */}
      <section id="destaques" className="scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#20322A]/60">
              <span className="font-semibold text-[#115C39]">Loja Digital</span>
              {settings.demoMode && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Demonstração — preços ilustrativos</span>
                </>
              )}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#073B2B]">
              {content.featuredTitle}
            </h2>
            <p className="text-sm text-[#20322A]/70 max-w-2xl">
              {content.featuredSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/loja')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#115C39]/25 bg-white text-sm font-semibold text-[#115C39] hover:bg-[#E9F3ED] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Ver todos os produtos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {displayProducts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#20322A]/10 text-center text-sm text-[#20322A]/70">
            Nenhum produto ativo cadastrado no momento. Utilize o Painel Administrativo para cadastrar produtos.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => {
              const hasPromo =
                product.promoPrice && product.promoPrice > 0 && product.promoPrice < product.price;
              const finalPrice = hasPromo ? product.promoPrice! : product.price;

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#20322A]/10 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div
                      onClick={() => navigate('/loja')}
                      className="aspect-[4/3] bg-[#F8F9F6] overflow-hidden cursor-pointer border-b border-[#20322A]/8"
                    >
                      <SmartImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="text-[11px] font-medium text-[#20322A]/60 truncate">
                        {product.category}
                        {product.isDemo ? ' · Demonstração' : ''}
                      </div>
                      <h3 className="font-display font-semibold text-sm text-[#20322A] leading-snug line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2">
                    <div>
                      {hasPromo && (
                        <div className="text-[11px] line-through text-[#20322A]/45 font-mono-num">
                          {formatBRL(product.price)}
                        </div>
                      )}
                      <div className="text-base font-extrabold font-mono-num text-[#073B2B]">
                        {formatBRL(finalPrice)}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product.id, 1)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] disabled:bg-[#20322A]/15 disabled:text-[#20322A]/45 transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {product.stock > 0 ? 'Adicionar' : 'Indisponível'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4.5 CONTATO RÁPIDO */}
      <section id="contato" className="scroll-mt-24 max-w-[1280px] mx-auto px-4 sm:px-6 pb-14">
        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#073B2B]">
              {content.quickContactTitle}
            </h2>
            <p className="text-sm text-[#20322A]/75 leading-relaxed">
              {content.quickContactSubtitle}
            </p>
            <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-[#20322A]/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#115C39]" />
                {settings.address}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-num">
                <Phone className="w-4 h-4 text-[#115C39]" />
                {settings.phonePrimary} / {settings.phoneSecondary}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#115C39]" />
                Banho e Tosa: seg–qui (hora marcada) · sex–sáb (ordem de chegada)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={buildVetWhatsAppUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Clínica
            </a>
            <a
              href={buildPetShopWhatsAppUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#115C39]/30 bg-[#E9F3ED]/60 text-[#073B2B] text-xs sm:text-sm font-semibold hover:bg-[#E9F3ED] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#115C39]" />
              WhatsApp Pet Shop
            </a>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#20322A]/18 bg-white text-[#20322A] text-xs sm:text-sm font-semibold hover:bg-[#F8F9F6] transition-colors whitespace-nowrap"
            >
              Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
