import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '../../config/cloudinary';
import { OrdenTrabajo } from '../../entities/OrdenTrabajo';

export const PdfService = {
  async generarReporteServicio(orden: OrdenTrabajo): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const tempPath = path.resolve(process.cwd(), `temp-reporte-${orden.id}.pdf`);
        const stream = fs.createWriteStream(tempPath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('Reporte de Servicio La Martina', { align: 'center' });
        doc.moveDown();

        // Details
        doc.fontSize(12).text(`Orden de Trabajo: ${orden.id}`);
        if (orden.programacion?.conjunto) {
          doc.text(`Conjunto: ${orden.programacion.conjunto.nombre}`);
        }
        if (orden.programacion?.propiedad) {
          doc.text(`Propiedad: ${orden.programacion.propiedad.numero}`);
        }
        
        doc.text(`Fecha de Inicio: ${orden.fechaInicio ? orden.fechaInicio.toISOString() : 'N/A'}`);
        doc.text(`Fecha de Fin: ${orden.fechaFin ? orden.fechaFin.toISOString() : 'N/A'}`);
        
        if (orden.operario) {
          doc.text(`Operario: ${orden.operario.nombre} ${orden.operario.apellido}`);
        }
        
        doc.moveDown();
        doc.fontSize(14).text('Observaciones:');
        doc.fontSize(12).text(orden.observaciones || 'Sin observaciones.');
        
        doc.end();

        stream.on('finish', async () => {
          try {
            // Upload to cloudinary
            const result = await uploadToCloudinary(tempPath, 'lamartina/reportes');
            // Clean temp file
            fs.unlinkSync(tempPath);
            resolve(result.secureUrl);
          } catch (uploadError) {
            reject(uploadError);
          }
        });

        stream.on('error', (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};
