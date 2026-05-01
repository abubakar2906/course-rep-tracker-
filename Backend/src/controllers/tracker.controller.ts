import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;
const getParamId = (req: Request) => req.params.id as string;

export const getTrackers = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const user = req.user as any;
        let trackers;

        if (user.role === 'lecturer') {
            trackers = await prisma.tracker.findMany({
                where: { course: { lecturerId: userId } },
                include: {
                    course: { select: { code: true, name: true, id: true } },
                    cohort: { select: { program: true, level: true } },
                    records: { select: { status: true } },
                    _count: { select: { records: true } }
                },
                orderBy: { date: 'desc' }
            });
        } else if (user.role === 'course_rep') {
            trackers = await prisma.tracker.findMany({
                where: { cohort: { courseRepId: userId } },
                include: {
                    course: { select: { code: true, name: true, id: true } },
                    cohort: { select: { program: true, level: true } },
                    records: { select: { status: true } },
                    _count: { select: { records: true } }
                },
                orderBy: { date: 'desc' }
            });
        } else {
            // Students — use their joinedCohortId
            const fullUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!fullUser?.joinedCohortId) return res.json({ success: true, data: [] });
            trackers = await prisma.tracker.findMany({
                where: { cohortId: fullUser.joinedCohortId },
                include: {
                    course: { select: { code: true, name: true, id: true } },
                    records: { select: { status: true } },
                    _count: { select: { records: true } }
                },
                orderBy: { date: 'desc' }
            });
        }

        res.json({ success: true, data: trackers });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getTracker = async (req: Request, res: Response) => {
    try {
        const id = getParamId(req);
        const tracker = await prisma.tracker.findUnique({
            where: { id },
            include: {
                records: {
                    include: {
                        student: { select: { id: true, fullName: true, matricNumber: true, gender: true } }
                    }
                },
                course: { select: { code: true, name: true } },
                cohort: { select: { program: true, level: true, department: true } }
            }
        });
        if (!tracker) return res.status(404).json({ success: false, error: 'Tracker not found' });
        res.json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const createTracker = async (req: Request, res: Response) => {
    try {
        const { name, type, courseId, cohortId, date } = req.body;
        const userId = getUserId(req);
        const cohort = await prisma.cohort.findFirst({
            where: { id: cohortId as string, courseRepId: userId },
            include: { students: { select: { id: true } } }
        });
        if (!cohort) return res.status(403).json({ success: false, error: 'Not authorized for this cohort' });
        const course = await prisma.course.findFirst({
            where: { id: courseId as string, cohorts: { some: { id: cohortId as string } } }
        });
        if (!course) return res.status(400).json({ success: false, error: 'Course not linked to this cohort' });
        const tracker = await prisma.tracker.create({
            data: {
                name,
                type,
                date: date ? new Date(date) : new Date(),
                courseId: courseId as string,
                cohortId: cohortId as string,
                userId,
                records: {
                    create: cohort.students.map(s => ({
                        studentId: s.id,
                        status: 'PENDING' as const
                    }))
                }
            },
            include: {
                records: { include: { student: true } },
                course: { select: { code: true, name: true } }
            }
        });
        res.status(201).json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const updateTracker = async (req: Request, res: Response) => {
    try {
        const { name, type } = req.body;
        const userId = getUserId(req);
        const id = getParamId(req);
        const existing = await prisma.tracker.findFirst({ where: { id, userId } });
        if (!existing) return res.status(404).json({ success: false, error: 'Tracker not found' });
        const tracker = await prisma.tracker.update({ where: { id }, data: { name, type } });
        res.json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const deleteTracker = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const id = getParamId(req);
        const existing = await prisma.tracker.findFirst({ where: { id, userId } });
        if (!existing) return res.status(404).json({ success: false, error: 'Tracker not found' });
        await prisma.tracker.delete({ where: { id } });
        res.json({ success: true, message: 'Tracker deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};