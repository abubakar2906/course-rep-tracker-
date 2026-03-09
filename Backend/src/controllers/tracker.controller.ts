// TODO:

// 1. getTrackers - get all trackers for the logged in user
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getTrackers = async (req: Request, res: Response) => {
    try {
        const trackers = await prisma.tracker.findMany({
            where: { userId: (req.user as any).id }
        });
        res.json({ success: true, data: trackers });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 2. getTracker - get a single tracker by id (include its records and students)
export const getTracker = async (req: Request, res: Response) => {
    try {
        const tracker = await prisma.tracker.findUnique({
            where: { id: req.params.id as string },
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
        const tracker = await prisma.tracker.create({
            data: {
                name,
                type,
                courseId,  // NEW: Required field
                userId: (req.user as any).id,
                records: {
                    create: studentIds.map((studentId: string) => ({
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
        const tracker = await prisma.tracker.update({
            where: { id: req.params.id as string },
            data: { name, type }
        });
        res.json({ success: true, data: tracker });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}
// 5. deleteTracker - delete a tracker
export const deleteTracker = async (req: Request, res: Response) => {
    try {
        await prisma.tracker.delete({
            where: { id: req.params.id as string }
        });
        res.json({ success: true, message: 'Tracker deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}