import { Request, Response } from 'express';
import { AppDataSource } from '../../config/database';
import { PQR } from '../../entities/PQR';
import { ApiError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authenticate';

const pqrRepo = AppDataSource.getRepository(PQR);

export async function crearPQR(req: Request, res: Response): Promise<void> {
  let clienteId = (req as AuthRequest).userId;
  const userRol = (req as AuthRequest).userRol;
  
  const { tipo, titulo, descripcion, conjuntoId, prioridad } = req.body as {
    tipo: PQR['tipo'];
    titulo: string;
    descripcion: string;
    conjuntoId: string;
    prioridad?: PQR['prioridad'];
  };

  // Si es ADMIN y envía un clienteId explícito, lo usamos
  if (req.body.clienteId && ['ADMIN', 'SUPER_ADMIN'].includes(userRol)) {
    clienteId = req.body.clienteId;
  }

  const pqr = pqrRepo.create({
    tipo,
    titulo,
    descripcion,
    conjuntoId,
    clienteId,
    prioridad: prioridad ?? 'MEDIA',
    estado: 'ABIERTA',
  });

  await pqrRepo.save(pqr);

  res.status(201).json({
    success: true,
    message: `PQR radicada exitosamente. Número de radicado: ${pqr.radicado}`,
    data: pqr,
  });
}

export async function crearPQRPublica(req: Request, res: Response): Promise<void> {
  const { tipo, titulo, descripcion, conjuntoId, propiedadId, prioridad } = req.body as {
    tipo: PQR['tipo'];
    titulo: string;
    descripcion: string;
    conjuntoId: string;
    propiedadId: string;
    prioridad?: PQR['prioridad'];
  };

  const pqr = pqrRepo.create({
    tipo,
    titulo,
    descripcion,
    conjuntoId,
    propiedadId,
    prioridad: prioridad ?? 'MEDIA',
    estado: 'ABIERTA',
    // clienteId remains null/undefined since it's an anonymous QR submission
  });

  await pqrRepo.save(pqr);

  res.status(201).json({
    success: true,
    message: `PQR radicada exitosamente. Número de radicado: ${pqr.radicado}`,
    data: pqr,
  });
}

/**
 * Agregar archivos adjuntos a una PQR (imágenes o PDFs).
 * Los archivos ya fueron subidos a Cloudinary por multer-storage-cloudinary.
 * Las URLs se guardan en el array adjuntos[] de la entidad.
 */
export async function agregarAdjuntos(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params as { id: string };
  const files = req.files as (Express.Multer.File & { path: string })[];

  if (!files || files.length === 0) {
    throw new ApiError('No se proporcionaron archivos.', 400);
  }

  const pqr = await pqrRepo.findOne({ where: { id } });
  if (!pqr) throw new ApiError('PQR no encontrada', 404);

  if (pqr.estado === 'CERRADA') {
    throw new ApiError('No se pueden agregar adjuntos a una PQR cerrada.', 400);
  }

  const nuevasUrls = files.map((f) => f.path);
  pqr.adjuntos = [...(pqr.adjuntos ?? []), ...nuevasUrls];

  await pqrRepo.save(pqr);

  res.json({
    success: true,
    message: `${files.length} adjunto(s) agregado(s).`,
    data: {
      pqrId: pqr.id,
      radicado: pqr.radicado,
      adjuntos: pqr.adjuntos,
    },
  });
}

export async function getMisPQR(req: Request, res: Response): Promise<void> {
  const clienteId = (req as AuthRequest).userId;
  const pqrs = await pqrRepo.find({
    where: { clienteId },
    order: { createdAt: 'DESC' },
  });
  res.json({ success: true, data: pqrs });
}

export async function getAll(_req: Request, res: Response): Promise<void> {
  const pqrs = await pqrRepo.find({
    relations: ['cliente', 'conjunto'],
    order: { createdAt: 'DESC' },
  });
  res.json({ success: true, data: pqrs });
}

export async function responder(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { respuesta, estado, asignadoAId } = req.body as {
    respuesta: string;
    estado: PQR['estado'];
    asignadoAId?: string;
  };

  const pqr = await pqrRepo.findOne({ where: { id } });
  if (!pqr) throw new ApiError('PQR no encontrada', 404);

  pqr.respuesta = respuesta;
  pqr.estado = estado;
  if (asignadoAId) pqr.asignadoAId = asignadoAId;

  await pqrRepo.save(pqr);
  res.json({ success: true, data: pqr });
}

export async function getAsignadas(req: Request, res: Response): Promise<void> {
  const operarioId = (req as AuthRequest).userId;
  const pqrs = await pqrRepo.find({
    where: { asignadoAId: operarioId },
    relations: ['propiedad', 'conjunto'],
    order: { createdAt: 'DESC' },
  });
  res.json({ success: true, data: pqrs });
}

export async function asignarOperario(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const operarioId = (req as AuthRequest).userId;
  
  const pqr = await pqrRepo.findOne({ where: { id } });
  if (!pqr) throw new ApiError('PQR no encontrada', 404);

  pqr.asignadoAId = operarioId;
  pqr.estado = 'EN_PROCESO';

  await pqrRepo.save(pqr);
  res.json({ success: true, data: pqr });
}

export async function actualizarEstado(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { estado, respuesta } = req.body as { estado: PQR['estado'], respuesta?: string };
  const operarioId = (req as AuthRequest).userId;
  
  const pqr = await pqrRepo.findOne({ where: { id } });
  if (!pqr) throw new ApiError('PQR no encontrada', 404);
  
  // Opcional: Validar que el operario asignado sea el que actualiza (o admin)
  if (pqr.asignadoAId && pqr.asignadoAId !== operarioId && (req as AuthRequest).userRol === 'OPERARIO') {
    throw new ApiError('No tienes permiso para actualizar esta PQR', 403);
  }

  pqr.estado = estado;
  if (respuesta) pqr.respuesta = respuesta;

  await pqrRepo.save(pqr);
  res.json({ success: true, data: pqr });
}
