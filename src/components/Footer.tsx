import React from 'react';
import { ExternalLink, MapPin, Mail, MessageCircle, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildPetShopWhatsAppUrl, buildVetWhatsAppUrl } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { navigate, settings, content, setIsPrivacyModalOpen } = useStore();

  return (
    <footer className="bg-[#073B2B] text-white border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Fornazari */}
          <div className="space-y-3">
            <div className="font-display font-extrabold text-xl tracking-tight text-white">
              Fornazari
            </div>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              {content.footerDescription}
            </p>
            <p className="text-xs text-white/60">
              {settings.founderName} · {settings.crmv}
            </p>
          </div>

          {/* Column 2: Navegação */}
          <div>
            <h3 className="font-display font-bold text-sm text-white mb-3.5">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/loja')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Loja Digital
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/servicos', { tab: 'clinica' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Serviços Veterinários
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/sobre')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sobre a Fornazari
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/galeria')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Galeria
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/contato')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Atendimento */}
          <div>
            <h3 className="font-display font-bold text-sm text-white mb-3.5">
              Atendimento
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-white/75">
              <div className="flex items-center gap-2 font-mono-num">
                <Phone className="w-4 h-4 text-white/60 shrink-0" />
                <span>
                  {settings.phonePrimary} / {settings.phoneSecondary}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/60 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </div>
              <div className="pt-1 space-y-1.5">
                <a
                  href={buildVetWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E9F3ED] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Clínica Veterinária
                </a>
                <br />
                <a
                  href={buildPetShopWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E9F3ED] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Pet Shop / Banho e Tosa
                </a>
              </div>
              <p className="text-xs text-white/60 pt-1 leading-relaxed">
                {settings.groomingHoursWeekdays}
                <br />
                {settings.groomingHoursWeekend}
              </p>
            </div>
          </div>

          {/* Column 4: Localização */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-white">
              Localização
            </h3>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-white/75 leading-relaxed">
              <MapPin className="w-4 h-4 text-white/60 mt-0.5 shrink-0" />
              <span>{settings.address}</span>
            </div>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/18 text-xs font-semibold text-white transition-colors"
            >
              Ver no Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/60">
          <div>{settings.footerCopyright}</div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Política de Privacidade e Dados
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-white/45 hover:text-white/85 transition-colors cursor-pointer"
            >
              Acesso administrativo
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
