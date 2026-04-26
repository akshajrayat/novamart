import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import type { Order, CreateOrderData } from '../types/order';

export const ordersApi = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    // Get current cart
    const cartSnap = await getDoc(doc(db, 'carts', user.uid));
    const cart = cartSnap.exists() ? cartSnap.data() : { items: [], total: 0 };

    const subtotal = cart.total || 0;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const total = parseFloat((subtotal + tax + shippingCost).toFixed(2));

    const order: Omit<Order, 'id'> = {
      orderNumber: `NM-${Date.now().toString(36).toUpperCase()}`,
      status: 'PENDING',
      items: (cart.items || []).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
        image: item.product.images?.[0],
      })),
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: user.uid,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      },
    };

    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      userId: user.uid,
    });

    return { ...order, id: docRef.id };
  },

  getUserOrders: async (page = 1, pageLimit = 10) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);

    return {
      orders,
      pagination: {
        page,
        limit: pageLimit,
        total: orders.length,
        totalPages: 1,
      },
    };
  },

  getOrderById: async (id: string): Promise<Order> => {
    const orderSnap = await getDoc(doc(db, 'orders', id));
    if (!orderSnap.exists()) throw new Error('Order not found');
    return { id: orderSnap.id, ...orderSnap.data() } as Order;
  },
};
