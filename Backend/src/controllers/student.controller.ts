import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;
const getParamId = (req: Request) => req.params.id as string;

export const getStudents = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const students = await prisma.student.findMany({
            where: { cohort: { courseRepId: userId } },
            include: {
                cohort: { select: { program: true, level: true, department: true } }
            }
        });
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getStudent = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const id = getParamId(req);
        const student = await prisma.student.findFirst({
            where: { id, cohort: { courseRepId: userId } },
            include: {
                cohort: true,
                records: { include: { tracker: { include: { course: true } } } }
            }
        });
        if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const createStudent = async (req: Request, res: Response) => {
    try {
        const { fullName, matricNumber, gender, cohortId } = req.body;
        const userId = getUserId(req);
        const cohort = await prisma.cohort.findFirst({
            where: { id: cohortId as string, courseRepId: userId }
        });
        if (!cohort) return res.status(403).json({ success: false, error: 'Not authorized to add students to this cohort' });
        // Find if a user already registered with this matric number
        const existingUser = await prisma.user.findUnique({ where: { matricNumber } });
        
        const student = await prisma.student.create({
            data: { 
                fullName, 
                matricNumber, 
                gender, 
                cohortId: cohortId as string,
                userId: existingUser ? existingUser.id : undefined
            }
        });
        res.json({ success: true, data: student });
    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ success: false, error: 'Matric number already exists' });
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { fullName, matricNumber, gender } = req.body;
        const userId = getUserId(req);
        const id = getParamId(req);
        const existing = await prisma.student.findFirst({
            where: { id, cohort: { courseRepId: userId } }
        });
        if (!existing) return res.status(404).json({ success: false, error: 'Student not found' });
        const student = await prisma.student.update({
            where: { id },
            data: { fullName, matricNumber, gender }
        });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const id = getParamId(req);
        const existing = await prisma.student.findFirst({
            where: { id, cohort: { courseRepId: userId } }
        });
        if (!existing) return res.status(404).json({ success: false, error: 'Student not found' });
        await prisma.student.delete({ where: { id } });
        res.json({ success: true, message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const getMyDashboardData = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;

        const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!fullUser?.joinedCohortId) {
            return res.json({ success: true, data: null });
        }

        const cohort = await prisma.cohort.findUnique({
            where: { id: fullUser.joinedCohortId },
            include: {
                courses: {
                    include: {
                        lecturer: { select: { name: true } },
                        updates: { orderBy: { createdAt: 'desc' }, take: 5 },
                        trackers: {
                            include: {
                                records: { select: { status: true } }
                            },
                            orderBy: { date: 'desc' }
                        }
                    }
                },
                courseRep: { select: { name: true, email: true } }
            }
        });

        res.json({ success: true, data: cohort });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};