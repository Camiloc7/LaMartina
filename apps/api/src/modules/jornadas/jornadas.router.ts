import { Router } from 'express';
import {
  iniciarJornada,
  finalizarJornada,
  agregarEvidencias,
  getMisJornadas,
  getById,
  getAll,
  programarJornada,
} from './jornadas.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uploadJornadaEvidencia, handleMulterError } from '../../middleware/upload';

export const jornadasRouter: Router = Router();

jornadasRouter.use(authenticate);

jornadasRouter.get('/', authorize('ADMIN', 'SUPER_ADMIN'), getAll);
jornadasRouter.post('/', authorize('OPERARIO'), iniciarJornada);
jornadasRouter.post('/programar', authorize('ADMIN', 'SUPER_ADMIN'), programarJornada);
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
