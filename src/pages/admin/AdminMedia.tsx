import React, { useMemo, useState } from 'react';
import { AlertTriangle, Edit3, Trash2, Upload, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MediaAsset, MediaCategory } from '../../types/fornazari';
import { compressImageFile, getLocalStorageUsageInfo } from '../../utils/storage';
import { SmartImage } from '../../components/SmartImage';

const MEDIA_CATEGORIES: MediaCategory[] = [
  'Fachada e Marca',
  'Ambientes',
  'Clínica',
  'Pet Shop',
  'Banho e Tosa',
  'Produtos',
];

export const AdminMedia: React.FC = () => {
  const {
    media,
    content,
    addMediaAsset,
    updateMediaAsset,
    deleteMediaAsset,
    updateContent,
    showToast,
  } = useStore();

  const [catFilter, setCatFilter] = useState<'Todas' | MediaCategory>('Todas');
  const [uploadCat, setUploadCat] = useState<MediaCategory>('Pet Shop');
  const [editing, setEditing] = useState<MediaAsset | null>(null);

  const storageInfo = getLocalStorageUsageInfo();

  const filtered = useMemo(() => {
    if (catFilter === 'Todas') return media;
    return media.filter((m) => m.category === catFilter);
  }, [media, catFilter]);

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 900, 0.76);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      addMediaAsset({
        id: `med-${Date.now()}`,
        name: baseName,
        alt: baseName,
        category: uploadCat,
        url: dataUrl,
        source: 'upload',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Falha no upload.', 'error');
    } finally {
      e.target.value = '';
    }
  };

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const dataUrl = await compressImageFile(file, 900, 0.76);
      setEditing({ ...editing, url: dataUrl, source: 'upload' });
      showToast('Nova imagem carregada e comprimida.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao substituir.', 'error');
    }
  };

  const assignToHome = (asset: MediaAsset, slot: 'hero' | 'card0' | 'card1' | 'card2') => {
    if (slot === 'hero') {
      updateContent({ ...content, heroImageUrl: asset.url, heroImageAlt: asset.alt });
      return;
    }
    const idx = Number(slot.replace('card', ''));
    const nextCards = [...content.areaCards] as typeof content.areaCards;
    nextCards[idx] = { ...nextCards[idx], image: asset.url, imageAlt: asset.alt };
    updateContent({ ...content, areaCards: nextCards });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Galeria de Imagens e Mídia
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Imagens enviadas são reduzidas e comprimidas automaticamente antes de salvar no localStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={uploadCat}
            onChange={(e) => setUploadCat(e.target.value as MediaCategory)}
            className="px-3 py-2 rounded-xl bg-white border border-[#20322A]/15 text-xs font-medium"
          >
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] cursor-pointer">
            <Upload className="w-4 h-4" />
            Enviar imagem
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadNew}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Storage usage meter */}
      <div
        className={`rounded-xl border p-4 space-y-2 ${
          storageInfo.nearLimit
            ? 'bg-[#D73F38]/8 border-[#D73F38]/30'
            : 'bg-white border-[#20322A]/10'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#073B2B] flex items-center gap-1.5">
            {storageInfo.nearLimit && (
              <AlertTriangle className="w-4 h-4 text-[#D73F38]" />
            )}
            Uso aproximado de armazenamento local (localStorage)
          </span>
          <span className="font-mono-num font-bold text-[#20322A]">
            {storageInfo.usedKB} KB / ~{storageInfo.estimatedLimitKB} KB ({storageInfo.percent}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#F8F9F6] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              storageInfo.nearLimit ? 'bg-[#D73F38]' : 'bg-[#115C39]'
            }`}
            style={{ width: `${storageInfo.percent}%` }}
          />
        </div>
        {storageInfo.nearLimit && (
          <p className="text-xs text-[#D73F38]">
            Aviso: o espaço local do navegador está próximo do limite. Exclua mídias não utilizadas ou exporte um backup JSON antes de adicionar novas fotos pesadas.
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCatFilter('Todas')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            catFilter === 'Todas'
              ? 'bg-[#115C39] text-white'
              : 'bg-white border border-[#20322A]/12 text-[#20322A]/75'
          }`}
        >
          Todas ({media.length})
        </button>
        {MEDIA_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCatFilter(c)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
              catFilter === c
                ? 'bg-[#115C39] text-white'
                : 'bg-white border border-[#20322A]/12 text-[#20322A]/75'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-xl border border-[#20322A]/10 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] bg-[#E9F3ED] overflow-hidden">
                <SmartImage
                  src={item.url}
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="text-[11px] font-medium text-[#115C39]">
                  {item.category} · {item.source}
                </div>
                <h3 className="font-display font-bold text-sm text-[#20322A] truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-[#20322A]/60 truncate">
                  Alt: {item.alt}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 border-t border-[#20322A]/8 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => assignToHome(item, 'hero')}
                  className="px-2 py-1 rounded bg-[#F8F9F6] hover:bg-[#E9F3ED] text-[11px] font-semibold text-[#073B2B] cursor-pointer"
                >
                  Usar no Hero
                </button>
                <button
                  type="button"
                  onClick={() => assignToHome(item, 'card0')}
                  className="px-2 py-1 rounded bg-[#F8F9F6] hover:bg-[#E9F3ED] text-[11px] font-semibold text-[#073B2B] cursor-pointer"
                >
                  Card Loja
                </button>
                <button
                  type="button"
                  onClick={() => assignToHome(item, 'card1')}
                  className="px-2 py-1 rounded bg-[#F8F9F6] hover:bg-[#E9F3ED] text-[11px] font-semibold text-[#073B2B] cursor-pointer"
                >
                  Card Clínica
                </button>
                <button
                  type="button"
                  onClick={() => assignToHome(item, 'card2')}
                  className="px-2 py-1 rounded bg-[#F8F9F6] hover:bg-[#E9F3ED] text-[11px] font-semibold text-[#073B2B] cursor-pointer"
                >
                  Card Banho
                </button>
              </div>
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="p-1.5 rounded-lg border border-[#20322A]/12 text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer"
                  title="Editar mídia"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMediaAsset(item.id)}
                  className="p-1.5 rounded-lg border border-[#20322A]/12 text-[#D73F38] hover:bg-[#D73F38]/10 cursor-pointer"
                  title="Excluir mídia"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Edit Media Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2B]/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#20322A]/10">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#073B2B]">
                Editar Mídia
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="w-8 h-8 rounded-lg border border-[#20322A]/12 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#E9F3ED]">
              <SmartImage
                src={editing.url}
                alt={editing.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#20322A]/15 text-xs font-semibold cursor-pointer hover:bg-[#E9F3ED]">
              <Upload className="w-3.5 h-3.5" />
              Substituir arquivo
              <input
                type="file"
                accept="image/*"
                onChange={handleReplaceImage}
                className="hidden"
              />
            </label>

            <div>
              <label className="block text-xs font-semibold mb-1">Nome</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Texto alternativo (SEO e acessibilidade)
              </label>
              <input
                type="text"
                value={editing.alt}
                onChange={(e) => setEditing({ ...editing, alt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Categoria</label>
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value as MediaCategory })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
              >
                {MEDIA_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border border-[#20322A]/15 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  updateMediaAsset(editing);
                  setEditing(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] cursor-pointer"
              >
                Salvar mídia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
