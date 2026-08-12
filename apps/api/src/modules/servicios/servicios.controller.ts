import { Request, Response } from 'express';
import { ServiciosService } from './servicios.service';

export const getAllProgramaciones = async (req: Request, res: Response) => {
  const { conjuntoId, estado } = req.query;
  const programaciones = await ServiciosService.obtenerProgramaciones({
    conjuntoId: conjuntoId as string,
    estado: estado as string,
  });
  res.json({ success: true, data: programaciones });
};

export const getProgramacionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const programacion = await ServiciosService.obtenerProgramacionPorId(id);
  if (!programacion) {
    return res.status(404).json({ success: false, error: 'Programacion no encontrada' });
  }
  res.json({ success: true, data: programacion });
};

export const iniciar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user; // middleware de auth inyecta el user
  
  if (!user) return res.status(401).json({ success: false, error: 'No autorizado' });

  try {
    const orden = await ServiciosService.iniciarOrdenTrabajo(id, user.id);
    res.status(201).json({ success: true, data: orden });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const completar = async (req: Request, res: Response) => {
  const { id } = req.params; // ID de la Orden de Trabajo
  const { observaciones, evidenciaFotos, latitud, longitud } = req.body;

  try {
    const orden = await ServiciosService.completarOrdenTrabajo(id, { observaciones, evidenciaFotos, latitud, longitud });
    res.json({ success: true, data: orden });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
