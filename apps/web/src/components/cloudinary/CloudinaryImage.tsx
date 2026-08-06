import { CldImage } from 'next-cloudinary';
import { getAvatarFallbackUrl } from '@lamartina/shared';

interface CloudinaryImageProps {
  /** Public ID de Cloudinary (ej: "lamartina/profiles/abc123") */
  publicId: string;
  /** Alt text descriptivo */
  alt: string;
  /** Ancho en píxeles */
  width: number;
  /** Alto en píxeles */
  height: number;
  /** Modo de recorte */
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  /** Enfoque (auto detecta caras) */
  gravity?: 'auto' | 'face' | 'center';
  /** Clases CSS */
  className?: string;
  /** Prioridad de carga (para imágenes above the fold) */
  priority?: boolean;
}

/**
 * Componente optimizado de imagen de Cloudinary.
 * Sirve automáticamente formato WebP y aplica lazy loading.
 * 
 * Uso:
 * ```tsx
 * <CloudinaryImage
 *   publicId="lamartina/profiles/user123"
 *   alt="Avatar de Juan"
 *   width={128}
 *   height={128}
 *   crop="fill"
 *   gravity="face"
 * />
 * ```
 */
export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  crop = 'fill',
  gravity = 'auto',
  className = '',
  priority = false,
}: CloudinaryImageProps) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      crop={crop}
      gravity={gravity}
      quality="auto"
      format="auto"
      className={className}
      priority={priority}
    />
  );
}

// ─── Avatar de Usuario con Fallback ───────────────────────────────────────────

interface UserAvatarProps {
  /** URL de Cloudinary del avatar (opcional) */
  avatarUrl?: string;
  /** Nombre del usuario (para generar initials como fallback) */
  nombre: string;
  apellido: string;
  /** Tamaño en píxeles */
  size?: number;
  className?: string;
}

/**
 * Avatar de usuario que usa Cloudinary si existe, o genera un placeholder con iniciales.
 * 
 * Uso:
 * ```tsx
 * <UserAvatar nombre="Juan" apellido="García" avatarUrl="lamartina/profiles/..." size={48} />
 * ```
 */
export function UserAvatar({
  avatarUrl,
  nombre,
  apellido,
  size = 40,
  className = '',
}: UserAvatarProps) {
  const fallbackUrl = getAvatarFallbackUrl(nombre, apellido);

  if (avatarUrl) {
    // Si la URL es un publicId de Cloudinary (no empieza con http)
    const isPublicId = !avatarUrl.startsWith('http');

    if (isPublicId) {
      return (
        <CloudinaryImage
          publicId={avatarUrl}
          alt={`Avatar de ${nombre} ${apellido}`}
          width={size}
          height={size}
          crop="fill"
          gravity="face"
          className={`rounded-full object-cover ${className}`}
        />
      );
    }

    // URL completa de Cloudinary
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`Avatar de ${nombre} ${apellido}`}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  // Fallback con iniciales
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallbackUrl}
      alt={`Avatar de ${nombre} ${apellido}`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
}
