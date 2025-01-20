// src/middleware/authMiddleware.ts
import jwt from 'jsonwebtoken';
import User from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_fallback';

export const authenticate = async (req: any, res: any, next: any) => {
    if (JWT_SECRET == 'secret_key_fallback')
        console.error('No seret key found!!')
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) res.status(401).json({ message: 'Invalid token' });
        next();
    } catch (err) {
        console.error('Authentication Error:', err); // Debugging
        res.status(401).json({ message: 'Unauthorized' });
    }
};
