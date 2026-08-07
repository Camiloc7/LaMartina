'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle2, Camera, MapPin, X, Clock, Navigation, CalendarClock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function OperarioJornadas() {
  const [jornadas, setJornadas] = useState<any[]>([]);
  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [jornadaActiva, setJornadaActiva] = useState<any>(null);
  const [jornadasProgramadas, setJornadasProgramadas] = useState<any[]>([]);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [conjuntoId, setConjuntoId] = useState('');

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [resJornadas, resConjuntos] = await Promise.all([
        fetchApi('/jornadas/mis-jornadas'),
        fetchApi('/conjuntos')
      ]);

      if (resJornadas.success) {
        setJornadas(resJornadas.data);
        const activa = resJornadas.data.find((j: any) => j.estado === 'EN_PROGRESO');
        setJornadaActiva(activa || null);
        
        const programadas = resJornadas.data.filter((j: any) => j.estado === 'PROGRAMADA');
        setJornadasProgramadas(programadas);
      }
      if (resConjuntos.success) {
        setConjuntos(resConjuntos.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartJornada = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetchApi('/jornadas', {
        method: 'POST',
        body: JSON.stringify({ conjuntoId }),
      });
      if (response.success) {
        await loadData();
        setIsStartModalOpen(false);
        setConjuntoId('');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar la jornada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartProgramada = async (jornadaId: string, conjId: string) => {
    try {
      const response = await fetchApi('/jornadas', {
        method: 'POST',
        body: JSON.stringify({ jornadaId, conjuntoId: conjId }),
      });
      if (response.success) {
        await loadData();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al iniciar la jornada programada');
    }
  };

  const handleEndJornada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jornadaActiva) return;
    setIsSubmitting(true);
    setError('');
    try {
      if (file) {
        const formData = new FormData();
        formData.append('evidencia', file);
        await fetchApi(`/jornadas/${jornadaActiva.id}/evidencias`, {
          method: 'POST',
          body: formData as any,
        });
      }
      const response = await fetchApi(`/jornadas/${jornadaActiva.id}/finalizar`, {
        method: 'PATCH',
        body: JSON.stringify({ observaciones }),
      });
      if (response.success) {
        await loadData();
        setIsEndModalOpen(false);
        setObservaciones('');
        setFile(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al finalizar el trabajo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null; // El layout ya muestra el loading

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Current Status Area */}
      {jornadaActiva ? (
        <div className="relative">
          {/* Animated Glow Behind Card */}
          <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-[3rem] animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-brand-500/30 rounded-[2.5rem] p-8 text-center shadow-2xl shadow-brand-500/10 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/20 border border-brand-500/30 text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              En Terreno
            </span>
            
            <h2 className="text-3xl font-display font-bold text-white mb-2">{jornadaActiva.conjunto?.nombre}</h2>
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-8 font-medium">
              <Clock size={16} />
              <span>Iniciado: {new Date(jornadaActiva.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <button 
              onClick={() => setIsEndModalOpen(true)}
              className="w-full relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 text-lg transition-transform active:scale-95 border border-white/20">
                <CheckCircle2 size={24} /> Finalizar Tarea
              </div>
            </button>
          </div>
        </div>
      ) : jornadasProgramadas.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-2">Tu ruta de hoy</h3>
          {jornadasProgramadas.map(j => (
            <div key={j.id} className="relative bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-[2rem] p-6 shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
                <CalendarClock size={14} /> Servicio Programado
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{j.conjunto?.nombre}</h2>
              <p className="text-slate-400 text-sm mb-6">{j.observaciones}</p>
              
              <button 
                onClick={() => handleStartProgramada(j.id, j.conjuntoId)}
                className="w-full relative group/btn"
              >
                <div className="absolute inset-0 bg-brand-500 rounded-2xl blur opacity-50 group-hover/btn:opacity-80 transition-opacity duration-300"></div>
                <div className="relative bg-brand-500 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all active:scale-95">
                  <MapPin size={20} /> Llegué al lugar
                </div>
              </button>
            </div>
          ))}
          <div className="pt-4 text-center">
            <button 
              onClick={() => setIsStartModalOpen(true)}
              className="text-slate-500 text-sm font-medium hover:text-white transition-colors"
            >
              O iniciar otro trabajo fuera de ruta...
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-0 bg-slate-800/30 blur-2xl rounded-[3rem]"></div>
          <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700 shadow-inner">
              <Navigation size={32} className="text-brand-400 ml-1 mt-1" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sin ruta programada</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">No tienes servicios asignados para hoy. Selecciona el lugar si estás haciendo un trabajo libre.</p>
            
            <button 
              onClick={() => setIsStartModalOpen(true)}
              className="w-full relative group"
            >
              <div className="absolute inset-0 bg-brand-500 rounded-2xl blur opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative bg-brand-500 text-slate-950 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:brightness-110 transition-all active:scale-95 text-lg">
                <MapPin size={22} className="text-slate-950" /> Comenzar Trabajo Libre
              </div>
            </button>
          </div>
        </div>
      )}

      {/* History Area */}
      <div>
        <div className="flex items-center justify-between mb-5 px-2">
          <h3 className="text-lg font-bold text-white">Historial de Trabajos</h3>
          <span className="text-xs font-medium text-brand-400 bg-brand-400/10 px-2 py-1 rounded-md">Últimos 5</span>
        </div>
        
        <div className="space-y-3">
          {jornadas.filter(j => j.estado === 'COMPLETADA').slice(0, 5).map(j => (
            <div key={j.id} className="bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between group hover:border-slate-700 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex flex-col items-center justify-center text-slate-300 shrink-0">
                  <span className="text-xs font-bold">{new Date(j.fechaInicio).getDate()}</span>
                  <span className="text-[10px] uppercase tracking-wider">{new Date(j.fechaInicio).toLocaleString('es', { month: 'short' })}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-sm truncate max-w-[150px]">
                    {j.conjunto?.nombre || 'Jornada'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(j.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(j.fechaFin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  Completado
                </span>
                {j.evidencias?.length > 0 && (
                  <Camera size={14} className="text-slate-500" />
                )}
              </div>
            </div>
          ))}
          {jornadas.filter(j => j.estado === 'COMPLETADA').length === 0 && (
            <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/50 border-dashed">
              <p className="text-slate-500 text-sm">No tienes trabajos finalizados aún.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: START */}
      {isStartModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsStartModalOpen(false)} />
          <div className="relative bg-slate-900 border-t sm:border border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up pb-safe">
            <div className="px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Iniciar Trabajo</h3>
              <button onClick={() => setIsStartModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 pt-2">
              <form onSubmit={handleStartJornada}>
                {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
                
                <label className="block text-sm font-medium text-slate-400 mb-2">¿Dónde te encuentras?</label>
                <div className="relative mb-8">
                  <select 
                    required
                    value={conjuntoId} 
                    onChange={e => setConjuntoId(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-brand-500 outline-none appearance-none font-medium"
                  >
                    <option value="" disabled>Selecciona la ubicación...</option>
                    {conjuntos.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} - {c.ciudad}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-brand-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-brand-500 text-slate-950 font-bold py-4 rounded-xl disabled:opacity-50 text-lg flex justify-center items-center">
                    {isSubmitting ? 'Iniciando...' : 'Comenzar Ahora'}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: END */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsEndModalOpen(false)} />
          <div className="relative bg-slate-900 border-t sm:border border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh] animate-slide-up pb-safe">
            <div className="px-6 py-5 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-white">Reporte de Trabajo</h3>
              <button onClick={() => setIsEndModalOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 pt-2 overflow-y-auto">
              <form id="end-jornada-form" onSubmit={handleEndJornada} className="space-y-6">
                {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
                
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">Evidencia Fotográfica (Opcional)</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-blue-500/10 rounded-2xl blur-md"></div>
                    <div className="relative flex justify-center px-6 py-8 border-2 border-slate-700 border-dashed rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors overflow-hidden">
                      <div className="text-center relative z-10">
                        {file ? (
                          <div className="text-brand-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-3">
                              <CheckCircle2 size={32} />
                            </div>
                            <span className="font-bold text-sm truncate max-w-[200px] text-white">{file.name}</span>
                            <span className="text-xs text-brand-400 mt-1">Foto capturada</span>
                          </div>
                        ) : (
                          <div className="text-slate-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                              <Camera size={32} />
                            </div>
                            <span className="font-bold text-sm text-slate-300">Toca para abrir la cámara</span>
                            <span className="text-xs mt-1 text-slate-500">o subir de la galería</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">Observaciones del Trabajo</label>
                  <textarea 
                    required 
                    rows={4}
                    value={observaciones} 
                    onChange={e => setObservaciones(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none placeholder-slate-600"
                    placeholder="Ej. El pasto frontal quedó cortado y se limpiaron las hojas secas..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-5 shrink-0 bg-slate-900 border-t border-slate-800/50">
              <button 
                type="submit" 
                form="end-jornada-form"
                disabled={isSubmitting}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-white rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white text-slate-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-transform active:scale-95 text-lg flex justify-center items-center">
                  {isSubmitting ? 'Guardando Reporte...' : 'Cerrar Jornada'}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation classes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
}
