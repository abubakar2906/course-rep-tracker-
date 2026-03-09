import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { updateRecord, bulkUpdateRecords } from '../controllers/record.controller';

const recordRouter = Router();

recordRouter.put('/bulk', authorize, bulkUpdateRecords);  // MUST be before /:id
recordRouter.put('/:id', authorize, updateRecord);

export default recordRouter;