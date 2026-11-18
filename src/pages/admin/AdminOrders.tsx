import React, { useMemo, useState } from 'react';
import { Download, Eye, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types/fornazari';
import {
  exportOrdersToCsv,
  formatBRL,
  formatDateTimeBR,
} from '../../utils/formatters';

const STATUS_OPTIONS: OrderStatus[] = [
  'Novo',
  'Em preparação',
  'Pronto para retirada',
  'Retirado',
  'Cancelado',
];

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | OrderStatus>('Todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderStatus>('Novo');
  const [draftInternalNotes, setDraftInternalNotes] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'Todos' && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.protocol.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setDraftStatus(order.status);
    setDraftInternalNotes(order.internalNotes || '');
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, draftStatus, draftInternalNotes);
    setSelectedOrder({
      ...selectedOrder,
      status: draftStatus,
      internalNotes: draftInternalNotes,
    });
  };

  const handleExportCsv = () => {
    if (orders.length === 0) {
      showToast('Não há pedidos para exportar.', 'warning');
      return;
    }
    const csv = exportOrdersToCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fornazari-pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Arquivo CSV exportado.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Gerenciamento de Pedidos
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            Pedidos gerados no mesmo navegador são persistidos localmente. Use a aba para acompanhar e alterar o status de retirada.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#20322A]/18 bg-white text-xs font-semibold text-[#20322A] hover:bg-[#E9F3ED] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#115C39]" />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#20322A]/45 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por protocolo (FNZ-...), cliente ou telefone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/15 text-xs sm:text-sm focus:outline-none focus:border-[#115C39]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'Todos' | OrderStatus)}
          className="px-3 py-2 rounded-lg bg-[#F8F9F6] border border-[#20322A]/15 text-xs sm:text-sm focus:outline-none focus:border-[#115C39]"
        >
          <option value="Todos">Todos os status</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#20322A]/60">
            Nenhum pedido encontrado. Finalize uma solicitação pela Loja Digital neste navegador para testar o fluxo completo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F6] border-b border-[#20322A]/10 text-[#20322A]/65">
                <tr>
                  <th className="py-3 px-4 font-semibold">Número</th>
                  <th className="py-3 px-4 font-semibold">Data</th>
                  <th className="py-3 px-4 font-semibold">Cliente</th>
                  <th className="py-3 px-4 font-semibold">Telefone</th>
                  <th className="py-3 px-4 font-semibold text-right">Itens</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold">Modalidade</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20322A]/8">
                {filtered.map((o) => {
                  const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr key={o.id} className="hover:bg-[#F8F9F6]/80">
                      <td className="py-3 px-4 font-mono-num font-bold text-[#073B2B]">
                        {o.protocol}
                        {o.isDemoOrder && (
                          <div className="text-[10px] font-normal text-[#D73F38]">
                            Demonstração
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono-num text-[#20322A]/75">
                        {formatDateTimeBR(o.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#20322A]">
                        {o.customerName}
                      </td>
                      <td className="py-3 px-4 font-mono-num text-[#20322A]/75">
                        {o.customerPhone}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-num">{totalQty}</td>
                      <td className="py-3 px-4 text-right font-mono-num font-bold text-[#073B2B]">
                        {formatBRL(o.total)}
                      </td>
                      <td className="py-3 px-4 text-[#20322A]/75">
                        {o.fulfillmentMethod}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            o.status === 'Cancelado'
                              ? 'text-[#D73F38]'
                              : o.status === 'Pronto para retirada' || o.status === 'Retirado'
                              ? 'text-[#115C39]'
                              : 'text-[#073B2B]'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openOrder(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#20322A]/15 hover:bg-[#E9F3ED] text-xs font-semibold text-[#073B2B] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Abrir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B2B]/50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#20322A]/10">
            <div className="px-6 py-4 border-b border-[#20322A]/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#20322A]/60">
                  {selectedOrder.isDemoOrder ? 'Pedido demonstrativo' : 'Solicitação'} ·{' '}
                  {formatDateTimeBR(selectedOrder.createdAt)}
                </div>
                <h3 className="font-display font-extrabold text-lg font-mono-num text-[#073B2B]">
                  {selectedOrder.protocol}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-lg border border-[#20322A]/12 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F8F9F6] border border-[#20322A]/8 text-xs">
                <div>
                  <span className="text-[#20322A]/60">Cliente:</span>{' '}
                  <strong className="text-[#20322A]">{selectedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-[#20322A]/60">Telefone/WhatsApp:</span>{' '}
                  <strong className="font-mono-num">{selectedOrder.customerPhone}</strong>
                </div>
                <div>
                  <span className="text-[#20322A]/60">Recebimento:</span>{' '}
                  {selectedOrder.fulfillmentMethod}
                </div>
                <div>
                  <span className="text-[#20322A]/60">Pagamento:</span>{' '}
                  {selectedOrder.paymentMethod}
                </div>
                {selectedOrder.notes && (
                  <div className="sm:col-span-2 pt-1 border-t border-[#20322A]/8">
                    <span className="text-[#20322A]/60">Observações do cliente:</span>{' '}
                    {selectedOrder.notes}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#073B2B]">
                  Itens da solicitação
                </div>
                <div className="border border-[#20322A]/10 rounded-xl divide-y divide-[#20322A]/8">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[#20322A]">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-[#20322A]/55 font-mono-num">
                          SKU {item.sku} · {formatBRL(item.unitPrice)} un.
                        </div>
                      </div>
                      <div className="font-mono-num font-bold text-[#073B2B]">
                        {formatBRL(item.unitPrice * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-[#F8F9F6] flex justify-between font-bold text-sm text-[#073B2B]">
                    <span>Total</span>
                    <span className="font-mono-num">{formatBRL(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1.5">
                  Status do pedido
                </label>
                <select
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/18 text-sm font-medium focus:outline-none focus:border-[#115C39]"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20322A] mb-1.5">
                  Observações internas da equipe
                </label>
                <textarea
                  rows={3}
                  value={draftInternalNotes}
                  onChange={(e) => setDraftInternalNotes(e.target.value)}
                  placeholder="Anotações sobre separação, confirmação de estoque ou contato realizado..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8F9F6] border border-[#20322A]/18 text-sm focus:outline-none focus:border-[#115C39]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl border border-[#20322A]/15 text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#115C39] text-white text-xs font-semibold hover:bg-[#073B2B] cursor-pointer"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
