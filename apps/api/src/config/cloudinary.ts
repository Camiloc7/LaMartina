import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// ─── Configuración del SDK de Cloudinary (Backend) ────────────────────────────
// El backend usa el SDK completo con API Secret para uploads autorizados.
// NUNCA exponer CLOUDINARY_API_SECRET en el frontend.

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRET'],
  secure: true,
});

/**
 * Sube un archivo a Cloudinary desde el backend.
 * @param filePath - Ruta temporal del archivo o buffer base64
 * @param folder - Carpeta de destino en Cloudinary (ej: "lamartina/jornadas")
 * @param publicId - ID público personalizado (opcional)
 */
export async function uploadToCloudinary(
  filePath: string,
  folder: string,
  publicId?: string
): Promise<{ publicId: string; secureUrl: string; bytes: number }> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: 'auto',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    bytes: result.bytes,
  };
}

/**
 * Elimina un archivo de Cloudinary usando su publicId.
 * Útil al actualizar foto de perfil o al borrar evidencias.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Genera una URL de transformación directa desde el servidor.
 */
export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
}

export { cloudinary };
