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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="relative rounded-2xl overflow-hidden bg-[#073B2B] md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center shadow-xl border border-white/10">
            <motion.div
              initial={{ scale: 1.04, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden md:col-start-2 md:row-start-1"
            >
              <SmartImage
                src={content.heroImageUrl}
                alt={content.heroImageAlt}
                className="block w-full h-auto brightness-[1.04]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 bg-[#073B2B] md:col-start-1 md:row-start-1 p-4 sm:p-7 lg:p-10 max-w-2xl space-y-3 sm:space-y-5 text-white"
            >
              <div className="text-xs sm:text-sm font-medium text-[#E9F3ED]/90 tracking-wide">
                {settings.neighborhood} · Desde {settings.foundedYear}
              </div>

              <h1 className="font-display font-extrabold text-[1.35rem] sm:text-2xl lg:text-[2rem] leading-[1.12] tracking-tight text-balance text-white">
                {content.heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
                {content.heroSubtitle}
              </p>

              <div className="pt-1 grid gap-2 sm:pt-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => navigate(content.heroPrimaryBtnRoute)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#D73F38] hover:bg-[#b9322c] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
                >
                  {content.heroPrimaryBtnText}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(content.heroSecondaryBtnRoute)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-white/14 hover:bg-white/22 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
