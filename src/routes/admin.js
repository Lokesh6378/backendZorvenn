import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { leadUpdateSchema } from '../utils/validators.js';
import {
  getStats, listLeads, getLead, updateLead, deleteLead, listSubscribers, deleteSubscriber,
} from '../controllers/adminController.js';

const router = Router();
router.use(requireAdmin);

router.get('/stats', asyncHandler(getStats));
router.get('/leads', asyncHandler(listLeads));
router.get('/leads/:id', asyncHandler(getLead));
router.patch('/leads/:id', validate(leadUpdateSchema), asyncHandler(updateLead));
router.delete('/leads/:id', asyncHandler(deleteLead));
router.get('/subscribers', asyncHandler(listSubscribers));
router.delete('/subscribers/:id', asyncHandler(deleteSubscriber));

export default router;
