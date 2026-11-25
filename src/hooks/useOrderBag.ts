import { useCallback, useEffect, useMemo, useState } from 'react';
import { MenuItem, SpiceLevel } from '../data/restaurant';

export interface OrderBagItem {
  cartKey: string;
  itemId: string;
  name: string;
  variantLabel: string;
  spiceLevel?: SpiceLevel;
  unitPrice: number;
  quantity: number;
}

export type FulfillmentMode = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'upi';

export interface ConfirmedOrder {
  orderId: string;
  fulfillmentMode: FulfillmentMode;
  paymentMethod: PaymentMethod;
  customerName: string;
  phone: string;
  addressLandmark: string;
  instructions: string;
  items: OrderBagItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedTime: string;
  createdAt: string;
}

const BAG_STORAGE_KEY = 'delhi_bites_order_bag_v1';
const LAST_ORDER_STORAGE_KEY = 'delhi_bites_last_order_v1';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or sandbox restrictions gracefully
  }
}

export function buildCartKey(
  itemId: string,
  variantLabel: string,
  spiceLevel?: SpiceLevel
): string {
  return `${itemId}__${variantLabel}__${spiceLevel ?? 'none'}`;
}

export function useOrderBag() {
  const [items, setItems] = useState<OrderBagItem[]>(() =>
    readStorage<OrderBagItem[]>(BAG_STORAGE_KEY, [])
  );
  const [lastOrder, setLastOrderState] = useState<ConfirmedOrder | null>(() =>
    readStorage<ConfirmedOrder | null>(LAST_ORDER_STORAGE_KEY, null)
  );

  useEffect(() => {
    writeStorage(BAG_STORAGE_KEY, items);
  }, [items]);

  const setLastOrder = useCallback((order: ConfirmedOrder | null) => {
    setLastOrderState(order);
    writeStorage(LAST_ORDER_STORAGE_KEY, order);
  }, []);

  const addItem = useCallback(
    (
      dish: MenuItem,
      options?: { variantLabel?: string; unitPrice?: number; spiceLevel?: SpiceLevel }
    ) => {
      const defaultVariant = dish.variants?.[0];
      const variantLabel = options?.variantLabel ?? defaultVariant?.label ?? dish.unit ?? 'Standard';
      const unitPrice = options?.unitPrice ?? defaultVariant?.price ?? dish.price;
      const spiceLevel = dish.supportsSpice ? (options?.spiceLevel ?? 'Medium') : undefined;
      const cartKey = buildCartKey(dish.id, variantLabel, spiceLevel);

      setItems((prev) => {
        const existing = prev.find((entry) => entry.cartKey === cartKey);
        if (existing) {
          return prev.map((entry) =>
            entry.cartKey === cartKey
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          );
        }
        return [
          ...prev,
          {
            cartKey,
            itemId: dish.id,
            name: dish.name,
            variantLabel,
            spiceLevel,
            unitPrice,
            quantity: 1,
          },
        ];
      });
    },
    []
  );

  const incrementItem = useCallback((cartKey: string) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.cartKey === cartKey ? { ...entry, quantity: entry.quantity + 1 } : entry
      )
    );
  }, []);

  const decrementItem = useCallback((cartKey: string) => {
    setItems((prev) =>
      prev
        .map((entry) =>
          entry.cartKey === cartKey ? { ...entry, quantity: entry.quantity - 1 } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((entry) => entry.cartKey !== cartKey));
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, entry) => sum + entry.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0),
    [items]
  );

  return {
    items,
    totalItems,
    subtotal,
    lastOrder,
    setLastOrder,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearBag,
  };
}
