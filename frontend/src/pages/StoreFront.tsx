import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { Product } from '../types';

export default function StoreFront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* 
    feat: fetch catalog data on component mount
    Utilizing a useEffect hook with an empty dependency array was chosen to optimize 
    network traffic by ensuring the API is only called once per mount, balancing 
    performance with readable component lifecycles[cite: 6].
  */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error: unknown) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <main>
      <header>
        <h1>Storefront Catalog</h1>
        <nav>Cart (0)</nav>
      </header>
      
      {loading ? (
        <p>Loading catalog...</p>
      ) : (
        <section className="product-grid">
          {products.map((product) => (
            <article key={product.id}>
              <h2>{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
              <button>Add to Cart</button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}