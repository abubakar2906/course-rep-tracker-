// TODO:

// 1. getTrackers - get all trackers for the logged in user
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;

export const getTrackers = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const trackers = await prisma.tracker.findMany({
            where: { userId }
        });
        res.json({ success: true, data: trackers });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 2. getTracker - get a single tracker by id (include its records and students)
export const getTracker = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const tracker = await prisma.tracker.findFirst({
            where: { id: req.params.id as string, userId },
            include: {
                records: {
                    include: { student: true }  // Include student details in each record
                }
            }
        });
        if (!tracker) {
            return res.status(404).json({ success: false, error: 'Tracker not found' });
        }
        res.json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}
// 3. createTracker - create a new tracker WITH records for each student
export const createTracker = async (req: Request, res: Response) => {
    try {
        const { name, type, courseId, studentIds } = req.body;
        const userId = getUserId(req);

        // Ensure course belongs to the current user
        const course = await prisma.course.findFirst({
            where: { id: courseId as string, userId }
        });

        if (!course) {
            return res.status(400).json({ success: false, error: 'Invalid course' });
        }

        // Ensure all students belong to the current user
        const students = await prisma.student.findMany({
            where: { id: { in: (studentIds || []) as string[] }, userId },
            select: { id: true }
        });

        const allowedStudentIds = new Set(students.map(s => s.id));
        const filteredStudentIds = ((studentIds || []) as string[]).filter(id => allowedStudentIds.has(id));

        const tracker = await prisma.tracker.create({
            data: {
                name,
                type,
                courseId,  // NEW: Required field
                userId,
                records: {
                    create: filteredStudentIds.map((studentId: string) => ({
                        studentId,
                        status: 'PENDING'
                    }))
                }
            },
            include: { records: true }
        });
        res.status(201).json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}
// 4. updateTracker - update a tracker name/type
export const updateTracker = async (req: Request, res: Response) => {
    try {
        const { name, type } = req.body;
        const userId = getUserId(req);

        const updated = await prisma.tracker.updateMany({
            where: { id: req.params.id as string, userId },
            data: { name, type }
        });

        if (updated.count === 0) {
            return res.status(404).json({ success: false, error: 'Tracker not found' });
        }

        const tracker = await prisma.tracker.findFirst({
            where: { id: req.params.id as string, userId }
        });

        res.json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}
// 5. deleteTracker - delete a tracker
export const deleteTracker = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const deleted = await prisma.tracker.deleteMany({
            where: { id: req.params.id as string, userId }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ success: false, error: 'Tracker not found' });
        }

        res.json({ success: true, message: 'Tracker deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}