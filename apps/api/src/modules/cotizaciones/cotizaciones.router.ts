import { Router } from 'express';
import { crear, getAll, getById, aprobarYProgramar, registrarPago, getResumenFinanciero, descargarPDF } from './cotizaciones.controller';
import { authenticate, authorize } from '../../middleware/authenticate';

export const cotizacionesRouter: Router = Router();

cotizacionesRouter.use(authenticate);

// Resumen financiero (debe ir antes de /:id para no interferir)
cotizacionesRouter.get('/finanzas/resumen', authorize('SUPER_ADMIN', 'ADMIN'), getResumenFinanciero);

// Listar cotizaciones (accesible por ADMIN, SUPER_ADMIN)
cotizacionesRouter.get('/', authorize('SUPER_ADMIN', 'ADMIN'), getAll);

// Obtener por ID
cotizacionesRouter.get('/:id', authorize('SUPER_ADMIN', 'ADMIN'), getById);

// Descargar PDF
cotizacionesRouter.get('/:id/pdf', authorize('SUPER_ADMIN', 'ADMIN'), descargarPDF);

// Crear cotizacion (solo SUPER_ADMIN)
cotizacionesRouter.post('/', authorize('SUPER_ADMIN'), crear);

// Aprobar y programar servicio
cotizacionesRouter.post('/:id/aprobar', authorize('SUPER_ADMIN', 'ADMIN'), aprobarYProgramar);

// Registrar pago
cotizacionesRouter.post('/:id/pago', authorize('SUPER_ADMIN', 'ADMIN'), registrarPago);
