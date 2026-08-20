import { Router } from 'express';
import {
  getAll,
  getById,
  updateProfile,
  updateAvatar,
  deactivate,
} from './users.controller';
import { authenticate, authorize, authorizeSelfOrRoles } from '../../middleware/authenticate';
import { uuidParamValidation, validate } from '../../middleware/validation';
import { uploadProfilePicture, handleMulterError } from '../../middleware/upload';

export const usersRouter: Router = Router();

usersRouter.use(authenticate);

usersRouter.get('/', authorize('SUPER_ADMIN', 'ADMIN'), getAll);
usersRouter.get('/:id', ...validate(uuidParamValidation()), authorizeSelfOrRoles('id', 'SUPER_ADMIN', 'ADMIN'), getById);
usersRouter.patch('/:id', ...validate(uuidParamValidation()), authorizeSelfOrRoles('id', 'SUPER_ADMIN', 'ADMIN'), updateProfile);

// Ruta para actualizar foto de perfil vía Cloudinary
usersRouter.patch(
  '/:id/avatar',
  ...validate(uuidParamValidation()),
  authorizeSelfOrRoles('id', 'SUPER_ADMIN', 'ADMIN'),
  uploadProfilePicture,
  handleMulterError,
  updateAvatar
);

usersRouter.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), deactivate);
