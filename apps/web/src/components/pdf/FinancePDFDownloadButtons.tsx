'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2, FileText, FileSpreadsheet } from 'lucide-react';
import { CotizacionPDF } from './CotizacionPDF';
import { CuentaCobroPDF } from './CuentaCobroPDF';

interface FinancePDFProps {
  cotizacion: any;
  configuracion: any;
  type: 'cotizacion' | 'cuenta_cobro';
}

export const FinancePDFDownloadButton = ({ cotizacion, configuracion, type }: FinancePDFProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const fileName = type === 'cotizacion' 
    ? `Cotizacion-${cotizacion.id.substring(0, 8).toUpperCase()}.pdf`
    : `Cuenta-de-Cobro-${cotizacion.id.substring(0, 8).toUpperCase()}.pdf`;

  const DocComponent = type === 'cotizacion'
    ? <CotizacionPDF cotizacion={cotizacion} configuracion={configuracion} />
    : <CuentaCobroPDF cotizacion={cotizacion} configuracion={configuracion} />;

  return (
    <PDFDownloadLink
      document={DocComponent}
      fileName={fileName}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
        type === 'cotizacion' 
          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      }`}
      title={type === 'cotizacion' ? 'Descargar Cotización' : 'Descargar Cuenta de Cobro'}
    >
      {/* 
        //@ts-ignore 
      */}
      {({ loading }) =>
        loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /></>
        ) : (
          <>
            {type === 'cotizacion' ? <FileText size={16} /> : <FileSpreadsheet size={16} />}
            <span className="hidden sm:inline">
              {type === 'cotizacion' ? 'Cotización' : 'Cuenta de Cobro'}
            </span>
          </>
        )
      }
    </PDFDownloadLink>
  );
};
