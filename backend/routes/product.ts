import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

/* 
  feat: implement Prisma Read operation for product catalog
  Using Prisma's strictly typed client was chosen over raw SQL to optimize 
  end-to-end type safety, balancing data integrity with highly readable asynchronous logic.
*/
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.status(200).json(products);
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to retrieve products" });
    }
});

/* 
  feat: implement Prisma Create operation for administrative inventory
  Protecting this endpoint with RBAC middleware ensures only authorized administrators 
  can mutate the catalog, balancing strict security with readable route definitions.
*/
router.post('/', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, stock_quantity } = req.body;
        const newProduct = await prisma.product.create({
            data: { name, price, stock_quantity }
        });
        res.status(201).json(newProduct);
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to create product" });
    }
});

/* 
  feat: implement Prisma Update operation for existing products
  Utilizing Prisma's built-in where clause was chosen to precisely target specific records 
  by ID, optimizing database performance while keeping update logic readable[cite: 6].
*/
router.put('/:id', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, stock_quantity } = req.body;
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { name, price, stock_quantity }
        });
        res.status(200).json(updatedProduct);
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

/* 
  feat: implement Prisma Delete operation for inventory management
*/
router.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

export default router;