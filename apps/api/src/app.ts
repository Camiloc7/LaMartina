import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';

import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { socketService } from './services/socket.service';

// Rutas de módulos
import { authRouter } from './modules/auth/auth.router';
import { usersRouter } from './modules/users/users.router';
import { jornadasRouter } from './modules/jornadas/jornadas.router';
import { pqrRouter } from './modules/pqr/pqr.router';
import { conjuntosRouter } from './modules/conjuntos/conjuntos.router';
import { propiedadesRouter } from './modules/propiedades/propiedades.router';
import { cotizacionesRouter } from './modules/cotizaciones/cotizaciones.router';
import { serviciosRouter } from './modules/servicios/servicios.router';
import { configuracionRouter } from './modules/configuracion/configuracion.router';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const app: Express = express();
const PORT = process.env['API_PORT'] ?? 3001;

// ─── Middleware Global ────────────────────────────────────────────────────────

app.use(helmet());
app.use(
  cors({
    origin: process.env['ALLOWED_ORIGINS']?.split(',') ?? [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Rutas ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/jornadas', jornadasRouter);
app.use('/api/v1/pqr', pqrRouter);
app.use('/api/v1/conjuntos', conjuntosRouter);
app.use('/api/v1/propiedades', propiedadesRouter);
app.use('/api/v1/cotizaciones', cotizacionesRouter);
app.use('/api/v1/servicios', serviciosRouter);
app.use('/api/v1/configuracion', configuracionRouter);

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Inicialización ───────────────────────────────────────────────────────────

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a PostgreSQL establecida');

    const server = createServer(app);
    socketService.initialize(server);
    console.log('🔌 Socket.io inicializado');

    server.listen(PORT, () => {
      console.log(`🚀 La Martina API corriendo en http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();

export default app;
