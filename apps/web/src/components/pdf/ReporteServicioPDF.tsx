import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Colores oficiales
const colors = {
  brand: '#f97316',
  black: '#0f172a',
  white: '#ffffff',
  grayLight: '#f1f5f9',
  grayMedium: '#94a3b8',
  grayDark: '#475569',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.brand,
    paddingBottom: 20,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  headerTextContainer: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.grayDark,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    backgroundColor: colors.brand,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: colors.black,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  tableHeader: {
    backgroundColor: colors.grayLight,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    color: colors.black,
  },
  col1: { width: '40%' },
  col2: { width: '30%' },
  col3: { width: '30%' },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 10,
  },
  imageContainer: {
    width: '45%',
    marginBottom: 15,
  },
  evidenceImage: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  imageCaption: {
    fontSize: 8,
    color: colors.grayDark,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: colors.grayMedium,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: colors.grayMedium,
  },
});

interface ReporteProps {
  trabajo: any; // Orden de Trabajo
  configuracion: any; // Configuracion Global
}

export const ReporteServicioPDF = ({ trabajo, configuracion }: ReporteProps) => {
  const propiedad = trabajo.programacion?.propiedad;
  const conjunto = propiedad?.conjunto;
  const operario = trabajo.operario;
  
  const fechaGeneracion = new Date().toLocaleDateString();
  const fechaServicio = trabajo.fechaFin 
    ? new Date(trabajo.fechaFin).toLocaleDateString() 
    : new Date(trabajo.createdAt).toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ENCABEZADO */}
        <View style={styles.header}>
          {/* Logo (asumimos que está en la misma URL de la API o usamos base64, 
              en @react-pdf/renderer con Next.js a veces es mejor pasar la URL absoluta) */}
          {/* Para este MVP usamos una imagen de placeholder si falla, o el logo local si sirve */}
          <View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.brand }}>La Martina</Text>
            <Text style={{ fontSize: 10, color: colors.black }}>Gestión Integral</Text>
          </View>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Orden de Trabajo</Text>
            <Text style={styles.subtitle}>Reporte Técnico Operativo</Text>
            <Text style={styles.subtitle}>OT-{trabajo.id.substring(0, 8).toUpperCase()}</Text>
          </View>
        </View>

        {/* DATOS GENERALES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN GENERAL</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Servicio:</Text>
            <Text style={styles.value}>{fechaServicio}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Conjunto Residencial:</Text>
            <Text style={styles.value}>{conjunto?.nombre || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Propiedad:</Text>
            <Text style={styles.value}>Casa {propiedad?.numero || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Operario a Cargo:</Text>
            <Text style={styles.value}>{operario?.nombre || 'N/A'}</Text>
          </View>
        </View>

        {/* DETALLES DEL TRABAJO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLES TÉCNICOS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.col1]}>Descripción</Text>
              <Text style={[styles.tableCell, styles.col2]}>Extensión</Text>
              <Text style={[styles.tableCell, styles.col3]}>Complejidad</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {trabajo.programacion?.cotizacion?.detalles?.descripcion || 'Mantenimiento preventivo de zonas verdes'}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>{propiedad?.extension ? `${propiedad.extension} m²` : 'N/A'}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{propiedad?.complejidad || 'N/A'}</Text>
            </View>
          </View>
          
          {trabajo.observaciones && (
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.label, { marginBottom: 4 }]}>Observaciones del Operario:</Text>
              <Text style={[styles.value, { backgroundColor: colors.grayLight, padding: 8, borderRadius: 4 }]}>
                {trabajo.observaciones}
              </Text>
            </View>
          )}

          {trabajo.latitud && trabajo.longitud && (
            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.label}>Geolocalización GPS:</Text>
              <Text style={styles.value}>{trabajo.latitud}, {trabajo.longitud}</Text>
            </View>
          )}
        </View>

        {/* EVIDENCIAS (Página 1 o 2 dependiendo del espacio) */}
        {trabajo.evidenciaFotos && trabajo.evidenciaFotos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EVIDENCIA FOTOGRÁFICA</Text>
            <View style={styles.imagesGrid}>
              {trabajo.evidenciaFotos.map((fotoUrl: string, index: number) => (
                <View key={index} style={styles.imageContainer}>
                  <Image src={fotoUrl} style={styles.evidenceImage} />
                  <Text style={styles.imageCaption}>Evidencia {index + 1}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FOOTER GLOBALES Y PAGINACIÓN */}
        <Text style={styles.footer}>
          {configuracion?.nombreEmpresa || 'La Martina'} | {configuracion?.correoContacto} | {configuracion?.telefonoContacto}{'\n'}
          Documento generado automáticamente el {fechaGeneracion}
        </Text>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};
