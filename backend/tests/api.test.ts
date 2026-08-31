import request from 'supertest';
import express from 'express';
import type { Application } from 'express';
import authRoutes from '../routes/auth';
import productRoutes from '../routes/product';
import prisma from '../db';

// Mock the Prisma client to prevent live database mutations during testing
jest.mock('../db', () => ({
    __esModule: true,
    default: {
        user: { findUnique: jest.fn(), create: jest.fn() },
        product: { findMany: jest.fn(), create: jest.fn() }
    }
}));

const app: Application = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

/* 
  test: verify authentication and product routes
  Supertest paired with Jest mock functions was chosen to optimize test execution speed 
  by bypassing actual network and database latency, balancing robust endpoint validation 
  with highly readable unit test structures.
*/
describe('Backend API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 for invalid login credentials', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'fake@test.com', password: 'wrong' });
            
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should fetch the product catalog successfully', async () => {
        const mockProducts = [
            { id: '1', name: 'Test Item', price: 9.99, stock_quantity: 5 }
        ];
        (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
        
        const response = await request(app).get('/api/products');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
    });
});