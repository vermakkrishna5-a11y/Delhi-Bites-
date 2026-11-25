import { FormEvent, useEffect, useState } from 'react';
import { Check, Copy, Minus, Plus, RotateCcw, ShoppingBag, Trash2, X } from 'lucide-react';
import { MENU_ITEMS, MenuItem, ORDER_SETTINGS, RESTAURANT_INFO } from '../data/restaurant';
import {
  ConfirmedOrder,
  FulfillmentMode,
  OrderBagItem,
  PaymentMethod,
} from '../hooks/useOrderBag';

interface OrderBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderBagItem[];
  subtotal: number;
  lastOrder: ConfirmedOrder | null;
  onSetLastOrder: (order: ConfirmedOrder | null) => void;
  onAddQuickItem: (dish: MenuItem) => void;
  onIncrement: (cartKey: string) => void;
  onDecrement: (cartKey: string) => void;
  onRemove: (cartKey: string) => void;
  onClearBag: () => void;
}

const QUICK_SUGGESTION_IDS = [
  'afghani-malai-chaap',
  'tandoori-momos',
  'signature-cold-coffee',
];

function formatWhatsAppOrderText(order: ConfirmedOrder): string {
  const itemLines = order.items
    .map((item) => {
      const details = [item.variantLabel, item.spiceLevel].filter(Boolean).join(', ');
      return `- ${item.quantity}x ${item.name} (${details}) — ₹${item.unitPrice * item.quantity}`;
    })
    .join('\n');

  const lines = [
    `Order #${order.orderId} — ${RESTAURANT_INFO.name}`,
    `Mode: ${order.fulfillmentMode === 'pickup' ? 'Counter Pickup (Near Shiv Mandir)' : 'Local Delivery (Nai Sarai)'}`,
    `Customer: ${order.customerName} (${order.phone})`,
    order.fulfillmentMode === 'delivery' ? `Address: ${order.addressLandmark}` : null,
    `Payment: ${order.paymentMethod === 'cash' ? 'Cash' : 'UPI'} on ${order.fulfillmentMode === 'pickup' ? 'Pickup' : 'Delivery'}`,
    '',
    'Items:',
    itemLines,
    '',
    `Subtotal: ₹${order.subtotal}`,
    order.fulfillmentMode === 'delivery'
      ? `Delivery: ${order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}`
      : null,
    `Total Payable: ₹${order.total}`,
    order.instructions ? `Notes: ${order.instructions}` : null,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export function OrderBagDrawer({
  isOpen,
  onClose,
  items,
  subtotal,
  lastOrder,
  onSetLastOrder,
  onAddQuickItem,
  onIncrement,
  onDecrement,
  onRemove,
  onClearBag,
}: OrderBagDrawerProps) {
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFreeDelivery = subtotal >= ORDER_SETTINGS.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(
    0,
    ORDER_SETTINGS.freeDeliveryThreshold - subtotal
  );
  const deliveryFee =
    fulfillmentMode === 'delivery' && items.length > 0 && !isFreeDelivery
      ? ORDER_SETTINGS.deliveryFee
      : 0;
  const totalPayable = subtotal + deliveryFee;

  const quickSuggestions = QUICK_SUGGESTION_IDS.map((id) =>
    MENU_ITEMS.find((item) => item.id === id)
  ).filter((item): item is MenuItem => Boolean(item));

  const handleSubmitOrder = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = 'Please enter your name.';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      nextErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (fulfillmentMode === 'delivery' && addressLandmark.trim().length < 6) {
      nextErrors.addressLandmark = 'Please enter your house/street & nearest landmark in Nai Sarai.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const confirmed: ConfirmedOrder = {
      orderId: `DBC-${orderNumber}`,
      fulfillmentMode,
      paymentMethod,
      customerName: customerName.trim(),
      phone: phone.trim(),
      addressLandmark:
        fulfillmentMode === 'delivery'
          ? addressLandmark.trim()
          : `${RESTAURANT_INFO.addressLine1}, ${RESTAURANT_INFO.city}`,
      instructions: instructions.trim(),
      items: [...items],
      subtotal,
      deliveryFee,
      total: totalPayable,
      estimatedTime:
        fulfillmentMode === 'pickup'
          ? ORDER_SETTINGS.pickupPrepTime
          : ORDER_SETTINGS.deliveryEstTime,
      createdAt: new Date().toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    onSetLastOrder(confirmed);
    onClearBag();
    setCopiedWhatsApp(false);
  };

  const handleCopyWhatsApp = async (order: ConfirmedOrder) => {
    const summaryText = formatWhatsAppOrderText(order);
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedWhatsApp(true);
      window.setTimeout(() => setCopiedWhatsApp(false), 3000);
    } catch {
      // Fallback textarea copy
      const el = document.createElement('textarea');
      el.value = summaryText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedWhatsApp(true);
      window.setTimeout(() => setCopiedWhatsApp(false), 3000);
    }
  };

  const showingReceipt = lastOrder !== null && items.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-bag-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        className="fixed inset-0 bg-[#141514]/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-lg h-full bg-[#F8F8F6] border-l border-[#E2E2DE] shadow-xl flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[#E2E2DE] shrink-0">
          <div>
            <p className="text-xs text-[#5A5C59] mb-0.5">
              {RESTAURANT_INFO.name} · {RESTAURANT_INFO.neighborhood}
            </p>
            <h2
              id="order-bag-title"
              className="font-display text-2xl sm:text-3xl font-medium text-[#141514]"
            >
              {showingReceipt ? 'Order Receipt' : 'Order Bag'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order bag"
            className="p-2.5 text-[#5A5C59] hover:text-[#141514] hover:bg-[#EFEFED] rounded-sm transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {showingReceipt && lastOrder ? (
            <div className="space-y-6">
              <div className="p-5 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm">
                <p className="text-xs font-medium text-[#1E3A2F] inline-flex items-center gap-1.5 mb-1.5">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Order #{lastOrder.orderId} Confirmed — Kitchen Preparing</span>
                </p>
                <h3 className="font-display text-2xl font-medium text-[#141514] mb-1">
                  Thank you, {lastOrder.customerName.split(' ')[0]}.
                </h3>
                <p className="text-xs text-[#5A5C59] tabular-nums">
                  Placed at {lastOrder.createdAt} · Estimated{' '}
                  {lastOrder.fulfillmentMode === 'pickup' ? 'pickup' : 'delivery'} in{' '}
                  <span className="font-medium text-[#141514]">{lastOrder.estimatedTime}</span>
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pb-5 border-b border-[#E2E2DE]">
                <div>
                  <dt className="text-xs text-[#5A5C59] mb-0.5">Fulfillment</dt>
                  <dd className="font-medium text-[#141514]">
                    {lastOrder.fulfillmentMode === 'pickup'
                      ? 'Counter Pickup (Near Shiv Mandir)'
                      : 'Local Nai Sarai Delivery'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5A5C59] mb-0.5">Payment</dt>
                  <dd className="font-medium text-[#141514]">
                    {lastOrder.paymentMethod === 'cash' ? 'Cash' : 'UPI'} on{' '}
                    {lastOrder.fulfillmentMode === 'pickup' ? 'Pickup' : 'Delivery'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#5A5C59] mb-0.5">
                    {lastOrder.fulfillmentMode === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
                  </dt>
                  <dd className="text-[#141514]">{lastOrder.addressLandmark}</dd>
                </div>
                {lastOrder.instructions && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#5A5C59] mb-0.5">Kitchen Instructions</dt>
                    <dd className="text-[#141514]">{lastOrder.instructions}</dd>
                  </div>
                )}
              </dl>

              <div>
                <p className="text-xs font-medium text-[#5A5C59] mb-3">Itemized Summary</p>
                <div className="divide-y divide-[#E2E2DE] border-y border-[#E2E2DE]">
                  {lastOrder.items.map((item) => (
                    <div
                      key={item.cartKey}
                      className="py-3 flex items-start justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-medium text-[#141514]">
                          <span className="tabular-nums">{item.quantity} ×</span> {item.name}
                        </p>
                        <p className="text-xs text-[#5A5C59]">
                          {item.variantLabel}
                          {item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                        </p>
                      </div>
                      <span className="font-medium text-[#141514] tabular-nums shrink-0">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-1.5 text-sm tabular-nums">
                  <div className="flex justify-between text-[#5A5C59]">
                    <span>Subtotal</span>
                    <span>₹{lastOrder.subtotal}</span>
                  </div>
                  {lastOrder.fulfillmentMode === 'delivery' && (
                    <div className="flex justify-between text-[#5A5C59]">
                      <span>Local Delivery</span>
                      <span>
                        {lastOrder.deliveryFee === 0 ? 'Free' : `₹${lastOrder.deliveryFee}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-[#141514] pt-2 border-t border-[#E2E2DE]">
                    <span>Total Payable</span>
                    <span>₹{lastOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp(lastOrder)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 cursor-pointer"
                >
                  {copiedWhatsApp ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>Order Copied for WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>Copy Order for WhatsApp</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onSetLastOrder(null)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#141514] border border-[#E2E2DE] hover:bg-[#EFEFED] rounded-sm transition-colors duration-150 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>New Order</span>
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center space-y-6">
              <div className="mx-auto w-12 h-12 rounded-sm bg-[#EFEFED] border border-[#E2E2DE] flex items-center justify-center text-[#5A5C59]">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-[#141514] mb-1.5">
                  Your order bag is empty
                </h3>
                <p className="text-sm text-[#5A5C59] max-w-xs mx-auto">
                  Add charcoal Afghani Chaap, Tandoori Momos, value combos, or cold coffee for quick
                  counter pickup or Nai Sarai delivery.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E2E2DE] text-left">
                <p className="text-xs font-medium text-[#5A5C59] mb-3">
                  Popular Quick Additions
                </p>
                <div className="divide-y divide-[#E2E2DE] border-y border-[#E2E2DE]">
                  {quickSuggestions.map((dish) => (
                    <div
                      key={dish.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#141514]">{dish.name}</p>
                        <p className="text-xs text-[#5A5C59] tabular-nums">
                          ₹{dish.variants?.[0]?.price ?? dish.price} ·{' '}
                          {dish.variants?.[0]?.label ?? dish.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddQuickItem(dish)}
                        className="px-3.5 py-1.5 text-xs font-medium text-[#141514] bg-[#EFEFED] hover:bg-[#1E3A2F] hover:text-[#F8F8F6] border border-[#E2E2DE] rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Fulfillment Mode Selector */}
              <div>
                <span className="block text-xs font-medium text-[#5A5C59] mb-2">
                  Order Type
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm">
                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('pickup')}
                    className={`px-3 py-2 text-xs font-medium rounded-sm transition-colors duration-150 cursor-pointer ${
                      fulfillmentMode === 'pickup'
                        ? 'bg-[#F8F8F6] text-[#141514] shadow-xs'
                        : 'text-[#5A5C59] hover:text-[#141514]'
                    }`}
                  >
                    Counter Pickup ({ORDER_SETTINGS.pickupPrepTime})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('delivery')}
                    className={`px-3 py-2 text-xs font-medium rounded-sm transition-colors duration-150 cursor-pointer ${
                      fulfillmentMode === 'delivery'
                        ? 'bg-[#F8F8F6] text-[#141514] shadow-xs'
                        : 'text-[#5A5C59] hover:text-[#141514]'
                    }`}
                  >
                    Local Delivery ({ORDER_SETTINGS.deliveryEstTime})
                  </button>
                </div>
              </div>

              {/* Free Local Delivery Meter */}
              {fulfillmentMode === 'delivery' && (
                <div className="p-3.5 bg-[#EFEFED] border border-[#E2E2DE] rounded-sm">
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">
                    <span className="font-medium text-[#141514]">
                      {isFreeDelivery
                        ? 'Free local delivery unlocked'
                        : `Add ₹${remainingForFreeDelivery} more for free Nai Sarai delivery`}
                    </span>
                    <span className="text-[#5A5C59] tabular-nums">
                      ₹{Math.min(subtotal, ORDER_SETTINGS.freeDeliveryThreshold)} / ₹
                      {ORDER_SETTINGS.freeDeliveryThreshold}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#E2E2DE] rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-[#1E3A2F] transition-all duration-200"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((subtotal / ORDER_SETTINGS.freeDeliveryThreshold) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Bag Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#5A5C59]">
                    Selected Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
                  </span>
                  <button
                    type="button"
                    onClick={onClearBag}
                    className="text-xs text-[#5A5C59] hover:text-[#141514] underline underline-offset-2 cursor-pointer"
                  >
                    Clear bag
                  </button>
                </div>

                <div className="divide-y divide-[#E2E2DE] border-y border-[#E2E2DE]">
                  {items.map((item) => (
                    <div key={item.cartKey} className="py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#141514] leading-snug">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#5A5C59] mt-0.5">
                          {item.variantLabel}
                          {item.spiceLevel ? ` · ${item.spiceLevel}` : ''}
                        </p>
                        <p className="text-xs font-medium text-[#141514] tabular-nums mt-1.5">
                          ₹{item.unitPrice * item.quantity}
                          {item.quantity > 1 && (
                            <span className="text-[#5A5C59] font-normal">
                              {' '}
                              (₹{item.unitPrice} each)
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center border border-[#E2E2DE] bg-[#F8F8F6] rounded-sm">
                          <button
                            type="button"
                            onClick={() => onDecrement(item.cartKey)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="p-2 text-[#141514] hover:bg-[#EFEFED] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium text-[#141514] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onIncrement(item.cartKey)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="p-2 text-[#141514] hover:bg-[#EFEFED] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(item.cartKey)}
                          aria-label={`Remove ${item.name}`}
                          className="p-2 text-[#5A5C59] hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Details Form */}
              <form id="order-checkout-form" onSubmit={handleSubmitOrder} noValidate className="space-y-4">
                <p className="text-xs font-medium text-[#5A5C59]">
                  {fulfillmentMode === 'pickup'
                    ? 'Pickup Contact Details'
                    : 'Nai Sarai Delivery Details'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="order-name" className="block text-xs text-[#5A5C59] mb-1">
                      Your Name
                    </label>
                    <input
                      id="order-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Rohan Verma"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName)
                          setErrors((prev) => ({ ...prev, customerName: '' }));
                      }}
                      className="w-full px-3 py-2 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-700">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="order-phone" className="block text-xs text-[#5A5C59] mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="order-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98110 42190"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className="w-full px-3 py-2 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm tabular-nums placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                  </div>
                </div>

                {fulfillmentMode === 'delivery' && (
                  <div>
                    <label htmlFor="order-address" className="block text-xs text-[#5A5C59] mb-1">
                      House / Lane &amp; Landmark (Nai Sarai, New Delhi)
                    </label>
                    <input
                      id="order-address"
                      type="text"
                      placeholder="House 14, Main Market Road, Near Shiv Mandir, Nai Sarai"
                      value={addressLandmark}
                      onChange={(e) => {
                        setAddressLandmark(e.target.value);
                        if (errors.addressLandmark)
                          setErrors((prev) => ({ ...prev, addressLandmark: '' }));
                      }}
                      className="w-full px-3 py-2 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
                    />
                    {errors.addressLandmark && (
                      <p className="mt-1 text-xs text-red-700">{errors.addressLandmark}</p>
                    )}
                  </div>
                )}

                <div>
                  <span className="block text-xs text-[#5A5C59] mb-1.5">
                    Payment on {fulfillmentMode === 'pickup' ? 'Pickup' : 'Delivery'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`px-3 py-2 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-[#1E3A2F] text-[#F8F8F6] border-[#1E3A2F]'
                          : 'bg-[#F8F8F6] text-[#141514] border-[#E2E2DE] hover:border-[#141514]/40'
                      }`}
                    >
                      UPI / QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`px-3 py-2 text-xs font-medium rounded-sm border transition-colors cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'bg-[#1E3A2F] text-[#F8F8F6] border-[#1E3A2F]'
                          : 'bg-[#F8F8F6] text-[#141514] border-[#E2E2DE] hover:border-[#141514]/40'
                      }`}
                    >
                      Cash
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="order-notes" className="block text-xs text-[#5A5C59] mb-1">
                    Kitchen Note (Optional)
                  </label>
                  <input
                    id="order-notes"
                    type="text"
                    placeholder="Extra green mint chutney, less onion, cutlery needed..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-[#141514] bg-[#F8F8F6] border border-[#E2E2DE] rounded-sm placeholder:text-[#5A5C59]/60 focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sticky Checkout Footer (when items exist) */}
        {items.length > 0 && (
          <div className="px-6 py-5 bg-[#EFEFED]/75 border-t border-[#E2E2DE] shrink-0 space-y-3">
            <div className="space-y-1 text-sm tabular-nums">
              <div className="flex justify-between text-[#5A5C59]">
                <span>Item Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {fulfillmentMode === 'delivery' && (
                <div className="flex justify-between text-[#5A5C59]">
                  <span>Local Delivery (Free over ₹{ORDER_SETTINGS.freeDeliveryThreshold})</span>
                  <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-[#141514] pt-2 border-t border-[#E2E2DE]">
                <span>Total Payable</span>
                <span>₹{totalPayable}</span>
              </div>
            </div>

            <button
              type="submit"
              form="order-checkout-form"
              className="w-full py-3 px-5 text-sm font-medium text-[#F8F8F6] bg-[#1E3A2F] hover:bg-[#152921] rounded-sm transition-colors duration-150 tabular-nums cursor-pointer"
            >
              {fulfillmentMode === 'pickup'
                ? `Place Pickup Order · ₹${totalPayable}`
                : `Place Delivery Order · ₹${totalPayable}`}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
