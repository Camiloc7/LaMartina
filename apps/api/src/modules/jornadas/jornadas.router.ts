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
import { jornadaFinishValidation, jornadaStartValidation, uuidParamValidation, validate } from '../../middleware/validation';

export const jornadasRouter: Router = Router();

jornadasRouter.use(authenticate);

jornadasRouter.get('/', authorize('ADMIN', 'SUPER_ADMIN'), getAll);
jornadasRouter.post('/', authorize('OPERARIO'), ...validate(jornadaStartValidation), iniciarJornada);
jornadasRouter.post('/programar', authorize('ADMIN', 'SUPER_ADMIN'), programarJornada);
jornadasRouter.get('/mis-jornadas', authorize('OPERARIO'), getMisJornadas);
jornadasRouter.get('/:id', authorize('OPERARIO', 'ADMIN', 'SUPER_ADMIN'), ...validate(uuidParamValidation()), getById);
jornadasRouter.patch('/:id/finalizar', authorize('OPERARIO'), ...validate(jornadaFinishValidation), finalizarJornada);

// Ruta para subir evidencias fotográficas de la jornada a Cloudinary
jornadasRouter.post(
  '/:id/evidencias',
  authorize('OPERARIO'),
  ...validate(uuidParamValidation()),
  uploadJornadaEvidencia,
  handleMulterError,
  agregarEvidencias
);
