import { useEffect, useState } from 'react';
import { fetchProducts, createCheckoutSession } from '../api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function StoreFront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { cart, addToCart, cartTotal } = useCart();

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

  /* 
    feat: handle stripe checkout redirection
    Using window.location.href for external routing was chosen over React Router to 
    optimize the handoff to Stripe's hosted PCI-compliant payment page, balancing 
    security compliance with straightforward navigation logic.
  */
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
        const { url } = await createCheckoutSession(cart);
        window.location.href = url;
    } catch (error: unknown) {
        console.error("Checkout failed:", error);
    }
  };

  return (
    <main>
      <header>
        <h1>Storefront Catalog</h1>
        <nav>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)}) - ${cartTotal.toFixed(2)}
            <button onClick={handleCheckout} disabled={cart.length === 0}>
                Checkout with Stripe
            </button>
        </nav>
      </header>
      
      {loading ? (
        <p>Loading catalog...</p>
      ) : (
        <section className="product-grid">
          {products.map((product) => (
            <article key={product.id}>
              <h2>{product.name}</h2>
              <p>${product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}