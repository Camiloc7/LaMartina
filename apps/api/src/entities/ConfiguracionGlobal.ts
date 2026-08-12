import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('configuracion_global')
export class ConfiguracionGlobal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255, default: 'La Martina' })
  nombreEmpresa!: string;

  @Column({ length: 50, nullable: true })
  telefonoContacto?: string;

  @Column({ length: 150, nullable: true })
  correoContacto?: string;

  @Column({ length: 255, nullable: true })
  direccionFisica?: string;

  @Column({ type: 'jsonb', nullable: true })
  redesSociales?: { plataforma: string; url: string }[];

  @Column({ length: 255, nullable: true })
  horarioAtencion?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
