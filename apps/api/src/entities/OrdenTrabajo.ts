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
import { User } from './User';
import { ProgramacionServicio } from './ProgramacionServicio';

@Entity('ordenes_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => ProgramacionServicio)
  @JoinColumn({ name: 'programacion_id' })
  programacion!: ProgramacionServicio;

  @Column({ name: 'programacion_id' })
  programacionId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'operario_id' })
  operario!: User;

  @Column({ name: 'operario_id' })
  operarioId!: string;

  @Column({ type: 'timestamptz', nullable: true })
  fechaInicio?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fechaFin?: Date;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  /**
   * URLs de Cloudinary de la evidencia (fotos antes/después).
   */
  @Column({ type: 'simple-array', nullable: true })
  evidenciaFotos: string[] = [];

  /**
   * URL del reporte PDF final.
   */
  @Column({ length: 500, nullable: true })
  reportePdfUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
