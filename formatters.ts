import { Order, StoreSettings } from '../types/fornazari';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateTimeBR(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateBR(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function sanitizePhoneDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function formatPhoneMask(raw: string): string {
  const digits = sanitizePhoneDigits(raw).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  const cleanPhone = sanitizePhoneDigits(phoneDigits);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildVetWhatsAppUrl(settings: StoreSettings, customSubject?: string): string {
  const baseMessage = customSubject
    ? `Olá! Gostaria de informações sobre atendimento veterinário na Fornazari (${customSubject}).`
    : 'Olá! Gostaria de informações sobre atendimento veterinário na Fornazari.';
  return buildWhatsAppUrl(settings.whatsappVet, baseMessage);
}

export function buildPetShopWhatsAppUrl(settings: StoreSettings, customSubject?: string): string {
  const baseMessage = customSubject
    ? `Olá! Gostaria de informações sobre os produtos e serviços da Fornazari (${customSubject}).`
    : 'Olá! Gostaria de informações sobre os produtos e serviços da Fornazari.';
  return buildWhatsAppUrl(settings.whatsappPetShop, baseMessage);
}

export function buildOrderWhatsAppMessage(order: Order, settings: StoreSettings): string {
  const lines = [
    order.isDemoOrder
      ? 'Solicitação demonstrativa — Fornazari Pet Shop'
      : 'Solicitação de pedido — Fornazari Pet Shop',
    `Protocolo: ${order.protocol}`,
    `Cliente: ${order.customerName}`,
    `Telefone/WhatsApp: ${order.customerPhone}`,
    '',
    'Itens selecionados:',
    ...order.items.map(
      (item) =>
        `- ${item.quantity}x ${item.name} (${formatBRL(item.unitPrice)}) = ${formatBRL(
          item.unitPrice * item.quantity
        )}`
    ),
    '',
    `Total estimado: ${formatBRL(order.total)}`,
    `Recebimento: ${order.fulfillmentMethod} (${settings.address})`,
    `Pagamento: ${order.paymentMethod}`,
  ];

  if (order.notes.trim()) {
    lines.push(`Observações: ${order.notes.trim()}`);
  }

  return lines.join('\n');
}

export function exportOrdersToCsv(orders: Order[]): string {
  const header = [
    'Protocolo',
    'Data',
    'Cliente',
    'Telefone',
    'Qtd Itens',
    'Total (R$)',
    'Modalidade',
    'Status',
    'Modo',
    'Itens',
    'Observacoes Cliente',
    'Observacoes Internas',
  ];

  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = orders.map((o) => {
    const qty = o.items.reduce((sum, i) => sum + i.quantity, 0);
    const itemsSummary = o.items.map((i) => `${i.quantity}x ${i.name}`).join('; ');
    return [
      escapeCsv(o.protocol),
      escapeCsv(formatDateTimeBR(o.createdAt)),
      escapeCsv(o.customerName),
      escapeCsv(o.customerPhone),
      escapeCsv(qty),
      escapeCsv(o.total.toFixed(2).replace('.', ',')),
      escapeCsv(o.fulfillmentMethod),
      escapeCsv(o.status),
      escapeCsv(o.isDemoOrder ? 'Demonstração' : 'Comercial'),
      escapeCsv(itemsSummary),
      escapeCsv(o.notes),
      escapeCsv(o.internalNotes),
    ].join(',');
  });

  return '\uFEFF' + [header.join(','), ...rows].join('\n');
}
