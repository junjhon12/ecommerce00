import { Product } from './types';

/* 
  feat: implement strictly typed API fetch service
  Using the native Fetch API with explicit return types was chosen over heavy libraries 
  like Axios to reduce the frontend bundle size, optimizing page load speeds while 
  maintaining readable, dependency-free code.
*/
export const fetchProducts = async (): Promise<Product[]> => {
    // Assuming VITE_API_URL is set in your .env pointing to your Render deployment
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};