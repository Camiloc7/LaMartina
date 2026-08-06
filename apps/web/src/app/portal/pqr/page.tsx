'use client';

import { useState } from 'react';
import type { PQRTipo, PQRPrioridad } from '@lamartina/shared';
import { CLOUDINARY_FOLDERS } from '@lamartina/shared';
import { CloudinaryUploader } from '@/components/cloudinary/CloudinaryUploader';

// ─── Formulario de PQR ────────────────────────────────────────────────────────

export default function PQRPage() {
  const [adjuntos, setAdjuntos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ radicado: string } | null>(null);
  const [form, setForm] = useState({
    tipo: 'PETICION' as PQRTipo,
    titulo: '',
    descripcion: '',
    conjuntoId: '',
    prioridad: 'MEDIA' as PQRPrioridad,
  });

  const handleAdjunto = (url: string) => {
    setAdjuntos((prev) => [...prev, url]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api/v1/pqr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ ...form, adjuntos }),
        }
      );
      const data = await res.json() as { data: { radicado: string } };
      setSubmitted({ radicado: data.data.radicado });
    } catch (error) {
      console.error('Error al radicar PQR:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-10 max-w-md w-full text-center animate-fade-in">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">
            PQR Radicada Exitosamente
          </h2>
          <p className="text-slate-400 mb-4">Tu número de radicado es:</p>
          <div className="bg-brand-500/20 border border-brand-500/50 rounded-xl p-4 mb-6">
            <p className="font-display text-2xl font-bold text-brand-400">
              {submitted.radicado}
            </p>
          </div>
          <p className="text-slate-500 text-sm">
            Guarda este número para hacer seguimiento de tu solicitud.
          </p>
          <button
            onClick={() => {
              setSubmitted(null);
              setForm({ tipo: 'PETICION', titulo: '', descripcion: '', conjuntoId: '', prioridad: 'MEDIA' });
              setAdjuntos([]);
            }}
            className="btn-brand mt-6 w-full justify-center"
          >
            Radicar otra PQR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-medium mb-4">
            📋 Portal Clientes
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Radicar PQR
          </h1>
          <p className="text-slate-400">
            Registra tu Petición, Queja o Reclamo. Te asignaremos un número de radicado
            único para hacer seguimiento.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 animate-slide-up">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tipo de solicitud *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['PETICION', 'QUEJA', 'RECLAMO'] as PQRTipo[]).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setForm({ ...form, tipo })}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    form.tipo === tipo
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'border-surface-border text-slate-400 hover:border-brand-500/30'
                  }`}
                >
                  {tipo === 'PETICION' ? '📄 Petición' : tipo === 'QUEJA' ? '😞 Queja' : '⚠️ Reclamo'}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-slate-300 mb-2">
              Título *
            </label>
            <input
              id="titulo"
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ej: Falla en alumbrado del parqueadero"
              className="input-dark"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-300 mb-2">
              Descripción detallada *
            </label>
            <textarea
              id="descripcion"
              required
              rows={5}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe tu situación con el mayor detalle posible..."
              className="input-dark resize-none"
            />
          </div>

          {/* Adjuntos — Cloudinary */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adjuntos (imágenes o PDFs)
            </label>
            <div className="space-y-3">
              <CloudinaryUploader
                folder={CLOUDINARY_FOLDERS.PQR}
                onSuccess={handleAdjunto}
                label="Adjuntar archivo"
                multiple
                maxFiles={5}
                resourceType="auto"
                icon={<span>📎</span>}
              />
              {/* Vista previa de adjuntos subidos */}
              {adjuntos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {adjuntos.map((url, i) => (
                    <div key={i} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Adjunto ${i + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-surface-border"
                        onError={(e) => {
                          // Si no es imagen (ej: PDF), mostrar placeholder
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text fill="%23f97316" x="50" y="55" text-anchor="middle" font-size="30">📄</text></svg>`;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAdjuntos(adjuntos.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500">
                Máximo 5 archivos (15MB cada uno). Imágenes y PDFs.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-brand w-full justify-center py-4 text-base"
          >
            {isSubmitting ? 'Radicando...' : 'Radicar PQR →'}
          </button>
        </form>
      </div>
    </div>
  );
}
