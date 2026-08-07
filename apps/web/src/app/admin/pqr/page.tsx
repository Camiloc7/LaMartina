'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PQRPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pqrs, setPqrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchApi('/pqr');
        if (response.success && response.data) {
          setPqrs(response.data);
        }
      } catch (error) {
        console.error('Error al cargar PQRs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Gestión de PQRs</h1>
          <p className="text-slate-500 mt-1">Supervisa y atiende las solicitudes de los conjuntos en tiempo real.</p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2">
          <Plus size={20} /> Nueva PQR
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
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Prioridad</th>
                  <th className="px-6 py-4">Fecha</th>
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
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(pqr.createdAt).toLocaleDateString()}
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

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
          <span>Mostrando {filteredPqrs.length} resultados</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 rounded border border-slate-200 bg-brand-50 text-brand-600 font-medium">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50">Siguiente</button>
          </div>
        </div>

      </div>
    </div>
  );
}
