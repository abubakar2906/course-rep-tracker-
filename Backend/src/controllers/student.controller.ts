// TODO:
// 1. getStudents - get all students for the logged in user
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            where: { userId: (req.user as any).id }
        });
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 2. getStudent - get a single student by id
export const getStudent = async (req: Request, res: Response) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: req.params.id as string, userId: (req.user as any).id }
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
        const student = await prisma.student.create({
            data: {
                fullName,
                matricNumber,
                level,
                gender,
                userId: (req.user as any).id
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
        const student = await prisma.student.update({
            where: { id: req.params.id as string, userId: (req.user as any).id },
            data: {
                fullName,
                matricNumber,
                level,
                gender
            }
        });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

// 5. deleteStudent - delete a student
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const student = await prisma.student.delete({
           where: { id: req.params.id as string, userId: (req.user as any).id }
        });
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
}