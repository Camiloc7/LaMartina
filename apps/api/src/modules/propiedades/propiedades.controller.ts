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
  res.status(201).json(propiedad);
};

export const getAll = async (req: Request, res: Response) => {
  const { conjuntoId, propietarioId } = req.query;
  const propiedades = await PropiedadesService.obtenerTodos({
    conjuntoId: conjuntoId as string,
    propietarioId: propietarioId as string,
  });
  res.json(propiedades);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const propiedad = await PropiedadesService.obtenerPorId(id);
  if (!propiedad) {
    return res.status(404).json({ error: 'Propiedad no encontrada' });
  }
  res.json(propiedad);
};

export const authQr = async (req: Request, res: Response) => {
  const { qrId, pin } = req.body;
  if (!qrId || !pin) {
    return res.status(400).json({ error: 'qrId y pin son requeridos' });
  }

  const propiedad = await PropiedadesService.qrAuth(qrId, pin);
  if (!propiedad) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json(propiedad);
};
