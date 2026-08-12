'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { DollarSign, AlertCircle, Loader2, CreditCard, TrendingUp, Calendar as CalendarIcon, CheckCircle, Wallet, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminFinanzasPage() {
  const [resumen, setResumen] = useState<any>(null);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para modal de pago
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<any>(null);
  const [montoPago, setMontoPago] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [notasPago, setNotasPago] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const resResumen = await fetchApi('/cotizaciones/finanzas/resumen');
      if (resResumen.success) setResumen(resResumen.data);

      const resCots = await fetchApi('/cotizaciones');
      if (resCots.success) {
        // Filtramos solo las que están aprobadas o cobrables
        const cobrables = (resCots.data || []).filter((c: any) => c.estado === 'APROBADA');
        setCotizaciones(cobrables);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModalPago = (cot: any) => {
    setCotizacionSeleccionada(cot);
    // Sugerir el saldo pendiente
    const saldoPendiente = Number(cot.precioTotal) - Number(cot.montoPagado || 0);
    setMontoPago(saldoPendiente.toString());
    setFechaPago(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cotizacionSeleccionada) return;

    setIsSubmitting(true);
    try {
      const res = await fetchApi(`/cotizaciones/${cotizacionSeleccionada.id}/pago`, {
        method: 'POST',
        body: JSON.stringify({
          monto: parseFloat(montoPago),
          fecha: fechaPago,
          notas: notasPago
        })
      });

      if (res.success) {
        setIsModalOpen(false);
        setMontoPago('');
        setNotasPago('');
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Error al registrar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500" /></div>;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resumen Financiero</h1>
          <p className="text-slate-500">Control de facturación, recaudos y saldos pendientes.</p>
        </div>
      </div>

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Facturado</p>
              <h2 className="text-2xl font-bold text-slate-900">${resumen.totalCotizado.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Recaudado</p>
              <h2 className="text-2xl font-bold text-slate-900">${resumen.totalRecaudado.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Saldo Pendiente</p>
              <h2 className="text-2xl font-bold text-rose-600">${resumen.saldoPendiente.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Cuentas por Cobrar (Cotizaciones Aprobadas)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Conjunto / Propiedad</th>
                <th className="p-4 font-semibold">Detalle</th>
                <th className="p-4 font-semibold text-right">Facturado</th>
                <th className="p-4 font-semibold text-right">Pagado</th>
                <th className="p-4 font-semibold text-center">Estado Pago</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((cot: any) => {
                const precio = Number(cot.precioTotal);
                const pagado = Number(cot.montoPagado || 0);
                const pendiente = precio - pagado;
                
                return (
                  <tr key={cot.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{cot.conjunto?.nombre}</p>
                      <p className="text-sm text-slate-500">{cot.propiedad?.numero || 'Global'}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                      {cot.detalles?.descripcion || 'Sin descripción'}
                    </td>
                    <td className="p-4 font-medium text-slate-800 text-right">
                      ${precio.toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-emerald-600 text-right">
                      ${pagado.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-md ${
                        cot.estadoPago === 'PAGADO' ? 'bg-emerald-100 text-emerald-700' :
                        cot.estadoPago === 'PARCIAL' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {cot.estadoPago || 'PENDIENTE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {cot.estadoPago !== 'PAGADO' && (
                        <button 
                          onClick={() => handleAbrirModalPago(cot)}
                          className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-brand-100 transition-colors"
                        >
                          <Plus size={16} /> Pago
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {cotizaciones.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No hay cuentas pendientes o cotizaciones aprobadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Pago */}
      {isModalOpen && cotizacionSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Registrar Pago / Abono</h3>
            </div>
            
            <form onSubmit={handleRegistrarPago} className="p-6">
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Total Facturado:</span>
                    <span className="font-semibold">${Number(cotizacionSeleccionada.precioTotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Pagado Anteriormente:</span>
                    <span className="font-semibold text-emerald-600">${Number(cotizacionSeleccionada.montoPagado || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200 mt-2">
                    <span className="font-bold text-slate-700">Saldo Pendiente:</span>
                    <span className="font-bold text-rose-600">
                      ${(Number(cotizacionSeleccionada.precioTotal) - Number(cotizacionSeleccionada.montoPagado || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monto Recibido</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={18} className="text-slate-400" />
                    </div>
                    <input 
                      required 
                      type="number"
                      step="0.01"
                      value={montoPago} 
                      onChange={(e) => setMontoPago(e.target.value)} 
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-lg font-bold outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha del Pago</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon size={18} className="text-slate-400" />
                    </div>
                    <input 
                      required 
                      type="date"
                      value={fechaPago} 
                      onChange={(e) => setFechaPago(e.target.value)} 
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notas (Opcional)</label>
                  <textarea 
                    rows={2}
                    placeholder="Ej: Transferencia Bancolombia, Pago en efectivo..."
                    value={notasPago}
                    onChange={(e) => setNotasPago(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  ></textarea>
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
                  className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle size={18} /> Registrar Pago</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
