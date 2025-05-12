import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  private waitingUsers: Socket[] = [];
  private pairs: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    this.waitingUsers.push(client);
    if (this.waitingUsers.length >= 2) {
      const [user1, user2] = this.waitingUsers.splice(0, 2);
      this.pairs.set(user1.id, user2.id);
      this.pairs.set(user2.id, user1.id);
      user1.emit('chat_start', { partnerId: user2.id });
      user2.emit('chat_start', { partnerId: user1.id });
    }
  }

  handleDisconnect(client: Socket) {
    const partnerId = this.pairs.get(client.id);
    if (partnerId) {
      this.server.to(partnerId).emit('partner_disconnected', { partnerId: client.id });
      this.pairs.delete(client.id);
      this.pairs.delete(partnerId);
    }
    this.waitingUsers = this.waitingUsers.filter((user) => user.id !== client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: Socket) {
    const partnerId = this.pairs.get(client.id);
    if (partnerId) {
      this.server.to(partnerId).emit('message', { text: data.text, from: client.id });
    }
  }
}
