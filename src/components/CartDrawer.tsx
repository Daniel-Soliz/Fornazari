import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types/fornazari';
import {
  buildOrderWhatsAppMessage,
  buildPetShopWhatsAppUrl,
  buildWhatsAppUrl,
  formatBRL,
  formatDateTimeBR,
  formatPhoneMask,
} from '../utils/formatters';
import { SmartImage } from './SmartImage';

type DrawerStep = 'cart' | 'checkout' | 'confirmation';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    products,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    settings,
    navigate,
    showToast,
  } = useStore();

  const [step, setStep] = useState<DrawerStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<Order['fulfillmentMethod']>(
    'Retirada na loja'
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Reset step to cart when re-opening empty or after closing confirmation
  const handleClose = () => {
    setIsCartOpen(false);
    if (step === 'confirmation') {
      window.setTimeout(() => {
        setStep('cart');
        setConfirmedOrder(null);
        setShowOrderDetails(false);
      }, 250);
    }
  };

  const cartDetails = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId && p.active);
      if (!product) return null;
      const unitPrice =
        product.promoPrice && product.promoPrice > 0 && product.promoPrice < product.price
          ? product.promoPrice
          : product.price;
      return {
        ...item,
        product,
        unitPrice,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const result = createOrder({
      customerName,
      customerPhone,
      notes,
      fulfillmentMethod,
    });
    if (!result.ok || !result.order) {
      setFormError(result.error || 'Verifique os dados informados.');
      return;
    }
    setConfirmedOrder(result.order);
    setStep('confirmation');
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => showToast('Mensagem copiada para a área de transferência.', 'success'))
      .catch(() => showToast('Não foi possível copiar automaticamente.', 'warning'));
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Carrinho e solicitação de pedido"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#073B2B]/45 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#F8F9F6] h-full shadow-2xl border-l border-[#20322A]/10 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-white border-b border-[#20322A]/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {step === 'checkout' && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null);
                      setStep('cart');
                    }}
                    aria-label="Voltar ao carrinho"
                    className="w-8 h-8 rounded-lg border border-[#20322A]/12 flex items-center justify-center hover:bg-[#E9F3ED] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#20322A]" />
                  </button>
                )}
                <div>
                  <h2 className="font-display font-bold text-base text-[#073B2B]">
                    {step === 'cart' && 'Seu Carrinho'}
                    {step === 'checkout' && 'Finalizar Solicitação'}
                    {step === 'confirmation' && 'Solicitação Registrada'}
                  </h2>
                  <p className="text-xs text-[#20322A]/60">
                    {settings.demoMode
                      ? 'Modo Demonstração · Retirada na unidade'
                      : 'Retirada na loja · Pagamento a combinar'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Fechar carrinho"
                className="w-10 h-10 rounded-lg border border-[#20322A]/12 flex items-center justify-center text-[#20322A] hover:bg-[#E9F3ED] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {step === 'cart' && (
                <>
                  {cartDetails.length === 0 ? (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#E9F3ED] text-[#115C39] flex items-center justify-center mb-4">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#073B2B] mb-1">
                        Seu carrinho está vazio
                      </h3>
                      <p className="text-sm text-[#20322A]/65 mb-6 max-w-xs">
                        Explore nossa loja digital e selecione rações, petiscos, brinquedos ou acessórios para retirada.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          navigate('/loja');
                        }}
                        className="px-5 py-2.5 rounded-lg bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
                      >
                        Explorar loja
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {settings.demoMode && (
                        <div className="p-3 rounded-xl bg-white border border-[#20322A]/12 text-xs text-[#20322A]/80 leading-relaxed">
                          <span className="font-semibold text-[#073B2B]">
                            Demonstração — preços ilustrativos:
                          </span>{' '}
                          os valores exibidos representam um catálogo de exemplo para avaliação da plataforma.
                        </div>
                      )}

                      {cartDetails.map(({ product, quantity, unitPrice }) => (
                        <div
                          key={product.id}
                          className="p-3.5 rounded-xl bg-white border border-[#20322A]/10 flex gap-3.5"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E9F3ED]/40 shrink-0 border border-[#20322A]/8">
                            <SmartImage
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain bg-white p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold text-[#20322A] leading-snug line-clamp-2">
                                  {product.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(product.id)}
                                  aria-label={`Remover ${product.name}`}
                                  className="text-[#20322A]/45 hover:text-[#D73F38] p-1 cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="mt-1 text-xs text-[#20322A]/60 font-mono-num">
                                {formatBRL(unitPrice)} un. · Estoque: {product.stock}
                              </div>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="inline-flex items-center border border-[#20322A]/15 rounded-lg bg-[#F8F9F6]">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                                  aria-label="Diminuir quantidade"
                                  className="w-8 h-8 flex items-center justify-center text-[#20322A] hover:bg-[#E9F3ED] rounded-l-lg cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-mono-num font-semibold text-[#20322A]">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                                  disabled={quantity >= product.stock}
                                  aria-label="Aumentar quantidade"
                                  className="w-8 h-8 flex items-center justify-center text-[#20322A] hover:bg-[#E9F3ED] disabled:opacity-35 rounded-r-lg cursor-pointer disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="text-sm font-bold font-mono-num text-[#073B2B]">
                                {formatBRL(unitPrice * quantity)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={clearCart}
                          className="text-xs font-semibold text-[#D73F38] hover:underline cursor-pointer"
                        >
                          Limpar carrinho
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 'checkout' && (
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-white border border-[#20322A]/10 text-xs text-[#20322A]/80 leading-relaxed space-y-1.5">
                    <div className="font-semibold text-[#073B2B] flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#115C39] shrink-0" />
                      Fluxo demonstrativo em navegador local
                    </div>
                    <p>
                      Esta solicitação é salva apenas neste navegador (localStorage) para apresentação do sistema. Não há pagamento online nem envio automático para outro aparelho — a operação comercial real requer integração com backend.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-lg bg-[#D73F38]/10 border border-[#D73F38]/25 text-xs font-medium text-[#D73F38]">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-semibold text-[#20322A] mb-1.5"
                    >
                      Nome completo *
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex.: Maria Aparecida Silva"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#20322A]/20 text-sm focus:outline-none focus:border-[#115C39]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-semibold text-[#20322A] mb-1.5"
                    >
                      Telefone ou WhatsApp *
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(formatPhoneMask(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#20322A]/20 text-sm font-mono-num focus:outline-none focus:border-[#115C39]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#20322A] mb-1.5">
                      Forma de recebimento
                    </span>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#115C39] cursor-pointer">
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={fulfillmentMethod === 'Retirada na loja'}
                          onChange={() => setFulfillmentMethod('Retirada na loja')}
                          className="mt-0.5 accent-[#115C39]"
                        />
                        <div className="text-xs">
                          <div className="font-semibold text-[#073B2B]">
                            Retirada na loja (Principal)
                          </div>
                          <div className="text-[#20322A]/70 mt-0.5 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#115C39]" />
                            <span>{settings.address}</span>
                          </div>
                          <div className="text-[#20322A]/60 mt-1">
                            O prazo de retirada será confirmado pela equipe.
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#20322A]/15 cursor-pointer">
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={fulfillmentMethod === 'Consultar futura entrega (a combinar)'}
                          onChange={() =>
                            setFulfillmentMethod('Consultar futura entrega (a combinar)')
                          }
                          className="mt-0.5 accent-[#115C39]"
                        />
                        <div className="text-xs">
                          <div className="font-semibold text-[#20322A]">
                            Consultar disponibilidade de entrega (a combinar)
                          </div>
                          <div className="text-[#20322A]/60 mt-0.5">
                            {settings.futureDeliveryNotice}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#E9F3ED]/60 border border-[#115C39]/15 text-xs">
                    <span className="font-semibold text-[#073B2B]">Forma de pagamento:</span>{' '}
                    A combinar com a loja (sem pagamento online nesta etapa).
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-notes"
                      className="block text-xs font-semibold text-[#20322A] mb-1.5"
                    >
                      Observações
                    </label>
                    <textarea
                      id="checkout-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex.: Preferência de horário para retirada ou dúvida sobre o produto."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#20322A]/20 text-sm focus:outline-none focus:border-[#115C39]"
                    />
                  </div>

                  {/* Item review */}
                  <div className="pt-2 border-t border-[#20322A]/10">
                    <div className="text-xs font-semibold text-[#20322A]/70 mb-2">
                      Revisão dos itens ({cartDetails.length})
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {cartDetails.map((item) => (
                        <li key={item.productId} className="flex justify-between gap-2">
                          <span className="text-[#20322A] truncate">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-mono-num font-semibold text-[#073B2B] shrink-0">
                            {formatBRL(item.unitPrice * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </form>
              )}

              {step === 'confirmation' && confirmedOrder && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#115C39]/25 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#E9F3ED] text-[#115C39] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-semibold text-[#115C39]">
                      {confirmedOrder.isDemoOrder
                        ? 'Solicitação demonstrativa registrada localmente'
                        : 'Solicitação registrada para retirada'}
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-[#073B2B] font-mono-num">
                      {confirmedOrder.protocol}
                    </h3>
                    <p className="text-xs text-[#20322A]/70">
                      Status inicial: <strong className="text-[#20322A]">{confirmedOrder.status}</strong> ·{' '}
                      {formatDateTimeBR(confirmedOrder.createdAt)}
                    </p>
                  </div>

                  {confirmedOrder.isDemoOrder ? (
                    <div className="p-4 rounded-xl bg-white border border-[#D73F38]/25 space-y-2.5 text-xs text-[#20322A]/85 leading-relaxed">
                      <div className="font-bold text-[#D73F38]">
                        Aviso de Modo Demonstração
                      </div>
                      <p>
                        Esta solicitação contém itens ilustrativos e foi gravada apenas no armazenamento local (localStorage) deste navegador. Nenhuma compra real foi efetivada nem enviada automaticamente para a loja.
                      </p>
                      <p>
                        Para converter pedidos em atendimento real via WhatsApp com catálogo confirmado, ative o <strong>Modo Comercial</strong> nas configurações do Painel Administrativo após revisar produtos e preços.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#E9F3ED]/60 border border-[#115C39]/20 text-xs text-[#20322A] leading-relaxed">
                      Solicitação salva com sucesso. Para confirmar a separação e o horário de retirada na unidade, envie os dados no WhatsApp do Pet Shop usando o botão abaixo.
                    </div>
                  )}

                  {/* Details toggle */}
                  <div className="bg-white rounded-xl border border-[#20322A]/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowOrderDetails((v) => !v)}
                      className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#073B2B] hover:bg-[#F8F9F6] cursor-pointer"
                    >
                      <span>Consultar detalhes da solicitação</span>
                      <span>{showOrderDetails ? 'Ocultar' : 'Exibir'}</span>
                    </button>
                    {showOrderDetails && (
                      <div className="px-4 pb-4 pt-2 border-t border-[#20322A]/8 space-y-2 text-xs">
                        <div>
                          <span className="text-[#20322A]/60">Cliente:</span>{' '}
                          <span className="font-semibold">{confirmedOrder.customerName}</span>
                        </div>
                        <div>
                          <span className="text-[#20322A]/60">Contato:</span>{' '}
                          <span className="font-mono-num">{confirmedOrder.customerPhone}</span>
                        </div>
                        <div>
                          <span className="text-[#20322A]/60">Recebimento:</span>{' '}
                          {confirmedOrder.fulfillmentMethod}
                        </div>
                        <div>
                          <span className="text-[#20322A]/60">Pagamento:</span>{' '}
                          {confirmedOrder.paymentMethod}
                        </div>
                        <div className="pt-2 border-t border-[#20322A]/8 space-y-1">
                          {confirmedOrder.items.map((item) => (
                            <div key={item.productId} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-mono-num font-semibold">
                                {formatBRL(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-[#20322A]/10 flex justify-between font-bold text-sm text-[#073B2B]">
                          <span>Total estimado</span>
                          <span className="font-mono-num">{formatBRL(confirmedOrder.total)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Message Preview */}
                  <div className="bg-white rounded-xl border border-[#20322A]/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#073B2B]">
                        Mensagem preparada para WhatsApp
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyMessage(buildOrderWhatsAppMessage(confirmedOrder, settings))
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#115C39] hover:underline cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
                      </button>
                    </div>
                    <pre className="text-[11px] bg-[#F8F9F6] p-3 rounded-lg border border-[#20322A]/8 whitespace-pre-wrap font-mono-num text-[#20322A]/80 max-h-40 overflow-y-auto">
                      {buildOrderWhatsAppMessage(confirmedOrder, settings)}
                    </pre>

                    {!confirmedOrder.isDemoOrder ? (
                      <a
                        href={buildWhatsAppUrl(
                          settings.whatsappPetShop,
                          buildOrderWhatsAppMessage(confirmedOrder, settings)
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Enviar solicitação via WhatsApp
                      </a>
                    ) : (
                      <a
                        href={buildPetShopWhatsAppUrl(
                          settings,
                          'dúvida sobre produtos da loja'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#115C39] text-[#115C39] text-sm font-semibold hover:bg-[#E9F3ED] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Falar com o Pet Shop no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {step === 'cart' && cartDetails.length > 0 && (
              <div className="p-5 bg-white border-t border-[#20322A]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#20322A]/75">Subtotal estimado</span>
                  <span className="text-lg font-extrabold font-mono-num text-[#073B2B]">
                    {formatBRL(cartSubtotal)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-2.5 px-3 rounded-xl border border-[#20322A]/18 text-xs sm:text-sm font-semibold text-[#20322A] hover:bg-[#F8F9F6] transition-colors cursor-pointer"
                  >
                    Continuar comprando
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="py-2.5 px-3 rounded-xl bg-[#115C39] text-white text-xs sm:text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
                  >
                    Finalizar solicitação
                  </button>
                </div>
              </div>
            )}

            {step === 'checkout' && (
              <div className="p-5 bg-white border-t border-[#20322A]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#20322A]/75">Total estimado</span>
                  <span className="text-lg font-extrabold font-mono-num text-[#073B2B]">
                    {formatBRL(cartSubtotal)}
                  </span>
                </div>
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-full py-3 px-4 rounded-xl bg-[#115C39] text-white text-sm font-semibold hover:bg-[#073B2B] transition-colors cursor-pointer"
                >
                  Confirmar solicitação de retirada
                </button>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="p-5 bg-white border-t border-[#20322A]/10">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('/loja');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#20322A]/18 text-sm font-semibold text-[#20322A] hover:bg-[#F8F9F6] transition-colors cursor-pointer"
                >
                  Voltar para a loja
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
