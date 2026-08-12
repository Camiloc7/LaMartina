import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

import { User } from '../entities/User';
import { Conjunto } from '../entities/Conjunto';
import { Jornada } from '../entities/Jornada';
import { PQR } from '../entities/PQR';
import { Propiedad } from '../entities/Propiedad';
import { Cotizacion } from '../entities/Cotizacion';
import { ProgramacionServicio } from '../entities/ProgramacionServicio';
import { OrdenTrabajo } from '../entities/OrdenTrabajo';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'],
  host: process.env['DB_HOST'] ?? 'localhost',
  port: parseInt(process.env['DB_PORT'] ?? '5432'),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  synchronize: process.env['NODE_ENV'] === 'development', // Solo en dev
  logging: process.env['NODE_ENV'] === 'development',
  entities: [User, Conjunto, Jornada, PQR, Propiedad, Cotizacion, ProgramacionServicio, OrdenTrabajo],
  migrations: ['src/migrations/**/*.ts', 'dist/migrations/**/*.js'],
  subscribers: [],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
