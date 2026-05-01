import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;
const getParamId = (req: Request) => req.params.id as string;

export const getCourses = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const user = req.user as any;
    let courses;

    if (user.role === 'lecturer') {
      courses = await prisma.course.findMany({
        where: { lecturerId: userId },
        include: {
          cohorts: {
            include: {
              courseRep: { select: { name: true, email: true } },
              _count: { select: { students: true } }
            }
          },
          updates: { orderBy: { createdAt: 'desc' }, take: 3 },
          _count: { select: { trackers: true } }
        }
      });
    } else if (user.role === 'course_rep') {
      courses = await prisma.course.findMany({
        where: { cohorts: { some: { courseRepId: userId } } },
        include: {
          lecturer: { select: { name: true, email: true } },
          updates: { orderBy: { createdAt: 'desc' }, take: 3 },
          _count: { select: { trackers: true } }
        }
      });
    } else {
      // Students — use their joinedCohortId
      const fullUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!fullUser?.joinedCohortId) return res.json({ success: true, data: [] });
      const cohort = await prisma.cohort.findUnique({
        where: { id: fullUser.joinedCohortId },
        include: {
          courses: {
            include: {
              lecturer: { select: { name: true } },
              updates: { orderBy: { createdAt: 'desc' }, take: 3 }
            }
          }
        }
      });
      courses = cohort?.courses ?? [];
    }

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req);
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lecturer: { select: { name: true, email: true } },
        cohorts: {
          include: {
            courseRep: { select: { name: true, email: true } },
            students: true,
            _count: { select: { students: true } }
          }
        },
        trackers: {
          include: { 
            records: { select: { status: true } },
            _count: { select: { records: true } } 
          },
          orderBy: { date: 'desc' }
        },
        updates: {
          include: { author: { select: { name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: { select: { trackers: true } }
      }
    });

    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { code, name, semester } = req.body;
    const userId = getUserId(req);
    const user = req.user as any;
    
    if (user.role !== 'lecturer') {
      return res.status(403).json({ success: false, error: 'Only lecturers can create courses' });
    }

    const existing = await prisma.course.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'A course with this code already exists.' });
    }
    const course = await prisma.course.create({
      data: { code, name, semester, lecturerId: userId }
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const findCourseByCode = async (req: Request, res: Response) => {
  try {
    const code = req.params.code as string;
    const course = await prisma.course.findUnique({
      where: { code },
      include: { lecturer: { select: { name: true, email: true } } }
    });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { code, name, semester } = req.body;
    const userId = getUserId(req);
    const user = req.user as any;
    
    if (user.role !== 'lecturer') {
      return res.status(403).json({ success: false, error: 'Only lecturers can update courses' });
    }

    const id = getParamId(req);
    const course = await prisma.course.findFirst({ where: { id, lecturerId: userId } });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found or unauthorized' });
    const updated = await prisma.course.update({ where: { id }, data: { code, name, semester } });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const user = req.user as any;
    
    if (user.role !== 'lecturer') {
      return res.status(403).json({ success: false, error: 'Only lecturers can delete courses' });
    }

    const id = getParamId(req);
    const course = await prisma.course.findFirst({ where: { id, lecturerId: userId } });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found or unauthorized' });
    await prisma.course.delete({ where: { id } });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createCourseUpdate = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const courseId = getParamId(req);
    const userId = getUserId(req);
    const update = await prisma.courseUpdate.create({
      data: { content, courseId, authorId: userId },
      include: { author: { select: { name: true, role: true } } }
    });
    res.status(201).json({ success: true, data: update });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};