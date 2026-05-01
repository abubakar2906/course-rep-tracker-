import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;

export const createCohort = async (req: Request, res: Response) => {
  try {
    const { faculty, department, program, level } = req.body;
    const userId = getUserId(req);

    // Check if cohort exists
    let cohort = await prisma.cohort.findUnique({
      where: {
        program_level_department: {
          program,
          level,
          department
        }
      }
    });

    if (cohort) {
      return res.status(400).json({ success: false, error: 'Cohort already exists for this program and level' });
    }

    cohort = await prisma.cohort.create({
      data: {
        faculty,
        department,
        program,
        level,
        courseRepId: userId
      }
    });

    res.status(201).json({ success: true, data: cohort });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getMyCohorts = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    
    // Fetch cohorts managed by this rep
    const cohorts = await prisma.cohort.findMany({
      where: { courseRepId: userId },
      include: {
        courses: true,
        _count: {
          select: { students: true }
        }
      }
    });

    res.json({ success: true, data: cohorts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getAllCohorts = async (req: Request, res: Response) => {
  try {
    const cohorts = await prisma.cohort.findMany({
      include: {
        courseRep: { select: { name: true, email: true } },
        _count: { select: { students: true, courses: true, viewers: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: cohorts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const joinCohort = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { cohortId } = req.body;

    if (!cohortId) return res.status(400).json({ success: false, error: 'cohortId is required' });

    const cohort = await prisma.cohort.findUnique({ where: { id: cohortId } });
    if (!cohort) return res.status(404).json({ success: false, error: 'Cohort not found' });

    // Update the user's joinedCohortId
    await prisma.user.update({
      where: { id: userId },
      data: { joinedCohortId: cohortId }
    });

    res.json({ success: true, message: 'Joined cohort successfully', data: cohort });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const linkCourseToCohort = async (req: Request, res: Response) => {
  try {
    const cohortId = req.params.cohortId as string;
    const { courseId } = req.body;
    const userId = getUserId(req);

    // Verify cohort belongs to the course rep
    const cohort = await prisma.cohort.findFirst({
      where: { id: cohortId, courseRepId: userId }
    });

    if (!cohort) {
      return res.status(403).json({ success: false, error: 'Not authorized to manage this cohort' });
    }

    const updated = await prisma.cohort.update({
      where: { id: cohortId as string },
      data: {
        courses: { connect: { id: courseId } }
      },
      include: { courses: true }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
