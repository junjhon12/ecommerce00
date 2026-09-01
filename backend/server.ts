import express from 'express';
import type { Application } from 'express';
import productRoutes from './routes/product.js';
import chatRoutes from './routes/chat.js';

const app: Application = express();
app.use(express.json());

/* 
  feat: mount product CRUD routes
  Isolating routes into dedicated modules was chosen over a monolithic server file to 
  prevent merge conflicts and optimize route parsing, balancing structure with readability[cite: 8].
*/
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});