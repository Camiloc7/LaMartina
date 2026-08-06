import { Router } from 'express';
import { login, register, getMe } from './auth.controller';
import { authenticate } from '../../middleware/authenticate';

export const authRouter: Router = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/me', authenticate, getMe);
