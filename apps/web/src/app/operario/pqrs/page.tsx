'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Loader2, CheckCircle, Ticket, UserPlus } from 'lucide-react';

export default function OperarioPQRsPage() {
  const [pqrs, setPqrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPQRs();
  }, []);

  const loadPQRs = async () => {
    try {
      const res = await fetchApi('/pqr'); // Devuelve todas las PQRs (el backend debe permitir a OPERARIO verlas)
      if (res.success) {
        setPqrs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarme = async (id: string) => {
    try {
      const res = await fetchApi(`/pqr/${id}/asignar`, { method: 'PATCH' });
      if (res.success) {
        loadPQRs();
      }
    } catch (err) {
      alert('Error al asignarse la PQR');
    }
  };

  const handleMarcarResuelta = async (id: string) => {
    try {
      const res = await fetchApi(`/pqr/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'RESUELTA' })
      });
      if (res.success) {
        loadPQRs();
      }
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" /></div>;

  return (
    <div className="flex flex-col pb-6">
      <h1 className="text-2xl font-bold text-white mb-6">Tickets PQR</h1>
      
      {pqrs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 opacity-50" />
          <p className="text-slate-400 font-medium">No hay tickets pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pqrs.map((pqr) => (
            <div key={pqr.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-800/50">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white pr-2">{pqr.titulo}</h2>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                    pqr.estado === 'ABIERTA' ? 'bg-rose-500/20 text-rose-400' :
                    pqr.estado === 'EN_PROCESO' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {pqr.estado}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{pqr.descripcion}</p>
                
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Ticket size={14} />
                  <span>Radicado: {pqr.radicado}</span>
                </div>
              </div>

              <div className="p-3">
                {pqr.estado === 'ABIERTA' && (
                  <button 
                    onClick={() => handleAsignarme(pqr.id)}
                    className="w-full bg-rose-600 active:bg-rose-700 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <UserPlus size={20} /> TOMAR TICKET
                  </button>
                )}
                {pqr.estado === 'EN_PROCESO' && (
                  <button 
                    onClick={() => handleMarcarResuelta(pqr.id)}
                    className="w-full bg-amber-600 active:bg-amber-700 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <CheckCircle size={20} /> MARCAR RESUELTO
                  </button>
                )}
                {pqr.estado === 'RESUELTA' && (
                  <div className="w-full bg-slate-800 text-emerald-500 font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> COMPLETADO
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
