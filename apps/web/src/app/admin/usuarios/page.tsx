'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, Shield, Wrench, User as UserIcon, MoreVertical, CheckCircle2, XCircle, Plus, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('CLIENTE');

  const loadData = async () => {
    try {
      const response = await fetchApi('/users');
      if (response.success && response.data) {
        setUsuarios(response.data);
      }
    } catch (error) {
      console.error('Error al cargar Usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetchApi('/auth/register/staff', {
        method: 'POST',
        body: JSON.stringify({ nombre, apellido, email, password, telefono, rol }),
      });

      if (response.success) {
        // Recargar datos y cerrar modal
        await loadData();
        setIsModalOpen(false);
        setNombre(''); setApellido(''); setEmail(''); setPassword(''); setTelefono(''); setRol('CLIENTE');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear el usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'SUPER_ADMIN': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200"><Shield size={12} /> Súper Admin</span>;
      case 'ADMIN': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 border border-brand-200"><Shield size={12} /> Admin</span>;
      case 'OPERARIO': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"><Wrench size={12} /> Operario</span>;
      case 'CLIENTE': 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"><UserIcon size={12} /> Cliente</span>;
      default: 
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{rol}</span>;
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Directorio de Usuarios</h1>
          <p className="text-slate-500 mt-1">Administra accesos y perfiles de clientes, operarios y administradores.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus size={20} /> Nuevo Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Activos</p>
            <h3 className="text-3xl font-bold text-slate-800">{usuarios.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Users className="text-slate-400" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Administradores</p>
            <h3 className="text-3xl font-bold text-brand-600">
              {usuarios.filter(u => u.rol === 'ADMIN' || u.rol === 'SUPER_ADMIN').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
            <Shield className="text-brand-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Operarios</p>
            <h3 className="text-3xl font-bold text-blue-600">
              {usuarios.filter(u => u.rol === 'OPERARIO').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Wrench className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Clientes</p>
            <h3 className="text-3xl font-bold text-slate-600">
              {usuarios.filter(u => u.rol === 'CLIENTE').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <UserIcon className="text-slate-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              <Filter size={18} /> Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Cargando usuarios...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Registro</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No hay usuarios que coincidan con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredUsuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0 border border-slate-300">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt={u.nombre} className="w-full h-full object-cover" />
                            ) : (
                              u.nombre?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{u.nombre} {u.apellido}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(u.rol)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {u.telefono || <span className="text-slate-400 italic">No registrado</span>}
                      </td>
                      <td className="px-6 py-4">
                        {u.activo ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 size={16} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                            <XCircle size={16} /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Crear Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-800 font-display">Crear Nuevo Usuario</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <input 
                      required 
                      type="text" 
                      value={nombre} 
                      onChange={e => setNombre(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                    <input 
                      required 
                      type="text" 
                      value={apellido} 
                      onChange={e => setApellido(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      value={telefono} 
                      onChange={e => setTelefono(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                    <select 
                      value={rol} 
                      onChange={e => setRol(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-white"
                    >
                      <option value="CLIENTE">Cliente</option>
                      <option value="OPERARIO">Operario</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña (Temporal)</label>
                  <input 
                    required 
                    type="text" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
                    placeholder="Ej. temporal123"
                  />
                  <p className="text-xs text-slate-400 mt-1">El usuario podrá cambiarla después.</p>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="create-user-form"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
