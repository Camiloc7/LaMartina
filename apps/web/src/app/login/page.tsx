'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        // El backend ya estableció la cookie HttpOnly con el token
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (response.data.user.rol === 'OPERARIO') {
          router.push('/operario/jornadas');
        } else {
          router.push('/admin/pqr');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans animate-fade-in">
      {/* Lado Izquierdo: Formulario */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 lg:px-20 xl:px-24 border-r border-slate-100 shadow-2xl z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center sm:text-left">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image src="/logo.png" alt="La Martina Logo" width={120} height={120} className="rounded-2xl mx-auto sm:mx-0 shadow-lg shadow-slate-200/50" />
            </Link>
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 font-display">
              Portal Administradores
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ingresa tus credenciales para gestionar La Martina
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all text-slate-800"
                  placeholder="admin@lamartina.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all text-slate-800"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-brand-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? 'Verificando...' : 'Entrar al Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Imagen de Fondo */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900 group overflow-hidden">
        <Image
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-overlay"
          src="/paisajismo-1.jpeg"
          alt="Paisajismo La Martina"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white transform transition-transform duration-700 translate-y-4 group-hover:translate-y-0">
          <blockquote className="space-y-4">
            <p className="text-3xl font-display font-medium leading-relaxed drop-shadow-md">
              "Transformamos y mantenemos los espacios verdes de tu conjunto residencial con precisión y tecnología."
            </p>
            <footer className="text-lg text-brand-300 font-medium">
              Gestión Integral La Martina
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
