import { AppDataSource } from '../../config/database';
import { ProgramacionServicio } from '../../entities/ProgramacionServicio';
import { OrdenTrabajo } from '../../entities/OrdenTrabajo';
import { PdfService } from './pdf.service';

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
    if (!programacion) throw new Error('Programacion no encontrada');
    
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
    data: { observaciones?: string; evidenciaFotos?: string[] }
  ): Promise<OrdenTrabajo> {
    const orden = await ordenTrabajoRepo.findOne({ 
      where: { id: ordenId },
      relations: ['programacion', 'programacion.conjunto', 'programacion.propiedad', 'operario']
    });
    if (!orden) throw new Error('Orden de trabajo no encontrada');

    orden.fechaFin = new Date();
    if (data.observaciones) orden.observaciones = data.observaciones;
    if (data.evidenciaFotos) orden.evidenciaFotos = data.evidenciaFotos;
    
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
