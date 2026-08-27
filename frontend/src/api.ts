import { Product } from './types';
import type { CartItem } from './context/CartContext';

export interface CheckoutSessionResponse {
    url: string;
}
export interface AuthResponse {
    token: string;
}

/* 
  feat: implement strictly typed API fetch service
  Using the native Fetch API with explicit return types was chosen over heavy libraries 
  like Axios to reduce the frontend bundle size, optimizing page load speeds while 
  maintaining readable, dependency-free code.
*/
export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

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

/* 
  feat: implement secure product creation API request
  The Omit utility type was chosen here to exclude the 'id' field from the base Product interface 
  since the database generates it, optimizing type reuse and balancing strictness with developer readability.
*/
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(productData),
    });

    if (!response.ok) {
        throw new Error('Failed to create product');
    }
};

export interface AuthResponse {
    token: string;
}

/* 
  feat: implement strictly typed login request
  Delegating credential validation to a dedicated API utility was chosen over inline 
  component fetching to optimize code reusability, balancing clean architecture 
  with readable network logic.
*/
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    return response.json();
};