import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'La Martina — Plataforma de Gestión de Conjuntos Residenciales',
  description:
    'Gestiona jornadas laborales, PQR y conjuntos residenciales de forma centralizada con La Martina. Plataforma moderna y segura para administradores y operarios.',
  keywords: [
    'gestión conjuntos residenciales',
    'PQR',
    'jornadas laborales',
    'administración',
    'La Martina',
  ],
  openGraph: {
    title: 'La Martina',
    description: 'Plataforma Centralizada de Gestión de Conjuntos Residenciales',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
