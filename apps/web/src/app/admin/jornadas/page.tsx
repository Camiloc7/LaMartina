'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, CalendarClock, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function JornadasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jornadas, setJornadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchApi('/jornadas');
        if (response.success && response.data) {
          setJornadas(response.data);
        }
      } catch (error) {
        console.error('Error al cargar Jornadas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'EN_PROGRESO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETADA': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELADA': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'EN_PROGRESO': return <PlayCircle size={14} className="mr-1" />;
      case 'COMPLETADA': return <CheckCircle2 size={14} className="mr-1" />;
      case 'CANCELADA': return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  const filteredJornadas = jornadas.filter(j => 
    j.operario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.operario?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.conjunto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Gestión de Jornadas</h1>
          <p className="text-slate-500 mt-1">Supervisa los tiempos y actividades del personal en terreno.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Jornadas</p>
            <h3 className="text-3xl font-bold text-slate-800">{jornadas.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <CalendarClock className="text-slate-400" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">En Progreso</p>
            <h3 className="text-3xl font-bold text-blue-600">{jornadas.filter(j => j.estado === 'EN_PROGRESO').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <PlayCircle className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Completadas</p>
            <h3 className="text-3xl font-bold text-emerald-600">{jornadas.filter(j => j.estado === 'COMPLETADA').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Canceladas</p>
            <h3 className="text-3xl font-bold text-red-600">{jornadas.filter(j => j.estado === 'CANCELADA').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por operario o conjunto..." 
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
            <div className="p-12 text-center text-slate-500">Cargando jornadas...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Operario</th>
                  <th className="px-6 py-4">Conjunto</th>
                  <th className="px-6 py-4">Inicio</th>
                  <th className="px-6 py-4">Fin</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Evidencias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJornadas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No hay jornadas registradas.</td>
                  </tr>
                ) : (
                  filteredJornadas.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{j.operario?.nombre} {j.operario?.apellido}</div>
                        <div className="text-xs text-slate-500">{j.operario?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{j.conjunto?.nombre || 'N/A'}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        {new Date(j.fechaInicio).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        {j.fechaFin ? new Date(j.fechaFin).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(j.estado)}`}>
                          {getStatusIcon(j.estado)}
                          {j.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-bold border border-slate-200">
                          {j.evidencias?.length || 0} fotos
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
