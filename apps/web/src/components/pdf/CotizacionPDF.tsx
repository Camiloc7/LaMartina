import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const colors = {
  brand: '#f97316',
  black: '#0f172a',
  white: '#ffffff',
  grayLight: '#f1f5f9',
  grayMedium: '#94a3b8',
  grayDark: '#475569',
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
  col1: { width: '70%' },
  col2: { width: '30%', textAlign: 'right' },
  totalsContainer: { alignItems: 'flex-end', marginTop: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 6 },
  totalLabel: { fontSize: 12, fontWeight: 'bold', color: colors.grayDark },
  totalValue: { fontSize: 12, fontWeight: 'bold', color: colors.brand },
  grandTotal: { fontSize: 16, fontWeight: 'bold', color: colors.black },
  legalText: { fontSize: 8, color: colors.grayDark, marginTop: 40, fontStyle: 'italic', textAlign: 'justify', lineHeight: 1.4 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: colors.grayMedium, fontSize: 8, borderTopWidth: 1, borderTopColor: colors.grayLight, paddingTop: 10 },
});

export const CotizacionPDF = ({ cotizacion, configuracion }: { cotizacion: any, configuracion: any }) => {
  const fechaGeneracion = new Date().toLocaleDateString();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 15);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.brand }}>La Martina</Text>
            <Text style={{ fontSize: 10, color: colors.black }}>Gestión Integral</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>COTIZACIÓN</Text>
            <Text style={styles.subtitle}>Nº {cotizacion.id.substring(0, 8).toUpperCase()}</Text>
            <Text style={styles.subtitle}>Fecha: {fechaGeneracion}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL CLIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Conjunto Residencial:</Text>
            <Text style={styles.value}>{cotizacion.conjunto?.nombre || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Propiedad:</Text>
            <Text style={styles.value}>{cotizacion.propiedad?.numero ? `Casa ${cotizacion.propiedad.numero}` : 'Cotización Global del Conjunto'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPCIÓN DE SERVICIOS</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.col1]}>Concepto</Text>
              <Text style={[styles.tableCell, styles.col2]}>Valor Total</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {cotizacion.detalles?.descripcion || 'Servicio de mantenimiento integral (ver anexos operativos)'}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>
                ${Number(cotizacion.precioTotal).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL A PAGAR:</Text>
              <Text style={[styles.totalValue, styles.grandTotal]}>${Number(cotizacion.precioTotal).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.legalText}>
            CONDICIONES Y VALIDEZ: Esta cotización es válida por 15 días a partir de la fecha de emisión ({validUntil.toLocaleDateString()}). 
            Los precios indicados incluyen los servicios descritos en la sección de concepto. 
            Cualquier servicio adicional fuera del alcance descrito será cotizado y facturado por separado. 
            Aprobando esta cotización usted acepta los términos de servicio de La Martina.
          </Text>
        </View>

        <Text style={styles.footer}>
          {configuracion?.nombreEmpresa || 'La Martina'} | {configuracion?.correoContacto} | {configuracion?.telefonoContacto}{'\n'}
          Este documento es una cotización informativa y no constituye una cuenta de cobro oficial.
        </Text>
      </Page>
    </Document>
  );
};
