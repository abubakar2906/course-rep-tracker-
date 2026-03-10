import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const token = generateToken(user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        about: true,
        department: true,
        role: true,
        office: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: fullUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};