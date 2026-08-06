// =============================================================================
// Tipos compartidos — La Martina
// Usados tanto en Frontend (Next.js) como en Backend (Node.js)
// =============================================================================

// ─── Cloudinary ──────────────────────────────────────────────────────────────

export interface CloudinaryAsset {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType: 'image' | 'video' | 'raw';
  createdAt: string;
  bytes?: number;
}

// ─── Usuario ─────────────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERARIO' | 'CLIENTE';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: UserRole;
  avatarUrl?: string; // URL de Cloudinary
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  rol: UserRole;
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  avatarUrl?: string;
}

// ─── Conjunto Residencial ────────────────────────────────────────────────────

export interface Conjunto {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit?: string;
  telefono?: string;
  emailContacto?: string;
  adminId: string;
  imagenes: string[]; // URLs de Cloudinary
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConjuntoDto {
  nombre: string;
  direccion: string;
  ciudad: string;
  nit?: string;
  telefono?: string;
  emailContacto?: string;
  adminId: string;
}

// ─── Jornada Laboral ─────────────────────────────────────────────────────────

export type JornadaEstado = 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';

export interface Jornada {
  id: string;
  operarioId: string;
  conjuntoId: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: JornadaEstado;
  observaciones?: string;
  evidencias: string[]; // URLs de Cloudinary (fotos del trabajo realizado)
  ubicacionInicio?: GeoCoordinates;
  ubicacionFin?: GeoCoordinates;
  createdAt: string;
  updatedAt: string;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface IniciarJornadaDto {
  operarioId: string;
  conjuntoId: string;
  ubicacion?: GeoCoordinates;
}

export interface FinalizarJornadaDto {
  observaciones?: string;
  ubicacion?: GeoCoordinates;
}

// ─── PQR (Peticiones, Quejas, Reclamos) ──────────────────────────────────────

export type PQRTipo = 'PETICION' | 'QUEJA' | 'RECLAMO';
export type PQREstado = 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA';
export type PQRPrioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface PQR {
  id: string;
  radicado: string; // Número de radicado único
  tipo: PQRTipo;
  estado: PQREstado;
  prioridad: PQRPrioridad;
  titulo: string;
  descripcion: string;
  adjuntos: string[]; // URLs de Cloudinary
  clienteId: string;
  conjuntoId: string;
  asignadoAId?: string; // Operario asignado
  respuesta?: string;
  fechaLimite?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrearPQRDto {
  tipo: PQRTipo;
  titulo: string;
  descripcion: string;
  conjuntoId: string;
  prioridad?: PQRPrioridad;
}

export interface ResponderPQRDto {
  respuesta: string;
  estado: PQREstado;
  asignadoAId?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'createdAt' | 'updatedAt'>;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}
