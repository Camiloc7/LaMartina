import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary';
import { CLOUDINARY_FOLDERS } from '@lamartina/shared';

// ─── Helpers para crear storage de Cloudinary ─────────────────────────────────

function createCloudinaryStorage(folder: string, allowedFormats: string[]) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: allowedFormats,
      transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
    } as object,
  });
}

// ─── Configuraciones por módulo ───────────────────────────────────────────────

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Upload de fotos de perfil de usuario.
 * Solo imágenes, transformadas a WebP automáticamente.
 */
export const uploadProfilePicture: RequestHandler = multer({
  storage: createCloudinaryStorage(CLOUDINARY_FOLDERS.PROFILES, [
    'jpg',
    'jpeg',
    'png',
    'webp',
  ]),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
}).single('avatar');

/**
 * Upload de evidencias de jornada laboral.
 * Fotos del trabajo realizado por el operario.
 */
export const uploadJornadaEvidencia: RequestHandler = multer({
  storage: createCloudinaryStorage(CLOUDINARY_FOLDERS.JORNADAS, [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'heic',
  ]),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — fotos de alta calidad
}).array('evidencias', 10); // Máximo 10 fotos por jornada

/**
 * Upload de adjuntos en PQR.
 * Soporta imágenes y documentos PDF.
 */
export const uploadPQRAdjunto: RequestHandler = multer({
  storage: createCloudinaryStorage(CLOUDINARY_FOLDERS.PQR, [
    'jpg',
    'jpeg',
    'png',
    'pdf',
    'webp',
  ]),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — incluye PDFs
}).array('adjuntos', 5); // Máximo 5 adjuntos por PQR

/**
 * Upload de imágenes de conjuntos residenciales.
 */
export const uploadConjuntoImagen: RequestHandler = multer({
  storage: createCloudinaryStorage(CLOUDINARY_FOLDERS.CONJUNTOS, [
    'jpg',
    'jpeg',
    'png',
    'webp',
  ]),
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('imagenes', 20); // Múltiples imágenes de instalaciones

// ─── Middleware de manejo de errores de Multer ─────────────────────────────────

export function handleMulterError(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'El archivo supera el tamaño máximo permitido.',
      });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        message: 'Se superó el número máximo de archivos permitidos.',
      });
      return;
    }
  }
  next(err);
}
