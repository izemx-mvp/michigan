import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { getProductById, type Product } from "@/data/products";

export type CartItem = { productId: string; qty: number };
export type CartLine = CartItem & { product: Product };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  update: (productId: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** Increments on every add — used to trigger the badge bounce. */
  pulse: number;
};

const STORAGE_KEY = "michigan-cart-v1";
const MAX_QTY = 999;

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i): i is CartItem =>
          typeof i === "object" &&
          i !== null &&
          typeof (i as CartItem).productId === "string" &&
          typeof (i as CartItem).qty === "number",
      )
      .filter((i) => getProductById(i.productId))
      .map((i) => ({ productId: i.productId, qty: Math.min(MAX_QTY, Math.max(1, Math.round(i.qty))) }));
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable — cart stays in memory */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const hydrated = useRef(false);

  // Hydrate from storage on the client only.
  useEffect(() => {
    setItems(readStorage());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) writeStorage(items);
  }, [items]);

  const add = useCallback((productId: string, qty = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i,
        );
      }
      return [...prev, { productId, qty: Math.min(MAX_QTY, qty) }];
    });
    setPulse((p) => p + 1);
    toast.success("Ajouté au panier", { description: product.name });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const update = useCallback((productId: string, qty: number) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = [];
    for (const item of items) {
      const product = getProductById(item.productId);
      if (product) lines.push({ ...item, product });
    }
    return {
      items,
      lines,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      add,
      remove,
      update,
      clear,
      isOpen,
      setOpen,
      pulse,
    };
  }, [items, add, remove, update, clear, isOpen, pulse]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
