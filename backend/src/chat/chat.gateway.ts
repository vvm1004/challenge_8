import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // constructor(private readonly chatService: ChatService) {}

  private userSockets = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const disconnectedUserId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (disconnectedUserId) {
      this.userSockets.delete(disconnectedUserId);
      console.log(`User ${disconnectedUserId} disconnected`);
    }
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    this.userSockets.set(userId, client.id);
    client.join(userId);
    console.log(`User ${userId} joined room`);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}
