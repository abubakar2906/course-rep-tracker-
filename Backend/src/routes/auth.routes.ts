import { Router } from 'express';
import passport from '../lib/passport';
import { googleCallback, getMe, logout } from '../controllers/auth.controller';
import { authorize } from '../middlewares/auth.middleware';

const authRouter = Router();

// Redirect to Google login page
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// Google callback
authRouter.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

// Get current user
authRouter.get('/me', authorize, getMe);

// Logout
authRouter.post('/logout', authorize, logout);

export default authRouter;