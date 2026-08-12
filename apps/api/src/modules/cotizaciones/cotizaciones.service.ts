import { AppDataSource } from '../../config/database';
import { Cotizacion } from '../../entities/Cotizacion';
import { ProgramacionServicio } from '../../entities/ProgramacionServicio';

const cotizacionRepo = AppDataSource.getRepository(Cotizacion);
const programacionRepo = AppDataSource.getRepository(ProgramacionServicio);

export const CotizacionesService = {
  async crear(data: {
    conjuntoId: string;
    propiedadId?: string;
    detalles: any;
    precioTotal: number;
    notasFinancieras?: string;
  }): Promise<Cotizacion> {
    const nuevaCotizacion = cotizacionRepo.create({
      ...data,
      estado: 'BORRADOR',
    });

    return await cotizacionRepo.save(nuevaCotizacion);
  },

  async obtenerTodos(filtros: { conjuntoId?: string; estado?: string }): Promise<Cotizacion[]> {
    const where: any = {};
    if (filtros.conjuntoId) where.conjuntoId = filtros.conjuntoId;
    if (filtros.estado) where.estado = filtros.estado;

    return await cotizacionRepo.find({
      where,
      relations: ['conjunto', 'propiedad'],
      order: { createdAt: 'DESC' },
    });
  },

  async obtenerPorId(id: string): Promise<Cotizacion | null> {
    return await cotizacionRepo.findOne({
      where: { id },
      relations: ['conjunto', 'propiedad'],
    });
  },

  async aprobarYProgramar(
    id: string,
    fechaProgramada: Date
  ): Promise<{ cotizacion: Cotizacion; programacion: ProgramacionServicio }> {
    const cotizacion = await cotizacionRepo.findOne({ where: { id } });
    if (!cotizacion) throw new Error('Cotizacion no encontrada');
    if (cotizacion.estado === 'APROBADA') throw new Error('La cotización ya estaba aprobada');

    cotizacion.estado = 'APROBADA';
    const cotizacionActualizada = await cotizacionRepo.save(cotizacion);

    // Generar ProgramacionServicio vinculada
    const programacion = programacionRepo.create({
      fechaProgramada,
      estado: 'PENDIENTE',
      conjuntoId: cotizacion.conjuntoId,
      propiedadId: cotizacion.propiedadId,
      cotizacionId: cotizacion.id,
      precioAcordado: cotizacion.precioTotal,
    });

    const programacionGuardada = await programacionRepo.save(programacion);

    return { cotizacion: cotizacionActualizada, programacion: programacionGuardada };
  },
};
