import { Router } from 'express';
import { login, logout, register, getMe } from './auth.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { loginRateLimit, registrationRateLimit } from '../../middleware/rateLimit';
import { loginValidation, registerValidation, validate } from '../../middleware/validation';

export const authRouter: Router = Router();

authRouter.post('/login', loginRateLimit, ...validate(loginValidation), login);
authRouter.post('/logout', authenticate, logout);
authRouter.post('/register', registrationRateLimit, ...validate(registerValidation), register);
authRouter.post('/register/staff', authenticate, authorize('SUPER_ADMIN'), ...validate(registerValidation), register);
authRouter.get('/me', authenticate, getMe);
