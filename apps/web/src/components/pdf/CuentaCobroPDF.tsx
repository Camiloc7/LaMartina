import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const colors = {
  brand: '#f97316',
  black: '#0f172a',
  white: '#ffffff',
  grayLight: '#f1f5f9',
  grayMedium: '#94a3b8',
  grayDark: '#475569',
  success: '#10b981',
  error: '#f43f5e'
};

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: colors.white, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: colors.brand, paddingBottom: 20, marginBottom: 30 },
  headerTextContainer: { alignItems: 'flex-end' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.black, marginBottom: 4 },
  subtitle: { fontSize: 12, color: colors.grayDark },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.white, backgroundColor: colors.brand, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 10, borderRadius: 4 },
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 120, fontSize: 10, fontWeight: 'bold', color: colors.grayDark },
  value: { flex: 1, fontSize: 10, color: colors.black },
  table: { width: '100%', borderWidth: 1, borderColor: colors.grayLight, marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.grayLight },
  tableHeader: { backgroundColor: colors.grayLight, fontWeight: 'bold' },
  tableCell: { padding: 10, fontSize: 10, color: colors.black },
  col1: { width: '40%' },
  col2: { width: '30%', textAlign: 'right' },
  col3: { width: '30%', textAlign: 'right' },
  totalsContainer: { alignItems: 'flex-end', marginTop: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 220, marginBottom: 6 },
  totalLabel: { fontSize: 12, fontWeight: 'bold', color: colors.grayDark },
  totalValue: { fontSize: 12, fontWeight: 'bold', color: colors.black },
  grandTotal: { fontSize: 16, fontWeight: 'bold', color: colors.error }, // Red color to indicate pending balance
  paidTotal: { fontSize: 12, fontWeight: 'bold', color: colors.success },
  legalText: { fontSize: 8, color: colors.grayDark, marginTop: 40, fontStyle: 'italic', textAlign: 'justify', lineHeight: 1.4 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: colors.grayMedium, fontSize: 8, borderTopWidth: 1, borderTopColor: colors.grayLight, paddingTop: 10 },
});

export const CuentaCobroPDF = ({ cotizacion, configuracion }: { cotizacion: any, configuracion: any }) => {
  const fechaGeneracion = new Date().toLocaleDateString();
  const precio = Number(cotizacion.precioTotal);
  const pagado = Number(cotizacion.montoPagado || 0);
  const pendiente = precio - pagado;
  
  const historialPagos = cotizacion.historialPagos || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.brand }}>La Martina</Text>
            <Text style={{ fontSize: 10, color: colors.black }}>Gestión Integral</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>CUENTA DE COBRO</Text>
            <Text style={styles.subtitle}>Doc Nº {cotizacion.id.substring(0, 8).toUpperCase()}</Text>
            <Text style={styles.subtitle}>Fecha Emisión: {fechaGeneracion}</Text>
            <Text style={[styles.subtitle, { color: pendiente === 0 ? colors.success : colors.brand, fontWeight: 'bold', marginTop: 4 }]}>
              ESTADO: {cotizacion.estadoPago || 'PENDIENTE'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL DEUDOR</Text>
          <View style={styles.row}>
            <Text style={styles.label}>A nombre de:</Text>
            <Text style={styles.value}>{cotizacion.conjunto?.nombre || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Propiedad Asociada:</Text>
            <Text style={styles.value}>{cotizacion.propiedad?.numero ? `Casa ${cotizacion.propiedad.numero}` : 'Cotización Global'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONCEPTO DEL COBRO</Text>
          <Text style={{ fontSize: 10, color: colors.black, marginBottom: 10, lineHeight: 1.4 }}>
            Debe y pagará a la orden de LA MARTINA GESTIÓN INTEGRAL, la suma indicada a continuación por concepto de servicios prestados:
          </Text>
          <Text style={{ fontSize: 10, color: colors.black, fontWeight: 'bold', marginBottom: 10, padding: 8, backgroundColor: colors.grayLight }}>
            {cotizacion.detalles?.descripcion || 'Servicios de mantenimiento.'}
          </Text>

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Valor Total del Servicio:</Text>
              <Text style={styles.totalValue}>${precio.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Abonos Registrados:</Text>
              <Text style={[styles.totalValue, styles.paidTotal]}>- ${pagado.toLocaleString()}</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: colors.grayLight, paddingTop: 10 }]}>
              <Text style={styles.totalLabel}>SALDO A PAGAR:</Text>
              <Text style={[styles.totalValue, pendiente > 0 ? styles.grandTotal : { color: colors.success, fontSize: 16 }]}>
                ${pendiente.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {historialPagos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HISTORIAL DE PAGOS RECIBIDOS</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.col1]}>Fecha de Pago</Text>
                <Text style={[styles.tableCell, styles.col2]}>Monto</Text>
                <Text style={[styles.tableCell, styles.col3]}>Notas</Text>
              </View>
              {historialPagos.map((pago: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col1]}>{pago.fecha}</Text>
                  <Text style={[styles.tableCell, styles.col2]}>${Number(pago.monto).toLocaleString()}</Text>
                  <Text style={[styles.tableCell, styles.col3]}>{pago.notas || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View>
          <Text style={styles.legalText}>
            ACLARACIONES LEGALES: El presente documento constituye una cuenta de cobro y presta mérito ejecutivo en caso de mora o incumplimiento conforme a la legislación comercial vigente. 
            El pago deberá realizarse a favor de {configuracion?.nombreEmpresa || 'La Martina'} a más tardar 5 días hábiles después de la presentación de este documento, a menos que se hayan pactado fechas de crédito específicas. 
            El incumplimiento generará intereses de mora a la tasa máxima permitida por la ley.
          </Text>
        </View>

        <Text style={styles.footer}>
          {configuracion?.nombreEmpresa || 'La Martina'} | {configuracion?.correoContacto} | {configuracion?.telefonoContacto}{'\n'}
          Documento generado automáticamente el {fechaGeneracion}
        </Text>
      </Page>
    </Document>
  );
};
