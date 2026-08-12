import { Request, Response } from 'express';
import { AppDataSource } from '../../config/database';
import { Conjunto } from '../../entities/Conjunto';
import { ApiError } from '../../middleware/errorHandler';

const conjuntoRepo = AppDataSource.getRepository(Conjunto);

export async function getAll(_req: Request, res: Response): Promise<void> {
  const conjuntos = await conjuntoRepo.find({ where: { activo: true }, order: { createdAt: 'DESC' } });
  
  const countQuery = await AppDataSource.getRepository('ProgramacionServicio')
    .createQueryBuilder('p')
    .select('p.conjunto_id', 'conjuntoId')
    .addSelect('COUNT(*)', 'count')
    .where('p.estado IN (:...estados)', { estados: ['PENDIENTE', 'EN_PROGRESO'] })
    .groupBy('p.conjunto_id')
    .getRawMany();

  const countMap = new Map(countQuery.map(row => [row.conjuntoId, parseInt(row.count, 10)]));

  const result = conjuntos.map(c => ({
    ...c,
    ordenesActivasCount: countMap.get(c.id) || 0
  }));

  res.json({ success: true, data: result });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const conjunto = await conjuntoRepo.findOne({
    where: { id: req.params['id'] as string },
    relations: ['admin'],
  });
  if (!conjunto) throw new ApiError('Conjunto no encontrado', 404);
  res.json({ success: true, data: conjunto });
}

export async function crear(req: Request, res: Response): Promise<void> {
  const { nombre, direccion, ciudad, nit, telefono, emailContacto, adminId } =
    req.body as {
      nombre: string;
      direccion: string;
      ciudad: string;
      nit?: string;
      telefono?: string;
      emailContacto?: string;
      adminId: string;
    };

  const conjunto = conjuntoRepo.create({
    nombre,
    direccion,
    ciudad,
    nit,
    telefono,
    emailContacto,
    adminId,
  });

  await conjuntoRepo.save(conjunto);
  res.status(201).json({ success: true, data: conjunto });
}

/**
 * Agregar imágenes de las instalaciones de un conjunto residencial.
 * Los archivos ya fueron subidos a Cloudinary por multer-storage-cloudinary.
 */
export async function agregarImagenes(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params as { id: string };
  const files = req.files as (Express.Multer.File & { path: string })[];

  if (!files || files.length === 0) {
    throw new ApiError('No se proporcionaron imágenes.', 400);
  }

  const conjunto = await conjuntoRepo.findOne({ where: { id } });
  if (!conjunto) throw new ApiError('Conjunto no encontrado', 404);

  const nuevasUrls = files.map((f) => f.path);
  conjunto.imagenes = [...(conjunto.imagenes ?? []), ...nuevasUrls];

  await conjuntoRepo.save(conjunto);

  res.json({
    success: true,
    message: `${files.length} imagen(es) agregada(s).`,
    data: { conjuntoId: id, imagenes: conjunto.imagenes },
  });
}

export async function actualizar(req: Request, res: Response): Promise<void> {
  const conjunto = await conjuntoRepo.findOne({
    where: { id: req.params['id'] as string },
  });
  if (!conjunto) throw new ApiError('Conjunto no encontrado', 404);

  Object.assign(conjunto, req.body);
  await conjuntoRepo.save(conjunto);
  res.json({ success: true, data: conjunto });
}
