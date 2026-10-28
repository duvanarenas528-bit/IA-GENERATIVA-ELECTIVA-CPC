import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middlewares/auth.js';
import { adminOverview } from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/overview', adminOverview);

export default router;
