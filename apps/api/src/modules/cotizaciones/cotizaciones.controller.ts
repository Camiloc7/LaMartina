import { Request, Response } from 'express';
import { CotizacionesService } from './cotizaciones.service';

export const crear = async (req: Request, res: Response) => {
  const { conjuntoId, propiedadId, detalles, precioTotal, notasFinancieras } = req.body;
  const cotizacion = await CotizacionesService.crear({
    conjuntoId,
    propiedadId,
    detalles,
    precioTotal,
    notasFinancieras,
  });

  res.status(201).json(cotizacion);
};

export const getAll = async (req: Request, res: Response) => {
  const { conjuntoId, estado } = req.query;
  const cotizaciones = await CotizacionesService.obtenerTodos({
    conjuntoId: conjuntoId as string,
    estado: estado as string,
  });
  res.json(cotizaciones);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cotizacion = await CotizacionesService.obtenerPorId(id);
  if (!cotizacion) {
    return res.status(404).json({ error: 'Cotización no encontrada' });
  }
  res.json(cotizacion);
};

export const aprobarYProgramar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fechaProgramada } = req.body;

  if (!fechaProgramada) {
    return res.status(400).json({ error: 'fechaProgramada es requerida' });
  }

  try {
    const result = await CotizacionesService.aprobarYProgramar(id, new Date(fechaProgramada));
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
