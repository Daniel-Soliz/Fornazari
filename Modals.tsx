import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-medium flex items-center gap-2.5 ${
              t.tone === 'error'
                ? 'bg-[#D73F38] text-white border-[#D73F38]'
                : t.tone === 'warning'
                ? 'bg-[#20322A] text-white border-[#20322A]'
                : t.tone === 'info'
                ? 'bg-white text-[#20322A] border-[#20322A]/15'
                : 'bg-[#073B2B] text-white border-[#073B2B]'
            }`}
          >
            {t.tone === 'info' ? (
              <Info className="w-4 h-4 text-[#115C39] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const InstitutionalHistoryModal: React.FC = () => {
  const { isHistoryModalOpen, setIsHistoryModalOpen, content, settings, navigate } = useStore();

  return (
    <AnimatePresence>
      {isHistoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="História da Fornazari"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsHistoryModalOpen(false)}
            className="fixed inset-0 bg-[#073B2B]/50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-[#20322A]/10"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-[#20322A]/10 flex items-center justify-between z-10">
              <div>
                <div className="text-xs font-semibold text-[#115C39]">
                  Desde {settings.foundedYear} · {settings.crmv}
                </div>
                <h2 className="font-display font-bold text-lg text-[#073B2B]">
                  {content.institutionalTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                aria-label="Fechar janela de história"
                className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center hover:bg-[#E9F3ED] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="aspect-[16/8] rounded-xl overflow-hidden bg-[#E9F3ED]">
                <SmartImage
                  src={content.institutionalImage}
                  alt="Dr. Marcos Roberto de Castro Fornazari na clínica"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#20322A]/85 leading-relaxed whitespace-pre-line">
                {content.institutionalFullStory}
              </div>

              <div className="pt-4 border-t border-[#20322A]/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#20322A]/65">
                  {settings.address}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsHistoryModalOpen(false);
                    navigate('/sobre');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
                >
                  Ver página completa Sobre a Fornazari
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const PrivacyPolicyModal: React.FC = () => {
  const { isPrivacyModalOpen, setIsPrivacyModalOpen, settings } = useStore();

  return (
    <AnimatePresence>
      {isPrivacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Política de Privacidade e Tratamento de Dados"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPrivacyModalOpen(false)}
            className="fixed inset-0 bg-[#073B2B]/50 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#20322A]/10 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#E9F3ED] text-[#115C39] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="font-display font-bold text-lg text-[#073B2B]">
                  Política de Privacidade e Dados
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                aria-label="Fechar política de privacidade"
                className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center hover:bg-[#E9F3ED] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#20322A]/85 leading-relaxed">
              <p>{settings.privacySummary}</p>
              <p className="text-xs text-[#20322A]/70">
                Responsável institucional: {settings.businessName} · {settings.address} · Contato:{' '}
                {settings.email}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
