'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary';
import { CloudinaryFolder } from '@lamartina/shared';

interface CloudinaryUploaderProps {
  /** Carpeta de destino en Cloudinary (ej: 'lamartina/jornadas') */
  folder: CloudinaryFolder;
  /** Callback con la URL segura de la imagen subida */
  onSuccess: (url: string, publicId: string) => void;
  /** Texto del botón de upload */
  label?: string;
  /** Habilitar múltiples archivos */
  multiple?: boolean;
  /** Tipos de archivo aceptados */
  resourceType?: 'image' | 'auto';
  /** Máximo de archivos en modo múltiple */
  maxFiles?: number;
  /** Clases CSS adicionales para el botón */
  className?: string;
  /** Icono del botón */
  icon?: React.ReactNode;
}

/**
 * Componente reutilizable para subir archivos a Cloudinary.
 * Usa CldUploadWidget de next-cloudinary para uploads sin exponer el API Secret.
 * 
 * Uso:
 * ```tsx
 * <CloudinaryUploader
 *   folder={CLOUDINARY_FOLDERS.JORNADAS}
 *   onSuccess={(url, publicId) => console.log(url)}
 *   multiple
 *   maxFiles={5}
 *   label="Subir evidencias"
 * />
 * ```
 */
export function CloudinaryUploader({
  folder,
  onSuccess,
  label = 'Subir imagen',
  multiple = false,
  resourceType = 'image',
  maxFiles = 1,
  className = '',
  icon,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
      options={{
        folder,
        multiple,
        maxFiles,
        resourceType,
        sources: ['local', 'camera'],
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'heic'],
        maxFileSize: 15_000_000, // 15MB
        showAdvancedOptions: false,
        showCompletedButton: true,
        language: 'es',
        text: {
          es: {
            or: 'o',
            back: 'Atrás',
            advanced: 'Avanzado',
            close: 'Cerrar',
            no_results: 'Sin resultados',
            search_placeholder: 'Buscar archivos',
            about_uw: 'Acerca del widget de carga',
            search: {
              placeholder: 'Buscar...',
              reset: 'Limpiar búsqueda',
            },
            local: {
              browse: 'Seleccionar',
              dd_title_single: 'Arrastra tu archivo aquí',
              dd_title_multi: 'Arrastra tus archivos aquí',
              drop_title_single: 'Suelta el archivo',
              drop_title_multiple: 'Suelta los archivos',
            },
          },
        },
        styles: {
          palette: {
            window: '#1e293b',
            windowBorder: '#f97316',
            tabIcon: '#f97316',
            menuIcons: '#cbd5e1',
            textDark: '#0f172a',
            textLight: '#f8fafc',
            link: '#f97316',
            action: '#f97316',
            inactiveTabIcon: '#64748b',
            error: '#ef4444',
            inProgress: '#f97316',
            complete: '#22c55e',
            sourceBg: '#0f172a',
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
              active: true,
            },
          },
        },
      }}
      onUpload={(result) => {
        setIsUploading(false);
        if (
          result.event === 'success' &&
          typeof result.info === 'object' &&
          result.info
        ) {
          const info = result.info as { secure_url: string; public_id: string };
          onSuccess(info.secure_url, info.public_id);
        }
      }}
      onOpen={() => setIsUploading(true)}
      onClose={() => setIsUploading(false)}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          disabled={isUploading}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            bg-brand-500 hover:bg-brand-600 text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/30
            ${className}
          `}
        >
          {icon && <span>{icon}</span>}
          {isUploading ? 'Subiendo...' : label}
        </button>
      )}
    </CldUploadWidget>
  );
}
