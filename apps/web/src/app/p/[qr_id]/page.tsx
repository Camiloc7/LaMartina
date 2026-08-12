'use client';

import React, { useState, use, useEffect } from 'react';
import { Lock, Home, FileText, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function QrPortalPage({ params }: { params: Promise<{ qr_id: string }> }) {
  // En Next.js 15, params es una Promesa.
  const { qr_id } = use(params);

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [propiedad, setPropiedad] = useState<any>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('El PIN debe tener 4 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Usaremos una ruta base relativa si están en el mismo dominio, o podemos usar variable de entorno.
      // Suponiendo que el API corre en :3001 y WEB en :3000 por el monorepo.
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const res = await fetch(`${API_URL}/propiedades/qr-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrId: qr_id, pin }),
      });

      if (!res.ok) {
        throw new Error('PIN incorrecto o código QR inválido.');
      }

      const data = await res.json();
      setPropiedad(data);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-10 h-10 text-emerald-600" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Acceso Privado</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            Ingresa el PIN de 4 dígitos de tu propiedad para ver el historial y solicitar servicios.
          </p>
        </div>

        <form onSubmit={handleAuth} className="w-full max-w-xs space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-center text-3xl tracking-[1em] h-16 font-mono font-bold border-2 border-gray-200 focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>

          {error && (
            <div className="flex items-center text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all active:scale-95"
            disabled={loading || pin.length !== 4}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Ingresar'}
          </Button>
        </form>
      </div>
    );
  }

  // Vista Autenticada (Dashboard de la Propiedad)
  return (
    <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6 flex items-start space-x-4 shadow-sm">
        <div className="p-3 bg-emerald-600 rounded-xl text-white">
          <Home className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{propiedad?.numero}</h2>
          <p className="text-emerald-700 font-medium">{propiedad?.conjunto?.nombre}</p>
          <div className="flex space-x-3 mt-2 text-xs text-gray-500">
            <span className="bg-white px-2 py-1 rounded-md shadow-sm border border-emerald-100">
              {propiedad?.extension} m²
            </span>
            <span className="bg-white px-2 py-1 rounded-md shadow-sm border border-emerald-100">
              Nivel: {propiedad?.complejidad}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Servicios y Novedades</h3>
        
        {/* En el futuro estos podrían listar servicios reales iterando sobre un array */}
        <button className="w-full bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all group text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Último Reporte</p>
              <p className="text-sm text-gray-500">Ver detalles del servicio reciente</p>
            </div>
          </div>
          <span className="text-blue-600 text-sm font-medium pr-2">Ver PDF</span>
        </button>

        <button className="w-full bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between hover:border-amber-300 hover:shadow-md transition-all group text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Radicar PQR</p>
              <p className="text-sm text-gray-500">Peticiones, quejas o felicitaciones</p>
            </div>
          </div>
        </button>

        <button className="w-full bg-emerald-600 p-4 rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all text-white shadow-lg mt-8 active:scale-95">
          <span className="font-bold text-lg">Solicitar Servicio Adicional</span>
        </button>
      </div>
    </div>
  );
}
