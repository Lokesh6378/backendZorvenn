import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { contactSchema, projectInquirySchema, newsletterSchema } from '../utils/validators.js';
import { createContact, createProjectInquiry, subscribe } from '../controllers/publicController.js';

const router = Router();

router.post('/contact', formLimiter, validate(contactSchema), asyncHandler(createContact));
router.post('/project-inquiry', formLimiter, validate(projectInquirySchema), asyncHandler(createProjectInquiry));
router.post('/newsletter', formLimiter, validate(newsletterSchema), asyncHandler(subscribe));

export default router;
