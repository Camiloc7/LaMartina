'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { ReporteServicioPDF } from './ReporteServicioPDF';

interface PDFButtonProps {
  trabajo: any;
  configuracion: any;
}

export const PDFDownloadButton = ({ trabajo, configuracion }: PDFButtonProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const fileName = `Orden-Trabajo-${trabajo.id.substring(0, 8).toUpperCase()}.pdf`;

  return (
    <PDFDownloadLink
      document={<ReporteServicioPDF trabajo={trabajo} configuracion={configuracion} />}
      fileName={fileName}
      className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm w-full md:w-auto mt-4 md:mt-0"
    >
      {/* 
        //@ts-ignore 
        react-pdf child function pattern 
      */}
      {({ blob, url, loading, error }) =>
        loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generando Documento...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Descargar Reporte Oficial
          </>
        )
      }
    </PDFDownloadLink>
  );
};
