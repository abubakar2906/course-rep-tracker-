import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Update a single record's status
export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    
    const record = await prisma.trackerRecord.update({
      where: { id: req.params.id as string },
      data: { status, notes }
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
    
    const updates = await Promise.all(
      records.map((record: any) =>
        prisma.trackerRecord.update({
          where: { id: record.id },
          data: { status: record.status, notes: record.notes }
        })
      )
    );
    
    res.json({ success: true, data: updates });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};