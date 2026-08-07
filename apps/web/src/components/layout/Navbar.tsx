import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.jpeg" alt="La Martina Logo" width={50} height={50} className="rounded-md object-cover" />
          <span className="font-bold text-2xl text-slate-800 tracking-tight hidden md:block">La Martina</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <Link href="/#inicio" className="hover:text-brand-500 transition-colors">Inicio</Link>
          <Link href="/#servicios" className="hover:text-brand-500 transition-colors">Servicios</Link>
          <Link href="/#galeria" className="hover:text-brand-500 transition-colors">Galería</Link>
          <Link href="/#contacto" className="hover:text-brand-500 transition-colors">Contacto</Link>
        </nav>
        
        <div className="hidden md:block w-[140px]"></div>
      </div>
    </header>
  );
}
