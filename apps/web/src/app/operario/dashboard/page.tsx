'use client';

import Link from 'next/link';
import { Wrench, MessageSquareWarning } from 'lucide-react';

export default function OperarioDashboard() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">¿Qué haremos hoy?</h1>
        <p className="text-brand-400">Selecciona una opción para empezar</p>
      </div>

      <Link 
        href="/operario/trabajos"
        className="bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-lg shadow-brand-900/50"
      >
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Wrench size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold">Mis Trabajos</h2>
        <p className="text-brand-100 text-sm text-center">Ver mis casas asignadas e iniciar jornada</p>
      </Link>

      <Link 
        href="/operario/pqrs"
        className="bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-lg shadow-slate-900/50 border border-slate-700"
      >
        <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <MessageSquareWarning size={40} className="text-brand-400" />
        </div>
        <h2 className="text-2xl font-bold">Mis Tickets PQR</h2>
        <p className="text-slate-400 text-sm text-center">Atender solicitudes, quejas o reclamos</p>
      </Link>
    </div>
  );
}
