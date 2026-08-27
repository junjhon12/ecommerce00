import express, { Application } from 'express';
import productRoutes from './routes/products';
import paymentRoutes from './routes/payments';

const app: Application = express();

app.use(express.json());

/* 
  feat: mount product CRUD routes
  Isolating routes into dedicated modules was chosen over a monolithic server file to 
  prevent merge conflicts and optimize route parsing, balancing structure with readability.
*/
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});