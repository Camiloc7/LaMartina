import { Router } from 'express';
import {
  crearPQR,
  crearPQRPublica,
  registrarWhatsappPublico,
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
import { publicPqrRateLimit, whatsappTraceRateLimit } from '../../middleware/rateLimit';
import { pqrValidation, publicPqrValidation, updatePqrValidation, uuidParamValidation, validate } from '../../middleware/validation';

export const pqrRouter: Router = Router();

// Ruta pública para crear PQR desde el Portal QR
pqrRouter.post('/public', publicPqrRateLimit, ...validate(publicPqrValidation), crearPQRPublica);
pqrRouter.post('/public/:id/whatsapp', whatsappTraceRateLimit, ...validate(uuidParamValidation()), registrarWhatsappPublico);

pqrRouter.use(authenticate);

pqrRouter.post('/', ...validate(pqrValidation), crearPQR);
pqrRouter.get('/mis-pqr', getMisPQR);
pqrRouter.get('/', authorize('ADMIN', 'SUPER_ADMIN', 'OPERARIO'), getAll);

// Operario routes
pqrRouter.get('/asignadas', authorize('OPERARIO'), getAsignadas);
pqrRouter.patch('/:id/asignar', authorize('OPERARIO'), ...validate(uuidParamValidation()), asignarOperario);
pqrRouter.patch('/:id/estado', authorize('OPERARIO', 'ADMIN', 'SUPER_ADMIN'), ...validate(updatePqrValidation), actualizarEstado);

pqrRouter.patch('/:id/responder', authorize('ADMIN', 'SUPER_ADMIN'), ...validate(updatePqrValidation), responder);

// Ruta para adjuntar imágenes o PDFs a una PQR a través de Cloudinary
pqrRouter.post(
  '/:id/adjuntos',
  ...validate(uuidParamValidation()),
  uploadPQRAdjunto,
  handleMulterError,
  agregarAdjuntos
);
