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
import { User } from './User';
import { PQR } from './PQR';

@Entity('conjuntos')
export class Conjunto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  nombre!: string;

  @Column({ length: 500 })
  direccion!: string;

  @Column({ length: 100 })
  ciudad!: string;

  @Column({ nullable: true, length: 20 })
  nit?: string;

  @Column({ nullable: true, length: 20 })
  telefono?: string;

  @Column({ nullable: true, length: 255 })
  emailContacto?: string;

  /**
   * Array de URLs de Cloudinary para imágenes del conjunto.
   * Carpeta: lamartina/conjuntos
   * Se gestionan vía POST /api/v1/conjuntos/:id/imagenes
   */
  @Column({ type: 'simple-array', nullable: true })
  imagenes: string[] = [];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin?: User;

  @Column({ name: 'admin_id' })
  adminId!: string;

  @OneToMany(() => PQR, (pqr) => pqr.conjunto)
  pqrs?: PQR[];

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
