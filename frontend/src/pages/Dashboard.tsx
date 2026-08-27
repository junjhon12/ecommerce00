import { useEffect, useState, FormEvent } from 'react';
import { fetchProducts, createProduct } from '../api';
import type { Product } from '../types';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  /* 
    feat: handle product creation submission
    Controlled React state variables were chosen for form inputs over native FormData references 
    to optimize real-time validation capabilities, balancing robust data entry with readable component flow.
  */
  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        await createProduct({ name, price, stock_quantity: stockQuantity });
        // Reset form and reload table
        setName('');
        setPrice(0);
        setStockQuantity(0);
        await loadCatalog();
    } catch (error: unknown) {
        console.error("Failed to add product:", error);
    }
  };

  return (
    <main>
      <header>
        <h1>Admin Dashboard</h1>
        <nav>Inventory Management</nav>
      </header>
      
      <section className="admin-controls">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct}>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Product Name" 
                required 
            />
            <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Number(e.target.value))} 
                placeholder="Price" 
                step="0.01"
                required 
            />
            <input 
                type="number" 
                value={stockQuantity} 
                onChange={(e) => setStockQuantity(Number(e.target.value))} 
                placeholder="Stock Quantity" 
                required 
            />
            <button type="submit">Create Product</button>
        </form>
      </section>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <section className="inventory-list">
          <h2>Current Catalog</h2>
          <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id.slice(0, 8)}...</td>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock_quantity}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

{/* 
  feat: Dashboard component 
  A functional component was chosen here over a class component to optimize rendering 
  and easily integrate React hooks, balancing readability and performance.
*/}