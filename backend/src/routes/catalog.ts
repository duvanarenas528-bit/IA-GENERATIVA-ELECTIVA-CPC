import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { catalogMakes, catalogModels, catalogYears } from '../controllers/catalogController.js';

const router = Router();

router.use(requireAuth);
router.get('/makes', catalogMakes);
router.get('/models', catalogModels);
router.get('/years', catalogYears);

export default router;
