import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const getUserId = (req: Request) => (req.user as any)?.id as string;

// Update a single record's status
export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const userId = getUserId(req);
    
    const updated = await prisma.trackerRecord.updateMany({
      where: { id: req.params.id as string, tracker: { userId } },
      data: { status, notes }
    });

    if (updated.count === 0) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    const record = await prisma.trackerRecord.findFirst({
      where: { id: req.params.id as string, tracker: { userId } }
    });
    
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Bulk update multiple records at once
export const bulkUpdateRecords = async (req: Request, res: Response) => {
  try {
    const { records } = req.body; // Array of { id, status, notes }
    const userId = getUserId(req);
    
    const updates = await prisma.$transaction(
      (records || []).map((record: any) =>
        prisma.trackerRecord.updateMany({
          where: { id: record.id as string, tracker: { userId } },
          data: { status: record.status, notes: record.notes }
        })
      )
    );
    
    res.json({ success: true, data: updates });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};