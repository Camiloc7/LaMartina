import { Request, Response } from 'express';
import { AppDataSource } from '../../config/database';
import { PQR } from '../../entities/PQR';
import { Propiedad } from '../../entities/Propiedad';
import { ApiError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/authenticate';
import { socketService } from '../../services/socket.service';

const pqrRepo = AppDataSource.getRepository(PQR);
const propiedadRepo = AppDataSource.getRepository(Propiedad);

function canAccessPqr(pqr: PQR, req: AuthRequest): boolean {
  if (['ADMIN', 'SUPER_ADMIN'].includes(req.userRol)) return true;
  if (req.userRol === 'OPERARIO') return pqr.asignadoAId === req.userId;
  return pqr.clienteId === req.userId;
}

function notifyAdmins(pqr: PQR): void {
  socketService.emitToRoles(['ADMIN', 'SUPER_ADMIN'], 'nueva_pqr', {
    id: pqr.id,
    radicado: pqr.radicado,
    titulo: pqr.titulo,
    prioridad: pqr.prioridad,
    conjuntoId: pqr.conjuntoId,
    createdAt: pqr.createdAt,
  });
}

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
    canalOrigen: ['ADMIN', 'SUPER_ADMIN'].includes(userRol) ? 'ADMINISTRACION' : 'PORTAL_CLIENTE',
  });

  await pqrRepo.save(pqr);

  notifyAdmins(pqr);

  res.status(201).json({
    success: true,
    message: `PQR radicada exitosamente. Número de radicado: ${pqr.radicado}`,
    data: pqr,
  });
}

export async function crearPQRPublica(req: Request, res: Response): Promise<void> {
  const { tipo, titulo, descripcion, conjuntoId, propiedadId } = req.body as {
    tipo: PQR['tipo'];
    titulo: string;
    descripcion: string;
    conjuntoId: string;
    propiedadId: string;
  };

  const propiedad = await propiedadRepo.findOne({
    where: { id: propiedadId, conjuntoId, activo: true },
  });
  if (!propiedad) {
    throw new ApiError('La propiedad no corresponde a un conjunto activo.', 400);
  }

  const pqr = pqrRepo.create({
    tipo,
    titulo,
    descripcion,
    conjuntoId,
    propiedadId,
    prioridad: 'MEDIA',
    estado: 'ABIERTA',
    canalOrigen: 'PORTAL_QR',
    // clienteId remains null/undefined since it's an anonymous QR submission
  });

  await pqrRepo.save(pqr);

  notifyAdmins(pqr);

  res.status(201).json({
    success: true,
    message: `PQR radicada exitosamente. Número de radicado: ${pqr.radicado}`,
    data: pqr,
  });
}

/** Registra que el radicante abrió WhatsApp como seguimiento del caso ya creado. */
export async function registrarWhatsappPublico(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const pqr = await pqrRepo.findOne({ where: { id } });

  if (!pqr || pqr.canalOrigen !== 'PORTAL_QR') {
    throw new ApiError('PQR no encontrada', 404);
  }

  if (!pqr.whatsappAbiertoAt) {
    pqr.whatsappAbiertoAt = new Date();
    await pqrRepo.save(pqr);
  }

  res.json({
    success: true,
    data: { id: pqr.id, radicado: pqr.radicado, whatsappAbiertoAt: pqr.whatsappAbiertoAt },
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

  if (!canAccessPqr(pqr, req as AuthRequest)) {
    throw new ApiError('No tienes permiso para adjuntar archivos a esta PQR.', 403);
  }

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
    relations: ['cliente', 'conjunto', 'propiedad', 'asignadoA'],
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

  if (pqr.asignadoAId && pqr.asignadoAId !== operarioId) {
    throw new ApiError('La PQR ya está asignada a otro operario.', 409);
  }

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
  
  if ((req as AuthRequest).userRol === 'OPERARIO' && pqr.asignadoAId !== operarioId) {
    throw new ApiError('No tienes permiso para actualizar esta PQR', 403);
  }

  pqr.estado = estado;
  if (respuesta) pqr.respuesta = respuesta;

  await pqrRepo.save(pqr);
  res.json({ success: true, data: pqr });
}
