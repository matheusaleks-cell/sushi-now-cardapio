
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './db';

export type CartItem = Product & {
    quantity: number;
    observation?: string;
};

type CartState = {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, observation?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    updateObservation: (productId: string, observation: string) => void;
    clearCart: () => void;
    total: () => number;
};

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity = 1, observation = '') => set((state) => {
                const existing = state.items.find((i) => i.id === product.id);
                // If existing item has same observation, merge? Or unique line item?
                // Simplest for now: if same ID, just add quantity. Overwrite obs??
                // "Anota Ai" usually separates if observation is different.
                // But our ID is product ID. To separate, we'd need CartItemId.
                // Let's stick to simple: Aggregates by ProductID.
                if (existing) {
                    return {
                        items: state.items.map((i) =>
                            i.id === product.id
                                ? { ...i, quantity: i.quantity + quantity, observation: observation || i.observation }
                                : i
                        ),
                    };
                }
                return { items: [...state.items, { ...product, quantity, observation }] };
            }),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, delta) => set((state) => ({
                items: state.items.map((i) => {
                    if (i.id === id) {
                        const newQty = Math.max(0, i.quantity + delta);
                        return { ...i, quantity: newQty };
                    }
                    return i;
                }).filter(i => i.quantity > 0),
            })),
            updateObservation: (id, obs) => set((state) => ({
                items: state.items.map((i) => i.id === id ? { ...i, observation: obs } : i)
            })),
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            },
        }),
        {
            name: 'sushi-now-cart',
        }
    )
);
