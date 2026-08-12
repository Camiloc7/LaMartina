import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// We extract the base URL from the API_URL (e.g. from http://localhost:3001/api/v1 to http://localhost:3001)
const SOCKET_URL = API_URL.replace('/api/v1', '');

class SocketClient {
  private socket: Socket | null = null;

  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado a WebSockets', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado de WebSockets');
      });
    }
    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClient();
