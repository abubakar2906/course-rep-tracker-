import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { createCohort, getMyCohorts, getAllCohorts, linkCourseToCohort, joinCohort } from '../controllers/cohort.controller';

const cohortRouter = Router();

cohortRouter.get('/', authorize, getAllCohorts);
cohortRouter.get('/mine', authorize, getMyCohorts);
cohortRouter.post('/', authorize, createCohort);
cohortRouter.post('/join', authorize, joinCohort);
cohortRouter.post('/:cohortId/courses', authorize, linkCourseToCohort);

export default cohortRouter;
