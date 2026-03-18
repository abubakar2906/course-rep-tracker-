// TODO:
// 1. getStudents - get all students for the logged in user
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;

export const getStudents = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const students = await prisma.student.findMany({
            where: { userId }
        });
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 2. getStudent - get a single student by id
export const getStudent = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const student = await prisma.student.findFirst({
            where: { id: req.params.id as string, userId }
        });
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 3. createStudent - create a new student
export const createStudent = async (req: Request, res: Response) => {
    try {
        const { fullName, matricNumber, level, gender } = req.body;
        const userId = getUserId(req);
        const student = await prisma.student.create({
            data: {
                fullName,
                matricNumber,
                level,
                gender,
                userId
            }
        });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 4. updateStudent - update a student
export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { fullName, matricNumber, level, gender } = req.body;
        const userId = getUserId(req);

        const updated = await prisma.student.updateMany({
            where: { id: req.params.id as string, userId },
            data: { fullName, matricNumber, level, gender }
        });

        if (updated.count === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        const student = await prisma.student.findFirst({
            where: { id: req.params.id as string, userId }
        });

        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 5. deleteStudent - delete a student
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const deleted = await prisma.student.deleteMany({
            where: { id: req.params.id as string, userId }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.json({ success: true, message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}