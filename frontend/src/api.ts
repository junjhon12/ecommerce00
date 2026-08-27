import { Product } from './types';
import type { CartItem } from './context/CartContext';

export interface CheckoutSessionResponse {
    url: string;
}

/* 
  feat: implement stripe checkout session request
  Delegating the checkout redirection URL generation to the backend was chosen over 
  client-side Stripe integration to optimize security by keeping API keys hidden, 
  balancing safe transaction handling with readable frontend logic.
*/
export const createCheckoutSession = async (cartItems: CartItem[]): Promise<CheckoutSessionResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Assuming a token exists in local storage for authenticated routes
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ items: cartItems }),
    });

    if (!response.ok) {
        throw new Error('Failed to initialize checkout session');
    }
    return response.json();
};