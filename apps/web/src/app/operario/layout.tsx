'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { CalendarClock, User, LogOut, Map, Bell } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function OperarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchApi('/auth/me');
        if (response.success && response.data) {
          const userData = response.data.user || response.data;
          
          if (userData.rol !== 'OPERARIO' && userData.rol !== 'ADMIN' && userData.rol !== 'SUPER_ADMIN') {
            throw new Error('Unauthorized role');
          }

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error(error);
    }
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center text-brand-500">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium tracking-widest text-sm uppercase">Cargando...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col pb-20 selection:bg-brand-500/30 font-sans relative overflow-hidden">
      
      {/* Luces de fondo sutiles (Background glow) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* Top Header Glass */}
      <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/50 supports-[backdrop-filter]:bg-slate-950/30">
        <div className="px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-brand-400 font-bold text-lg">
                  {user?.nombre?.charAt(0) || 'O'}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm leading-tight">Hola, {user?.nombre}</p>
              <p className="text-xs text-brand-400 font-medium">Operario en Terreno</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-white transition-colors bg-slate-900/50 rounded-full">
              <Bell size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-red-400 hover:text-red-300 transition-colors bg-slate-900/50 rounded-full"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 animate-fade-in relative z-10 w-full max-w-md mx-auto">
        {children}
      </main>

      {/* Bottom Navigation Bar (Glassmorphism) */}
      <div className="fixed bottom-0 w-full z-50 px-4 pb-safe pt-2 pointer-events-none">
        <nav className="max-w-sm mx-auto bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 shadow-2xl shadow-black/50 rounded-3xl flex justify-around p-2 pointer-events-auto relative overflow-hidden">
          
          <Link 
            href="/operario/jornadas" 
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 w-1/3 relative z-10 ${pathname.includes('jornadas') ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {pathname.includes('jornadas') && (
              <div className="absolute inset-0 bg-brand-500/20 rounded-2xl animate-fade-in"></div>
            )}
            <CalendarClock size={24} className={`mb-1 ${pathname.includes('jornadas') ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Jornada</span>
          </Link>

          <Link 
            href="/operario/mapa" 
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 w-1/3 relative z-10 ${pathname.includes('mapa') ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {pathname.includes('mapa') && (
              <div className="absolute inset-0 bg-brand-500/20 rounded-2xl animate-fade-in"></div>
            )}
            <Map size={24} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rutas</span>
          </Link>

          <Link 
            href="/operario/perfil" 
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 w-1/3 relative z-10 ${pathname.includes('perfil') ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {pathname.includes('perfil') && (
              <div className="absolute inset-0 bg-brand-500/20 rounded-2xl animate-fade-in"></div>
            )}
            <User size={24} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
          </Link>
        </nav>
      </div>
      
      {/* Safe Area para iOS */}
      <style dangerouslySetInnerHTML={{__html: `
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
      `}} />
    </div>
  );
}
