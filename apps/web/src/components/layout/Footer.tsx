import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contacto" className="bg-[#0f172a] text-slate-300 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo.png" alt="La Martina Logo" width={40} height={40} className="rounded object-cover grayscale brightness-200" />
            <span className="font-bold text-2xl text-white tracking-tight">La Martina</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed pr-4">
            Especialistas en transformar y mantener los espacios verdes de su conjunto residencial con tecnología, transparencia y pasión.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-brand-500 mt-0.5 flex-shrink-0" size={18} />
              <span>Bogotá, Colombia</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-brand-500 flex-shrink-0" size={18} />
              <span>+57 300 000 0000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-brand-500 flex-shrink-0" size={18} />
              <span>contacto@lamartina.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/#inicio" className="hover:text-brand-400 transition-colors">Volver arriba</Link></li>
            <li><Link href="/#servicios" className="hover:text-brand-400 transition-colors">Nuestros Servicios</Link></li>
            <li><Link href="#" className="hover:text-brand-400 transition-colors">Políticas de Privacidad</Link></li>
            <li><Link href="#" className="hover:text-brand-400 transition-colors">Términos y Condiciones</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Únete a nuestro equipo</h4>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            ¿Eres experto en jardinería, paisajismo o mantenimiento? Buscamos talento con pasión por el detalle.
          </p>
          <Link href="/trabaja-con-nosotros" className="inline-flex items-center justify-center w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-brand-500/20">
            Trabaja con Nosotros
          </Link>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} La Martina. Todos los derechos reservados.</span>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <Link href="/admin/pqr" className="hover:text-slate-300 transition-colors">Portal Administradores</Link>
          <span>Desarrollado con ❤️ para el cuidado del paisajismo.</span>
        </div>
      </div>
    </footer>
  );
}
