import { Request, Response } from 'express';
import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';
import { deleteFromCloudinary } from '../../config/cloudinary';
import { extractPublicIdFromUrl } from '@lamartina/shared';
import { ApiError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authenticate';

const userRepo = AppDataSource.getRepository(User);

export async function getAll(_req: Request, res: Response): Promise<void> {
  const users = await userRepo.find({ where: { activo: true } });
  res.json({ success: true, data: users });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const user = await userRepo.findOne({ where: { id: req.params['id'] as string } });
  if (!user) throw new ApiError('Usuario no encontrado', 404);
  res.json({ success: true, data: user });
}

export async function updateProfile(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params as { id: string };
  const { nombre, apellido, telefono } = req.body as {
    nombre?: string;
    apellido?: string;
    telefono?: string;
  };

  const user = await userRepo.findOne({ where: { id } });
  if (!user) throw new ApiError('Usuario no encontrado', 404);

  if (nombre) user.nombre = nombre;
  if (apellido) user.apellido = apellido;
  if (telefono) user.telefono = telefono;

  await userRepo.save(user);
  res.json({ success: true, data: user });
}

/**
 * Actualiza la foto de perfil de un usuario.
 * El archivo ya fue subido a Cloudinary por multer-storage-cloudinary.
 * Si el usuario tenía una foto anterior, se elimina de Cloudinary.
 */
export async function updateAvatar(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params as { id: string };
  const file = req.file as Express.Multer.File & { path: string };

  if (!file) throw new ApiError('No se proporcionó ningún archivo.', 400);

  const user = await userRepo.findOne({ where: { id } });
  if (!user) throw new ApiError('Usuario no encontrado', 404);

  // Eliminar avatar anterior de Cloudinary si existía
  if (user.avatarUrl) {
    const oldPublicId = extractPublicIdFromUrl(user.avatarUrl);
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId).catch(() => {
        // No crítico si falla la eliminación del anterior
      });
    }
  }

  // multer-storage-cloudinary guarda la URL en file.path
  user.avatarUrl = file.path;
  await userRepo.save(user);

  res.json({
    success: true,
    message: 'Foto de perfil actualizada.',
    data: { avatarUrl: user.avatarUrl },
  });
}

export async function deactivate(req: Request, res: Response): Promise<void> {
  const requesterRol = (req as AuthRequest).userRol;
  if (!['SUPER_ADMIN', 'ADMIN'].includes(requesterRol)) {
    throw new ApiError('No tienes permisos para esta acción.', 403);
  }

  const user = await userRepo.findOne({ where: { id: req.params['id'] as string } });
  if (!user) throw new ApiError('Usuario no encontrado', 404);

  user.activo = false;
  await userRepo.save(user);

  res.json({ success: true, message: 'Usuario desactivado.' });
}
