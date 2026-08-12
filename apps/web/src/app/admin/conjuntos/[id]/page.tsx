'use client';

import { useState, useEffect, use } from 'react';
import { fetchApi } from '@/lib/api';
import { Building2, Home, FileText, QrCode, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ConjuntoDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [conjunto, setConjunto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resumen' | 'propiedades' | 'cotizaciones'>('propiedades');

  // State for propiedades tab
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numero, setNumero] = useState('');
  const [extension, setExtension] = useState('');
  const [complejidad, setComplejidad] = useState<'BAJA' | 'MEDIA' | 'ALTA'>('MEDIA');

  // State for cotizaciones tab
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [isCotizacionModalOpen, setIsCotizacionModalOpen] = useState(false);
  const [precioTotal, setPrecioTotal] = useState('');
  const [detallesCotizacion, setDetallesCotizacion] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/conjuntos/${id}`);
      if (res.success) {
        setConjunto(res.data);
      }
      
      const resProp = await fetchApi(`/propiedades?conjuntoId=${id}`);
      if (resProp.success) {
        setPropiedades(resProp.data || resProp); // Adjust based on API structure
      }

      const resCot = await fetchApi(`/cotizaciones?conjuntoId=${id}`);
      if (resCot.success) {
        setCotizaciones(resCot.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearPropiedad = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi('/propiedades', {
        method: 'POST',
        body: JSON.stringify({
          numero,
          extension: parseFloat(extension),
          complejidad,
          conjuntoId: id
        })
      });
      if (res.success) {
        setIsModalOpen(false);
        setNumero(''); setExtension(''); setComplejidad('MEDIA');
        loadData(); // Recargar propiedades
      } else {
        alert(res.error || 'Error al crear la casa');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCrearCotizacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi('/cotizaciones', {
        method: 'POST',
        body: JSON.stringify({
          conjuntoId: id,
          precioTotal: parseFloat(precioTotal),
          detalles: { descripcion: detallesCotizacion },
        })
      });
      if (res.success) {
        setIsCotizacionModalOpen(false);
        setPrecioTotal(''); setDetallesCotizacion('');
        loadData();
      } else {
        alert(res.error || 'Error al crear la cotización');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando...</div>;
  if (!conjunto) return <div className="p-8 text-center text-red-500">Conjunto no encontrado</div>;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/conjuntos" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{conjunto.nombre}</h1>
          <p className="text-slate-500">{conjunto.ciudad} • {conjunto.direccion}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-8">
        <button 
          onClick={() => setActiveTab('resumen')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'resumen' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Building2 size={16} /> Resumen
        </button>
        <button 
          onClick={() => setActiveTab('propiedades')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'propiedades' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Home size={16} /> Propiedades (Casas)
        </button>
        <button 
          onClick={() => setActiveTab('cotizaciones')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'cotizaciones' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FileText size={16} /> Cotizaciones
        </button>
      </div>

      <div>
        {activeTab === 'resumen' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Información del Proyecto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Administrador</p>
                <p className="font-medium text-slate-900">{conjunto.admin?.nombre} {conjunto.admin?.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email Contacto</p>
                <p className="font-medium text-slate-900">{conjunto.emailContacto || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'propiedades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Casas registradas</h2>
              <div className="flex gap-3">
                <Link href={`/admin/conjuntos/${id}/print-qrs`}>
                  <Button variant="outline" className="gap-2">
                    <QrCode size={16} /> Exportar QRs
                  </Button>
                </Link>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-brand-600 hover:bg-brand-700 text-white">
                  <Plus size={16} /> Agregar Casa
                </Button>
              </div>
            </div>

            {propiedades.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No hay casas registradas en este conjunto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propiedades.map((p: any) => (
                  <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-900">{p.numero}</h3>
                        <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">{p.complejidad}</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">{p.extension} m²</p>
                      
                      <div className="text-sm">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Propietario</p>
                        {p.propietario ? (
                          <p className="font-medium text-slate-700">{p.propietario.nombre} {p.propietario.apellido}</p>
                        ) : (
                          <p className="text-slate-400 italic">No asignado</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="text-xs">
                        <p className="text-slate-400">PIN de Acceso</p>
                        <p className="font-mono font-bold text-slate-700 tracking-widest">{p.pinAcceso || '****'}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                        Ver QR
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cotizaciones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Cotizaciones del Conjunto</h2>
              <Button onClick={() => setIsCotizacionModalOpen(true)} className="gap-2 bg-brand-600 hover:bg-brand-700 text-white">
                <Plus size={16} /> Crear Cotización
              </Button>
            </div>

            {cotizaciones.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay cotizaciones registradas para este conjunto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cotizaciones.map((cot: any) => (
                  <div key={cot.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900">Cotización #{cot.id.substring(0, 8)}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${cot.estado === 'APROBADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {cot.estado}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{cot.detalles?.descripcion || 'Sin detalles'}</p>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total</p>
                        <p className="font-bold text-lg text-slate-800">${cot.precioTotal?.toLocaleString()}</p>
                      </div>
                      {cot.estado !== 'APROBADA' && (
                        <Button variant="outline" size="sm" className="text-brand-600 border-brand-200 hover:bg-brand-50">
                          Aprobar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Agregar Nueva Casa</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCrearPropiedad} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Número / Identificador</label>
                  <Input 
                    required 
                    placeholder="Ej: Casa 14, Apto 201" 
                    value={numero} 
                    onChange={(e) => setNumero(e.target.value)} 
                    className="rounded-xl border-slate-200"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Extensión (m²)</label>
                    <Input 
                      required 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={extension} 
                      onChange={(e) => setExtension(e.target.value)} 
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Complejidad</label>
                    <select 
                      value={complejidad} 
                      onChange={(e) => setComplejidad(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Casa'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCotizacionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Crear Cotización</h3>
              <button onClick={() => setIsCotizacionModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCrearCotizacion} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Precio Total (COP)</label>
                  <Input 
                    required 
                    type="number"
                    placeholder="Ej: 500000" 
                    value={precioTotal} 
                    onChange={(e) => setPrecioTotal(e.target.value)} 
                    className="rounded-xl border-slate-200 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción de la Propuesta</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Detalles del servicio a cotizar..."
                    value={detallesCotizacion}
                    onChange={(e) => setDetallesCotizacion(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setIsCotizacionModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-xl"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cotización'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
