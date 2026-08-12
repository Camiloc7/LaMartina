'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquareWarning, CalendarClock, Users, LogOut, Menu, X, Building2, CalendarDays, ChevronLeft, ChevronRight, DollarSign, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import Image from 'next/image';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Finanzas', href: '/admin/finanzas', icon: DollarSign },
  { name: 'Programación', href: '/admin/programacion', icon: CalendarDays },
  { name: 'PQRs', href: '/admin/pqr', icon: MessageSquareWarning },
  { name: 'Jornadas', href: '/admin/jornadas', icon: CalendarClock },
  { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
  { name: 'Conjuntos', href: '/admin/conjuntos', icon: Building2 },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // For Mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // For Desktop
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetchApi('/auth/me');
        if (response.success && response.data) {
          const userData = response.data.user || response.data;

          if (userData.rol !== 'ADMIN' && userData.rol !== 'SUPER_ADMIN') {
            throw new Error('Unauthorized role');
          }

          setUser(userData);
          // Opcional: Actualizar localStorage para tenerlo en caché
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
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-brand-900 to-brand-950 text-white shadow-xl z-50 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:static lg:flex-shrink-0 flex flex-col
      `}>
        <div className={`h-20 flex items-center px-6 border-b border-brand-800/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="La Martina" 
              width={isCollapsed ? 40 : 50} 
              height={isCollapsed ? 40 : 50} 
              className="rounded-lg object-cover bg-white p-1"
            />
            {!isCollapsed && <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">La Martina</span>}
          </Link>
          {!isCollapsed && (
            <button className="lg:hidden text-brand-200 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          )}
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-5rem)]">
          <div className="flex-1 space-y-2 mt-4 relative group">
            {/* Botón para contraer (solo en desktop) */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-8 top-4 bg-brand-800 text-white p-1 rounded-full shadow-md hover:bg-brand-700 transition-colors z-50 border border-brand-700/50"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 py-3 rounded-xl transition-all font-medium
                    ${isCollapsed ? 'justify-center px-0' : 'px-4'}
                    ${isActive 
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                      : 'text-brand-100/70 hover:bg-brand-800/50 hover:text-white'
                    }
                  `}
                  title={isCollapsed ? link.name : ''}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-brand-800/50">
            <div className={`flex items-center gap-3 py-3 mb-4 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
              <div className="w-10 h-10 shrink-0 rounded-full bg-brand-800 flex items-center justify-center font-bold text-orange-300">
                {user?.nombre?.charAt(0) || 'A'}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user?.nombre} {user?.apellido}</p>
                  <p className="text-xs text-brand-200/70 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <a
              href="#"
              onClick={handleLogout}
              className={`flex items-center gap-3 py-3 rounded-xl text-brand-200/70 hover:bg-red-500/20 hover:text-red-300 transition-all font-medium cursor-pointer ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
              title={isCollapsed ? 'Cerrar Sesión' : ''}
            >
              <LogOut size={20} className="shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile */}
        <header className="h-16 lg:hidden bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
          <button 
            className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg ml-4 text-slate-800">Portal Administrador</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
