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

    // Autenticación básica de sockets (opcional pero recomendada para canales seguros)
    this.io.use((socket, next) => {
      // Extraemos el token ya sea del auth payload o de las cookies
      const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        // Permitimos la conexión de todas formas (quizás para vistas públicas) pero sin identificar usuario
        return next();
      }

      try {
        const decoded = jwt.verify(token, process.env['JWT_SECRET'] ?? 'dev_secret') as any;
        socket.data.user = decoded; // { id, rol, conjuntoId }
        next();
      } catch (err) {
        // En caso de error de token, procedemos pero como invitado
        next();
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id} (User: ${socket.data.user?.rol || 'Invitado'})`);

      // Unimos al usuario a una sala (room) si queremos mandar notificaciones por conjunto o rol
      if (socket.data.user) {
        const { id, rol, conjuntoId } = socket.data.user;
        socket.join(`rol_${rol}`); // Ej: rol_ADMIN
        if (conjuntoId) {
          socket.join(`conjunto_${conjuntoId}`);
        }
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
  
  /**
   * Emitir un evento a un conjunto específico
   */
  public emitToConjunto(conjuntoId: string, event: string, data: any): void {
    this.getIo().to(`conjunto_${conjuntoId}`).emit(event, data);
  }
}

export const socketService = new SocketService();
