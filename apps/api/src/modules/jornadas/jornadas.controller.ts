import { Request, Response } from 'express';
import { AppDataSource } from '../../config/database';
import { Jornada } from '../../entities/Jornada';
import { ApiError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authenticate';

const jornadaRepo = AppDataSource.getRepository(Jornada);

export async function iniciarJornada(
  req: Request,
  res: Response
): Promise<void> {
  const operarioId = (req as AuthRequest).userId;
  const { conjuntoId, ubicacion } = req.body as {
    conjuntoId: string;
    ubicacion?: { lat: number; lng: number };
  };

  // Verificar que no haya una jornada en progreso
  const activa = await jornadaRepo.findOne({
    where: { operarioId, estado: 'EN_PROGRESO' },
  });
  if (activa) {
    throw new ApiError(
      'Ya tienes una jornada en progreso. Finalízala primero.',
      409
    );
  }

  const jornada = jornadaRepo.create({
    operarioId,
    conjuntoId,
    fechaInicio: new Date(),
    estado: 'EN_PROGRESO',
    ubicacionInicio: ubicacion,
  });

  if (req.body.jornadaId) {
    const programada = await jornadaRepo.findOne({ where: { id: req.body.jornadaId } });
    if (programada && programada.estado === 'PROGRAMADA') {
      if (programada.operarioId !== operarioId) {
        throw new ApiError('No tienes permiso para iniciar esta jornada.', 403);
      }
      programada.estado = 'EN_PROGRESO';
      programada.fechaInicio = new Date();
      programada.ubicacionInicio = ubicacion;
      await jornadaRepo.save(programada);
      res.status(200).json({ success: true, message: 'Jornada programada iniciada.', data: programada });
      return;
    }
  }

  await jornadaRepo.save(jornada);
  res.status(201).json({
    success: true,
    message: 'Jornada iniciada.',
    data: jornada,
  });
}

export async function programarJornada(
  req: Request,
  res: Response
): Promise<void> {
  const { operarioId, conjuntoId, fechaInicio, observaciones } = req.body as {
    operarioId: string;
    conjuntoId: string;
    fechaInicio: string;
    observaciones?: string;
  };

  const jornada = jornadaRepo.create({
    operarioId,
    conjuntoId,
    fechaInicio: new Date(fechaInicio),
    estado: 'PROGRAMADA',
    observaciones,
  });

  await jornadaRepo.save(jornada);
  res.status(201).json({
    success: true,
    message: 'Servicio programado exitosamente.',
    data: jornada,
  });
}

export async function finalizarJornada(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params as { id: string };
  const { observaciones, ubicacion } = req.body as {
    observaciones?: string;
    ubicacion?: { lat: number; lng: number };
  };

  const jornada = await jornadaRepo.findOne({ where: { id } });
  if (!jornada) throw new ApiError('Jornada no encontrada', 404);
  if (jornada.operarioId !== (req as AuthRequest).userId) {
    throw new ApiError('No tienes permiso para finalizar esta jornada.', 403);
  }
  if (jornada.estado !== 'EN_PROGRESO') {
    throw new ApiError('Esta jornada ya fue finalizada o cancelada.', 400);
  }

  jornada.estado = 'COMPLETADA';
  jornada.fechaFin = new Date();
  jornada.observaciones = observaciones;
  jornada.ubicacionFin = ubicacion;

  await jornadaRepo.save(jornada);
  res.json({ success: true, message: 'Jornada completada.', data: jornada });
}

/**
 * Agregar fotos de evidencia a una jornada.
 * Los archivos ya fueron subidos a Cloudinary por multer-storage-cloudinary.
 * Las URLs se guardan en el array evidencias[] de la entidad.
 */
export async function agregarEvidencias(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params as { id: string };
  const files = req.files as (Express.Multer.File & { path: string })[];

  if (!files || files.length === 0) {
    throw new ApiError('No se proporcionaron archivos.', 400);
  }

  const jornada = await jornadaRepo.findOne({ where: { id } });
  if (!jornada) throw new ApiError('Jornada no encontrada', 404);
  if (jornada.operarioId !== (req as AuthRequest).userId) {
    throw new ApiError('No tienes permiso para adjuntar evidencias a esta jornada.', 403);
  }

  // Extraer las URLs de Cloudinary de los archivos subidos
  const nuevasUrls = files.map((f) => f.path);
  jornada.evidencias = [...(jornada.evidencias ?? []), ...nuevasUrls];

  await jornadaRepo.save(jornada);

  res.json({
    success: true,
    message: `${files.length} evidencia(s) agregada(s).`,
    data: {
      jornadaId: jornada.id,
      evidencias: jornada.evidencias,
      total: jornada.evidencias.length,
    },
  });
}

export async function getMisJornadas(
  req: Request,
  res: Response
): Promise<void> {
  const operarioId = (req as AuthRequest).userId;
  const jornadas = await jornadaRepo.find({
    where: { operarioId },
    order: { createdAt: 'DESC' },
    take: 30,
  });
  res.json({ success: true, data: jornadas });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const jornada = await jornadaRepo.findOne({
    where: { id: req.params['id'] as string },
    relations: ['operario', 'conjunto'],
  });
  if (!jornada) throw new ApiError('Jornada no encontrada', 404);
  const authReq = req as AuthRequest;
  if (authReq.userRol === 'OPERARIO' && jornada.operarioId !== authReq.userId) {
    throw new ApiError('No tienes permiso para ver esta jornada.', 403);
  }
  res.json({ success: true, data: jornada });
}

export async function getAll(_req: Request, res: Response): Promise<void> {
  const jornadas = await jornadaRepo.find({
    relations: ['operario', 'conjunto'],
    order: { createdAt: 'DESC' },
  });
  res.json({ success: true, data: jornadas });
}
