import Link from 'next/link';
import { Leaf, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-900 px-6 font-sans">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-brand-100">
          <Leaf className="text-brand-500" size={48} />
        </div>
        <h1 className="text-7xl md:text-9xl font-bold font-display text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Página no encontrada</h2>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          Lo sentimos, parece que te has desviado del camino. La ruta que buscas no existe o ha sido movida.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-brand-500/30"
        >
          <Home size={20} />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
