import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { getTrackers, getTracker, createTracker, updateTracker, deleteTracker } from '../controllers/tracker.controller';

const trackerRouter = Router();

trackerRouter.get('/', authorize, getTrackers);
trackerRouter.get('/:id', authorize, getTracker);
trackerRouter.post('/', authorize, createTracker);
trackerRouter.put('/:id', authorize, updateTracker);
trackerRouter.delete('/:id', authorize, deleteTracker);

export default trackerRouter;