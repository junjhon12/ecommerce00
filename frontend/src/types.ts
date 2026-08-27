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