import { Request, Response } from 'express';
import { ServiciosService } from './servicios.service';

export const getAllProgramaciones = async (req: Request, res: Response) => {
  const { conjuntoId, estado } = req.query;
  const programaciones = await ServiciosService.obtenerProgramaciones({
    conjuntoId: conjuntoId as string,
    estado: estado as string,
  });
  res.json(programaciones);
};

export const getProgramacionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const programacion = await ServiciosService.obtenerProgramacionPorId(id);
  if (!programacion) {
    return res.status(404).json({ error: 'Programacion no encontrada' });
  }
  res.json(programacion);
};

export const iniciar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user; // middleware de auth inyecta el user
  
  if (!user) return res.status(401).json({ error: 'No autorizado' });

  try {
    const orden = await ServiciosService.iniciarOrdenTrabajo(id, user.id);
    res.status(201).json(orden);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const completar = async (req: Request, res: Response) => {
  const { id } = req.params; // ID de la Orden de Trabajo
  const { observaciones, evidenciaFotos } = req.body;

  try {
    const orden = await ServiciosService.completarOrdenTrabajo(id, { observaciones, evidenciaFotos });
    res.json(orden);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
