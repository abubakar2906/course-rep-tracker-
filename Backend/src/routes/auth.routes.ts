import { Router } from 'express';
import passport from 'passport';
import { googleCallback, exchangeCode, getMe, logout } from '../controllers/auth.controller';
import { authorize } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL + '/login' }), googleCallback);
authRouter.post('/exchange', exchangeCode); // NEW
authRouter.get('/me', authorize, getMe);
authRouter.post('/logout', logout);

export default authRouter;