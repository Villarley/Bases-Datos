import { Router } from 'express';
import { getEmpleados, createEmpleado } from '../controllers/empleado.controller';

const router = Router();

router.get('/', getEmpleados);
router.post('/', createEmpleado);

export default router;
