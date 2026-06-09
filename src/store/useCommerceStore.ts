"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";
import type { Product } from "@/types";

type CartLine = {
  product: Product;
  quantity: number;
};

type CommerceState = {
  cart: CartLine[];
  wishlist: Product[];
  compare: Product[];
  quickView: Product | null;
  isCartDrawerOpen: boolean;
  toast: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  toggleWishlist: (product: Product) => void;
  toggleCompare: (product: Product) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  dismissToast: () => void;
};

const addProductToCart = (cart: CartLine[], product: Product, quantity = 1) => {
  const amount = Math.max(1, quantity);
  const existing = cart.find((line) => line.product.id === product.id);

  if (existing) {
    return cart.map((line) =>
      line.product.id === product.id ? { ...line, quantity: line.quantity + amount } : line
    );
  }

  return [...cart, { product, quantity: amount }];
};

const electronicsProductIds = new Set(products.map((product) => product.id));
const isElectronicsProduct = (product: Product) => electronicsProductIds.has(product.id);
const sanitizeCart = (cart: CartLine[]) => cart.filter((line) => isElectronicsProduct(line.product));
const sanitizeProducts = (items: Product[]) => items.filter(isElectronicsProduct);

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      compare: [],
      quickView: null,
      isCartDrawerOpen: false,
      toast: null,
      addToCart: (product, quantity = 1) =>
        set((state) => ({
          cart: addProductToCart(state.cart, product, quantity),
          isCartDrawerOpen: true,
          toast: `${product.name} added to cart`
        })),
      addItem: (product, quantity = 1) =>
        set((state) => ({
          cart: addProductToCart(state.cart, product, quantity),
          isCartDrawerOpen: true,
          toast: `${product.name} added to cart`
        })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((line) => line.product.id !== id) })),
      removeItem: (id) => set((state) => ({ cart: state.cart.filter((line) => line.product.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((line) => line.product.id !== id) };
          }

          return {
            cart: state.cart.map((line) => (line.product.id === id ? { ...line, quantity } : line))
          };
        }),
      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((line) => (line.product.id === id ? { ...line, quantity: line.quantity + 1 } : line))
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((line) => (line.product.id === id ? { ...line, quantity: line.quantity - 1 } : line))
            .filter((line) => line.quantity > 0)
        })),
      toggleWishlist: (product) =>
        set((state) => ({
          wishlist: state.wishlist.some((item) => item.id === product.id)
            ? state.wishlist.filter((item) => item.id !== product.id)
            : [...state.wishlist, product],
          toast: state.wishlist.some((item) => item.id === product.id)
            ? `${product.name} removed from wishlist`
            : `${product.name} added to wishlist`
        })),
      toggleCompare: (product) =>
        set((state) => ({
          compare: state.compare.some((item) => item.id === product.id)
            ? state.compare.filter((item) => item.id !== product.id)
            : [...state.compare.slice(-3), product],
          toast: state.compare.some((item) => item.id === product.id)
            ? `${product.name} removed from compare`
            : `${product.name} added to compare`
        })),
      openQuickView: (product) => set({ quickView: product }),
      closeQuickView: () => set({ quickView: null }),
      clearCart: () => set({ cart: [] }),
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
      dismissToast: () => set({ toast: null })
    }),
    {
      name: "amarbazar-commerce",
      partialize: (state) => ({
        cart: sanitizeCart(state.cart),
        wishlist: sanitizeProducts(state.wishlist),
        compare: sanitizeProducts(state.compare)
      }),
      merge: (persisted, current) => {
        const state = persisted as Partial<CommerceState>;
        return {
          ...current,
          ...state,
          cart: sanitizeCart(state.cart ?? []),
          wishlist: sanitizeProducts(state.wishlist ?? []),
          compare: sanitizeProducts(state.compare ?? []).slice(-4),
          quickView: null,
          isCartDrawerOpen: false,
          toast: null
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.cart = sanitizeCart(state.cart);
        state.wishlist = sanitizeProducts(state.wishlist);
        state.compare = sanitizeProducts(state.compare).slice(-4);
      }
    }
  )
);
