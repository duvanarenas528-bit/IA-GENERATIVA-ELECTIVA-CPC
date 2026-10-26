import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import {
  createVehicle,
  listVehicles,
  getVehicle,
  generateReport,
  listReports,
  getReport,
  createPreperitaje,
  listPreperitajes,
  getPreperitaje,
  updatePreperitaje,
  dashboardStats,
} from '../controllers/vehiclesController.js';

const router = Router();

router.use(requireAuth);
router.get('/stats', dashboardStats);
router.post('/preperitajes', createPreperitaje);
router.get('/preperitajes', listPreperitajes);
router.get('/preperitajes/:id', getPreperitaje);
router.put('/preperitajes/:id', updatePreperitaje);
router.patch('/preperitajes/:id', updatePreperitaje);

router.post('/', createVehicle);
router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/:id/report', generateReport);

export const reportsRouter = Router();
reportsRouter.use(requireAuth);
reportsRouter.get('/', listReports);
reportsRouter.get('/:id', getReport);

export default router;
