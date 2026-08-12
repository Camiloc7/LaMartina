import { Router } from 'express';
import {
  getAllProgramaciones,
  getProgramacionById,
  iniciar,
  completar,
} from './servicios.controller';
import { authenticate, authorize } from '../../middleware/authenticate';

export const serviciosRouter: Router = Router();

serviciosRouter.use(authenticate);

// Programaciones
serviciosRouter.get('/programaciones', getAllProgramaciones);
serviciosRouter.get('/programaciones/:id', getProgramacionById);

// Iniciar orden de trabajo desde una programación
serviciosRouter.post(
  '/programaciones/:id/iniciar',
  authorize('SUPER_ADMIN', 'ADMIN', 'OPERARIO'),
  iniciar
);

// Completar orden de trabajo (acá :id es el de la OrdenTrabajo, no el de la Programacion)
serviciosRouter.post(
  '/orden-trabajo/:id/completar',
  authorize('SUPER_ADMIN', 'ADMIN', 'OPERARIO'),
  completar
);
