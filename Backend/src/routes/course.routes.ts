import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse, findCourseByCode, createCourseUpdate } from '../controllers/course.controller';

const courseRouter = Router();

courseRouter.get('/', authorize, getCourses);
courseRouter.get('/search/:code', authorize, findCourseByCode);
courseRouter.get('/:id', authorize, getCourse);
courseRouter.post('/', authorize, createCourse);
courseRouter.post('/:id/updates', authorize, createCourseUpdate);
courseRouter.put('/:id', authorize, updateCourse);
courseRouter.delete('/:id', authorize, deleteCourse);

export default courseRouter;