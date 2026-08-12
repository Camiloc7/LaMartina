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

  async registrarPago(id: string, data: { monto: number; fecha: string; notas?: string }): Promise<Cotizacion> {
    const cotizacion = await cotizacionRepo.findOne({ where: { id } });
    if (!cotizacion) throw new Error('Cotizacion no encontrada');

    const montoNumber = Number(data.monto);
    cotizacion.montoPagado = Number(cotizacion.montoPagado) + montoNumber;
    
    const nuevoPago = {
      monto: montoNumber,
      fecha: data.fecha,
      notas: data.notas || ''
    };

    cotizacion.historialPagos = [...(cotizacion.historialPagos || []), nuevoPago];

    if (cotizacion.montoPagado >= cotizacion.precioTotal) {
      cotizacion.estadoPago = 'PAGADO';
    } else if (cotizacion.montoPagado > 0) {
      cotizacion.estadoPago = 'PARCIAL';
    }

    return await cotizacionRepo.save(cotizacion);
  },

  async obtenerResumenFinanciero(): Promise<{ totalCotizado: number; totalRecaudado: number; saldoPendiente: number }> {
    // Solo contar cotizaciones APROBADAS para el total cotizado
    const cotizaciones = await cotizacionRepo.find({ where: { estado: 'APROBADA' } });
    
    let totalCotizado = 0;
    let totalRecaudado = 0;

    for (const cot of cotizaciones) {
      totalCotizado += Number(cot.precioTotal);
      totalRecaudado += Number(cot.montoPagado);
    }

    return {
      totalCotizado,
      totalRecaudado,
      saldoPendiente: totalCotizado - totalRecaudado
    };
  },
};
