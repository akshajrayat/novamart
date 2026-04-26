import { create } from 'zustand';
import type { Cart } from '../types/cart';
import { cartApi } from '../api/cart.api';

// ─── Demo cart items for presentation without backend ────────────────
const DEMO_CART: Cart = {
  id: 'demo-cart',
  userId: 'demo',
  items: [
    {
      id: 'ci1',
      productId: 'p1',
      quantity: 1,
      product: {
        id: 'p1',
        name: 'Wireless Noise-Cancelling Headphones',
        slug: 'wireless-noise-cancelling-headphones',
        price: 299.99,
        comparePrice: 349.99,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        stock: 45,
        active: true,
      },
    },
    {
      id: 'ci2',
      productId: 'p6',
      quantity: 2,
      product: {
        id: 'p6',
        name: 'Running Sneakers Air',
        slug: 'running-sneakers-air',
        price: 139.99,
        comparePrice: 169.99,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        stock: 80,
        active: true,
      },
    },
    {
      id: 'ci3',
      productId: 'p8',
      quantity: 1,
      product: {
        id: 'p8',
        name: 'The Art of Design Thinking',
        slug: 'the-art-of-design-thinking',
        price: 24.99,
        comparePrice: 32.99,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
        stock: 300,
        active: true,
      },
    },
  ],
  total: 604.96,
  itemCount: 4,
};

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, productInfo?: { name: string; slug: string; price: number; comparePrice?: number; images: string[]; stock: number }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

function recalculate(cart: Cart): Cart {
  let total = 0;
  let itemCount = 0;
  for (const item of cart.items) {
    total += Number(item.product.price) * item.quantity;
    itemCount += item.quantity;
  }
  return { ...cart, total: parseFloat(total.toFixed(2)), itemCount };
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: DEMO_CART,
  isOpen: false,
  isLoading: false,
  isDemoMode: true,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartApi.getCart();
      set({ cart, isLoading: false, isDemoMode: false });
    } catch {
      // Keep demo cart if backend unavailable
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1, productInfo?) => {
    const state = get();
    if (state.isDemoMode && state.cart) {
      // Demo mode — add locally
      const existingItem = state.cart.items.find(item => item.productId === productId);
      let updatedItems;
      if (existingItem) {
        // Already in cart — increment quantity
        updatedItems = state.cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else if (productInfo) {
        // New item — add to cart
        const newItem = {
          id: `ci-${Date.now()}`,
          productId,
          quantity,
          product: {
            id: productId,
            name: productInfo.name,
            slug: productInfo.slug,
            price: productInfo.price,
            comparePrice: productInfo.comparePrice,
            images: productInfo.images,
            stock: productInfo.stock,
            active: true,
          },
        };
        updatedItems = [...state.cart.items, newItem];
      } else {
        set({ isOpen: true });
        return;
      }
      const updatedCart = recalculate({ ...state.cart, items: updatedItems });
      set({ cart: updatedCart, isOpen: true });
      return;
    }
    set({ isLoading: true });
    try {
      const cart = await cartApi.addItem(productId, quantity);
      set({ cart, isLoading: false, isOpen: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateItem: async (itemId, quantity) => {
    const state = get();
    if (state.isDemoMode && state.cart) {
      // Demo mode — update locally
      const updatedItems = state.cart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const updatedCart = recalculate({ ...state.cart, items: updatedItems });
      set({ cart: updatedCart });
      return;
    }
    try {
      const cart = await cartApi.updateItem(itemId, quantity);
      set({ cart });
    } catch (error) {
      throw error;
    }
  },

  removeItem: async (itemId) => {
    const state = get();
    if (state.isDemoMode && state.cart) {
      // Demo mode — remove locally
      const updatedItems = state.cart.items.filter(item => item.id !== itemId);
      const updatedCart = recalculate({ ...state.cart, items: updatedItems });
      set({ cart: updatedCart });
      return;
    }
    try {
      const cart = await cartApi.removeItem(itemId);
      set({ cart });
    } catch (error) {
      throw error;
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  clearCart: () => set({ cart: null }),
}));
