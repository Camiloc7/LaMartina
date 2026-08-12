'use client';

import { useState, useEffect, use } from 'react';
import { fetchApi } from '@/lib/api';
import { Building2, Home, FileText, QrCode, ArrowLeft, Plus, X, Trash2, History, Layers } from 'lucide-react';
import Link from 'next/link';

export default function ConjuntoDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [conjunto, setConjunto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'resumen' | 'propiedades' | 'cotizaciones'>('propiedades');

  // State for propiedades tab
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMasivo, setIsMasivo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numero, setNumero] = useState(''); // Se usará como "Prefijo" si es masivo
  const [cantidadMasiva, setCantidadMasiva] = useState('10');
  const [extension, setExtension] = useState('');
  const [complejidad, setComplejidad] = useState<'BAJA' | 'MEDIA' | 'ALTA'>('MEDIA');

  // State for Historial
  const [historialModalOpen, setHistorialModalOpen] = useState(false);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState<any>(null);
  const [historialTrabajos, setHistorialTrabajos] = useState<any[]>([]);

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
      let endpoint = '/propiedades';
      let payload: any = {
        extension: parseFloat(extension),
        complejidad,
        conjuntoId: id
      };

      if (isMasivo) {
        endpoint = '/propiedades/bulk';
        payload.prefijo = numero;
        payload.cantidad = parseInt(cantidadMasiva, 10);
      } else {
        payload.numero = numero;
      }

      const res = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.success) {
        setIsModalOpen(false);
        setNumero(''); setExtension(''); setComplejidad('MEDIA'); setIsMasivo(false);
        loadData(); // Recargar propiedades
      }
    } catch (err: any) {
      alert(err.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDesactivar = async (propiedadId: string) => {
    if (!confirm('¿Seguro que deseas ocultar esta casa? No se borrarán sus registros pasados.')) return;
    try {
      const res = await fetchApi(`/propiedades/${propiedadId}/desactivar`, {
        method: 'PATCH',
      });
      if (res.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Error al desactivar la propiedad');
    }
  };

  const verHistorial = async (propiedad: any) => {
    setPropiedadSeleccionada(propiedad);
    setHistorialModalOpen(true);
    setHistorialTrabajos([]); // Reset while loading
    try {
      const res = await fetchApi(`/propiedades/${propiedad.id}/historial`);
      if (res.success) {
        setHistorialTrabajos(res.data);
      }
    } catch (err: any) {
      console.error('Error al cargar historial', err);
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
      }
    } catch (err: any) {
      alert(err.message || 'Error de conexión');
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
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">
                    <QrCode size={16} /> Exportar QRs
                  </button>
                </Link>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg">
                  <Plus size={16} /> Agregar Casa
                </button>
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
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-slate-500 mb-4">{p.extension} m²</p>
                        <div className="flex gap-1">
                          <button onClick={() => verHistorial(p)} title="Ver Historial" className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors">
                            <History size={16} />
                          </button>
                          <button onClick={() => handleDesactivar(p.id)} title="Eliminar/Ocultar" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
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
                      <button className="px-3 py-1.5 text-sm rounded-md text-brand-600 hover:text-brand-700 hover:bg-brand-50 transition-colors">
                        Ver QR
                      </button>
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
              <button onClick={() => setIsCotizacionModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg">
                <Plus size={16} /> Crear Cotización
              </button>
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
                        <button className="px-3 py-1.5 text-sm border border-brand-200 rounded-md text-brand-600 hover:bg-brand-50 transition-colors">
                          Aprobar
                        </button>
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
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 text-slate-400">
                    <Layers size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Creación Masiva</p>
                    <p className="text-xs text-slate-500">Genera múltiples casas de una vez</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isMasivo} onChange={() => setIsMasivo(!isMasivo)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                {isMasivo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prefijo Base</label>
                      <input 
                        required 
                        placeholder="Ej: Casa " 
                        value={numero} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumero(e.target.value)} 
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad</label>
                      <input 
                        required 
                        type="number" 
                        min="1"
                        max="200"
                        placeholder="Ej: 50" 
                        value={cantidadMasiva} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCantidadMasiva(e.target.value)} 
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Número / Identificador</label>
                    <input 
                      required 
                      placeholder="Ej: Casa 14, Apto 201" 
                      value={numero} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumero(e.target.value)} 
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Extensión (m²)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={extension} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExtension(e.target.value)} 
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Complejidad</label>
                    <select 
                      value={complejidad} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setComplejidad(e.target.value as any)}
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
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Casa'}
                </button>
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
                  <input 
                    required 
                    type="number"
                    placeholder="Ej: 500000" 
                    value={precioTotal} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrecioTotal(e.target.value)} 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-lg outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción de la Propuesta</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Detalles del servicio a cotizar..."
                    value={detallesCotizacion}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDetallesCotizacion(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50"
                  onClick={() => setIsCotizacionModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cotización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historialModalOpen && propiedadSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Historial de Trabajos</h3>
                <p className="text-sm text-slate-500">{propiedadSeleccionada.numero} - {propiedadSeleccionada.conjunto?.nombre}</p>
              </div>
              <button onClick={() => setHistorialModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              {historialTrabajos.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No hay registros de trabajos para esta casa.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historialTrabajos.map((trabajo: any) => (
                    <div key={trabajo.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand-500 rounded-l-xl"></div>
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <h4 className="font-bold text-slate-800">{trabajo.programacion?.cotizacion?.detalles?.descripcion || 'Trabajo de limpieza'}</h4>
                        <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
                          {new Date(trabajo.fechaFin || trabajo.fechaInicio || trabajo.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pl-2">
                        <p className="text-sm text-slate-600 mb-2">{trabajo.observaciones || 'Sin observaciones registradas.'}</p>
                        <div className="flex items-center text-xs text-slate-400">
                          <span className="font-medium">Operario:</span>
                          <span className="ml-1">{trabajo.operario ? `${trabajo.operario.nombre} ${trabajo.operario.apellido}` : 'Desconocido'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
