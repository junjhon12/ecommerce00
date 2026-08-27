import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import './index.css'
import App from './App.tsx'
{/* BrowserRouter was used instead of HashRouter for it's clean URLs and balance between SEO optimization and code readability. */}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CartProvider>
      <App />  
    </CartProvider>
  </BrowserRouter>
);
