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
import { User } from './User';
import { PQR } from './PQR';
// import { ProgramacionServicio } from './ProgramacionServicio'; // To add later

export type ComplejidadPropiedad = 'BAJA' | 'MEDIA' | 'ALTA';

@Entity('propiedades')
export class Propiedad {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  numero!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  extension!: number;

  @Column({
    type: 'enum',
    enum: ['BAJA', 'MEDIA', 'ALTA'],
    default: 'MEDIA',
  })
  complejidad!: ComplejidadPropiedad;

  @ManyToOne(() => Conjunto, (conjunto) => conjunto.propiedades)
  @JoinColumn({ name: 'conjunto_id' })
  conjunto!: Conjunto;

  @Column({ name: 'conjunto_id' })
  conjuntoId!: string;

  @ManyToOne(() => User, (user) => user.propiedades, { nullable: true })
  @JoinColumn({ name: 'propietario_id' })
  propietario?: User;

  @Column({ name: 'propietario_id', nullable: true })
  propietarioId?: string;

  @Column({ length: 100, unique: true })
  identificadorUnicoQr!: string;

  @Column({ length: 4 })
  pinAcceso!: string;

  @OneToMany(() => PQR, (pqr) => pqr.propiedad)
  pqrs?: PQR[];

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
