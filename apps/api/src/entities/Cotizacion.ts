import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Conjunto } from './Conjunto';
import { Propiedad } from './Propiedad';
// import { ProgramacionServicio } from './ProgramacionServicio';

export type CotizacionEstado = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA';

@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', generated: 'increment' })
  numeroSecuencial!: number;

  @ManyToOne(() => Conjunto)
  @JoinColumn({ name: 'conjunto_id' })
  conjunto!: Conjunto;

  @Column({ name: 'conjunto_id' })
  conjuntoId!: string;

  @ManyToOne(() => Propiedad, { nullable: true })
  @JoinColumn({ name: 'propiedad_id' })
  propiedad?: Propiedad;

  @Column({ name: 'propiedad_id', nullable: true })
  propiedadId?: string;

  @Column({ type: 'json' })
  detalles!: any; // JSON with breakdown of services

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precioTotal!: number;

  @Column({ type: 'int', nullable: true })
  cantidadCasas?: number;

  @Column({
    type: 'enum',
    enum: ['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA'],
    default: 'BORRADOR',
  })
  estado!: CotizacionEstado;

  // --- FINANCIAL TRACKING ---

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  montoPagado!: number;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'PARCIAL', 'PAGADO'],
    default: 'PENDIENTE',
  })
  estadoPago!: 'PENDIENTE' | 'PARCIAL' | 'PAGADO';

  /**
   * JSON Array to store payment history without needing a separate table.
   * Format: { monto: number, fecha: string, notas: string }[]
   */
  @Column({ type: 'jsonb', default: [] })
  historialPagos!: { monto: number; fecha: string; notas?: string }[];

  // --------------------------

  @Column({ type: 'text', nullable: true })
  notasFinancieras?: string;

  // @OneToMany(() => ProgramacionServicio, (prog) => prog.cotizacion)
  // programaciones?: ProgramacionServicio[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
