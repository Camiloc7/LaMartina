import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Conjunto } from './Conjunto';

export type JornadaEstado = 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';

@Entity('jornadas')
export class Jornada {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.jornadas)
  @JoinColumn({ name: 'operario_id' })
  operario?: User;

  @Column({ name: 'operario_id' })
  operarioId!: string;

  @ManyToOne(() => Conjunto)
  @JoinColumn({ name: 'conjunto_id' })
  conjunto?: Conjunto;

  @Column({ name: 'conjunto_id' })
  conjuntoId!: string;

  @Column({ type: 'timestamptz' })
  fechaInicio!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  fechaFin?: Date;

  @Column({
    type: 'enum',
    enum: ['EN_PROGRESO', 'COMPLETADA', 'CANCELADA'],
    default: 'EN_PROGRESO',
  })
  estado!: JornadaEstado;

  @Column({ nullable: true, type: 'text' })
  observaciones?: string;

  /**
   * URLs de Cloudinary de las fotos de evidencia tomadas durante la jornada.
   * Carpeta: lamartina/jornadas
   * Se agregan vía POST /api/v1/jornadas/:id/evidencias
   * Máximo: 10 fotos por jornada (configurado en multer)
   */
  @Column({ type: 'simple-array', nullable: true })
  evidencias: string[] = [];

  /**
   * Coordenadas GPS de inicio y fin (almacenadas como JSON).
   */
  @Column({ type: 'jsonb', nullable: true })
  ubicacionInicio?: { lat: number; lng: number };

  @Column({ type: 'jsonb', nullable: true })
  ubicacionFin?: { lat: number; lng: number };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
