import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { fetchProducts, createProduct, fetchOrders } from '../api';
import type { Product, Order } from '../types';

export default function Dashboard() {
  // Product State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  
  // Order State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  
  // Form State
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);

  const loadCatalog = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error: unknown) {
      console.error("Error loading inventory:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error: unknown) {
      console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCatalog();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, []);

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        await createProduct({ name, price, stock_quantity: stockQuantity });
        setName('');
        setPrice(0);
        setStockQuantity(0);
        await loadCatalog();
    } catch (error: unknown) {
        console.error("Failed to add product:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <header className="mb-8 bg-white p-6 shadow-sm rounded-xl border border-gray-100 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1.5 rounded-full">Inventory & Orders</span>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <section className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Product Name" 
                  required 
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(Number(e.target.value))} 
                  placeholder="Price" 
                  step="0.01"
                  required 
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input 
                  type="number" 
                  value={stockQuantity} 
                  onChange={(e) => setStockQuantity(Number(e.target.value))} 
                  placeholder="Stock Quantity" 
                  required 
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                  type="submit"
                  className="bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm mt-2"
              >
                  Create Product
              </button>
          </form>
        </section>

        <section className="bg-white shadow-sm rounded-xl border border-gray-100 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Current Catalog</h2>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500 animate-pulse font-medium">Loading inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">${Number(product.price).toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.stock_quantity} in stock
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* 
        feat: implement administrative order table
        A native HTML table structure styled with Tailwind CSS was chosen over a CSS grid for 
        tabular data to optimize screen reader accessibility, balancing semantic correctness 
        with readable styling logic[cite: 1].
      */}
      <section className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Incoming Orders</h2>
        </div>
        
        {ordersLoading ? (
          <div className="flex justify-center items-center h-48">
              <p className="text-gray-500 animate-pulse font-medium">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                  {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">{order.id.slice(0, 8)}...</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.user?.email || 'Unknown User'}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                              <span className="bg-yellow-100 text-yellow-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                  {order.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-bold">${Number(order.total_amount).toFixed(2)}</td>
                      </tr>
                  ))}
                  {orders.length === 0 && (
                      <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                      </tr>
                  )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}