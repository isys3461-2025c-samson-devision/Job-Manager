import { Router } from 'express';
import * as authController from './authController';
import { validateRequest } from '../../../shared/middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './validation';

const router = Router();

router.post('/register', validateRequest(registerSchema),authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh',validateRequest(refreshTokenSchema), authController.refreshToken);
router.post('/logout',validateRequest(refreshTokenSchema), authController.logout);

//token validation endpoint

router.post('/validate', authController.validateToken);

//protected route to get user profile
router.get('/profile', authController.getProfile);
router.delete('/delete', authController.deleteAccount);

export default router;