import { Request, Response } from 'express';
import { PropiedadesService } from './propiedades.service';

export const crear = async (req: Request, res: Response) => {
  const { numero, extension, complejidad, conjuntoId, propietarioId } = req.body;
  const propiedad = await PropiedadesService.crear({
    numero,
    extension,
    complejidad,
    conjuntoId,
    propietarioId,
  });

  // Mostramos el PIN en la creación para que el admin se lo pueda dar al cliente
  res.status(201).json({ success: true, data: propiedad });
};

export const crearMasivo = async (req: Request, res: Response) => {
  const { prefijo, cantidad, extension, complejidad, conjuntoId } = req.body;
  if (!prefijo || !cantidad || !extension || !complejidad || !conjuntoId) {
    return res.status(400).json({ success: false, error: 'Faltan datos obligatorios' });
  }

  const propiedades = await PropiedadesService.crearMasivo({
    prefijo,
    cantidad: parseInt(cantidad, 10),
    extension: parseFloat(extension),
    complejidad,
    conjuntoId,
  });

  res.status(201).json({ success: true, data: propiedades });
};

export const getAll = async (req: Request, res: Response) => {
  const { conjuntoId, propietarioId } = req.query;
  const propiedades = await PropiedadesService.obtenerTodos({
    conjuntoId: conjuntoId as string,
    propietarioId: propietarioId as string,
  });
  res.json({ success: true, data: propiedades });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const propiedad = await PropiedadesService.obtenerPorId(id);
  if (!propiedad) {
    return res.status(404).json({ success: false, error: 'Propiedad no encontrada' });
  }
  res.json({ success: true, data: propiedad });
};

export const desactivar = async (req: Request, res: Response) => {
  const { id } = req.params;
  await PropiedadesService.desactivar(id);
  res.json({ success: true, data: null, message: 'Propiedad eliminada logicamente' });
};

export const getHistorial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit } = req.query;
  const numLimit = limit ? parseInt(limit as string, 10) : undefined;
  const historial = await PropiedadesService.obtenerHistorial(id, numLimit);
  res.json({ success: true, data: historial });
};

export const authQr = async (req: Request, res: Response) => {
  const { qrId, pin } = req.body;
  if (!qrId || !pin) {
    return res.status(400).json({ success: false, error: 'qrId y pin son requeridos' });
  }

  const propiedad = await PropiedadesService.qrAuth(qrId, pin);
  if (!propiedad) {
    return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
  }

  res.json({ success: true, data: propiedad });
};
