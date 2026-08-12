'use client';

import { useState, useEffect, use } from 'react';
import { fetchApi } from '@/lib/api';
import { QRCodeSVG } from 'qrcode.react';

export default function PrintQRsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [propiedades, setPropiedades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApi(`/propiedades?conjuntoId=${id}`);
        if (res.success) {
          setPropiedades(res.data || resProp); // based on backend response
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div>Cargando QRs para imprimir...</div>;

  const getUrl = (qrId: string) => {
    // Para producción cambiar por la URL real
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${base}/p/${qrId}`;
  };

  return (
    <div className="p-8 bg-white min-h-screen print:p-0">
      <div className="mb-8 print:hidden flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Impresión de Códigos QR</h1>
          <p className="text-gray-500">Usa (Ctrl+P / Cmd+P) para imprimir esta página.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Imprimir ahora
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-3 print:gap-4">
        {propiedades.map((p) => (
          <div key={p.id} className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center text-center rounded-xl print:border-gray-400 print:break-inside-avoid">
            <h2 className="text-xl font-bold mb-1">{p.numero}</h2>
            <p className="text-sm text-gray-500 mb-4">{p.conjunto?.nombre}</p>
            
            <div className="bg-white p-2 rounded-xl mb-4 border border-gray-100 shadow-sm">
              <QRCodeSVG 
                value={getUrl(p.identificadorUnicoQr)} 
                size={160}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">PIN de Acceso</p>
            <p className="font-mono text-2xl font-bold tracking-[0.2em]">{p.pinAcceso}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
