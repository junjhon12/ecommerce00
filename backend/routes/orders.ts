import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken, requireRole } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';

const router = express.Router();

interface OrderItemInput {
    product_id: string;
    quantity: number;
    price_at_time: number;
}

/* 
  feat: implement live Prisma query for customer orders
  Using Prisma's nested create operation was chosen over multiple sequential inserts 
  to optimize database transaction safety, balancing relational data integrity 
  with highly readable asynchronous logic.
*/
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized access" });
            return;
        }

        const { items, total_amount } = req.body as { items: OrderItemInput[], total_amount: number };
        
        const newOrder = await prisma.order.create({
            data: {
                user_id: userId,
                total_amount,
                order_items: {
                    create: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price_at_time: item.price_at_time
                    }))
                }
            },
            include: {
                order_items: true
            }
        });
        
        res.status(201).json(newOrder);
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to process order" });
    }
});

/* 
  feat: implement live Prisma query for administrative order tracking
  Including relational user and item data in the fetch query optimizes the dashboard 
  rendering process, balancing strict type safety with comprehensive data delivery.
*/
router.get('/', authenticateToken, requireRole('ADMIN'), async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                user: { select: { email: true } },
                order_items: { include: { product: true } }
            }
        });
        res.status(200).json(orders);
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

export default router;