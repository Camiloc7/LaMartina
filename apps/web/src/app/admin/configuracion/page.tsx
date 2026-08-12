'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Building2, Phone, Mail, MapPin, Clock, Save, Loader2, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

export default function AdminConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    nombreEmpresa: '',
    telefonoContacto: '',
    correoContacto: '',
    direccionFisica: '',
    horarioAtencion: '',
    redesSociales: [] as { plataforma: string, url: string }[]
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetchApi('/configuracion');
      if (res.success && res.data) {
        setConfig({
          nombreEmpresa: res.data.nombreEmpresa || '',
          telefonoContacto: res.data.telefonoContacto || '',
          correoContacto: res.data.correoContacto || '',
          direccionFisica: res.data.direccionFisica || '',
          horarioAtencion: res.data.horarioAtencion || '',
          redesSociales: res.data.redesSociales || []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchApi('/configuracion', {
        method: 'PATCH',
        body: JSON.stringify(config)
      });
      if (res.success) {
        alert('Configuración guardada exitosamente');
      }
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" /></div>;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Configuración Global y Marca</h1>
        <p className="text-slate-500">Administra la identidad y los datos de contacto visibles para los clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Izquierdo: Previsualización de Logo y Marca */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-slate-700 mb-4 w-full text-left">Logo Actual</h3>
            <div className="w-32 h-32 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="Logo La Martina" 
                width={100} 
                height={100} 
                className="object-contain"
              />
            </div>
            <p className="text-xs text-slate-400">
              El logo se obtiene del archivo <code>/public/logo.png</code>. Para cambiarlo, debes reemplazar el archivo en el código fuente.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="col-span-1 md:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-xl text-slate-800 border-b border-slate-100 pb-4 mb-4">Información de Contacto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de la Empresa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={18} className="text-slate-400" />
                  </div>
                  <input 
                    name="nombreEmpresa"
                    value={config.nombreEmpresa}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono / WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-slate-400" />
                  </div>
                  <input 
                    name="telefonoContacto"
                    value={config.telefonoContacto}
                    onChange={handleChange}
                    placeholder="+57 300..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input 
                    name="correoContacto"
                    type="email"
                    value={config.correoContacto}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Horario de Atención</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-slate-400" />
                  </div>
                  <input 
                    name="horarioAtencion"
                    value={config.horarioAtencion}
                    onChange={handleChange}
                    placeholder="Lun - Vie 8am - 5pm"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección Física</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-slate-400" />
                  </div>
                  <input 
                    name="direccionFisica"
                    value={config.direccionFisica}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
