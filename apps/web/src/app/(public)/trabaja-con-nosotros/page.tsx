'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Leaf, MapPin, Send, Phone, Briefcase, ShieldCheck } from 'lucide-react';

export default function TrabajaConNosotrosPage() {
  return (
    <>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image src="/equipo_de_trabajo (1).jpeg" alt="Equipo de La Martina" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display drop-shadow-lg">
            Únete al equipo que transforma <span className="text-brand-400">los espacios verdes</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light drop-shadow">
            Buscamos personas apasionadas por el paisajismo, el cuidado ambiental y el detalle. Si te enorgullece tu trabajo, este es tu lugar.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Izquierda: Por qué elegirnos e Imágenes Adicionales */}
        <div>
          <h2 className="text-3xl font-bold mb-8 font-display text-slate-900">¿Por qué trabajar en La Martina?</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Leaf className="text-brand-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Impacto Positivo</h3>
                <p className="text-slate-600 leading-relaxed">Tu trabajo embellecerá directamente las comunidades y aportará al medio ambiente mediante técnicas sostenibles.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Briefcase className="text-brand-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Estabilidad y Desarrollo</h3>
                <p className="text-slate-600 leading-relaxed">Ofrecemos contratos estables, capacitación continua en uso de maquinaria, poda en altura y botánica práctica.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-brand-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">Cultura de Seguridad</h3>
                <p className="text-slate-600 leading-relaxed">La seguridad es nuestra prioridad. Te dotamos de los mejores EPP y herramientas modernas para cuidar de ti.</p>
              </div>
            </div>
          </div>
          
          {/* Collage Corto del Equipo */}
          <div className="mt-12 grid grid-cols-2 gap-4">
             <div className="rounded-2xl overflow-hidden aspect-square relative shadow-md">
               <Image src="/equipo_de_trabajo (2).jpeg" alt="Equipo trabajando" fill className="object-cover hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="rounded-2xl overflow-hidden aspect-square relative shadow-md">
               <Image src="/trabajos (4).jpeg" alt="Resultados" fill className="object-cover hover:scale-110 transition-transform duration-500" />
             </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="text-brand-500" size={20} /> Base Operativa
            </h4>
            <p className="text-slate-600">Nuestros proyectos se concentran principalmente en la zona norte de Bogotá y sabana centro. Tendrás asignaciones claras y rutas optimizadas.</p>
          </div>
        </div>

        {/* Derecha: Formulario de Postulación */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative self-start sticky top-28">
          <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600" />
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Formulario de Postulación</h2>
            <p className="text-slate-500 mb-8">Completa tus datos y nuestro equipo te contactará a la brevedad.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por postularte! Hemos recibido tus datos de forma exitosa.'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-slate-700">Nombre completo <span className="text-red-500">*</span></label>
                  <input type="text" id="nombre" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="Ej. Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-sm font-medium text-slate-700">Teléfono / Celular <span className="text-red-500">*</span></label>
                  <input type="tel" id="telefono" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="Ej. 300 000 0000" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="experiencia" className="text-sm font-medium text-slate-700">Años de experiencia <span className="text-red-500">*</span></label>
                <select id="experiencia" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all bg-white">
                  <option value="">Selecciona una opción</option>
                  <option value="0-1">Menos de 1 año (Quiero aprender)</option>
                  <option value="1-3">1 a 3 años</option>
                  <option value="3-5">3 a 5 años</option>
                  <option value="5+">Más de 5 años</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-medium text-slate-700">Cuéntanos un poco sobre ti (Opcional)</label>
                <textarea id="mensaje" rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none" placeholder="¿Manejas guadañadora? ¿Trabajo en alturas?"></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-500/30 mt-4">
                <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Enviar Postulación
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-500">
              <Phone size={16} /> ¿Prefieres llamar? <strong>+57 300 000 0000</strong>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
