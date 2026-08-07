'use client';

import { useState, useEffect } from 'react';
import { Search, CalendarDays, Plus, X, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ProgramacionPage() {
  const [jornadas, setJornadas] = useState<any[]>([]);
  const [operarios, setOperarios] = useState<any[]>([]);
  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [operarioId, setOperarioId] = useState('');
  const [conjuntoId, setConjuntoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [observaciones, setObservaciones] = useState('Mantenimiento Regular');

  const loadData = async () => {
    try {
      const [resJornadas, resUsuarios, resConjuntos] = await Promise.all([
        fetchApi('/jornadas'),
        fetchApi('/users'),
        fetchApi('/conjuntos')
      ]);

      if (resJornadas.success) setJornadas(resJornadas.data);
      if (resUsuarios.success) {
        setOperarios(resUsuarios.data.filter((u: any) => u.rol === 'OPERARIO'));
      }
      if (resConjuntos.success) setConjuntos(resConjuntos.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProgramar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetchApi('/jornadas/programar', {
        method: 'POST',
        body: JSON.stringify({
          operarioId,
          conjuntoId,
          fechaInicio,
          observaciones,
        }),
      });

      if (response.success) {
        await loadData();
        setIsModalOpen(false);
        setOperarioId(''); setConjuntoId(''); setFechaInicio(''); setObservaciones('Mantenimiento Regular');
      }
    } catch (err: any) {
      setError(err.message || 'Error al programar el servicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'EN_PROGRESO': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETADA': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="animate-fade-in relative min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">Programación de Rutas</h1>
          <p className="text-slate-500 mt-2 text-lg">Asigna servicios y visitas regulares a tus operarios.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-brand-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2"
        >
          <CalendarDays size={20} /> Programar Servicio
        </button>
      </div>

      {/* Grid de Programación */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-white/50 rounded-[2rem] animate-pulse border border-slate-200"></div>)
        ) : jornadas.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200 border-dashed">
            <CalendarDays size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No hay servicios programados</h3>
            <p className="text-slate-500 mt-2">Empieza a programar las rutas para organizar el trabajo.</p>
          </div>
        ) : (
          jornadas.map(j => (
            <div key={j.id} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-300 relative group overflow-hidden">
              
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-brand-100 to-purple-200 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(j.estado)}`}>
                  {j.estado.replace('_', ' ')}
                </span>
                <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(j.fechaInicio).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-5 relative z-10">
                <h3 className="text-xl font-bold text-slate-800 mb-1 leading-tight flex items-center gap-2">
                  <MapPin size={18} className="text-brand-500" /> {j.conjunto?.nombre}
                </h3>
                <p className="text-slate-500 text-sm ml-7 line-clamp-1">{j.observaciones}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
                  {j.operario?.nombre.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Operario Asignado</p>
                  <p className="text-sm font-bold text-slate-800">{j.operario?.nombre} {j.operario?.apellido}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Programar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white/95 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 font-display">Programar Servicio</h3>
                <p className="text-sm text-slate-500 mt-1">Asigna un conjunto a un operario en una fecha</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="schedule-form" onSubmit={handleProgramar} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 font-medium">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Operario</label>
                  <select 
                    required
                    value={operarioId} 
                    onChange={e => setOperarioId(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium"
                  >
                    <option value="" disabled>Selecciona el operario...</option>
                    {operarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Proyecto / Conjunto</label>
                  <select 
                    required
                    value={conjuntoId} 
                    onChange={e => setConjuntoId(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium"
                  >
                    <option value="" disabled>Selecciona a dónde irá...</option>
                    {conjuntos.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Fecha y Hora Programada</label>
                  <input 
                    required 
                    type="datetime-local" 
                    value={fechaInicio} 
                    onChange={e => setFechaInicio(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Servicio / Observación</label>
                  <input 
                    required 
                    type="text" 
                    value={observaciones} 
                    onChange={e => setObservaciones(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium"
                    placeholder="Ej. Mantenimiento semanal jardines"
                  />
                </div>
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-[2.5rem]">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="schedule-form"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-brand-600 shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
                <span className="relative z-10">{isSubmitting ? 'Guardando...' : 'Programar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
