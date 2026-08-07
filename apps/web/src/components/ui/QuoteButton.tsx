'use client';

import { useState } from 'react';
import { ArrowRight, X, Send, Phone } from 'lucide-react';

export function QuoteButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-brand-500/40 flex items-center gap-2"
      >
        Solicitar una Cotización <ArrowRight size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-slate-100">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600" />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10">
              <h2 className="text-3xl font-bold mb-2 text-slate-900 font-display">Cotiza tu Proyecto</h2>
              <p className="text-slate-500 mb-8">Déjanos tus datos y un experto en paisajismo se pondrá en contacto contigo muy pronto.</p>
              
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias! Hemos recibido tu solicitud de cotización.'); setIsOpen(false); }}>
                <div className="space-y-2 text-left">
                  <label htmlFor="nombreModal" className="text-sm font-medium text-slate-700 block">Nombre completo <span className="text-red-500">*</span></label>
                  <input type="text" id="nombreModal" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800" placeholder="Ej. Juan Pérez" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                  <div className="space-y-2">
                    <label htmlFor="telefonoModal" className="text-sm font-medium text-slate-700 block">Teléfono / Celular <span className="text-red-500">*</span></label>
                    <input type="tel" id="telefonoModal" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800" placeholder="Ej. 300 000 0000" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="conjuntoModal" className="text-sm font-medium text-slate-700 block">Nombre del Conjunto</label>
                    <input type="text" id="conjuntoModal" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all text-slate-800" placeholder="Opcional" />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="servicioModal" className="text-sm font-medium text-slate-700 block">¿Qué servicio necesitas?</label>
                  <select id="servicioModal" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all bg-white text-slate-800">
                    <option value="">Selecciona un servicio...</option>
                    <option value="mantenimiento">Mantenimiento Mensual</option>
                    <option value="poda">Poda de Árboles en Altura</option>
                    <option value="diseno">Diseño de Paisajismo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-500/30 mt-2">
                  <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  Enviar Solicitud
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center justify-center gap-4 text-sm text-slate-500">
                <span>¿Buscas una respuesta inmediata?</span>
                <a href="https://wa.me/573000000000?text=Hola,%20me%20gustar%C3%ADa%20solicitar%20una%20cotizaci%C3%B3n%20para%20mi%20conjunto%20residencial." target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md">
                  <Phone size={18} /> Escríbenos por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
