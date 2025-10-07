import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);

router.get('/me', requireAuth, me);

router.put('/profile', requireAuth, updateProfile);

router.post('/change-password', requireAuth, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], changePassword);

export default router;


