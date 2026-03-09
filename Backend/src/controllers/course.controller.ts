import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { userId: (req.user as any).id },
      include: {
        _count: {
          select: { trackers: true }
        }
      }
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id as string },
      include: {
        trackers: {
          include: {
            _count: {
              select: { records: true }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { code, name, semester } = req.body;
    const course = await prisma.course.create({
      data: {
        code,
        name,
        semester,
        userId: (req.user as any).id
      }
    });
    res.status(201).json({ success: true, data: course });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, error: 'Course code already exists' });
    } else {
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { code, name, semester } = req.body;
    const course = await prisma.course.update({
      where: { id: req.params.id as string },
      data: { code, name, semester }
    });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    // Check if course has trackers
    const course = await prisma.course.findUnique({
      where: { id: req.params.id as string },
      include: {
        _count: {
          select: { trackers: true }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    if (course._count.trackers > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete course with ${course._count.trackers} trackers. Delete trackers first.`,
        trackerCount: course._count.trackers
      });
    }

    await prisma.course.delete({
      where: { id: req.params.id as string }
    });

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};