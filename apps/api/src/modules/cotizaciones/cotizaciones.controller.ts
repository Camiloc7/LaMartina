import { Request, Response } from 'express';
import { CotizacionesService } from './cotizaciones.service';
import { PdfCotizacionesService } from './pdf-cotizacion.service';

export const crear = async (req: Request, res: Response) => {
  const { conjuntoId, propiedadId, detalles, precioTotal, notasFinancieras, cantidadCasas } = req.body;
  const cotizacion = await CotizacionesService.crear({
    conjuntoId,
    propiedadId,
    detalles,
    precioTotal,
    notasFinancieras,
    cantidadCasas: cantidadCasas ? parseInt(cantidadCasas, 10) : undefined,
  });

  res.status(201).json({ success: true, data: cotizacion });
};

export const getAll = async (req: Request, res: Response) => {
  const { conjuntoId, estado } = req.query;
  const cotizaciones = await CotizacionesService.obtenerTodos({
    conjuntoId: conjuntoId as string,
    estado: estado as string,
  });
  res.json({ success: true, data: cotizaciones });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cotizacion = await CotizacionesService.obtenerPorId(id as string);
  if (!cotizacion) {
    return res.status(404).json({ success: false, error: 'Cotización no encontrada' });
  }
  res.json({ success: true, data: cotizacion });
};

export const descargarPDF = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cotizacion = await CotizacionesService.obtenerPorId(id as string);
  if (!cotizacion) {
    return res.status(404).json({ success: false, error: 'Cotización no encontrada' });
  }

  const filename = `Cotizacion_${String(cotizacion.numeroSecuencial || 0).padStart(6, '0')}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  await PdfCotizacionesService.generarPdfCotizacion(cotizacion, res);
};

export const aprobarYProgramar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fechaProgramada } = req.body;

  if (!fechaProgramada) {
    return res.status(400).json({ success: false, error: 'fechaProgramada es requerida' });
  }

  try {
    const result = await CotizacionesService.aprobarYProgramar(id as string, new Date(fechaProgramada));
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const registrarPago = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { monto, fecha, notas } = req.body;

  if (!monto || !fecha) {
    return res.status(400).json({ success: false, error: 'monto y fecha son requeridos' });
  }

  try {
    const result = await CotizacionesService.registrarPago(id as string, { monto, fecha, notas });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getResumenFinanciero = async (req: Request, res: Response) => {
  try {
    const result = await CotizacionesService.obtenerResumenFinanciero();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
