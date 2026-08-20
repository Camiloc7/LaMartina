'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

type PQRTipo = 'PETICION' | 'QUEJA' | 'RECLAMO';

interface PqrRadicationModalProps {
  propiedad: { id: string; numero?: string; conjuntoId?: string; conjunto?: { id: string; nombre?: string } };
  whatsappNumber?: string;
  onClose: () => void;
}

interface PqrCreada {
  id: string;
  radicado: string;
  estado: string;
}

export function PqrRadicationModal({ propiedad, whatsappNumber, onClose }: PqrRadicationModalProps) {
  const [tipo, setTipo] = useState<PQRTipo>('PETICION');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pqrCreada, setPqrCreada] = useState<PqrCreada | null>(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  const conjuntoId = propiedad.conjuntoId ?? propiedad.conjunto?.id;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!conjuntoId) {
      setError('No pudimos identificar el conjunto de esta propiedad. Inténtalo de nuevo o contacta a soporte.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetchApi<PqrCreada>('/pqr/public', {
        method: 'POST',
        body: JSON.stringify({
          tipo,
          titulo,
          descripcion,
          conjuntoId,
          propiedadId: propiedad.id,
          prioridad: 'MEDIA',
        }),
      });

      if (!response.data) throw new Error('No fue posible confirmar el radicado.');
      setPqrCreada(response.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No fue posible radicar tu PQR.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    if (!pqrCreada || !whatsappNumber) return;

    setWhatsappOpened(true);
    void fetchApi(`/pqr/public/${pqrCreada.id}/whatsapp`, { method: 'POST' }).catch(() => {
      // La PQR ya fue guardada; no bloqueamos al usuario si el evento de trazabilidad falla.
    });

    const telefono = whatsappNumber.replace(/\D/g, '');
    const mensaje = encodeURIComponent(`Hola, deseo hacer seguimiento a mi PQR ${pqrCreada.radicado}.`);
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="pqr-modal-title">
      <button className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} aria-label="Cerrar" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Canal oficial</p>
            <h2 id="pqr-modal-title" className="mt-1 text-xl font-bold text-slate-900">Radicar PQR</h2>
            <p className="mt-1 text-sm text-slate-500">Se guarda en el sistema antes de cualquier contacto por WhatsApp.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Cerrar formulario">
            <X size={20} />
          </button>
        </div>

        {pqrCreada ? (
          <div className="space-y-5 px-6 py-7 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Tu PQR quedó radicada</h3>
              <p className="mt-1 text-sm text-slate-500">Conserva este número para cualquier seguimiento.</p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
              <p className="font-mono text-xl font-bold text-brand-700">{pqrCreada.radicado}</p>
              <p className="mt-1 text-xs font-medium text-brand-600">Estado inicial: Abierta · Canal: Portal QR</p>
            </div>
            {whatsappNumber && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-left">
                <p className="font-semibold text-emerald-900">¿Necesitas ampliar la información?</p>
                <p className="mt-1 text-sm text-emerald-800">WhatsApp es opcional. Al abrirlo registraremos ese seguimiento en esta PQR, pero la conversación externa no reemplaza el radicado.</p>
                <button onClick={openWhatsApp} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-bold text-white hover:bg-[#20bd5a]">
                  <MessageCircle size={18} /> {whatsappOpened ? 'WhatsApp abierto para seguimiento' : 'Continuar por WhatsApp'}
                </button>
              </div>
            )}
            <button onClick={onClose} className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Finalizar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Propiedad: <strong>{propiedad.numero ?? 'Propiedad verificada'}</strong>. El conjunto se completa automáticamente.</p>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo de solicitud</label>
              <div className="grid grid-cols-3 gap-2">
                {(['PETICION', 'QUEJA', 'RECLAMO'] as PQRTipo[]).map((value) => (
                  <button key={value} type="button" onClick={() => setTipo(value)} className={`rounded-xl border px-2 py-2 text-sm font-semibold transition-colors ${tipo === value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-300'}`}>
                    {value === 'PETICION' ? 'Petición' : value === 'QUEJA' ? 'Queja' : 'Reclamo'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="pqr-title" className="mb-1 block text-sm font-semibold text-slate-700">Asunto</label>
              <input id="pqr-title" required minLength={3} maxLength={255} value={titulo} onChange={(event) => setTitulo(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="Ej. Novedad en zona común" />
            </div>
            <div>
              <label htmlFor="pqr-description" className="mb-1 block text-sm font-semibold text-slate-700">Cuéntanos qué ocurrió</label>
              <textarea id="pqr-description" required minLength={10} maxLength={10000} rows={5} value={descripcion} onChange={(event) => setDescripcion(event.target.value)} className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" placeholder="Incluye lugar, fecha y detalles que ayuden a atender tu caso." />
              <p className="mt-1 text-right text-xs text-slate-400">{descripcion.length}/10.000</p>
            </div>
            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 disabled:opacity-60">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} {isSubmitting ? 'Guardando PQR...' : 'Radicar y obtener número'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
