import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  const payload = verifyAccessToken(token);
  if (!payload) return res.status(401).json({ error: 'No autorizado' });
  req.user = payload;
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso exclusivo para administradores.' });
  }
  next();
};
