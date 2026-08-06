// =============================================================================
// Configuración de Cloudinary para el Frontend (Next.js)
// Usa next-cloudinary que envuelve el SDK oficial de forma amigable con React/Next.js
// =============================================================================

// Cloud name y upload preset son públicos (se pueden exponer en el cliente)
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'lamartina_unsigned',
} as const;

// Validación en tiempo de ejecución
if (typeof window === 'undefined') {
  // Solo en servidor, verificamos que las vars están configuradas
  if (!CLOUDINARY_CONFIG.cloudName) {
    console.warn(
      '⚠️  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está configurado. ' +
        'Agrega esta variable al archivo .env.local'
    );
  }
}
