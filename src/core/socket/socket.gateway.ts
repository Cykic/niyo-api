// socket.gateway.ts

import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly connectedUsers: Map<string, Socket> = new Map(); // Map to store connected users

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as  string; // Assuming userId is passed as a query parameter during connection
    console.log(`User ${userId} connected`);
    this.connectedUsers.set(userId, client); // Associate the socket with the user ID
  }

  handleDisconnect(client: Socket) {
    // Clean up disconnected user
    this.connectedUsers.forEach((socket, userId) => {
      if (socket === client) {
        this.connectedUsers.delete(userId);
      }
    });
  }

  emitToUser(userId: string, event: string, payload: any) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit(event, payload);
    } else {
      console.log(`User with ID ${userId} is not connected.`);
    }
  }
}
