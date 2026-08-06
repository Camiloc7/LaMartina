import { Router } from 'express';
import {
  getAll,
  getById,
  crear,
  agregarImagenes,
  actualizar,
} from './conjuntos.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uploadConjuntoImagen, handleMulterError } from '../../middleware/upload';

export const conjuntosRouter: Router = Router();

conjuntosRouter.use(authenticate);

conjuntosRouter.get('/', getAll);
conjuntosRouter.get('/:id', getById);
conjuntosRouter.post('/', authorize('SUPER_ADMIN', 'ADMIN'), crear);
conjuntosRouter.patch('/:id', authorize('SUPER_ADMIN', 'ADMIN'), actualizar);

// Ruta para agregar imágenes de instalaciones del conjunto a Cloudinary
conjuntosRouter.post(
  '/:id/imagenes',
  authorize('SUPER_ADMIN', 'ADMIN'),
  uploadConjuntoImagen,
  handleMulterError,
  agregarImagenes
);
