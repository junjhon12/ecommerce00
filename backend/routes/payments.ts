import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Initialize Stripe with a strict type assertion for the environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/* 
  feat: implement Stripe checkout session generation
  Offloading payment UI and PCI compliance to Stripe's hosted checkout was chosen 
  over building custom card forms to optimize transaction security, balancing 
  robust real-world functionality with developer readability.
*/
router.post('/create-checkout-session', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { items } = req.body as { items: Array<{ name: string; price: number; quantity: number }> };

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
        });

        res.status(200).json({ url: session.url });
    } catch (error: unknown) {
        res.status(500).json({ error: "Failed to create payment session" });
    }
});

export default router;