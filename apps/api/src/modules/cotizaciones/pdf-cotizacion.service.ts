import PDFDocument from 'pdfkit';
import path from 'path';
import { Cotizacion } from '../../entities/Cotizacion';
import { AppDataSource } from '../../config/database';
import { Propiedad } from '../../entities/Propiedad';

export const PdfCotizacionesService = {
  async generarPdfCotizacion(cotizacion: Cotizacion, stream: NodeJS.WritableStream): Promise<void> {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Pipe the PDF into the response stream
    doc.pipe(stream);
    
    const logoPath = path.resolve(process.cwd(), 'src/assets/logo.png');
    const primaryColor = '#f97316'; // Orange
    const secondaryColor = '#0f172a'; // Slate 900
    
    // HEADER
    doc.image(logoPath, 50, 45, { width: 80 });
    
    doc
      .fillColor(primaryColor)
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('COTIZACIÓN', 200, 50, { align: 'right' });
      
    doc
      .fillColor(secondaryColor)
      .fontSize(10)
      .font('Helvetica')
      .text(`Cotización #${String(cotizacion.numeroSecuencial || 0).padStart(6, '0')}`, 200, 75, { align: 'right' })
      .text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 200, 90, { align: 'right' })
      .text(`Estado: ${cotizacion.estado}`, 200, 105, { align: 'right' });
      
    // DIVIDER
    doc
      .moveTo(50, 140)
      .lineTo(545, 140)
      .lineWidth(2)
      .strokeColor(primaryColor)
      .stroke();
      
    // CLIENT INFO
    doc
      .fillColor(secondaryColor)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('DATOS DEL CLIENTE', 50, 160);
      
    // Calculate property count
    let numeroCasas = 1;
    let textoAlcance = `Propiedad específica: ${cotizacion.propiedad?.numero || 'N/A'}`;
    
    if (cotizacion.cantidadCasas) {
      numeroCasas = cotizacion.cantidadCasas;
      textoAlcance = `Cotización manual para ${numeroCasas} propiedades`;
    } else if (!cotizacion.propiedadId && cotizacion.conjuntoId) {
      numeroCasas = await AppDataSource.getRepository(Propiedad).count({
        where: { conjuntoId: cotizacion.conjuntoId }
      });
      textoAlcance = `Cobertura total del conjunto (${numeroCasas} propiedades registradas)`;
    }
      
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Conjunto Residencial: ${cotizacion.conjunto?.nombre || 'N/A'}`, 50, 180)
      .text(`Dirección: ${cotizacion.conjunto?.direccion || 'N/A'}`, 50, 195)
      .text(`Alcance: ${textoAlcance}`, 50, 210);

    // DETAILS TABLE HEADER
    doc
      .fillColor(primaryColor)
      .rect(50, 240, 495, 25)
      .fill();
      
    doc
      .fillColor('#ffffff')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('DESCRIPCIÓN DEL SERVICIO', 60, 248)
      .text('CANTIDAD', 380, 248)
      .text('TOTAL', 470, 248);
      
    // DETAILS CONTENT
    doc
      .fillColor(secondaryColor)
      .fontSize(10)
      .font('Helvetica')
      .text(cotizacion.detalles?.descripcion || 'Servicios generales de mantenimiento.', 60, 280, { width: 300, align: 'justify' })
      .text(`${numeroCasas} Casas`, 380, 280)
      .text(`$${Number(cotizacion.precioTotal).toLocaleString('es-CO')}`, 470, 280);
      
    // TABLE BORDER BOTTOM
    doc
      .moveTo(50, 360)
      .lineTo(545, 360)
      .lineWidth(1)
      .strokeColor('#e2e8f0')
      .stroke();
    
    // PRECIO TOTAL (Solo en cotizaciones)
    doc
      .fillColor(secondaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`VALOR TOTAL: $${Number(cotizacion.precioTotal).toLocaleString('es-CO')}`, 50, 380, { align: 'right' });
      
    // CLAUSES
    doc
      .moveTo(50, 620)
      .lineTo(545, 620)
      .lineWidth(1)
      .strokeColor('#e2e8f0')
      .stroke();
      
    doc
      .fillColor(primaryColor)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('CLÁUSULAS Y CONDICIONES DE VALIDEZ', 50, 640);
      
    doc
      .fillColor('#64748b')
      .fontSize(8)
      .font('Helvetica')
      .text('1. La presente cotización tiene una validez de treinta (30) días calendario a partir de su fecha de expedición.', 50, 660, { width: 495 })
      .text('2. Los valores aquí presentados incluyen IVA según aplique y podrán estar sujetos a variaciones si cambian las condiciones iniciales del requerimiento.', 50, 675, { width: 495 })
      .text('3. Para dar inicio a los trabajos, se requiere la aprobación formal de esta cotización y el pago del anticipo acordado (si aplica).', 50, 695, { width: 495 })
      .text('4. El tiempo de ejecución se contará a partir del cumplimiento de los requisitos de inicio y la disponibilidad técnica de los espacios.', 50, 715, { width: 495 });
      
    // FOOTER
    doc
      .fillColor(secondaryColor)
      .fontSize(8)
      .text('La Martina Mantenimientos S.A.S | contacto@lamartina.com | Tel: +57 300 000 0000', 50, 780, { align: 'center' });
      
    // Finalize PDF file
    doc.end();
  }
};
