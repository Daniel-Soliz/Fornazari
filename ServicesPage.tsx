import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarCheck,
  Clock,
  FlaskConical,
  Info,
  MessageCircle,
  Scissors,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Service, ServiceTab } from '../types/fornazari';
import { buildPetShopWhatsAppUrl, buildVetWhatsAppUrl } from '../utils/formatters';
import { SmartImage } from '../components/SmartImage';

const SERVICE_TABS: {
  id: ServiceTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'clinica', label: 'Clínica', icon: Stethoscope },
  { id: 'especialidades', label: 'Especialidades', icon: Sparkles },
  { id: 'exames', label: 'Exames', icon: FlaskConical },
  { id: 'banho', label: 'Banho e Tosa', icon: Scissors },
];

export const ServicesPage: React.FC = () => {
  const { services, serviceTab, setServiceTab, settings, content } = useStore();
  const [selectedSpecialty, setSelectedSpecialty] = useState<Service | null>(null);

  const visibleServices = services
    .filter((s) => s.category === serviceTab && s.availability !== 'Oculto')
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#115C39]">
          {settings.businessName} · {settings.crmv}
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#073B2B] tracking-tight">
          Serviços Veterinários e Estética Pet
        </h1>
        <p className="text-sm sm:text-base text-[#20322A]/75 max-w-2xl">
          Selecione uma das áreas abaixo para consultar atendimentos clínicos, especialidades, exames diagnósticos e serviço de banho e tosa.
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white border border-[#20322A]/10 rounded-2xl"
        role="tablist"
        aria-label="Áreas de serviços"
      >
        {SERVICE_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = serviceTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setServiceTab(tab.id)}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#115C39] text-white shadow-sm'
                  : 'text-[#20322A]/75 hover:bg-[#E9F3ED] hover:text-[#073B2B]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={serviceTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Context Banner per Tab */}
          {serviceTab === 'clinica' && (
            <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h2 className="font-display font-bold text-2xl text-[#073B2B]">
                  Clínica Veterinária Fornazari
                </h2>
                <p className="text-sm text-[#20322A]/80 leading-relaxed">
                  Estrutura clínica em Itaberaba preparada para consultas, vacinação, microchipagem, atendimento domiciliar com hora marcada, cirurgias conforme avaliação, farmácia veterinária e orientação sobre transporte de animais.
                </p>
                <div className="pt-1 flex flex-wrap gap-3">
                  <a
                    href={buildVetWhatsAppUrl(settings, 'Clínica Veterinária')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Falar com a Clínica no WhatsApp
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 aspect-[16/10] rounded-xl overflow-hidden bg-[#E9F3ED]">
                <SmartImage
                  src={content.servicesClinicaImage}
                  alt="Consultório da Clínica Veterinária Fornazari"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {serviceTab === 'especialidades' && (
            <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-display font-bold text-xl text-[#073B2B]">
                  Especialidades Veterinárias
                </h2>
                <p className="text-sm text-[#20322A]/75">
                  Clique em qualquer especialidade para ver a apresentação e consultar disponibilidade de agenda com a equipe.
                </p>
              </div>
              <a
                href={buildVetWhatsAppUrl(settings, 'Especialidades Veterinárias')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar agenda
              </a>
            </div>
          )}

          {serviceTab === 'exames' && (
            <div className="bg-white rounded-2xl border border-[#115C39]/25 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-3.5 max-w-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#E9F3ED] text-[#115C39] flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-lg text-[#073B2B]">
                    Exames com agendamento e encaminhamento veterinário
                  </h2>
                  <p className="text-sm text-[#20322A]/80 leading-relaxed">
                    Os exames diagnósticos divulgados pela Fornazari são realizados mediante agendamento prévio e encaminhamento ou solicitação médico-veterinária.
                  </p>
                </div>
              </div>
              <a
                href={buildVetWhatsAppUrl(settings, 'Agendamento de Exames')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] whitespace-nowrap shrink-0 self-start lg:self-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Agendar exame no WhatsApp
              </a>
            </div>
          )}

          {serviceTab === 'banho' && (
            <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display font-bold text-2xl text-[#073B2B]">
                  Banho e Tosa Fornazari
                </h2>
                <p className="text-sm text-[#20322A]/80 leading-relaxed">
                  Cuidados completos de higiene e estética para o conforto e bem-estar do seu pet, com equipe dedicada e produtos adequados a cada pelagem.
                </p>

                <div className="p-4 rounded-xl bg-[#E9F3ED]/65 border border-[#115C39]/15 space-y-2 text-xs sm:text-sm text-[#20322A]">
                  <div className="font-bold text-[#073B2B] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#115C39]" />
                    Funcionamento do Banho e Tosa
                  </div>
                  <p>{settings.groomingHoursWeekdays}</p>
                  <p>{settings.groomingHoursWeekend}</p>
                </div>

                <div>
                  <a
                    href={buildPetShopWhatsAppUrl(settings, 'Banho e Tosa')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D73F38] hover:bg-[#b9322c] text-white text-sm font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Recepção Pet Shop (Banho e Tosa)
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 aspect-[16/10] rounded-xl overflow-hidden bg-[#E9F3ED]">
                <SmartImage
                  src={content.servicesBanhoImage}
                  alt="Serviço de Banho e Tosa da Fornazari"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Services Grid */}
          {serviceTab === 'especialidades' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleServices.map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => setSelectedSpecialty(srv)}
                  className="text-left bg-white rounded-2xl border border-[#20322A]/10 p-6 hover:border-[#115C39]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-[#115C39]">
                      Especialidade · {srv.availability}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#073B2B] group-hover:text-[#115C39]">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-[#20322A]/75 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-[#115C39] pt-2 border-t border-[#20322A]/8 flex items-center justify-between">
                    <span>Ver apresentação</span>
                    <span>{srv.priceLabel}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleServices.map((srv) => (
                <article
                  key={srv.id}
                  className="bg-white rounded-2xl border border-[#20322A]/10 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#E9F3ED] overflow-hidden border-b border-[#20322A]/8">
                      <SmartImage
                        src={srv.image}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="text-[11px] font-medium text-[#20322A]/60">
                        {srv.availability}
                        {srv.requiresReferral ? ' · Requer encaminhamento' : ''}
                      </div>
                      <h3 className="font-display font-bold text-lg text-[#073B2B]">
                        {srv.title}
                      </h3>
                      <p className="text-sm text-[#20322A]/75 leading-relaxed">
                        {srv.description}
                      </p>
                      {srv.details && (
                        <p className="text-xs text-[#20322A]/60 leading-relaxed pt-1">
                          {srv.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-[#20322A]/8 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#20322A]/70">
                      {srv.priceLabel || 'Consulte a recepção'}
                    </span>
                    <a
                      href={
                        serviceTab === 'banho'
                          ? buildPetShopWhatsAppUrl(settings, srv.title)
                          : buildVetWhatsAppUrl(settings, srv.title)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#115C39] hover:text-[#073B2B]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Consultar
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Specialty Modal */}
      <AnimatePresence>
        {selectedSpecialty && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={selectedSpecialty.title}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpecialty(null)}
              className="fixed inset-0 bg-[#073B2B]/50 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#20322A]/10 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#115C39]">
                    Especialidade Veterinária · {selectedSpecialty.availability}
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-[#073B2B] mt-1">
                    {selectedSpecialty.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSpecialty(null)}
                  aria-label="Fechar especialidade"
                  className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center hover:bg-[#E9F3ED] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#E9F3ED]">
                <SmartImage
                  src={selectedSpecialty.image}
                  alt={selectedSpecialty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm text-[#20322A]/85 leading-relaxed">
                {selectedSpecialty.description}
              </p>

              {selectedSpecialty.details && (
                <div className="p-3.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 text-xs text-[#20322A]/75 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#115C39] shrink-0 mt-0.5" />
                  <span>{selectedSpecialty.details}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#20322A]/70">
                  Valor: {selectedSpecialty.priceLabel || 'Consulte a recepção'}
                </span>
                <a
                  href={buildVetWhatsAppUrl(
                    settings,
                    `Especialidade: ${selectedSpecialty.title}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar recepção via WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
