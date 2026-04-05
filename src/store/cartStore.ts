"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBrowserClient } from "@/lib/supabase/browser";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  printType: "RESIN" | "FDM" | "MULTICOLOUR";
  selectedOptions?: Record<string, string>;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  /** Sync cart to/from Supabase for logged-in users */
  syncToDb: (userId: string) => Promise<void>;
  loadFromDb: (userId: string) => Promise<void>;
  mergeAndSync: (userId: string) => Promise<void>;
}

let _syncTimer: ReturnType<typeof setTimeout> | null = null;

function debouncedSync(userId: string, items: CartItem[]) {
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    try {
      const supabase = getBrowserClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("carts") as any).upsert(
        { user_id: userId, cart_json: items, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    } catch (err) {
      console.error("[Cart] DB sync error:", err);
    }
  }, 800);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item) => {
        set((state) => {
          const optKey = JSON.stringify(item.selectedOptions ?? {});
          const existing = state.items.find(
            (i) => i.id === item.id && JSON.stringify(i.selectedOptions ?? {}) === optKey
          );
          const newItems = existing
            ? state.items.map((i) =>
                i.id === item.id && JSON.stringify(i.selectedOptions ?? {}) === optKey
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            : [...state.items, { ...item, quantity: 1 }];
          return { items: newItems };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      syncToDb: async (userId: string) => {
        debouncedSync(userId, get().items);
      },

      loadFromDb: async (userId: string) => {
        try {
          const supabase = getBrowserClient();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data } = await (supabase.from("carts") as any)
            .select("cart_json")
            .eq("user_id", userId)
            .maybeSingle();
          if (data?.cart_json && Array.isArray(data.cart_json)) {
            set({ items: data.cart_json as CartItem[] });
          }
        } catch (err) {
          console.error("[Cart] loadFromDb error:", err);
        }
      },

      mergeAndSync: async (userId: string) => {
        try {
          const supabase = getBrowserClient();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data } = await (supabase.from("carts") as any)
            .select("cart_json")
            .eq("user_id", userId)
            .maybeSingle();

          const remoteItems: CartItem[] = Array.isArray(data?.cart_json)
            ? (data.cart_json as CartItem[])
            : [];

          const localItems = get().items;

          // Merge: local items take precedence for quantity; add remote-only items
          const merged = [...localItems];
          for (const remoteItem of remoteItems) {
            if (!merged.find((i) => i.id === remoteItem.id)) {
              merged.push(remoteItem);
            }
          }

          set({ items: merged });
          debouncedSync(userId, merged);
        } catch (err) {
          console.error("[Cart] mergeAndSync error:", err);
        }
      },
    }),
    {
      name: "yarik-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
