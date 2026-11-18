import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MediaAsset, MediaCategory } from '../types/fornazari';
import { SmartImage } from '../components/SmartImage';

const GALLERY_CATEGORIES: ('Todas' | MediaCategory)[] = [
  'Todas',
  'Fachada e Marca',
  'Ambientes',
  'Clínica',
  'Pet Shop',
  'Banho e Tosa',
  'Produtos',
];

export const GalleryPage: React.FC = () => {
  const { media } = useStore();
  const [selectedCat, setSelectedCat] = useState<'Todas' | MediaCategory>('Todas');
  const [lightboxItem, setLightboxItem] = useState<MediaAsset | null>(null);

  const filtered = useMemo(() => {
    if (selectedCat === 'Todas') return media;
    return media.filter((m) => m.category === selectedCat);
  }, [media, selectedCat]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#115C39]">
          Instalações e Ambientes · Rua Parapuã, 747
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#073B2B] tracking-tight">
          Galeria Fornazari
        </h1>
        <p className="text-sm sm:text-base text-[#20322A]/75 max-w-2xl">
          Conheça nossa fachada, recepção, consultório, centro cirúrgico, internação, corredores do pet shop e espaço de banho e tosa.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {GALLERY_CATEGORIES.map((cat) => {
          const active = selectedCat === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#115C39] text-white'
                  : 'bg-white border border-[#20322A]/12 text-[#20322A]/75 hover:bg-[#E9F3ED]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-10 text-center text-sm text-[#20322A]/65">
          Nenhuma fotografia cadastrada nesta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxItem(item)}
              className="group text-left bg-white rounded-2xl border border-[#20322A]/10 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-[#E9F3ED] overflow-hidden">
                <SmartImage
                  src={item.url}
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#073B2B]/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
              <div className="p-4">
                <div className="text-[11px] font-medium text-[#115C39]">
                  {item.category}
                </div>
                <div className="font-display font-bold text-sm text-[#20322A] mt-0.5 truncate">
                  {item.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.name}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 bg-[#073B2B]/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-white/15"
            >
              <div className="px-5 py-3.5 border-b border-[#20322A]/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-[#115C39]">
                    {lightboxItem.category}
                  </div>
                  <h2 className="font-display font-bold text-base text-[#073B2B]">
                    {lightboxItem.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  aria-label="Fechar ampliação"
                  className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center hover:bg-[#E9F3ED] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-[#F8F9F6] max-h-[72vh] flex items-center justify-center overflow-hidden">
                <SmartImage
                  src={lightboxItem.url}
                  alt={lightboxItem.alt || lightboxItem.name}
                  className="max-h-[72vh] w-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
