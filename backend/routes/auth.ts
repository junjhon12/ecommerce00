import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const router = express.Router();

/* 
  feat: implement live Prisma query for secure user registration
  Hashing passwords with bcrypt before database insertion was chosen to optimize 
  security against data breaches, balancing robust cryptography with readable async logic.
*/
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "Email already in use" });
            return;
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        await prisma.user.create({
            data: { 
                email, 
                password_hash, 
                role: 'ADMIN' // Defaulting to ADMIN for testing dashboard access. Change to 'CUSTOMER' for production.
            }
        });
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: unknown) {
        res.status(500).json({ error: "Registration failed" });
    }
});

/* 
  feat: implement live Prisma query for secure user login
  Delegating the email lookup to Prisma's findUnique method was chosen to optimize 
  database indexing and query speed, balancing performance with strict type safety.
*/
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ token });
    } catch (error: unknown) {
        res.status(500).json({ error: "Authentication failed" });
    }
});

export default router;