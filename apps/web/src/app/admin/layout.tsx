'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquareWarning, CalendarClock, Users, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'PQRs', href: '/admin/pqr', icon: MessageSquareWarning },
  { name: 'Jornadas', href: '/admin/jornadas', icon: CalendarClock },
  { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (e) {}
    setIsLoading(false);
  }, [router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('accessToken');
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
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-white shadow-xl z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:static lg:flex-shrink-0
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <span className="text-brand-500">La</span> Martina
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-5rem)]">
          <div className="flex-1 space-y-1 mt-4">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                    ${isActive 
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-brand-400">
                {user?.nombre?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.nombre} {user?.apellido}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <a
              href="#"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium cursor-pointer"
            >
              <LogOut size={20} />
              Cerrar Sesión
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
