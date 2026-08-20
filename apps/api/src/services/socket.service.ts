import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

class SocketService {
  private io: Server | null = null;

  public initialize(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: process.env['ALLOWED_ORIGINS']?.split(',') ?? ['http://localhost:3000'],
        credentials: true,
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        return next(new Error('No autenticado'));
      }

      try {
        const jwtSecret = process.env['JWT_SECRET'];
        if (!jwtSecret) return next(new Error('Configuración de autenticación incompleta'));
        const decoded = jwt.verify(token, jwtSecret) as { sub: string; rol: string; conjuntoId?: string };
        socket.data.user = decoded;
        next();
      } catch {
        next(new Error('Token inválido'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id} (Rol: ${socket.data.user.rol})`);

      const { rol, conjuntoId } = socket.data.user;
      socket.join(`rol_${rol}`);
      if (conjuntoId) {
        socket.join(`conjunto_${conjuntoId}`);
      }

      socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
      });
    });
  }

  public getIo(): Server {
    if (!this.io) {
      throw new Error('Socket.io no ha sido inicializado!');
    }
    return this.io;
  }

  /**
   * Emitir un evento global a todos los clientes
   */
  public emitToAll(event: string, data: any): void {
    this.getIo().emit(event, data);
  }

  /**
   * Emitir un evento a un rol específico
   */
  public emitToRol(rol: string, event: string, data: any): void {
    this.getIo().to(`rol_${rol}`).emit(event, data);
  }

  public emitToRoles(roles: string[], event: string, data: unknown): void {
    for (const rol of roles) {
      this.getIo().to(`rol_${rol}`).emit(event, data);
    }
  }
  
  /**
   * Emitir un evento a un conjunto específico
   */
  public emitToConjunto(conjuntoId: string, event: string, data: any): void {
    this.getIo().to(`conjunto_${conjuntoId}`).emit(event, data);
  }
}

export const socketService = new SocketService();
