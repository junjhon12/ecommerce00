/* 
  feat: establish frontend data interfaces
  Centralizing interfaces in a dedicated file was chosen to optimize type reuse 
  across multiple components, balancing strict architecture with developer readability.
*/
export interface Product {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
}

export interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price_at_time: number;
    product?: Product;
}

export interface Order {
    id: string;
    user_id: string;
    status: string;
    total_amount: number;
    created_at: string;
    user?: { email: string };
    order_items: OrderItem[];
}