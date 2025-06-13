import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserFilters } from 'src/shared/interfaces/user-filters.interface';
import { isMatch } from 'src/shared/utils/filters.utils';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  private waitingUsers: Socket[] = [];
  private pairs: Map<string, string> = new Map();
  private userFilters: Map<string, UserFilters> = new Map();

  @SubscribeMessage('set_filters')
  handleSetFilters(@MessageBody() filters: UserFilters, @ConnectedSocket() client: Socket) {
    Logger.log(`Client ${client.id} set filters:`, filters, 'ChatGateway');
    this.userFilters.set(client.id, filters);
    this.tryPairUser(client, filters);
  }

  private tryPairUser(client: Socket, filters: UserFilters) {
    const matchingIndexes = this.waitingUsers
      .map((user, idx) => {
        const partnerFilters = this.userFilters.get(user.id);
        return partnerFilters && isMatch(filters, partnerFilters) ? idx : -1;
      })
      .filter((idx) => idx !== -1);
    if (matchingIndexes.length > 0) {
      const randomIdx = matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)];
      const partner = this.waitingUsers.splice(randomIdx, 1)[0];
      this.pairs.set(client.id, partner.id);
      this.pairs.set(partner.id, client.id);
      client.emit('chat_start', { partnerId: partner.id });
      partner.emit('chat_start', { partnerId: client.id });
    } else {
      this.waitingUsers.push(client);
    }
  }

  handleConnection(client: Socket) {
    Logger.log(`Client connected: ${client.id}`, 'ChatGateway');
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`, 'ChatGateway');
    const partnerId = this.pairs.get(client.id);
    if (partnerId) {
      this.server.to(partnerId).emit('partner_disconnected', { partnerId: client.id });
      this.pairs.delete(client.id);
      this.pairs.delete(partnerId);
      this.userFilters.delete(partnerId);
    }
    this.waitingUsers = this.waitingUsers.filter((user) => user.id !== client.id);
    this.userFilters.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: Socket) {
    Logger.log(`Message from ${client.id}:`, data.text, 'ChatGateway');
    const partnerId = this.pairs.get(client.id);
    if (partnerId) {
      this.server.to(partnerId).emit('message', { text: data.text, from: client.id });
    }
  }

  @SubscribeMessage('reconnect')
  handleReconnect(@MessageBody() oldId: string, @ConnectedSocket() client: Socket) {
    const partnerId = this.pairs.get(oldId);
    if (partnerId) {
      this.pairs.set(client.id, partnerId);
      this.pairs.set(partnerId, client.id);
      this.pairs.delete(oldId);
      this.server.to(partnerId).emit('partner_reconnected', { newId: client.id });
    }
  }

  @SubscribeMessage('leave_chat')
  handleLeaveChat(@ConnectedSocket() client: Socket) {
    Logger.log(`Client ${client.id} wants to leave chat`, 'ChatGateway');
    const partnerId = this.pairs.get(client.id);
    Logger.log(`Partner ID found: ${partnerId}`, 'ChatGateway');
    if (partnerId) {
      Logger.log(`Sending partner_left to ${partnerId}`, 'ChatGateway');
      this.server.to(partnerId).emit('partner_left', { partnerId: client.id });
      this.pairs.delete(client.id);
      this.pairs.delete(partnerId);
      this.userFilters.delete(partnerId);
    }
    this.waitingUsers = this.waitingUsers.filter((user) => user.id !== client.id);
    this.userFilters.delete(client.id);
  }
}
