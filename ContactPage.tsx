import React, { useState } from 'react';
import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  buildPetShopWhatsAppUrl,
  buildVetWhatsAppUrl,
  buildWhatsAppUrl,
} from '../utils/formatters';
import { SmartImage } from '../components/SmartImage';

export const ContactPage: React.FC = () => {
  const { settings, content, showToast } = useStore();
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'vet' | 'petshop'>('vet');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);

  const handlePrepareWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError('Informe seu nome para preparar o atendimento.');
      return;
    }
    if (message.trim().length < 5) {
      setError('Descreva brevemente sua dúvida ou solicitação.');
      return;
    }
    const targetNumber =
      channel === 'vet' ? settings.whatsappVet : settings.whatsappPetShop;
    const prefix =
      channel === 'vet'
        ? `Olá! Meu nome é ${name.trim()} e gostaria de atendimento veterinário:`
        : `Olá! Meu nome é ${name.trim()} e gostaria de informações do Pet Shop / Banho e Tosa:`;
    const url = buildWhatsAppUrl(targetNumber, `${prefix}\n${message.trim()}`);
    setPreparedUrl(url);
    showToast('Mensagem pronta para envio no WhatsApp.', 'success');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#115C39]">
          {settings.neighborhood}
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#073B2B] tracking-tight">
          Localização e Contato
        </h1>
        <p className="text-sm sm:text-base text-[#20322A]/75 max-w-2xl">
          Atendemos na Zona Norte de São Paulo desde 1997. Fale diretamente com nossa equipe clínica ou com o Pet Shop e Banho e Tosa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Direct Channels & Location */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-2xl border border-[#20322A]/10 overflow-hidden">
            <div className="aspect-[16/9] bg-[#E9F3ED]">
              <SmartImage
                src={content.heroImageUrl}
                alt="Fachada da Fornazari na Rua Parapuã, 747"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#115C39] shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-bold text-base text-[#073B2B]">
                    Endereço da Unidade
                  </div>
                  <p className="text-sm text-[#20322A]/80 mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#115C39] shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-bold text-base text-[#073B2B]">
                    Telefones Gerais
                  </div>
                  <p className="text-sm font-mono-num text-[#20322A]/80 mt-0.5">
                    {settings.phonePrimary} / {settings.phoneSecondary}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#115C39] shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-bold text-base text-[#073B2B]">
                    E-mail
                  </div>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm text-[#115C39] hover:underline mt-0.5 inline-block"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#115C39] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#20322A]/80 space-y-1">
                  <div className="font-display font-bold text-base text-[#073B2B]">
                    Orientações de Horário
                  </div>
                  <p>{settings.clinicHours}</p>
                  <p>{settings.groomingHoursWeekdays}</p>
                  <p>{settings.groomingHoursWeekend}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#073B2B] text-white text-xs sm:text-sm font-semibold hover:bg-[#115C39] transition-colors"
                >
                  Abrir rota no Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={buildVetWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Clínica
                </a>
                <a
                  href={buildPetShopWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#115C39]/30 bg-[#E9F3ED] text-[#073B2B] text-xs sm:text-sm font-semibold hover:bg-[#d6eadf] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#115C39]" />
                  WhatsApp Pet Shop
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Guided WhatsApp Message Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-[#073B2B]">
                Enviar mensagem direta
              </h2>
              <p className="text-sm text-[#20322A]/75">
                Preencha sua dúvida abaixo para gerar a mensagem direcionada ao canal correto no WhatsApp da Fornazari.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#D73F38]/10 border border-[#D73F38]/25 text-xs font-medium text-[#D73F38]">
                {error}
              </div>
            )}

            <form onSubmit={handlePrepareWhatsApp} className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-[#20322A] mb-1.5"
                >
                  Seu nome *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#20322A] mb-1.5">
                  Setor desejado
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setChannel('vet');
                      setPreparedUrl(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      channel === 'vet'
                        ? 'border-[#115C39] bg-[#E9F3ED]/60'
                        : 'border-[#20322A]/15 bg-white hover:bg-[#F8F9F6]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#073B2B]">
                      Clínica Veterinária
                    </div>
                    <div className="text-[11px] text-[#20322A]/65 font-mono-num mt-0.5">
                      +55 11 95966-0208
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setChannel('petshop');
                      setPreparedUrl(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      channel === 'petshop'
                        ? 'border-[#115C39] bg-[#E9F3ED]/60'
                        : 'border-[#20322A]/15 bg-white hover:bg-[#F8F9F6]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#073B2B]">
                      Pet Shop e Banho e Tosa
                    </div>
                    <div className="text-[11px] text-[#20322A]/65 font-mono-num mt-0.5">
                      +55 11 98221-1059
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-msg"
                  className="block text-xs font-semibold text-[#20322A] mb-1.5"
                >
                  Mensagem ou solicitação *
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex.: Gostaria de consultar horários para consulta veterinária ou disponibilidade de banho e tosa."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Preparar atendimento no WhatsApp
              </button>
            </form>

            {preparedUrl && (
              <div className="p-4 rounded-xl bg-[#E9F3ED] border border-[#115C39]/25 space-y-2.5">
                <div className="text-xs font-semibold text-[#073B2B]">
                  Mensagem pronta. Clique abaixo para abrir o WhatsApp e confirmar o envio:
                </div>
                <a
                  href={preparedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#073B2B] text-white text-sm font-semibold hover:bg-[#115C39] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp agora
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
