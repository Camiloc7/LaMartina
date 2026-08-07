import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

import { User } from '../entities/User';
import { Conjunto } from '../entities/Conjunto';
import { Jornada } from '../entities/Jornada';
import { PQR } from '../entities/PQR';

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
  entities: [User, Conjunto, Jornada, PQR],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: [],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
