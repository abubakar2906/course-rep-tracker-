import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const token = generateToken(user.id);
    res.cookie('token', token, cookieOptions());
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
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
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', { 
    path: '/', 
    secure: isProd, 
    sameSite: isProd ? ('none' as const) : ('lax' as const)
  });
  res.json({ success: true, message: 'Logged out successfully' });
};