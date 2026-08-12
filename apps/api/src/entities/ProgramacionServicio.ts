import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Conjunto } from './Conjunto';
import { Propiedad } from './Propiedad';
import { Cotizacion } from './Cotizacion';
// import { OrdenTrabajo } from './OrdenTrabajo';

export type ProgramacionEstado = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';

@Entity('programaciones_servicio')
export class ProgramacionServicio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz' })
  fechaProgramada!: Date;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO'],
    default: 'PENDIENTE',
  })
  estado!: ProgramacionEstado;

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

  @ManyToOne(() => Cotizacion)
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion!: Cotizacion;

  @Column({ name: 'cotizacion_id' })
  cotizacionId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precioAcordado!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
