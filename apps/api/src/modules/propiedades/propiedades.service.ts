import { AppDataSource } from '../../config/database';
import { Propiedad } from '../../entities/Propiedad';

const propiedadRepo = AppDataSource.getRepository(Propiedad);

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateQrId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const PropiedadesService = {
  async crear(data: {
    numero: string;
    extension: number;
    complejidad: 'BAJA' | 'MEDIA' | 'ALTA';
    conjuntoId: string;
    propietarioId?: string;
  }): Promise<Propiedad> {
    const nuevaPropiedad = propiedadRepo.create({
      ...data,
      identificadorUnicoQr: generateQrId(),
      pinAcceso: generatePin(),
    });

    return await propiedadRepo.save(nuevaPropiedad);
  },

  async obtenerTodos(filtros: { conjuntoId?: string; propietarioId?: string }): Promise<Propiedad[]> {
    const where: any = { activo: true };
    if (filtros.conjuntoId) where.conjuntoId = filtros.conjuntoId;
    if (filtros.propietarioId) where.propietarioId = filtros.propietarioId;

    return await propiedadRepo.find({
      where,
      relations: ['conjunto', 'propietario'],
      select: {
        pinAcceso: false, // Omit pin in normal queries
      },
    });
  },

  async obtenerPorId(id: string): Promise<Propiedad | null> {
    return await propiedadRepo.findOne({
      where: { id, activo: true },
      relations: ['conjunto', 'propietario'],
      select: {
        pinAcceso: false,
      },
    });
  },

  async qrAuth(identificadorUnicoQr: string, pin: string): Promise<Propiedad | null> {
    const propiedad = await propiedadRepo.findOne({
      where: { identificadorUnicoQr, activo: true },
      relations: ['conjunto', 'propietario'],
      // We don't exclude pinAcceso here because we need to verify it, but we won't return it ideally.
    });

    if (!propiedad) return null;
    if (propiedad.pinAcceso !== pin) return null;

    // Remove pin from result
    const { pinAcceso, ...rest } = propiedad;
    return rest as Propiedad;
  },
};
