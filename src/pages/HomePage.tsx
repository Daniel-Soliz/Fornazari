import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';

export const HomePage: React.FC = () => {
  const {
    content,
    settings,
    navigate,
  } = useStore();

  return (
    <div>
      {/* 4.1 HERO PRINCIPAL */}
      <section id="apresentacao" className="scroll-mt-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-14">
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

    </div>
  );
};
