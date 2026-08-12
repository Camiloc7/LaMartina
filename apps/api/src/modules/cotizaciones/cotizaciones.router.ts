import { Router } from 'express';
import { crear, getAll, getById, aprobarYProgramar } from './cotizaciones.controller';
import { authenticate, authorize } from '../../middleware/authenticate';

export const cotizacionesRouter: Router = Router();

cotizacionesRouter.use(authenticate);

// Listar cotizaciones (accesible por ADMIN, SUPER_ADMIN)
cotizacionesRouter.get('/', authorize('SUPER_ADMIN', 'ADMIN'), getAll);

// Obtener por ID
cotizacionesRouter.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), getById);

// Crear cotizacion (solo SUPER_ADMIN)
cotizacionesRouter.post('/', authorize('SUPER_ADMIN'), crear);

// Aprobar y programar servicio
cotizacionesRouter.post('/:id/aprobar', authorize('SUPER_ADMIN', 'ADMIN'), aprobarYProgramar);
