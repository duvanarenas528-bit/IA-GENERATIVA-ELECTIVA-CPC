import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getProfileStats } from '../controllers/usersController.js';

const router = Router();

router.use(requireAuth);
router.get('/me/stats', getProfileStats);

export default router;
