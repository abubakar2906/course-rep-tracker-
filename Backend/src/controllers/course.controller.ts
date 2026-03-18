import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;

export const getCourses = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const courses = await prisma.course.findMany({
      where: { userId },
      include: {
        trackers: {
          include: {
            records: {
              select: {
                status: true
              }
            },
            _count: {
              select: { records: true }
            }
          }
        },
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
    const userId = getUserId(req);
    const course = await prisma.course.findFirst({
      where: { id: req.params.id as string, userId },
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
    const userId = getUserId(req);
    const course = await prisma.course.create({
      data: {
        code,
        name,
        semester,
        userId
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
    const userId = getUserId(req);

    const updated = await prisma.course.updateMany({
      where: { id: req.params.id as string, userId },
      data: { code, name, semester }
    });

    if (updated.count === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const course = await prisma.course.findFirst({
      where: { id: req.params.id as string, userId }
    });

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    // Check if course has trackers
    const course = await prisma.course.findFirst({
      where: { id: req.params.id as string, userId },
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

    await prisma.course.deleteMany({
      where: { id: req.params.id as string, userId }
    });

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};