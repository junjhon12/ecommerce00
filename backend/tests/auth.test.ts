import request from 'supertest';
import express, { Application } from 'express';
import authRoutes from '../routes/auth';

const app: Application = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

/* 
  test: verify login route rejects missing credentials
  Supertest was chosen here to simulate HTTP requests directly against the Express app 
  without requiring a live server port, optimizing test execution speed and balancing 
  integration coverage with readability.
*/
describe('Auth Routes', () => {
    it('should return 500 when authentication fails', async () => {
        const response = await request(app).post('/api/auth/login').send({});
        expect(response.status).toBe(500);
    });
});