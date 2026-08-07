'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2, Clock, AlertCircle, X, UserPlus } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PQRPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pqrs, setPqrs] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states para Crear PQR
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [tipo, setTipo] = useState('PETICION');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('MEDIA');
  const [clienteId, setClienteId] = useState('');
  const [conjuntoId, setConjuntoId] = useState('');

  // Modal states para Asignar Operario
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [pqrToAssign, setPqrToAssign] = useState<any>(null);
  const [selectedOperarioId, setSelectedOperarioId] = useState('');

  const loadData = async () => {
    try {
      const [resPqrs, resUsuarios, resConjuntos] = await Promise.all([
        fetchApi('/pqr'),
        fetchApi('/users'),
        fetchApi('/conjuntos')
      ]);

      if (resPqrs.success) setPqrs(resPqrs.data);
      if (resUsuarios.success) setUsuarios(resUsuarios.data);
      if (resConjuntos.success) setConjuntos(resConjuntos.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!clienteId || !conjuntoId) {
      setError('Debes seleccionar un cliente y un conjunto.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetchApi('/pqr', {
        method: 'POST',
        body: JSON.stringify({
          tipo,
          titulo,
          descripcion,
          prioridad,
          conjuntoId,
          clienteId 
        }),
      });

      if (response.success) {
        await loadData();
        setIsModalOpen(false);
        setTipo('PETICION'); setTitulo(''); setDescripcion(''); setPrioridad('MEDIA'); setClienteId(''); setConjuntoId('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear la orden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignModal = (pqr: any) => {
    setPqrToAssign(pqr);
    setSelectedOperarioId(pqr.asignadoA?.id || '');
    setIsAssignModalOpen(true);
  };

  const handleAssignOperario = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!selectedOperarioId) {
      setError('Debes seleccionar un operario.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetchApi(`/pqr/${pqrToAssign.id}/responder`, {
        method: 'PATCH',
        body: JSON.stringify({
          respuesta: pqrToAssign.respuesta || '', // Keep existing or empty
          estado: 'EN_PROCESO', // Update status automatically when assigned
          asignadoAId: selectedOperarioId
        }),
      });

      if (response.success) {
        await loadData();
        setIsAssignModalOpen(false);
        setPqrToAssign(null);
        setSelectedOperarioId('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al asignar al operario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'ABIERTA': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EN_PROCESO': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'RESUELTA': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CERRADA': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'ABIERTA': return <AlertCircle size={14} className="mr-1" />;
      case 'EN_PROCESO': return <Clock size={14} className="mr-1" />;
      case 'RESUELTA': return <CheckCircle2 size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'URGENTE': return 'bg-red-500 text-white shadow-sm shadow-red-500/20';
      case 'ALTA': return 'bg-orange-500 text-white';
      case 'MEDIA': return 'bg-slate-400 text-white';
      case 'BAJA': return 'bg-slate-300 text-slate-700';
      default: return 'bg-slate-400 text-white';
    }
  };

  const getTipoBadge = (tipo: string) => {
    const isPeticion = tipo === 'PETICION';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isPeticion ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-600'}`}>
        {tipo}
      </span>
    );
  };

  const filteredPqrs = pqrs.filter(pqr => 
    pqr.radicado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pqr.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pqr.conjunto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const operarios = usuarios.filter(u => u.rol === 'OPERARIO');

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Gestión de PQRs y Órdenes</h1>
          <p className="text-slate-500 mt-1">Supervisa, atiende y asigna las solicitudes a tus operarios.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus size={20} /> Nueva Orden
        </button>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total PQRs</p>
            <h3 className="text-3xl font-bold text-slate-800">{pqrs.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <FileText className="text-slate-400" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Abiertas</p>
            <h3 className="text-3xl font-bold text-blue-600">{pqrs.filter(p => p.estado === 'ABIERTA').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <AlertCircle className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">En Proceso</p>
            <h3 className="text-3xl font-bold text-amber-600">{pqrs.filter(p => p.estado === 'EN_PROCESO').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="text-amber-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Resueltas</p>
            <h3 className="text-3xl font-bold text-emerald-600">{pqrs.filter(p => p.estado === 'RESUELTA').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500" size={24} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por radicado, título o conjunto..." 
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

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Cargando datos del servidor...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Radicado</th>
                  <th className="px-6 py-4">Asunto</th>
                  <th className="px-6 py-4">Conjunto</th>
                  <th className="px-6 py-4">Asignación</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Prioridad</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPqrs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">No hay PQRs que coincidan con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredPqrs.map((pqr) => (
                    <tr key={pqr.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 font-mono font-medium text-brand-600">{pqr.radicado}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-800">{pqr.titulo}</span>
                          <div>{getTipoBadge(pqr.tipo)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{pqr.conjunto?.nombre || 'N/A'}</td>
                      
                      {/* Columna de Asignación */}
                      <td className="px-6 py-4">
                        {pqr.asignadoA ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex flex-col items-center justify-center text-xs font-bold shrink-0">
                              {pqr.asignadoA.nombre.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{pqr.asignadoA.nombre} {pqr.asignadoA.apellido}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sin asignar</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pqr.estado)}`}>
                          {getStatusIcon(pqr.estado)}
                          {pqr.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(pqr.prioridad)}`}>
                          {pqr.prioridad}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => openAssignModal(pqr)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Asignar Operario"
                        >
                          <UserPlus size={14} /> Asignar
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition-colors">
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

      {/* Modal Crear PQR / Orden */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-800 font-display">Crear Nueva Orden (PQR)</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="create-pqr-form" onSubmit={handleCreatePQR} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                    <select 
                      value={tipo} 
                      onChange={e => setTipo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-white"
                    >
                      <option value="PETICION">Petición</option>
                      <option value="QUEJA">Queja</option>
                      <option value="RECLAMO">Reclamo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
                    <select 
                      value={prioridad} 
                      onChange={e => setPrioridad(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-white"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título del asunto</label>
                  <input 
                    required 
                    type="text" 
                    value={titulo} 
                    onChange={e => setTitulo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800"
                    placeholder="Ej. Limpieza profunda en áreas comunes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cliente Solicitante</label>
                  <select 
                    required
                    value={clienteId} 
                    onChange={e => setClienteId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-white"
                  >
                    <option value="" disabled>Selecciona el cliente...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} {u.apellido} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Proyecto / Conjunto / Casa</label>
                  <select 
                    required
                    value={conjuntoId} 
                    onChange={e => setConjuntoId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-white"
                  >
                    <option value="" disabled>Selecciona el conjunto...</option>
                    {conjuntos.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción detallada</label>
                  <textarea 
                    required 
                    rows={4}
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 resize-none"
                    placeholder="Describe los detalles de la solicitud..."
                  />
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
                form="create-pqr-form"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Crear Orden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asignar Operario */}
      {isAssignModalOpen && pqrToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-800 font-display">Asignar Operario</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Orden seleccionada</p>
                <p className="font-semibold text-slate-800">{pqrToAssign.titulo}</p>
                <p className="text-sm text-slate-500">{pqrToAssign.radicado}</p>
              </div>

              <form id="assign-operario-form" onSubmit={handleAssignOperario} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Selecciona el Operario a cargo</label>
                  <select 
                    required
                    value={selectedOperarioId} 
                    onChange={e => setSelectedOperarioId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-slate-800 bg-white"
                  >
                    <option value="" disabled>Elige de la lista...</option>
                    {operarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} {u.apellido}
                      </option>
                    ))}
                  </select>
                  {operarios.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">No hay operarios creados en el sistema. Créalos en la pestaña Usuarios.</p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setIsAssignModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="assign-operario-form"
                disabled={isSubmitting || operarios.length === 0}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Asignar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
