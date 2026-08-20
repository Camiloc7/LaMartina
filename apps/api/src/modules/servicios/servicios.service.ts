import { AppDataSource } from '../../config/database';
import { ProgramacionServicio } from '../../entities/ProgramacionServicio';
import { OrdenTrabajo } from '../../entities/OrdenTrabajo';
import { PdfService } from './pdf.service';
import { ApiError } from '../../middleware/errorHandler';

const programacionRepo = AppDataSource.getRepository(ProgramacionServicio);
const ordenTrabajoRepo = AppDataSource.getRepository(OrdenTrabajo);

export const ServiciosService = {
  async obtenerProgramaciones(filtros: { conjuntoId?: string; operarioId?: string; estado?: string }): Promise<ProgramacionServicio[]> {
    const where: any = {};
    if (filtros.conjuntoId) where.conjuntoId = filtros.conjuntoId;
    if (filtros.estado) where.estado = filtros.estado;
    // Si hay filtros por operarioId, tendríamos que cruzar con OrdenTrabajo.
    // Por simplicidad en este MVP, retornamos todas y filtramos en el controlador si es necesario.

    return await programacionRepo.find({
      where,
      relations: ['conjunto', 'propiedad', 'cotizacion'],
      order: { fechaProgramada: 'ASC' },
    });
  },

  async obtenerProgramacionPorId(id: string): Promise<ProgramacionServicio | null> {
    return await programacionRepo.findOne({
      where: { id },
      relations: ['conjunto', 'propiedad', 'cotizacion'],
    });
  },

  async iniciarOrdenTrabajo(
    programacionId: string,
    operarioId: string
  ): Promise<OrdenTrabajo> {
    const programacion = await programacionRepo.findOne({ where: { id: programacionId } });
    if (!programacion) throw new ApiError('Programación no encontrada', 404);

    const existingOrder = await ordenTrabajoRepo.findOne({ where: { programacionId } });
    if (existingOrder) {
      throw new ApiError('Esta programación ya tiene una orden de trabajo.', 409);
    }
    
    // Cambiar estado a EN_PROGRESO
    programacion.estado = 'EN_PROGRESO';
    await programacionRepo.save(programacion);

    const orden = ordenTrabajoRepo.create({
      programacionId,
      operarioId,
      fechaInicio: new Date(),
    });

    return await ordenTrabajoRepo.save(orden);
  },

  async completarOrdenTrabajo(
    ordenId: string,
    data: { observaciones?: string; evidenciaFotos?: string[]; latitud?: number; longitud?: number },
    userId: string,
    userRol: string
  ): Promise<OrdenTrabajo> {
    const orden = await ordenTrabajoRepo.findOne({ 
      where: { id: ordenId },
      relations: ['programacion', 'programacion.conjunto', 'programacion.propiedad', 'operario']
    });
    if (!orden) throw new ApiError('Orden de trabajo no encontrada', 404);
    if (userRol === 'OPERARIO' && orden.operarioId !== userId) {
      throw new ApiError('No tienes permiso para completar esta orden.', 403);
    }

    orden.fechaFin = new Date();
    if (data.observaciones) orden.observaciones = data.observaciones;
    if (data.evidenciaFotos) orden.evidenciaFotos = data.evidenciaFotos;
    if (data.latitud !== undefined) orden.latitud = data.latitud;
    if (data.longitud !== undefined) orden.longitud = data.longitud;
    
    // Generar el PDF y subirlo a Cloudinary
    try {
      const pdfUrl = await PdfService.generarReporteServicio(orden);
      orden.reportePdfUrl = pdfUrl;
    } catch (err) {
      console.error('Error generando o subiendo PDF:', err);
    }

    const ordenActualizada = await ordenTrabajoRepo.save(orden);

    // Cambiar estado de la programacion a COMPLETADO
    if (ordenActualizada.programacion) {
      ordenActualizada.programacion.estado = 'COMPLETADO';
      await programacionRepo.save(ordenActualizada.programacion);
    }

    return ordenActualizada;
  },
};
