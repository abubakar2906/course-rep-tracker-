import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
      secure: true,
      sameSite: 'lax', // Now works!
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
        faculty: true,
        department: true,
        role: true,
        office: true,
        matricNumber: true,
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

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'pending'
      }
    });

    const token = generateToken(user.id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { faculty, department, role, phone, matricNumber } = req.body;
    const user = req.user as any;

    const updateData: any = { role };
    if (faculty) updateData.faculty = faculty;
    if (department) updateData.department = department;
    if (phone) updateData.phone = phone;
    if (matricNumber) updateData.matricNumber = matricNumber;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    // If the user is registering as a student and provided a matricNumber, link their account
    if (role === 'student' && matricNumber) {
      const studentRecord = await prisma.student.findUnique({ where: { matricNumber } });
      if (studentRecord && !studentRecord.userId) {
        await prisma.student.update({
          where: { matricNumber },
          data: { userId: user.id }
        });
      }
    }

    res.json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error: any) {
    if (error.code === 'P2002') {
       return res.status(400).json({ success: false, error: 'Phone number or Matric number already in use' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};