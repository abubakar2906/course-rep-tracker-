import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import passport from './lib/passport';
import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import trackerRouter from './routes/tracker.routes';
import recordRouter from './routes/record.routes';
import courseRouter from './routes/course.routes';

const app = express();

// Middlewares
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const allowedOrigins = (process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim()).filter(Boolean)
  : ['https://course-repp-tracker.vercel.app']
);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(passport.initialize());

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/students', studentRouter);
app.use('/api/trackers', trackerRouter);
app.use('/api/courses', courseRouter);
app.use('/api/records', recordRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Course Rep Tracker API is running!' });
});

export default app;