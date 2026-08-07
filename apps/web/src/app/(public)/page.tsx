import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Scissors, Clock, ShieldCheck, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { QuoteButton } from '@/components/ui/QuoteButton';

export const metadata: Metadata = {
  title: 'La Martina — Gestión Inteligente de Conjuntos Residenciales',
  description:
    'Centraliza la gestión de jornadas laborales, PQR y seguimiento operativo de tus conjuntos residenciales. La Martina es la plataforma todo-en-uno para administradores modernos.',
};

export default function LandingPage() {
  return (
    <>
      {/* 2. Hero Banner */}
      <section id="inicio" className="relative pt-20 h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/paisajismo-1.jpeg" alt="Paisajismo Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-display drop-shadow-lg">
            Llevamos la excelencia a los <span className="text-brand-400">espacios verdes</span> de su conjunto.
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light drop-shadow">
            Gestión integral de jardinería, paisajismo y mantenimiento con tecnología en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <QuoteButton />
            <Link href="#servicios" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
              Ver Resultados
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Sección de Servicios */}
      <section id="servicios" className="py-24 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-display">Nuestros Servicios</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Soluciones profesionales diseñadas para mantener la belleza y salud de las áreas comunes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-slate-100 flex flex-col">
              <div className="h-56 relative">
                <Image src="/paisajismo (3).jpeg" alt="Mantenimiento de Conjuntos" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
                  <Leaf className="text-brand-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Mantenimiento Integral</h3>
                <p className="text-slate-600 leading-relaxed">Cuidado constante de zonas verdes, asegurando espacios vibrantes y saludables durante todo el año.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-slate-100 flex flex-col">
              <div className="h-56 relative bg-slate-200">
                <Image src="/trabajos (2).jpeg" alt="Poda Especializada" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
                  <Scissors className="text-brand-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Poda y Paisajismo</h3>
                <p className="text-slate-600 leading-relaxed">Poda técnica de árboles, diseño floral y arbustos para promover estética impecable y seguridad estructural.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-slate-100 flex flex-col">
              <div className="h-56 relative bg-slate-200">
                <Image src="/trabajos (4).jpeg" alt="Atención Rápida" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="text-brand-500" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Atención a Urgencias</h3>
                <p className="text-slate-600 leading-relaxed">Respuesta inmediata ante caídas de ramas o afectaciones climáticas que comprometan la seguridad de su conjunto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección de Acceso Exclusivo */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-brand-500/10 blur-3xl rounded-full transform -translate-x-1/4 translate-y-1/4" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
                <Image src="/trabajos (3).jpeg" alt="Portal Tecnológico" fill className="object-cover" />
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-semibold mb-6">
                <ShieldCheck size={16} /> Portal de Clientes
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display leading-tight">
                Transparencia total en cada proyecto.
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Supervise nuestros mantenimientos en tiempo real. Radique sus PQR directamente en nuestra plataforma web y reciba reportes fotográficos de los avances antes y después del servicio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Prueba Social y Galería Extendida */}
      <section id="galeria" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 font-display">Nuestra Excelencia en Detalle</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Un recorrido visual por los proyectos que hemos transformado recientemente.</p>
        </div>
        
        {/* Carrusel Móvil (Marquee Infinito) */}
        <div className="overflow-hidden whitespace-nowrap flex w-full relative">
          {/* Overlay fade edges para suavizar el inicio y fin */}
          <div className="absolute top-0 left-0 w-16 md:w-48 h-full bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 md:w-48 h-full bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
          
          {/* Contenedor animado */}
          <div className="flex animate-marquee hover:[animation-play-state:paused] gap-6 px-3">
            {[1, 2].map((set) => (
              <div key={set} className="flex gap-6 min-w-max">
                <div className="w-[320px] md:w-[480px] aspect-[4/3] relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl">
                  <Image src="/trabajos (1).jpeg" alt="Resultados" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="w-[320px] md:w-[480px] aspect-[4/3] relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl">
                  <Image src="/trabajos (2).jpeg" alt="Resultados" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="w-[320px] md:w-[480px] aspect-[4/3] relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl">
                  <video autoPlay loop muted playsInline className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700">
                    <source src="/trabajos (1).mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-brand-500/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>
                <div className="w-[320px] md:w-[480px] aspect-[4/3] relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl">
                  <Image src="/trabajos (4).jpeg" alt="Resultados" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="w-[320px] md:w-[480px] aspect-[4/3] relative overflow-hidden rounded-2xl group cursor-pointer shadow-xl">
                  <Image src="/trabajos (3).jpeg" alt="Resultados" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
