import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import type { Cart } from '../types/cart';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const cartRef = doc(db, 'carts', user.uid);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      return cartSnap.data() as Cart;
    }

    // Return empty cart
    const emptyCart: Cart = {
      id: user.uid,
      userId: user.uid,
      items: [],
      total: 0,
      itemCount: 0,
    };
    return emptyCart;
  },

  addItem: async (productId: string, quantity = 1): Promise<Cart> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const cart = await cartApi.getCart();
    const existingIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: `ci-${Date.now()}`,
        productId,
        quantity,
        product: { id: productId, name: '', slug: '', price: 0, images: [], stock: 0, active: true },
      });
    }

    recalculate(cart);
    await setDoc(doc(db, 'carts', user.uid), cart);
    return cart;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const cart = await cartApi.getCart();
    const item = cart.items.find((i) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
    }

    recalculate(cart);
    await setDoc(doc(db, 'carts', user.uid), cart);
    return cart;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const cart = await cartApi.getCart();
    cart.items = cart.items.filter((i) => i.id !== itemId);

    recalculate(cart);
    await setDoc(doc(db, 'carts', user.uid), cart);
    return cart;
  },
};

function recalculate(cart: Cart) {
  let total = 0;
  let itemCount = 0;
  for (const item of cart.items) {
    total += Number(item.product.price) * item.quantity;
    itemCount += item.quantity;
  }
  cart.total = parseFloat(total.toFixed(2));
  cart.itemCount = itemCount;
}
