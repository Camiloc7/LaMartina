'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Loader2, MapPin, Camera, CheckCircle, Navigation, X, Wrench } from 'lucide-react';

export default function OperarioTrabajosPage() {
  const [programaciones, setProgramaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para la orden activa (EN_PROGRESO)
  const [ordenActiva, setOrdenActiva] = useState<any>(null);
  
  // Modal de finalizar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geolocalizando, setGeolocalizando] = useState(false);

  useEffect(() => {
    loadTrabajos();
  }, []);

  const loadTrabajos = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/servicios/programaciones'); 
      if (res.success) {
        // En una app real, filtramos por operario. Aquí usamos todos para el MVP.
        const pendientes = res.data.filter((p: any) => p.estado === 'PENDIENTE');
        setProgramaciones(pendientes);

        // Si ya hay algo EN_PROGRESO, deberíamos cargarlo, pero por simplicidad
        // asumiremos que se inicia y se termina en la misma sesión/vista.
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciar = async (progId: string) => {
    if (!confirm('¿Iniciar este trabajo ahora?')) return;
    try {
      const res = await fetchApi(`/servicios/programaciones/${progId}/iniciar`, { method: 'POST' });
      if (res.success) {
        setOrdenActiva(res.data);
        loadTrabajos(); // Refrescar lista para quitar el pendiente
      }
    } catch (err: any) {
      alert(err.message || 'Error al iniciar');
    }
  };

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ordenActiva) return;

    setIsSubmitting(true);
    setGeolocalizando(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await submitFinalizar(position.coords.latitude, position.coords.longitude);
        },
        async (error) => {
          alert('No se pudo obtener la ubicación. Asegúrate de dar permisos de GPS.');
          // Aún así permitimos enviar si falla el GPS en este MVP, pero en prod se podría bloquear.
          await submitFinalizar();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      await submitFinalizar();
    }
  };

  const submitFinalizar = async (lat?: number, lng?: number) => {
    setGeolocalizando(false);
    try {
      const res = await fetchApi(`/servicios/ordenes/${ordenActiva.id}/completar`, {
        method: 'POST',
        body: JSON.stringify({
          observaciones,
          evidenciaFotos: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], // Dummy photo for now
          latitud: lat,
          longitud: lng
        })
      });
      if (res.success) {
        setOrdenActiva(null);
        setIsModalOpen(false);
        setObservaciones('');
        alert('¡Trabajo finalizado con éxito!');
        loadTrabajos();
      }
    } catch (err: any) {
      alert(err.message || 'Error al finalizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" /></div>;

  // VISTA 1: ORDEN ACTIVA (TRABAJANDO)
  if (ordenActiva) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-brand-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Wrench size={48} className="text-brand-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Trabajo en Progreso</h2>
          <p className="text-slate-400 mb-8">Estás realizando un mantenimiento.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xl py-6 rounded-3xl shadow-xl shadow-emerald-900/50 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Camera size={32} />
          <span>TOMAR FOTO Y TERMINAR</span>
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col p-4 animate-in slide-in-from-bottom-full">
            <div className="flex justify-between items-center mb-6 pt-4">
              <h3 className="text-2xl font-bold text-white">Finalizar Trabajo</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-800 rounded-full text-slate-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFinalizar} className="flex-1 flex flex-col">
              <div className="flex-1 space-y-6">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-400 border-dashed">
                  <Camera size={48} />
                  <span className="font-bold">Toca para añadir fotos (Max 5)</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-2 ml-2">¿Cómo quedó? (Opcional)</label>
                  <textarea 
                    rows={4}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Escribe algún detalle..."
                    className="w-full p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500 resize-none text-lg"
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-600 active:bg-brand-700 text-white font-bold text-xl py-5 rounded-3xl mt-6 mb-safe flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> {geolocalizando ? 'Obteniendo GPS...' : 'Guardando...'}</>
                ) : (
                  <><CheckCircle size={28} /> ENVIAR Y CERRAR</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // VISTA 2: LISTA DE TRABAJOS PENDIENTES
  return (
    <div className="flex flex-col pb-6">
      <h1 className="text-2xl font-bold text-white mb-6">Trabajos Pendientes</h1>
      
      {programaciones.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 font-medium">¡Estás al día!</p>
          <p className="text-sm text-slate-500">No hay casas asignadas pendientes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {programaciones.map((prog) => (
            <div key={prog.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-800/50">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-bold text-white">{prog.propiedad?.numero || 'Global'}</h2>
                  <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full font-bold">
                    HOY
                  </span>
                </div>
                <p className="text-brand-400 font-medium">{prog.conjunto?.nombre}</p>
                
                <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
                  <MapPin size={16} />
                  <span>{prog.conjunto?.direccion}</span>
                </div>
              </div>
              
              <div className="p-3">
                <button 
                  onClick={() => handleIniciar(prog.id)}
                  className="w-full bg-brand-600 active:bg-brand-700 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Navigation size={20} /> INICIAR TRABAJO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
