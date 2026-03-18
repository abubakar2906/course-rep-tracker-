import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

// Store temporary auth codes (in production, use Redis)
const authCodes = new Map<string, string>();

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    // Generate a temporary auth code
    const authCode = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Store user ID with auth code (expires in 5 minutes)
    authCodes.set(authCode, user.id);
    setTimeout(() => authCodes.delete(authCode), 5 * 60 * 1000);
    
    // Redirect to frontend with auth code
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?code=${authCode}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

// Exchange auth code for session cookie
export const exchangeCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code required' });
    }
    
    const userId = authCodes.get(code);
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Invalid or expired code' });
    }
    
    // Delete code after use (one-time use)
    authCodes.delete(code);
    
    // Generate JWT token
    const token = generateToken(userId);
    
    // Set httpOnly cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ success: true, message: 'Authenticated' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
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
    sameSite: isProd ? 'none' : 'lax'
  });
  res.json({ success: true, message: 'Logged out successfully' });
};