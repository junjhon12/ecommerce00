import { useEffect, useState, useMemo } from 'react';
import { fetchProducts, createCheckoutSession } from '../api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function StoreFront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { cart, addToCart, cartTotal } = useCart();

  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

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
    feat: implement product catalog filtering
    The useMemo hook was chosen here to compute the filtered product list over inline filtering 
    to optimize rendering performance. It ensures the array is only recalculated when the underlying 
    catalog or filter parameters mutate, balancing UI responsiveness with highly readable derived state.
  */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = maxPrice === '' || product.price <= Number(maxPrice);
      return matchesSearch && matchesPrice;
    });
  }, [products, searchTerm, maxPrice]);

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

      <section className="filters">
        <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input 
            type="number" 
            placeholder="Max Price" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
            step="0.01"
        />
      </section>
      
      {loading ? (
        <p>Loading catalog...</p>
      ) : (
        <section className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article key={product.id}>
                <h2>{product.name}</h2>
                <p>${product.price.toFixed(2)}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </article>
            ))
          ) : (
            <p>No products match your filters.</p>
          )}
        </section>
      )}
    </main>
  );
}