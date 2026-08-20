import { Router } from 'express';
import {
  getAllProgramaciones,
  getProgramacionById,
  iniciar,
  completar,
} from './servicios.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uuidParamValidation, validate } from '../../middleware/validation';

export const serviciosRouter: Router = Router();

serviciosRouter.use(authenticate);

// Programaciones
serviciosRouter.get('/programaciones', authorize('SUPER_ADMIN', 'ADMIN', 'OPERARIO'), getAllProgramaciones);
serviciosRouter.get('/programaciones/:id', authorize('SUPER_ADMIN', 'ADMIN', 'OPERARIO'), ...validate(uuidParamValidation()), getProgramacionById);

// Iniciar orden de trabajo desde una programación
serviciosRouter.post(
  '/programaciones/:id/iniciar',
  authorize('SUPER_ADMIN', 'ADMIN', 'OPERARIO'),
  ...validate(uuidParamValidation()),
  iniciar
);

// Completar orden de trabajo (acá :id es el de la OrdenTrabajo, no el de la Programacion)
serviciosRouter.post(
  '/orden-trabajo/:id/completar',
  authorize('SUPER_ADMIN', 'ADMIN', 'OPERARIO'),
  ...validate(uuidParamValidation()),
  completar
);
