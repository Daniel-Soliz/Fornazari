import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ClipboardList,
  DollarSign,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types/fornazari';
import { formatBRL, formatDateTimeBR } from '../../utils/formatters';

type PeriodFilter = 'all' | 'today' | '7d' | '30d';

const ORDER_STATUS_LIST: OrderStatus[] = [
  'Novo',
  'Em preparação',
  'Pronto para retirada',
  'Retirado',
  'Cancelado',
];

export const AdminDashboard: React.FC<{ onGoToSection: (section: string) => void }> = ({
  onGoToSection,
}) => {
  const { products, orders, settings } = useStore();
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders;
    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return orders.filter((o) => {
      const ts = new Date(o.createdAt).getTime();
      if (Number.isNaN(ts)) return false;
      if (period === 'today') return ts >= startOfToday.getTime();
      if (period === '7d') return now - ts <= 7 * 86400000;
      if (period === '30d') return now - ts <= 30 * 86400000;
      return true;
    });
  }, [orders, period]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.active).length;
    const lowStock = products.filter((p) => p.active && p.stock <= 5).length;
    const totalOrders = filteredOrders.length;
    const newOrders = filteredOrders.filter((o) => o.status === 'Novo').length;
    const preparingOrders = filteredOrders.filter((o) => o.status === 'Em preparação').length;
    const readyOrders = filteredOrders.filter((o) => o.status === 'Pronto para retirada').length;
    const accumulatedValue = filteredOrders
      .filter((o) => o.status !== 'Cancelado')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalProducts,
      activeProducts,
      lowStock,
      totalOrders,
      newOrders,
      preparingOrders,
      readyOrders,
      accumulatedValue,
    };
  }, [products, filteredOrders]);

  const statusDistribution = useMemo(() => {
    const max = Math.max(
      1,
      ...ORDER_STATUS_LIST.map(
        (st) => filteredOrders.filter((o) => o.status === st).length
      )
    );
    return ORDER_STATUS_LIST.map((st) => {
      const count = filteredOrders.filter((o) => o.status === st).length;
      return {
        status: st,
        count,
        percent: Math.round((count / max) * 100),
      };
    });
  }, [filteredOrders]);

  const categoryStock = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    }
    const entries = Array.from(map.entries());
    const max = Math.max(1, ...entries.map(([, v]) => v));
    return entries.map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / max) * 100),
    }));
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Period filter header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-[#073B2B]">
            Visão Geral do Sistema
          </h2>
          <p className="text-xs text-[#20322A]/65 mt-0.5">
            {settings.demoMode
              ? 'Operando em Modo Demonstração (localStorage). Valores e pedidos exibidos são ilustrativos.'
              : 'Operando em Modo Comercial local (localStorage).'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white border border-[#20322A]/12 rounded-xl self-start">
          {(
            [
              { id: 'all', label: 'Todo período' },
              { id: 'today', label: 'Hoje' },
              { id: '7d', label: '7 dias' },
              { id: '30d', label: '30 dias' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                period === item.id
                  ? 'bg-[#115C39] text-white'
                  : 'text-[#20322A]/70 hover:bg-[#E9F3ED]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#20322A]/65">
            <span>Total de produtos</span>
            <Archive className="w-4 h-4 text-[#115C39]" />
          </div>
          <div className="font-display font-extrabold text-2xl font-mono-num text-[#073B2B]">
            {metrics.totalProducts}
          </div>
          <div className="text-xs text-[#20322A]/60">
            <span className="font-mono-num">{metrics.activeProducts}</span> ativos na loja
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#20322A]/65">
            <span>Estoque baixo (≤ 5 un.)</span>
            <AlertTriangle className="w-4 h-4 text-[#D73F38]" />
          </div>
          <div className="font-display font-extrabold text-2xl font-mono-num text-[#D73F38]">
            {metrics.lowStock}
          </div>
          <button
            type="button"
            onClick={() => onGoToSection('products')}
            className="text-xs font-semibold text-[#115C39] hover:underline cursor-pointer"
          >
            Revisar produtos
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#20322A]/65">
            <span>
              {settings.demoMode ? 'Pedidos demonstrativos' : 'Solicitações recebidas'}
            </span>
            <ClipboardList className="w-4 h-4 text-[#115C39]" />
          </div>
          <div className="font-display font-extrabold text-2xl font-mono-num text-[#073B2B]">
            {metrics.totalOrders}
          </div>
          <div className="text-xs text-[#20322A]/65 font-mono-num">
            {metrics.newOrders} novos · {metrics.preparingOrders} em prep. · {metrics.readyOrders} prontos
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#20322A]/65">
            <span>Valor acumulado (simulação)</span>
            <DollarSign className="w-4 h-4 text-[#115C39]" />
          </div>
          <div className="font-display font-extrabold text-2xl font-mono-num text-[#073B2B]">
            {formatBRL(metrics.accumulatedValue)}
          </div>
          <div className="text-[11px] text-[#20322A]/55">
            Não representa faturamento comercial real
          </div>
        </div>
      </div>

      {/* Status Breakdown & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#073B2B]">
              Pedidos por Status
            </h3>
            <button
              type="button"
              onClick={() => onGoToSection('orders')}
              className="text-xs font-semibold text-[#115C39] hover:underline cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#20322A]/60 space-y-2">
              <PackageCheck className="w-7 h-7 text-[#115C39]/50 mx-auto" />
              <p>Nenhum pedido registrado neste período.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {statusDistribution.map((row) => (
                <div key={row.status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#20322A]">{row.status}</span>
                    <span className="font-mono-num font-bold text-[#073B2B]">
                      {row.count}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F8F9F6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#115C39] transition-all duration-300"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#20322A]/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#073B2B]">
              Catálogo por Categoria
            </h3>
            <button
              type="button"
              onClick={() => onGoToSection('products')}
              className="text-xs font-semibold text-[#115C39] hover:underline cursor-pointer"
            >
              Gerenciar catálogo
            </button>
          </div>

          <div className="space-y-3">
            {categoryStock.map((row) => (
              <div key={row.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#20322A]">{row.name}</span>
                  <span className="font-mono-num font-bold text-[#073B2B]">
                    {row.count}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#F8F9F6] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#073B2B] transition-all duration-300"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders quick list */}
      <div className="bg-white rounded-xl border border-[#20322A]/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#20322A]/8 flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-[#073B2B]">
            Últimas solicitações no navegador
          </h3>
          <button
            type="button"
            onClick={() => onGoToSection('orders')}
            className="text-xs font-semibold text-[#115C39] hover:underline cursor-pointer"
          >
            Abrir gerenciamento
          </button>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#20322A]/60 space-y-2">
            <ShoppingBag className="w-6 h-6 text-[#115C39]/50 mx-auto" />
            <p>
              As solicitações feitas na Loja Digital neste navegador aparecerão aqui instantaneamente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9F6] text-[#20322A]/65 border-b border-[#20322A]/8">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Protocolo</th>
                  <th className="py-2.5 px-4 font-semibold">Cliente</th>
                  <th className="py-2.5 px-4 font-semibold">Data</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20322A]/8">
                {filteredOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8F9F6]">
                    <td className="py-2.5 px-4 font-mono-num font-semibold text-[#073B2B]">
                      {o.protocol}
                    </td>
                    <td className="py-2.5 px-4 text-[#20322A]">{o.customerName}</td>
                    <td className="py-2.5 px-4 font-mono-num text-[#20322A]/65">
                      {formatDateTimeBR(o.createdAt)}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-[#115C39]">{o.status}</td>
                    <td className="py-2.5 px-4 font-mono-num font-bold text-right text-[#073B2B]">
                      {formatBRL(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
