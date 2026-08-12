import { Request, Response } from 'express';
import { ConfiguracionService } from './configuracion.service';

export const obtenerConfiguracion = async (req: Request, res: Response) => {
  try {
    const config = await ConfiguracionService.obtenerConfiguracion();
    res.json({ success: true, data: config });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const actualizarConfiguracion = async (req: Request, res: Response) => {
  try {
    // Solo SUPER_ADMIN puede llegar aquí gracias al middleware
    const config = await ConfiguracionService.actualizarConfiguracion(req.body);
    res.json({ success: true, data: config });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
