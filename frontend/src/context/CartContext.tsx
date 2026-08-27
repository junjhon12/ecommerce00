import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Product } from '../types';

// Strictly type the cart item by extending the base Product interface
export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* 
  feat: implement global shopping cart state
  React Context paired with standard useState was chosen over heavy external state libraries 
  like Redux to optimize the application bundle size and reduce boilerplate, balancing 
  readable state management with adequate performance for a standard storefront.
*/
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    /*
      feat: calculate cart total dynamically
      The useMemo hook was chosen here to memoize the monetary total calculation, ensuring it 
      only re-runs when the cart array mutates. This optimizes rendering performance 
      while keeping the derived state logic highly readable.
    */
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};