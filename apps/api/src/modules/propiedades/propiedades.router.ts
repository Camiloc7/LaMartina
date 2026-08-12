import { Router } from 'express';
import { crear, getAll, getById, authQr, crearMasivo, desactivar, getHistorial } from './propiedades.controller';
import { authenticate, authorize } from '../../middleware/authenticate';

export const propiedadesRouter: Router = Router();

// Endpoint público para escanear QR e ingresar PIN
propiedadesRouter.post('/qr-auth', authQr);

propiedadesRouter.use(authenticate);

// Rutas de administración
propiedadesRouter.post('/', authorize('SUPER_ADMIN', 'ADMIN'), crear);
propiedadesRouter.post('/bulk', authorize('SUPER_ADMIN', 'ADMIN'), crearMasivo);
propiedadesRouter.get('/', getAll);

// Obtener por ID
propiedadesRouter.get('/:id', getById);

// Soft Delete
propiedadesRouter.patch('/:id/desactivar', authorize('SUPER_ADMIN', 'ADMIN'), desactivar);

// Historial
propiedadesRouter.get('/:id/historial', getHistorial);
