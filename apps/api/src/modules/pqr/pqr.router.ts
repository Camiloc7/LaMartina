import { Router } from 'express';
import {
  crearPQR,
  crearPQRPublica,
  agregarAdjuntos,
  getMisPQR,
  getAll,
  responder,
  getAsignadas,
  asignarOperario,
  actualizarEstado
} from './pqr.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uploadPQRAdjunto, handleMulterError } from '../../middleware/upload';

export const pqrRouter: Router = Router();

// Ruta pública para crear PQR desde el Portal QR
pqrRouter.post('/public', crearPQRPublica);

pqrRouter.use(authenticate);

pqrRouter.post('/', crearPQR);
pqrRouter.get('/mis-pqr', getMisPQR);
pqrRouter.get('/', authorize('ADMIN', 'SUPER_ADMIN', 'OPERARIO'), getAll);

// Operario routes
pqrRouter.get('/asignadas', authorize('OPERARIO'), getAsignadas);
pqrRouter.patch('/:id/asignar', authorize('OPERARIO'), asignarOperario);
pqrRouter.patch('/:id/estado', authorize('OPERARIO', 'ADMIN', 'SUPER_ADMIN'), actualizarEstado);

pqrRouter.patch('/:id/responder', authorize('ADMIN', 'SUPER_ADMIN'), responder);

// Ruta para adjuntar imágenes o PDFs a una PQR a través de Cloudinary
pqrRouter.post(
  '/:id/adjuntos',
  uploadPQRAdjunto,
  handleMulterError,
  agregarAdjuntos
);
