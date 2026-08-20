import { Request, Response } from 'express';
import { ServiciosService } from './servicios.service';
import { AuthRequest } from '../../middleware/authenticate';
import { ApiError } from '../../middleware/errorHandler';

export const getAllProgramaciones = async (req: Request, res: Response) => {
  const { conjuntoId, estado } = req.query;
  const programaciones = await ServiciosService.obtenerProgramaciones({
    conjuntoId: conjuntoId as string,
    estado: estado as string,
  });
  res.json({ success: true, data: programaciones });
};

export const getProgramacionById = async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const programacion = await ServiciosService.obtenerProgramacionPorId(id);
  if (!programacion) {
    return res.status(404).json({ success: false, error: 'Programacion no encontrada' });
  }
  res.json({ success: true, data: programacion });
};

export const iniciar = async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const user = req as AuthRequest;

  try {
    const orden = await ServiciosService.iniciarOrdenTrabajo(id, user.userId);
    res.status(201).json({ success: true, data: orden });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    res.status(400).json({ success: false, error: 'No se pudo iniciar la orden de trabajo.' });
  }
};

export const completar = async (req: Request, res: Response) => {
  const id = req.params['id'] as string; // ID de la Orden de Trabajo
  const { observaciones, evidenciaFotos, latitud, longitud } = req.body;

  try {
    const authReq = req as AuthRequest;
    const orden = await ServiciosService.completarOrdenTrabajo(
      id,
      { observaciones, evidenciaFotos, latitud, longitud },
      authReq.userId,
      authReq.userRol
    );
    res.json({ success: true, data: orden });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    res.status(400).json({ success: false, error: 'No se pudo completar la orden de trabajo.' });
  }
};
