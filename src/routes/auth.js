import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema } from '../utils/validators.js';
import { createAdmin, login, me } from '../controllers/authController.js';

const router = Router();

router.post(
    '/login',
    (req, res, next) => {
      console.log('🔥 LOGIN ROUTE HIT');
      console.log('BODY:', req.body);
      next();
    },
    loginLimiter,
    (req, res, next) => {
      console.log('🔥 LOGIN LIMITER PASSED');
      next();
    },
    validate(loginSchema),
    (req, res, next) => {
      console.log('🔥 VALIDATION PASSED');
      next();
    },
    asyncHandler(login)
  );
router.get('/me', requireAdmin, me);


router.post(
    '/create-admin',
    asyncHandler(createAdmin)
  );

export default router;
