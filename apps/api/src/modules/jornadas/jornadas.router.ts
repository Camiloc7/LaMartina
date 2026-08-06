import { Router } from 'express';
import {
  iniciarJornada,
  finalizarJornada,
  agregarEvidencias,
  getMisJornadas,
  getById,
} from './jornadas.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uploadJornadaEvidencia, handleMulterError } from '../../middleware/upload';

export const jornadasRouter: Router = Router();

jornadasRouter.use(authenticate);

jornadasRouter.post('/', authorize('OPERARIO'), iniciarJornada);
jornadasRouter.get('/mis-jornadas', getMisJornadas);
jornadasRouter.get('/:id', getById);
jornadasRouter.patch('/:id/finalizar', finalizarJornada);

// Ruta para subir evidencias fotográficas de la jornada a Cloudinary
jornadasRouter.post(
  '/:id/evidencias',
  authorize('OPERARIO'),
  uploadJornadaEvidencia,
  handleMulterError,
  agregarEvidencias
);
