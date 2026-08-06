import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panel Administrativo — La Martina',
};

const stats = [
  { label: 'Conjuntos activos', value: '—', icon: '🏘️', href: '/admin/conjuntos' },
  { label: 'Jornadas hoy', value: '—', icon: '🗓️', href: '/admin/jornadas' },
  { label: 'PQR abiertas', value: '—', icon: '📋', href: '/admin/pqr' },
  { label: 'Operarios activos', value: '—', icon: '👷', href: '/admin/users' },
];

const accesosRapidos = [
  { titulo: 'Ver todas las PQR', descripcion: 'Gestiona peticiones, quejas y reclamos', href: '/admin/pqr', emoji: '📋' },
  { titulo: 'Jornadas del día', descripcion: 'Supervisa el trabajo en tiempo real', href: '/admin/jornadas', emoji: '⏱️' },
  { titulo: 'Gestionar conjuntos', descripcion: 'Agrega imágenes y datos de conjuntos', href: '/admin/conjuntos', emoji: '🏘️' },
  { titulo: 'Administrar usuarios', descripcion: 'Crea y gestiona operarios y clientes', href: '/admin/users', emoji: '👥' },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Panel Administrativo
            </h1>
            <p className="text-slate-400">
              Bienvenido a{' '}
              <span className="text-gradient font-semibold">La Martina</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-400 text-sm">Sistema operativo</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="glass-card p-5 hover:border-brand-500/50 transition-all duration-300 group animate-slide-up"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <p className="font-display text-2xl font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">
                {stat.value}
              </p>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Accesos Rápidos */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold text-white mb-4">
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accesosRapidos.map((item) => (
              <Link
                key={item.titulo}
                href={item.href}
                className="glass-card p-6 flex items-start gap-4 hover:border-brand-500/50 transition-all duration-300 group"
              >
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors mb-1">
                    {item.titulo}
                  </h3>
                  <p className="text-slate-500 text-sm">{item.descripcion}</p>
                </div>
                <span className="ml-auto text-slate-600 group-hover:text-brand-400 transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Nota de Cloudinary */}
        <div className="glass-card p-5 border-brand-500/30 flex items-start gap-3">
          <span className="text-2xl">☁️</span>
          <div>
            <h3 className="font-medium text-brand-400 mb-1">
              Almacenamiento en Cloudinary activo
            </h3>
            <p className="text-slate-500 text-sm">
              Todas las evidencias de jornadas, adjuntos de PQR e imágenes de conjuntos
              se almacenan y optimizan automáticamente. Las imágenes se sirven en formato
              WebP para máxima velocidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
