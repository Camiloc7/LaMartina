import { Router } from 'express';
import {
  crearPQR,
  agregarAdjuntos,
  getMisPQR,
  getAll,
  responder,
} from './pqr.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uploadPQRAdjunto, handleMulterError } from '../../middleware/upload';

export const pqrRouter: Router = Router();

pqrRouter.use(authenticate);

pqrRouter.post('/', crearPQR);
pqrRouter.get('/mis-pqr', getMisPQR);
pqrRouter.get('/', authorize('ADMIN', 'SUPER_ADMIN'), getAll);
pqrRouter.patch('/:id/responder', authorize('ADMIN', 'SUPER_ADMIN'), responder);

// Ruta para adjuntar imágenes o PDFs a una PQR a través de Cloudinary
pqrRouter.post(
  '/:id/adjuntos',
  uploadPQRAdjunto,
  handleMulterError,
  agregarAdjuntos
);
