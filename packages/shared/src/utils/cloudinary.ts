// =============================================================================
// Utilidades Cloudinary — Compartidas entre Frontend y Backend
// =============================================================================

/**
 * Construye una URL de Cloudinary con transformaciones opcionales.
 * Útil para mostrar imágenes optimizadas (WebP, resize, calidad).
 */
export function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  options: CloudinaryTransformOptions = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformStr =
    transformations.length > 0 ? transformations.join(',') + '/' : '';

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}${publicId}`;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: string | 'auto';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
}

/**
 * Genera una URL de placeholder de avatar con iniciales del usuario.
 * Se usa como fallback cuando el usuario no tiene foto de perfil.
 */
export function getAvatarFallbackUrl(nombre: string, apellido: string): string {
  const initials = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  // Usa ui-avatars.com como fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=F97316&color=fff&size=128&bold=true`;
}

/**
 * Extrae el publicId de una URL de Cloudinary completa.
 * Útil para eliminar imágenes antiguas al actualizar.
 */
export function extractPublicIdFromUrl(cloudinaryUrl: string): string | null {
  try {
    const url = new URL(cloudinaryUrl);
    // Patrón: /image/upload/[transformaciones]/publicId
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // El publicId puede incluir la carpeta, ej: lamartina/jornadas/abc123
    return pathParts.slice(uploadIndex + 1).join('/').split('.')[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Carpetas organizadas de Cloudinary para cada módulo de La Martina.
 */
export const CLOUDINARY_FOLDERS = {
  PROFILES: 'lamartina/profiles',
  JORNADAS: 'lamartina/jornadas',
  PQR: 'lamartina/pqr',
  CONJUNTOS: 'lamartina/conjuntos',
  LANDING: 'lamartina/landing',
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
