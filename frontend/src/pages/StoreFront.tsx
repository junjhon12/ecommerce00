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
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 shadow-sm rounded-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">Storefront Catalog</h1>
        <nav className="flex items-center gap-6">
            <span className="text-lg font-medium text-gray-700">
                Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)}) - <span className="text-green-600">${cartTotal.toFixed(2)}</span>
            </span>
            <button 
                onClick={handleCheckout} 
                disabled={cart.length === 0}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold shadow-sm"
            >
                Checkout with Stripe
            </button>
        </nav>
      </header>

      <section className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 shadow-sm rounded-xl border border-gray-100">
        <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input 
            type="number" 
            placeholder="Max Price" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
            step="0.01"
            className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </section>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500 animate-pulse">Loading catalog...</p>
        </div>
      ) : (
        /* 
          feat: implement responsive grid for product catalog
          CSS Grid via Tailwind utility classes was chosen over Flexbox here to optimize 
          two-dimensional layout control, balancing strict structural alignment across varying 
          screen sizes with highly readable markup inline.
        */
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-2xl font-black text-gray-900 mb-6">${product.price.toFixed(2)}</p>
                </div>
                <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    Add to Cart
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products match your filters.</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}