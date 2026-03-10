import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './lib/passport';
import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import trackerRouter from './routes/tracker.routes';
import recordRouter from './routes/record.routes';
import courseRouter from './routes/course.routes';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://course-repp-tracker.vercel.app',
  credentials: true,
}));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/trackers', trackerRouter);
app.use('/api/courses', courseRouter);
app.use('/api/records', recordRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Course Rep Tracker API is running!' });
});

export default app;