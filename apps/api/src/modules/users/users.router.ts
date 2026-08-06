import { Router } from 'express';
import {
  getAll,
  getById,
  updateProfile,
  updateAvatar,
  deactivate,
} from './users.controller';
import { authenticate, authorize } from '../../middleware/authenticate';
import { uploadProfilePicture, handleMulterError } from '../../middleware/upload';

export const usersRouter: Router = Router();

usersRouter.use(authenticate);

usersRouter.get('/', authorize('SUPER_ADMIN', 'ADMIN'), getAll);
usersRouter.get('/:id', getById);
usersRouter.patch('/:id', updateProfile);

// Ruta para actualizar foto de perfil vía Cloudinary
usersRouter.patch(
  '/:id/avatar',
  uploadProfilePicture,
  handleMulterError,
  updateAvatar
);

usersRouter.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), deactivate);
