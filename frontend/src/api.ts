import type { Product, Order } from './types';
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
  feat: implement strictly typed registration request
  Delegating the registration network call to the API service was chosen over inline 
  component fetching to optimize code reusability and separation of concerns, balancing 
  clean architecture with readable network logic.
*/
export const registerUser = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Registration failed');
    }
};

/* 
  feat: implement stripe checkout session request
  Delegating the checkout redirection URL generation to the backend was chosen over 
  client-side Stripe integration to optimize security by keeping API keys hidden, 
  balancing safe transaction handling with readable frontend logic[cite: 16].
*/
export const createCheckoutSession = async (cartItems: CartItem[]): Promise<CheckoutSessionResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
  since the database generates it, optimizing type reuse and balancing strictness with developer readability[cite: 16].
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

/* 
  feat: implement strictly typed login request
  Delegating credential validation to a dedicated API utility was chosen over inline 
  component fetching to optimize code reusability, balancing clean architecture 
  with readable network logic[cite: 16].
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

export interface OrderItemInput {
    product_id: string;
    quantity: number;
    price_at_time: number;
}

export interface OrderPayload {
    items: OrderItemInput[];
    total_amount: number;
}

/* 
  feat: implement secure order creation API request
  Posting the order to the database before initializing the Stripe session ensures 
  the transaction intent is securely captured, balancing strict data tracking with 
  a seamless checkout flow.
*/
export const createOrder = async (orderPayload: OrderPayload): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
        throw new Error('Failed to create order record');
    }
};

/* 
  feat: implement strictly typed API request for administrative order tracking
  Including the JWT token in the Authorization header ensures the RBAC middleware 
  authenticates the request before querying the database, balancing security with frontend data access.
*/
export const fetchOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

export interface ChatResponse {
    reply: string;
}

export const fetchRecommendation = async (query: string): Promise<ChatResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch AI response');
    }
    return response.json();
};