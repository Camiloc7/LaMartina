import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Jornada } from './Jornada';
import { PQR } from './PQR';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERARIO' | 'CLIENTE';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  apellido!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ select: false }) // No retornar el hash en queries
  password!: string;

  @Column({ nullable: true, length: 20 })
  telefono?: string;

  @Column({
    type: 'enum',
    enum: ['SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'CLIENTE'],
    default: 'CLIENTE',
  })
  rol!: UserRole;

  /**
   * URL de Cloudinary para la foto de perfil del usuario.
   * Se actualiza vía PATCH /api/v1/users/:id/avatar
   * Carpeta: lamartina/profiles
   */
  @Column({ nullable: true, length: 500 })
  avatarUrl?: string;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => Jornada, (jornada) => jornada.operario)
  jornadas?: Jornada[];

  @OneToMany(() => PQR, (pqr) => pqr.cliente)
  pqrs?: PQR[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
