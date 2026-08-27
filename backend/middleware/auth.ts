import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to securely pass the user payload without using 'any'
export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

/* 
  feat: implement JWT authentication middleware
  Extracting the token from the Authorization header using the Bearer schema was chosen 
  over cookie-based extraction to optimize cross-domain API usage and prevent CSRF attacks, 
  balancing security with frontend flexibility.
*/
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Access denied: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
        req.user = decoded;
        next();
    } catch (error: unknown) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

/* 
  feat: implement Role-Based Access Control (RBAC) middleware
  A higher-order function was chosen here to dynamically generate role-checking middleware, 
  optimizing route configuration and reducing code duplication while maintaining readable logic.
*/
export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (req.user?.role !== role) {
            res.status(403).json({ error: "Access denied: Insufficient permissions" });
            return;
        }
        next();
    };
};