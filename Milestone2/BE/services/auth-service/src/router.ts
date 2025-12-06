import { Router } from 'express';
import * as authController from './authController';
import { authenticateToken, validateRequest } from '../../../shared/middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './validation';

const router = Router();

router.post('/register', validateRequest(registerSchema),authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh',validateRequest(refreshTokenSchema), authController.refreshToken);
router.post('/logout',validateRequest(refreshTokenSchema), authController.logout);

//token validation endpoint

router.post('/validate', authController.validateToken);

//protected route to get user profile
router.get('/profile',authenticateToken ,authController.getProfile);
router.delete('/profile',authenticateToken, authController.deleteAccount);

export default router;