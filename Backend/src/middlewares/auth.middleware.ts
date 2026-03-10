import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieToken = req.cookies.token;
    const headerToken = req.headers.authorization?.split(' ')[1];
    const token = cookieToken || headerToken;

    if (!token) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};