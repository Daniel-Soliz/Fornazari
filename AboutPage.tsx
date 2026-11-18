import React from 'react';
import { ArrowRight, Award, Calendar, HeartHandshake, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';

export const AboutPage: React.FC = () => {
  const { settings, content, navigate } = useStore();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Header Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-[#115C39]">
            Sobre a Fornazari · {settings.crmv}
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#073B2B] tracking-tight text-balance">
            {content.institutionalTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#20322A]/80 leading-relaxed whitespace-pre-line">
            {content.institutionalFullStory}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/servicos', { tab: 'clinica' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
            >
              Conhecer a clínica
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/galeria')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#20322A]/18 bg-white text-sm font-semibold text-[#20322A] hover:bg-[#E9F3ED] transition-colors cursor-pointer"
            >
              Ver fotos das instalações
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#20322A]/10 bg-[#E9F3ED] shadow-sm">
            <SmartImage
              src={content.institutionalImage}
              alt="Dr. Marcos Roberto de Castro Fornazari na clínica veterinária"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Institutional Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 space-y-2">
          <Calendar className="w-5 h-5 text-[#115C39]" />
          <div className="font-display font-extrabold text-2xl text-[#073B2B] font-mono-num">
            1997
          </div>
          <div className="text-sm font-bold text-[#20322A]">Fundação da Clínica</div>
          <p className="text-xs text-[#20322A]/70 leading-relaxed">
            Início das atividades em {settings.foundedYear} pelo {settings.founderName}.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 space-y-2">
          <HeartHandshake className="w-5 h-5 text-[#115C39]" />
          <div className="font-display font-extrabold text-2xl text-[#073B2B] font-mono-num">
            {settings.petShopExpansionYear}
          </div>
          <div className="text-sm font-bold text-[#20322A]">Expansão Pet Shop</div>
          <p className="text-xs text-[#20322A]/70 leading-relaxed">
            Ampliação da estrutura com pet shop, rações, acessórios e banho e tosa.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 space-y-2">
          <Award className="w-5 h-5 text-[#115C39]" />
          <div className="font-display font-extrabold text-2xl text-[#073B2B] font-mono-num">
            9374
          </div>
          <div className="text-sm font-bold text-[#20322A]">Registro CRMV-SP</div>
          <p className="text-xs text-[#20322A]/70 leading-relaxed">
            Responsabilidade técnica e atendimento ético em clínica e especialidades.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#20322A]/10 p-6 space-y-2">
          <MapPin className="w-5 h-5 text-[#115C39]" />
          <div className="font-display font-extrabold text-2xl text-[#073B2B]">
            Itaberaba
          </div>
          <div className="text-sm font-bold text-[#20322A]">Zona Norte de SP</div>
          <p className="text-xs text-[#20322A]/70 leading-relaxed">
            Presença consolidada na Rua Parapuã, 747, atendendo Freguesia do Ó e região.
          </p>
        </div>
      </div>
    </div>
  );
};
