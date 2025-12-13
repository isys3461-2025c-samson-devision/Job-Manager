import { Router } from 'express';
import { register, login } from './authController';
import { validateRequest } from '../../../shared/middleware';
import { registerSchema, loginSchema } from './validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;