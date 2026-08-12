import { Router } from 'express';
import { crear, getAll, getById, authQr } from './propiedades.controller';
import { authenticate, authorize } from '../../middleware/authenticate';

export const propiedadesRouter: Router = Router();

// Endpoint público para escanear QR e ingresar PIN
propiedadesRouter.post('/qr-auth', authQr);

propiedadesRouter.use(authenticate);

// Listar propiedades (accesible por ADMIN, SUPER_ADMIN y el dueño si se filtran las suyas, lo cual debe validarse en controller o policy)
propiedadesRouter.get('/', getAll);

// Obtener por ID
propiedadesRouter.get('/:id', getById);

// Crear propiedad (solo ADMIN / SUPER_ADMIN)
propiedadesRouter.post('/', authorize('SUPER_ADMIN', 'ADMIN'), crear);
