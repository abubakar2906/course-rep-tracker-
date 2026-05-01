import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getMyDashboardData } from '../controllers/student.controller';

const studentRouter = Router();

studentRouter.get('/', authorize, getStudents);
studentRouter.get('/me/dashboard', authorize, getMyDashboardData);
studentRouter.get('/:id', authorize, getStudent);
studentRouter.post('/', authorize, createStudent);
studentRouter.put('/:id', authorize, updateStudent);
studentRouter.delete('/:id', authorize, deleteStudent);

export default studentRouter;