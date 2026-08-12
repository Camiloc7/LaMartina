'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactFooter() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetchApi('/configuracion/public');
        if (res.success && res.data) {
          setConfig(res.data);
        }
      } catch (err) {
        console.error('Error loading config:', err);
      }
    };
    loadConfig();
  }, []);

  if (!config) return null;

  return (
    <footer className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">{config.nombreEmpresa || 'La Martina'} - Contacto</h3>
      <div className="space-y-3 text-sm text-slate-600">
        {config.telefonoContacto && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <Phone size={16} />
            </div>
            <span>{config.telefonoContacto}</span>
          </div>
        )}
        {config.correoContacto && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <Mail size={16} />
            </div>
            <span>{config.correoContacto}</span>
          </div>
        )}
        {config.horarioAtencion && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <Clock size={16} />
            </div>
            <span>{config.horarioAtencion}</span>
          </div>
        )}
        {config.direccionFisica && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <MapPin size={16} />
            </div>
            <span>{config.direccionFisica}</span>
          </div>
        )}
      </div>
    </footer>
  );
}
