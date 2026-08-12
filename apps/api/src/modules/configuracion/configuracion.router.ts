import { Router } from 'express';
import { obtenerConfiguracion, actualizarConfiguracion } from './configuracion.controller';
import { authenticate, authorize } from '../../middleware/authenticate';

export const configuracionRouter: Router = Router();

// Endpoint público para obtener la configuración (ej. portal de clientes)
configuracionRouter.get('/public', obtenerConfiguracion);

// Endpoints protegidos
configuracionRouter.get('/', authenticate, obtenerConfiguracion);
configuracionRouter.patch('/', authenticate, authorize('SUPER_ADMIN'), actualizarConfiguracion);
