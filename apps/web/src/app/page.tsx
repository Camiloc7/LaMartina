import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'La Martina — Gestión Inteligente de Conjuntos Residenciales',
  description:
    'Centraliza la gestión de jornadas laborales, PQR y seguimiento operativo de tus conjuntos residenciales. La Martina es la plataforma todo-en-uno para administradores modernos.',
};

// ─── Sección Hero ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      {/* Fondo con efecto de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-brand-950/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-700/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
          Plataforma Centralizada · MVP 2025
        </div>

        {/* Título principal */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          La{' '}
          <span className="text-gradient">Martina</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-4 font-light">
          Gestión inteligente de conjuntos residenciales
        </p>
        <p className="text-slate-500 max-w-2xl mx-auto mb-12">
          Centraliza jornadas laborales, PQR y el seguimiento operativo de todos
          tus conjuntos en un solo lugar. Diseñado para administradores modernos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/portal" className="btn-brand text-lg px-8 py-4">
            Acceder a la Plataforma
          </Link>
          <Link
            href="#servicios"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-slate-300 border border-surface-border hover:border-brand-500/50 hover:text-white transition-all duration-200"
          >
            Ver cómo funciona
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Sección Servicios ────────────────────────────────────────────────────────

const servicios = [
  {
    emoji: '🗓️',
    titulo: 'Control de Jornadas',
    descripcion:
      'Operarios registran inicio y fin de jornada con evidencias fotográficas geolocalizadas. Supervisión en tiempo real.',
  },
  {
    emoji: '📋',
    titulo: 'Gestión de PQR',
    descripcion:
      'Sistema de radicación y seguimiento de Peticiones, Quejas y Reclamos con adjuntos y número de radicado único.',
  },
  {
    emoji: '🏘️',
    titulo: 'Conjuntos Residenciales',
    descripcion:
      'Administra múltiples conjuntos desde un panel centralizado. Galería de instalaciones, directorio y métricas.',
  },
  {
    emoji: '📸',
    titulo: 'Evidencias en la Nube',
    descripcion:
      'Todas las imágenes y documentos se almacenan y optimizan automáticamente en Cloudinary. Disponibles 24/7.',
  },
  {
    emoji: '🔐',
    titulo: 'Roles y Permisos',
    descripcion:
      'Control granular de acceso: Super Admin, Admin, Operario y Cliente. Cada rol ve solo lo que necesita.',
  },
  {
    emoji: '📊',
    titulo: 'Reportes y Métricas',
    descripcion:
      'Dashboard con indicadores clave de gestión operativa, tiempos de respuesta y productividad del equipo.',
  },
];

function ServiciosSection() {
  return (
    <section id="servicios" className="py-24 px-6 bg-surface-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Todo lo que necesitas, <span className="text-gradient">en un solo lugar</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Diseñado específicamente para las necesidades de la gestión
            operativa de conjuntos residenciales en Colombia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <div key={s.titulo} className="glass-card p-6 hover:border-brand-500/50 transition-all duration-300 group animate-slide-up">
              <span className="text-4xl mb-4 block">{s.emoji}</span>
              <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-brand-400 transition-colors">
                {s.titulo}
              </h3>
              <p className="text-slate-400 leading-relaxed">{s.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent rounded-2xl" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              ¿Listo para modernizar tu gestión?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Únete a La Martina y transforma la administración de tus
              conjuntos residenciales.
            </p>
            <Link href="/portal/login" className="btn-brand text-lg px-10 py-4">
              Comenzar ahora →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <ServiciosSection />
      <CTASection />

      <footer className="py-8 px-6 border-t border-surface-border text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} La Martina. Todos los derechos reservados.
      </footer>
    </main>
  );
}
