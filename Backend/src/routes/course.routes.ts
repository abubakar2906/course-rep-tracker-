import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/course.controller';

const courseRouter = Router();

courseRouter.get('/', authorize, getCourses);
courseRouter.get('/:id', authorize, getCourse);
courseRouter.post('/', authorize, createCourse);
courseRouter.put('/:id', authorize, updateCourse);
courseRouter.delete('/:id', authorize, deleteCourse);

export default courseRouter;