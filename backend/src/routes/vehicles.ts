import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { createVehicle, listVehicles, getVehicle, generateReport, listReports, getReport } from '../controllers/vehiclesController.js';

const router = Router();

router.use(requireAuth);
router.post('/', createVehicle);
router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/:id/report', generateReport);

export const reportsRouter = Router();
reportsRouter.use(requireAuth);
reportsRouter.get('/', listReports);
reportsRouter.get('/:id', getReport);

export default router;
