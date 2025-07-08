import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

  ) { }

  private userSockets = new Map<string, string>(); // userId -> socketId

  private joinUserToRoom(userId: string, client: Socket) {
    this.userSockets.set(userId, client.id);
    client.join(userId);
    console.log(`User ${userId} connected: ${client.id}`);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });

      const userId = payload._id;
      this.joinUserToRoom(userId, client);

    } catch (err) {
      console.log("❌ Invalid token, disconnecting socket...");
      client.disconnect();
    }
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

  @SubscribeMessage('join')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
     this.joinUserToRoom(userId, client);
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  @SubscribeMessage('message')
  async handleSendMessage(
    @MessageBody() data: { senderId: string; receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.sendMessage(
      {
        receiverId: data.receiverId,
        message: data.message,
      },
      { _id: data.senderId } as any,
    );

    // Emit to receiver
    this.server.to(data.receiverId).emit('receive_message', message);
    this.server.to(data.senderId).emit('receive_message', message);
  }
}



