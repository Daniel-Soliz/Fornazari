import React, { useMemo, useState } from 'react';
import { Edit3, Plus, Trash2, Upload, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OFFICIAL_PHOTOS } from '../../data/initialData';
import {
  Service,
  ServiceAvailability,
  ServiceCategoryTab,
} from '../../types/fornazari';
import { compressImageFile } from '../../utils/storage';
import { SmartImage } from '../../components/SmartImage';

const TAB_LABELS: Record<ServiceCategoryTab, string> = {
  clinica: 'Clínica',
  especialidades: 'Especialidades',
  exames: 'Exames',
  banho: 'Banho e Tosa',
};

function createEmptyService(category: ServiceCategoryTab): Service {
  return {
    id: `srv-${Date.now()}`,
    title: '',
    description: '',
    details: '',
    category,
    image: OFFICIAL_PHOTOS.consultorio,
    availability: 'Sob consulta',
    priceLabel: 'Consulte a recepção',
    requiresReferral: category === 'exames',
    orderIndex: 99,
  };
}

export const AdminServices: React.FC = () => {
  const { services, saveService, deleteService, showToast } = useStore();
  const [tabFilter, setTabFilter] = useState<'all' | ServiceCategoryTab>('all');
  const [editing, setEditing] = useState<Service | null>(null);

  const filtered = useMemo(() => {
    const list =
      tabFilter === 'all'
        ? services
        : services.filter((s) => s.category === tabFilter);
    return [...list].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [services, tabFilter]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const dataUrl = await compressImageFile(file, 850, 0.78);
      setEditing({ ...editing, image: dataUrl });
      showToast('Imagem do serviço atualizada.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro no upload.', 'error');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.title.trim().length < 2) {
      showToast('Informe o título do serviço.', 'warning');
      return;
    }
    saveService({
      ...editing,
      title: editing.title.trim(),
      priceLabel: editing.priceLabel.trim() || 'Consulte a recepção',
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Gerenciamento de Serviços
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Valores veterinários não confirmados devem permanecer como &ldquo;Consulte a recepção&rdquo;.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditing(
              createEmptyService(tabFilter === 'all' ? 'clinica' : tabFilter)
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo serviço
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setTabFilter('all')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            tabFilter === 'all'
              ? 'bg-[#115C39] text-white'
              : 'bg-white border border-[#20322A]/12 text-[#20322A]/75'
          }`}
        >
          Todos ({services.length})
        </button>
        {(Object.keys(TAB_LABELS) as ServiceCategoryTab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTabFilter(key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
              tabFilter === key
                ? 'bg-[#115C39] text-white'
                : 'bg-white border border-[#20322A]/12 text-[#20322A]/75'
            }`}
          >
            {TAB_LABELS[key]} ({services.filter((s) => s.category === key).length})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F6] border-b border-[#20322A]/10 text-[#20322A]/65">
              <tr>
                <th className="py-3 px-4 font-semibold">Serviço</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold">Disponibilidade</th>
                <th className="py-3 px-4 font-semibold">Valor exibido</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20322A]/8">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8F9F6]/70">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#E9F3ED] shrink-0">
                        <SmartImage
                          src={s.image}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#20322A]">{s.title}</div>
                        <div className="text-[11px] text-[#20322A]/55 truncate max-w-[260px]">
                          {s.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#20322A]/80">
                    {TAB_LABELS[s.category]}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        s.availability === 'Oculto'
                          ? 'text-[#20322A]/40'
                          : s.availability === 'Disponível'
                          ? 'text-[#115C39]'
                          : 'text-[#073B2B]'
                      }`}
                    >
                      {s.availability}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#20322A]/75">{s.priceLabel}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(s)}
                        className="p-1.5 rounded-lg border border-[#20322A]/12 text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer"
                        title="Editar serviço"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteService(s.id)}
                        className="p-1.5 rounded-lg border border-[#20322A]/12 text-[#D73F38] hover:bg-[#D73F38]/10 cursor-pointer"
                        title="Excluir serviço"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2B]/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#20322A]/10">
            <div className="px-6 py-4 border-b border-[#20322A]/10 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#073B2B]">
                {services.some((s) => s.id === editing.id)
                  ? 'Editar Serviço'
                  : 'Novo Serviço'}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1">
                  Título do serviço *
                </label>
                <input
                  type="text"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#20322A] mb-1">
                    Aba / Categoria
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        category: e.target.value as ServiceCategoryTab,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                  >
                    {(Object.keys(TAB_LABELS) as ServiceCategoryTab[]).map((k) => (
                      <option key={k} value={k}>
                        {TAB_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#20322A] mb-1">
                    Disponibilidade
                  </label>
                  <select
                    value={editing.availability}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        availability: e.target.value as ServiceAvailability,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Sob consulta">Sob consulta</option>
                    <option value="Oculto">Oculto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1">
                  Preço / Informação de valor
                </label>
                <input
                  type="text"
                  value={editing.priceLabel}
                  onChange={(e) =>
                    setEditing({ ...editing, priceLabel: e.target.value })
                  }
                  placeholder="Consulte a recepção"
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1">
                  Descrição curta
                </label>
                <textarea
                  rows={2}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1">
                  Detalhes adicionais (opcional)
                </label>
                <textarea
                  rows={2}
                  value={editing.details || ''}
                  onChange={(e) => setEditing({ ...editing, details: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#E9F3ED] shrink-0">
                  <SmartImage
                    src={editing.image}
                    alt={editing.title || 'Prévia'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#20322A]/15 text-xs font-semibold cursor-pointer hover:bg-[#E9F3ED]">
                  <Upload className="w-3.5 h-3.5" />
                  Trocar foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-[#20322A]/15 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] cursor-pointer"
                >
                  Salvar serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
