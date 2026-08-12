import { AppDataSource } from '../../config/database';
import { Propiedad } from '../../entities/Propiedad';
import { OrdenTrabajo } from '../../entities/OrdenTrabajo';

const propiedadRepo = AppDataSource.getRepository(Propiedad);
const ordenTrabajoRepo = AppDataSource.getRepository(OrdenTrabajo);

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

  async crearMasivo(data: {
    prefijo: string;
    cantidad: number;
    extension: number;
    complejidad: 'BAJA' | 'MEDIA' | 'ALTA';
    conjuntoId: string;
  }): Promise<Propiedad[]> {
    const propiedades = [];
    for (let i = 1; i <= data.cantidad; i++) {
      propiedades.push(
        propiedadRepo.create({
          numero: `${data.prefijo}${i}`,
          extension: data.extension,
          complejidad: data.complejidad,
          conjuntoId: data.conjuntoId,
          identificadorUnicoQr: generateQrId(),
          pinAcceso: generatePin(),
        })
      );
    }
    // save() accepts an array to save in bulk
    return await propiedadRepo.save(propiedades);
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

  async desactivar(id: string): Promise<void> {
    await propiedadRepo.update(id, { activo: false });
  },

  async obtenerHistorial(id: string, limit?: number): Promise<OrdenTrabajo[]> {
    // Historial se basa en Ordenes de Trabajo asociadas a la programación de esta propiedad
    return await ordenTrabajoRepo.find({
      where: {
        programacion: {
          propiedadId: id
        }
      },
      relations: ['programacion', 'programacion.cotizacion', 'operario'],
      order: { fechaFin: 'DESC' },
      take: limit // if limit is undefined, returns all
    });
  },
};
