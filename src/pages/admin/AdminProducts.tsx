import React, { useMemo, useState } from 'react';
import {
  Edit3,
  Image as ImageIcon,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_CATEGORIES } from '../../data/initialData';
import { createProductIllustration } from '../../data/productArt';
import { CategoryName, Product } from '../../types/fornazari';
import { formatBRL } from '../../utils/formatters';
import { compressImageFile } from '../../utils/storage';
import { SmartImage } from '../../components/SmartImage';

function createEmptyProduct(): Product {
  const now = new Date().toISOString();
  return {
    id: `prod-${Date.now()}`,
    sku: `FNZ-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    brand: '',
    category: 'Rações para cães',
    price: 0,
    promoPrice: undefined,
    stock: 10,
    active: true,
    featured: false,
    isDemo: false,
    image: createProductIllustration('Novo Produto', 'Fornazari Pet Shop', '#115C39', '#E9F3ED', 'bag'),
    description: '',
    weightOrSize: '',
    createdAt: now,
    updatedAt: now,
  };
}

export const AdminProducts: React.FC = () => {
  const {
    products,
    media,
    saveProduct,
    deleteProduct,
    clearDemoProducts,
    showToast,
  } = useStore();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'Todas' | CategoryName>('Todas');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [confirmClearDemo, setConfirmClearDemo] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (catFilter !== 'Todas' && p.category !== catFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
  }, [products, search, catFilter]);

  const demoCount = products.filter((p) => p.isDemo).length;

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const dataUrl = await compressImageFile(file, 800, 0.78);
      setEditing({ ...editing, image: dataUrl });
      showToast('Imagem comprimida e aplicada ao produto.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro no upload.', 'error');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.name.trim().length < 2) {
      showToast('Informe o nome do produto.', 'warning');
      return;
    }
    if (editing.price <= 0) {
      showToast('Informe um preço válido maior que zero.', 'warning');
      return;
    }
    const res = saveProduct({
      ...editing,
      name: editing.name.trim(),
      brand: editing.brand.trim() || 'Fornazari',
      sku: editing.sku.trim() || `FNZ-${Date.now().toString().slice(-4)}`,
      promoPrice:
        editing.promoPrice && editing.promoPrice > 0 && editing.promoPrice < editing.price
          ? editing.promoPrice
          : undefined,
    });
    if (res.ok) {
      setEditing(null);
      setShowGalleryPicker(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Gerenciamento de Produtos
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Cadastre, edite, gerencie estoque e destaque produtos. Todas as alterações refletem imediatamente na loja pública.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {demoCount > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearDemo(true)}
              className="px-3.5 py-2.5 rounded-xl border border-[#D73F38]/30 text-xs font-semibold text-[#D73F38] hover:bg-[#D73F38]/10 transition-colors cursor-pointer"
            >
              Remover exemplos ({demoCount})
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditing(createEmptyProduct())}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Cadastrar produto
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#20322A]/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, marca ou SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/15 text-xs sm:text-sm focus:outline-none focus:border-[#115C39]"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as 'Todas' | CategoryName)}
          className="px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/15 text-xs sm:text-sm focus:outline-none focus:border-[#115C39]"
        >
          <option value="Todas">Todas as categorias</option>
          {STORE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#20322A]/60">
            Nenhum produto encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F6] border-b border-[#20322A]/10 text-[#20322A]/65">
                <tr>
                  <th className="py-3 px-4 font-semibold">Produto</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Categoria</th>
                  <th className="py-3 px-4 font-semibold text-right">Preço</th>
                  <th className="py-3 px-4 font-semibold text-right">Estoque</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20322A]/8">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F9F6]/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#E9F3ED] shrink-0 border border-[#20322A]/8">
                          <SmartImage
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#20322A] truncate max-w-[220px]">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-[#20322A]/55">
                            {p.brand}
                            {p.isDemo ? ' · Demonstração' : ''}
                            {p.featured ? ' · Destaque' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-num text-[#20322A]/75">{p.sku}</td>
                    <td className="py-3 px-4 text-[#20322A]/80">{p.category}</td>
                    <td className="py-3 px-4 text-right font-mono-num">
                      {p.promoPrice && p.promoPrice < p.price ? (
                        <div>
                          <span className="line-through text-[#20322A]/45 mr-1.5">
                            {formatBRL(p.price)}
                          </span>
                          <span className="font-bold text-[#115C39]">
                            {formatBRL(p.promoPrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-[#073B2B]">
                          {formatBRL(p.price)}
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono-num font-bold ${
                        p.stock <= 5 ? 'text-[#D73F38]' : 'text-[#20322A]'
                      }`}
                    >
                      {p.stock}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          p.active ? 'text-[#115C39]' : 'text-[#20322A]/45'
                        }`}
                      >
                        {p.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            saveProduct({ ...p, featured: !p.featured })
                          }
                          title={p.featured ? 'Remover destaque' : 'Marcar como destaque'}
                          className={`p-1.5 rounded-lg border cursor-pointer ${
                            p.featured
                              ? 'border-[#115C39]/30 bg-[#E9F3ED] text-[#115C39]'
                              : 'border-[#20322A]/12 text-[#20322A]/45 hover:text-[#115C39]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(p)}
                          title="Editar produto"
                          className="p-1.5 rounded-lg border border-[#20322A]/12 text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          title="Excluir produto"
                          className="p-1.5 rounded-lg border border-[#20322A]/12 text-[#D73F38] hover:bg-[#D73F38]/10 cursor-pointer"
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
        )}
      </div>

      {/* Confirm Clear Demo Products */}
      {confirmClearDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2B]/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#20322A]/10">
            <h3 className="font-display font-bold text-lg text-[#073B2B]">
              Remover produtos demonstrativos?
            </h3>
            <p className="text-sm text-[#20322A]/75">
              Isso excluirá os {demoCount} produtos marcados como demonstração. Produtos reais cadastrados manualmente serão mantidos.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmClearDemo(false)}
                className="px-4 py-2 rounded-lg border border-[#20322A]/15 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  clearDemoProducts();
                  setConfirmClearDemo(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#D73F38] text-white text-xs font-semibold cursor-pointer"
              >
                Confirmar remoção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2B]/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#20322A]/10">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-[#20322A]/10 flex items-center justify-between z-10">
              <h3 className="font-display font-bold text-lg text-[#073B2B]">
                {products.some((p) => p.id === editing.id)
                  ? 'Editar Produto'
                  : 'Cadastrar Novo Produto'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setShowGalleryPicker(false);
                }}
                className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-4 space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F8F9F6] border border-[#20322A]/12">
                    <SmartImage
                      src={editing.image}
                      alt={editing.name || 'Prévia'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#20322A]/15 text-xs font-semibold text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Enviar foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGalleryPicker((v) => !v)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#20322A]/15 text-xs font-semibold text-[#115C39] hover:bg-[#E9F3ED] cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Escolher da galeria
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#20322A] mb-1">
                      Nome do produto *
                    </label>
                    <input
                      type="text"
                      required
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#20322A] mb-1">
                        Categoria
                      </label>
                      <select
                        value={editing.category}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            category: e.target.value as CategoryName,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
                      >
                        {STORE_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#20322A] mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        value={editing.brand}
                        onChange={(e) => setEditing({ ...editing, brand: e.target.value })}
                        placeholder="Ex.: Premier, Royal Canin"
                        className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#20322A] mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={editing.sku}
                        onChange={(e) => setEditing({ ...editing, sku: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-xs font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#20322A] mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={editing.price || ''}
                        onChange={(e) =>
                          setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#20322A] mb-1">
                        Promoção (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editing.promoPrice ?? ''}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            promoPrice: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#20322A] mb-1">
                        Estoque *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={editing.stock}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            stock: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-mono-num"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {showGalleryPicker && (
                <div className="p-3 rounded-xl bg-[#F8F9F6] border border-[#20322A]/12 space-y-2">
                  <div className="text-xs font-semibold text-[#073B2B]">
                    Selecionar imagem da galeria:
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                    {media.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setEditing({ ...editing, image: m.url });
                          setShowGalleryPicker(false);
                        }}
                        className="aspect-square rounded-lg overflow-hidden border border-[#20322A]/15 hover:border-[#115C39] cursor-pointer"
                      >
                        <SmartImage
                          src={m.url}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#20322A] mb-1">
                    Peso / Apresentação
                  </label>
                  <input
                    type="text"
                    value={editing.weightOrSize || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, weightOrSize: e.target.value })
                    }
                    placeholder="Ex.: 3 kg, 500 ml, Tamanho M"
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#20322A] mb-1">
                    URL da imagem (opcional)
                  </label>
                  <input
                    type="text"
                    value={editing.image}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-xs font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/18 text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-5 pt-1">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#20322A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="accent-[#115C39]"
                  />
                  Produto ativo na loja
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#20322A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) =>
                      setEditing({ ...editing, featured: e.target.checked })
                    }
                    className="accent-[#115C39]"
                  />
                  Destacar na página inicial
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#20322A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.isDemo}
                    onChange={(e) => setEditing({ ...editing, isDemo: e.target.checked })}
                    className="accent-[#D73F38]"
                  />
                  Marcar como item demonstrativo
                </label>
              </div>

              <div className="pt-3 border-t border-[#20322A]/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setShowGalleryPicker(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#20322A]/15 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] cursor-pointer"
                >
                  Salvar produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
