'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Home, Building2, MapPin, Plus, X, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ConjuntosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [nit, setNit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [adminId, setAdminId] = useState('');

  const loadData = async () => {
    try {
      const [resConjuntos, resUsuarios] = await Promise.all([
        fetchApi('/conjuntos'),
        fetchApi('/users')
      ]);

      if (resConjuntos.success) {
        setConjuntos(resConjuntos.data);
      }
      
      if (resUsuarios.success) {
        setUsuarios(resUsuarios.data);
      }
    } catch (error) {
      console.error('Error al cargar Conjuntos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!adminId) {
      setError('Debes seleccionar un administrador / representante para el conjunto.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetchApi('/conjuntos', {
        method: 'POST',
        body: JSON.stringify({ nombre, direccion, ciudad, nit, telefono, emailContacto, adminId }),
      });

      if (response.success) {
        await loadData();
        setIsModalOpen(false);
        setNombre(''); setDireccion(''); setCiudad(''); setNit(''); setTelefono(''); setEmailContacto(''); setAdminId('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear el conjunto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredConjuntos = conjuntos.filter(c => 
    c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.admin?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in relative min-h-screen">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">Directorio de Proyectos</h1>
          <p className="text-slate-500 mt-2 text-lg">Administra las casas y conjuntos de La Martina.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar proyectos, ciudades, admins..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-0 bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold shadow-sm w-full sm:w-auto">
            <Filter size={18} /> Filtrar
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white/50 rounded-[2rem] h-64 animate-pulse border border-slate-200/50"></div>
          ))}
        </div>
      ) : filteredConjuntos.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200 border-dashed">
          <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No hay proyectos encontrados</h3>
          <p className="text-slate-500 mt-2">Crea un nuevo proyecto para comenzar a gestionarlo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredConjuntos.map((c) => (
            <div key={c.id} className="group relative bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-300 overflow-hidden">
              
              {/* Decorative gradient corner */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-brand-100 to-brand-300 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                  <Home size={28} className="text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-1 leading-tight group-hover:text-brand-600 transition-colors">{c.nombre}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-4">
                  <MapPin size={14} className="text-brand-400" />
                  {c.ciudad}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Dirección</p>
                    <p className="text-sm text-slate-700 truncate font-medium">{c.direccion}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex-1">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Contacto</p>
                      <p className="text-sm text-slate-700 truncate font-medium">{c.telefono || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Tag */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Administrador del Proyecto</p>
                  {c.admin ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        {c.admin.nombre.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{c.admin.nombre} {c.admin.apellido}</p>
                        <p className="text-xs text-slate-500 truncate">{c.admin.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 italic">No asignado</div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 hover:bg-brand-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-900/40 transition-all hover:scale-110 z-40 group"
      >
        <div className="absolute inset-0 rounded-full bg-brand-500 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Plus size={32} className="relative z-10" />
      </button>

      {/* Modal Crear Conjunto con Glassmorphism */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop blur profundo */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white/95 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 font-display">Nuevo Proyecto</h3>
                <p className="text-sm text-slate-500 mt-1">Registra una nueva casa o conjunto</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="create-conjunto-form" onSubmit={handleCreate} className="space-y-5">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 font-medium">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Conjunto o Casa</label>
                  <input 
                    required 
                    type="text" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow"
                    placeholder="Ej. Conjunto Residencial Los Pinos"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                    <input 
                      required 
                      type="text" 
                      value={ciudad} 
                      onChange={e => setCiudad(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">NIT (Opcional)</label>
                    <input 
                      type="text" 
                      value={nit} 
                      onChange={e => setNit(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Dirección Completa</label>
                  <input 
                    required 
                    type="text" 
                    value={direccion} 
                    onChange={e => setDireccion(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                    <input 
                      type="tel" 
                      value={telefono} 
                      onChange={e => setTelefono(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Contacto</label>
                    <input 
                      type="email" 
                      value={emailContacto} 
                      onChange={e => setEmailContacto(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Representante / Administrador</label>
                  <select 
                    required
                    value={adminId} 
                    onChange={e => setAdminId(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-0 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 font-medium transition-shadow appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona un usuario...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} {u.apellido} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-[2.5rem]">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="create-conjunto-form"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-brand-600 shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 blur group-hover:opacity-100 opacity-0 transition-opacity"></div>
                <span className="relative z-10">{isSubmitting ? 'Guardando...' : 'Crear Proyecto'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation classes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
