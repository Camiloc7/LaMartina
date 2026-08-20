import { Router } from 'express';
import { crear, getAll, getById, authQr, crearMasivo, desactivar, getHistorial, update, updateMasivo } from './propiedades.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { qrAuthRateLimit } from '../../middleware/rateLimit';
import { qrAuthValidation, uuidParamValidation, validate } from '../../middleware/validation';

export const propiedadesRouter: Router = Router();

// Endpoint público para escanear QR e ingresar PIN
propiedadesRouter.post('/qr-auth', qrAuthRateLimit, ...validate(qrAuthValidation), authQr);

propiedadesRouter.use(authenticate);

// Rutas de administración
propiedadesRouter.post('/', authorize('SUPER_ADMIN', 'ADMIN'), crear);
propiedadesRouter.post('/bulk', authorize('SUPER_ADMIN', 'ADMIN'), crearMasivo);
propiedadesRouter.patch('/bulk/update', authorize('SUPER_ADMIN', 'ADMIN'), updateMasivo);
propiedadesRouter.get('/', authorize('SUPER_ADMIN', 'ADMIN'), getAll);

// Obtener por ID
propiedadesRouter.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), ...validate(uuidParamValidation()), getById);

// Actualizar
propiedadesRouter.patch('/:id', authorize('SUPER_ADMIN', 'ADMIN'), ...validate(uuidParamValidation()), update);

// Soft Delete
propiedadesRouter.patch('/:id/desactivar', authorize('SUPER_ADMIN', 'ADMIN'), ...validate(uuidParamValidation()), desactivar);

// Historial
propiedadesRouter.get('/:id/historial', authorize('SUPER_ADMIN', 'ADMIN'), ...validate(uuidParamValidation()), getHistorial);
