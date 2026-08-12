import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from './User';
import { Conjunto } from './Conjunto';
import { Propiedad } from './Propiedad';

export type PQRTipo = 'PETICION' | 'QUEJA' | 'RECLAMO' | 'FELICITACION';
export type PQREstado = 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA';
export type PQRPrioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

@Entity('pqrs')
export class PQR {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Número de radicado único generado automáticamente.
   * Formato: PQR-YYYYMMDD-XXXX
   */
  @Column({ unique: true, length: 30 })
  radicado!: string;

  @Column({
    type: 'enum',
    enum: ['PETICION', 'QUEJA', 'RECLAMO', 'FELICITACION'],
  })
  tipo!: PQRTipo;

  @Column({
    type: 'enum',
    enum: ['ABIERTA', 'EN_PROCESO', 'RESUELTA', 'CERRADA'],
    default: 'ABIERTA',
  })
  estado!: PQREstado;

  @Column({
    type: 'enum',
    enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
    default: 'MEDIA',
  })
  prioridad!: PQRPrioridad;

  @Column({ length: 255 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  /**
   * URLs de Cloudinary de los archivos adjuntos (imágenes y PDFs).
   * Carpeta: lamartina/pqr
   * Se agregan vía POST /api/v1/pqr/:id/adjuntos
   * Máximo: 5 adjuntos por PQR (configurado en multer)
   */
  @Column({ type: 'simple-array', nullable: true })
  adjuntos: string[] = [];

  @ManyToOne(() => User, (user) => user.pqrs)
  @JoinColumn({ name: 'cliente_id' })
  cliente?: User;

  @Column({ name: 'cliente_id' })
  clienteId!: string;

  @ManyToOne(() => Conjunto, (conjunto) => conjunto.pqrs)
  @JoinColumn({ name: 'conjunto_id' })
  conjunto?: Conjunto;

  @Column({ name: 'conjunto_id' })
  conjuntoId!: string;

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.pqrs, { nullable: true })
  @JoinColumn({ name: 'propiedad_id' })
  propiedad?: Propiedad;

  @Column({ name: 'propiedad_id', nullable: true })
  propiedadId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'asignado_a_id' })
  asignadoA?: User;

  @Column({ name: 'asignado_a_id', nullable: true })
  asignadoAId?: string;

  @Column({ nullable: true, type: 'text' })
  respuesta?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  fechaLimite?: Date;

  @BeforeInsert()
  generateRadicado() {
    const fecha = new Date();
    const dateStr = fecha.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9000) + 1000;
    this.radicado = `PQR-${dateStr}-${random}`;
  }

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
