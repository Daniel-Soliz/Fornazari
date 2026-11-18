import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, RotateCcw, Save, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AppRoute, ServiceTab, SiteContent } from '../../types/fornazari';
import { compressImageFile } from '../../utils/storage';
import { SmartImage } from '../../components/SmartImage';

type ImageTargetField =
  | 'logoUrl'
  | 'heroImageUrl'
  | 'institutionalImage'
  | 'servicesClinicaImage'
  | 'servicesBanhoImage'
  | 'card-0'
  | 'card-1'
  | 'card-2';

export const AdminHomeEditor: React.FC = () => {
  const { content, media, updateContent, resetContentToDefault, showToast } = useStore();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [pickingFor, setPickingFor] = useState<ImageTargetField | null>(null);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const setImageValue = (target: ImageTargetField, url: string) => {
    if (target === 'card-0' || target === 'card-1' || target === 'card-2') {
      const idx = Number(target.split('-')[1]);
      const nextCards = [...draft.areaCards] as SiteContent['areaCards'];
      nextCards[idx] = { ...nextCards[idx], image: url };
      setDraft({ ...draft, areaCards: nextCards });
      return;
    }
    setDraft({ ...draft, [target]: url });
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: ImageTargetField
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1000, 0.8);
      setImageValue(target, dataUrl);
      showToast('Imagem aplicada ao rascunho. Clique em Salvar para publicar.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao processar imagem.', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(draft);
  };

  const ImageFieldControl = ({
    label,
    target,
    value,
  }: {
    label: string;
    target: ImageTargetField;
    value: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#20322A]">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#F8F9F6] border border-[#20322A]/12 shrink-0">
          <SmartImage src={value} alt={label} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setImageValue(target, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-xs font-mono-num"
          />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#20322A]/15 text-xs font-semibold text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, target)}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setPickingFor(pickingFor === target ? null : target)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#20322A]/15 text-xs font-semibold text-[#115C39] hover:bg-[#E9F3ED] cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Galeria
            </button>
          </div>
        </div>
      </div>

      {pickingFor === target && (
        <div className="p-3 rounded-xl bg-[#F8F9F6] border border-[#20322A]/12 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto">
          {media.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setImageValue(target, m.url);
                setPickingFor(null);
              }}
              className="aspect-square rounded-lg overflow-hidden border border-[#20322A]/15 hover:border-[#115C39] cursor-pointer"
              title={m.name}
            >
              <SmartImage src={m.url} alt={m.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Editor da Página Inicial e Textos Públicos
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Edite logotipo, hero, cards, história institucional, destaques, contato rápido e rodapé.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              resetContentToDefault();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#20322A]/18 bg-white text-xs font-semibold text-[#20322A] hover:bg-[#F8F9F6] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar padrão
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Salvar página inicial
          </button>
        </div>
      </div>

      {/* Logotipo & Hero */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-5">
        <h3 className="font-display font-bold text-base text-[#073B2B] border-b border-[#20322A]/8 pb-3">
          Identidade e Hero Principal
        </h3>

        <ImageFieldControl label="Logotipo do Cabeçalho" target="logoUrl" value={draft.logoUrl} />
        <ImageFieldControl
          label="Imagem Principal (Hero)"
          target="heroImageUrl"
          value={draft.heroImageUrl}
        />

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Título Principal (H1)
            </label>
            <input
              type="text"
              value={draft.heroTitle}
              onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-semibold focus:outline-none focus:border-[#115C39]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Subtítulo
            </label>
            <textarea
              rows={2}
              value={draft.heroSubtitle}
              onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 space-y-2.5">
              <div className="text-xs font-bold text-[#073B2B]">Botão Primário</div>
              <input
                type="text"
                value={draft.heroPrimaryBtnText}
                onChange={(e) =>
                  setDraft({ ...draft, heroPrimaryBtnText: e.target.value })
                }
                placeholder="Texto do botão"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
              />
              <select
                value={draft.heroPrimaryBtnRoute}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    heroPrimaryBtnRoute: e.target.value as AppRoute,
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
              >
                <option value="/loja">Destino: Loja Digital (/loja)</option>
                <option value="/servicos">Destino: Serviços (/servicos)</option>
                <option value="/sobre">Destino: Sobre (/sobre)</option>
                <option value="/contato">Destino: Contato (/contato)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 space-y-2.5">
              <div className="text-xs font-bold text-[#073B2B]">Botão Secundário</div>
              <input
                type="text"
                value={draft.heroSecondaryBtnText}
                onChange={(e) =>
                  setDraft({ ...draft, heroSecondaryBtnText: e.target.value })
                }
                placeholder="Texto do botão"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
              />
              <select
                value={draft.heroSecondaryBtnRoute}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    heroSecondaryBtnRoute: e.target.value as AppRoute,
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
              >
                <option value="/servicos">Destino: Serviços (/servicos)</option>
                <option value="/loja">Destino: Loja Digital (/loja)</option>
                <option value="/sobre">Destino: Sobre (/sobre)</option>
                <option value="/contato">Destino: Contato (/contato)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Cards de Navegação */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-5">
        <h3 className="font-display font-bold text-base text-[#073B2B] border-b border-[#20322A]/8 pb-3">
          Três Cards de Navegação
        </h3>

        <div className="space-y-6">
          <label className="block text-sm font-semibold">
            Título da seção de áreas
            <input className="mt-2 w-full rounded-lg border p-3" value={draft.areasTitle}
              onChange={(event) => setDraft({ ...draft, areasTitle: event.target.value })} />
          </label>
          {draft.areaCards.map((card, idx) => {
            const updateCard = (patch: Partial<typeof card>) => {
              const nextCards = [...draft.areaCards] as SiteContent['areaCards'];
              nextCards[idx] = { ...nextCards[idx], ...patch };
              setDraft({ ...draft, areaCards: nextCards });
            };
            const targetKey = `card-${idx}` as ImageTargetField;

            return (
              <div
                key={card.id}
                className="p-4 rounded-xl bg-[#F8F9F6] border border-[#20322A]/10 space-y-3"
              >
                <div className="text-xs font-bold text-[#115C39]">Card {idx + 1}</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Título</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard({ title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      Texto do botão
                    </label>
                    <input
                      type="text"
                      value={card.buttonLabel}
                      onChange={(e) => updateCard({ buttonLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Destino</label>
                    <select
                      value={
                        card.targetRoute === '/servicos' && card.targetTab
                          ? `/servicos:${card.targetTab}`
                          : card.targetRoute
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith('/servicos:')) {
                          updateCard({
                            targetRoute: '/servicos',
                            targetTab: val.split(':')[1] as ServiceTab,
                          });
                        } else {
                          updateCard({
                            targetRoute: val as AppRoute,
                            targetTab: undefined,
                          });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
                    >
                      <option value="/loja">Loja (/loja)</option>
                      <option value="/servicos:clinica">Clínica Veterinária</option>
                      <option value="/servicos:especialidades">Especialidades</option>
                      <option value="/servicos:exames">Exames</option>
                      <option value="/servicos:banho">Banho e Tosa</option>
                      <option value="/sobre">Sobre a Fornazari</option>
                      <option value="/contato">Contato</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Descrição</label>
                  <input
                    type="text"
                    value={card.description}
                    onChange={(e) => updateCard({ description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#20322A]/15 text-xs"
                  />
                </div>
                <ImageFieldControl
                  label={`Fotografia do Card ${idx + 1}`}
                  target={targetKey}
                  value={card.image}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Faixa Institucional & Fotos de Serviços */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-5">
        <h3 className="font-display font-bold text-base text-[#073B2B] border-b border-[#20322A]/8 pb-3">
          Faixa Institucional e Capas de Serviços
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Título institucional
            </label>
            <input
              type="text"
              value={draft.institutionalTitle}
              onChange={(e) =>
                setDraft({ ...draft, institutionalTitle: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Resumo da faixa inicial
            </label>
            <textarea
              rows={2}
              value={draft.institutionalSummary}
              onChange={(e) =>
                setDraft({ ...draft, institutionalSummary: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              História completa (modal e página Sobre)
            </label>
            <textarea
              rows={5}
              value={draft.institutionalFullStory}
              onChange={(e) =>
                setDraft({ ...draft, institutionalFullStory: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>

          <ImageFieldControl
            label="Foto Institucional"
            target="institutionalImage"
            value={draft.institutionalImage}
          />
          <ImageFieldControl
            label="Foto Capa — Clínica Veterinária"
            target="servicesClinicaImage"
            value={draft.servicesClinicaImage}
          />
          <ImageFieldControl
            label="Foto Capa — Banho e Tosa"
            target="servicesBanhoImage"
            value={draft.servicesBanhoImage}
          />
        </div>
      </div>

      {/* Destaques, Contato Rápido e Rodapé */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 sm:p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-[#073B2B] border-b border-[#20322A]/8 pb-3">
          Produtos em Destaque, Contato Rápido e Rodapé
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Título — Produtos em Destaque
            </label>
            <input
              type="text"
              value={draft.featuredTitle}
              onChange={(e) => setDraft({ ...draft, featuredTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Subtítulo — Produtos em Destaque
            </label>
            <input
              type="text"
              value={draft.featuredSubtitle}
              onChange={(e) => setDraft({ ...draft, featuredSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Título — Contato Rápido
            </label>
            <input
              type="text"
              value={draft.quickContactTitle}
              onChange={(e) =>
                setDraft({ ...draft, quickContactTitle: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#20322A] mb-1">
              Subtítulo — Contato Rápido
            </label>
            <input
              type="text"
              value={draft.quickContactSubtitle}
              onChange={(e) =>
                setDraft({ ...draft, quickContactSubtitle: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#20322A] mb-1">
            Descrição institucional do Rodapé
          </label>
          <textarea
            rows={2}
            value={draft.footerDescription}
            onChange={(e) => setDraft({ ...draft, footerDescription: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] cursor-pointer shadow-sm"
        >
          <Save className="w-4 h-4" />
          Salvar todas as alterações da Home
        </button>
      </div>
    </form>
  );
};
