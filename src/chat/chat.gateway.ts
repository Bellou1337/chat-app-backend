import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserFilters } from 'src/shared/interfaces/user-filters.interface';
import { isMatch } from 'src/shared/utils/filters.utils';
import { DisconnectedUser } from 'src/shared/interfaces/disconnected-user.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private waitingUsers: Socket[] = [];
  private pairs: Map<string, string> = new Map();
  private userFilters: Map<string, UserFilters> = new Map();
  private disconnectedUsers: Map<string, DisconnectedUser> = new Map();
  private readonly RECONNECT_TIMEOUT = 30000; // 30 секунд на переподключение

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
      const filters = this.userFilters.get(client.id);
      if (filters) {
        this.disconnectedUsers.set(client.id, {
          socket: client,
          partnerId,
          filters,
          disconnectedAt: Date.now(),
        });
      }

      this.server.to(partnerId).emit('partner_disconnected', { partnerId: client.id });

      setTimeout(() => {
        this.finalizeDisconnect(client.id);
      }, this.RECONNECT_TIMEOUT);
    } else {
      this.cleanupUser(client.id);
    }
  }

  private finalizeDisconnect(clientId: string) {
    const disconnectedUser = this.disconnectedUsers.get(clientId);
    if (disconnectedUser) {
      Logger.log(`Finalizing disconnect for ${clientId}`, 'ChatGateway');

      this.server.to(disconnectedUser.partnerId).emit('partner_left', { partnerId: clientId });

      this.pairs.delete(clientId);
      this.pairs.delete(disconnectedUser.partnerId);

      this.disconnectedUsers.delete(clientId);
      this.userFilters.delete(clientId);
      this.userFilters.delete(disconnectedUser.partnerId);
    }
  }

  private cleanupUser(clientId: string) {
    this.waitingUsers = this.waitingUsers.filter((user) => user.id !== clientId);
    this.userFilters.delete(clientId);
    this.disconnectedUsers.delete(clientId);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    data: { text?: string; image?: { data: string; mimeType: string; size: number } },
    @ConnectedSocket() client: Socket,
  ) {
    Logger.log(`Message from ${client.id}`, 'ChatGateway');

    if (data.image && data.image.size > 5 * 1024 * 1024) {
      client.emit('message_error', { error: 'Image too large. Maximum size is 5MB.' });
      return;
    }

    const partnerId = this.pairs.get(client.id);
    if (partnerId) {
      const message = {
        ...data,
        from: client.id,
        timestamp: Date.now(),
      };
      this.server.to(partnerId).emit('message', message);
    }
  }

  @SubscribeMessage('reconnect')
  handleReconnect(@MessageBody() oldId: string, @ConnectedSocket() client: Socket) {
    Logger.log(`Reconnect attempt: ${oldId} -> ${client.id}`, 'ChatGateway');

    const disconnectedUser = this.disconnectedUsers.get(oldId);
    if (disconnectedUser) {
      Logger.log(`Reconnecting user ${oldId} as ${client.id}`, 'ChatGateway');

      this.pairs.set(client.id, disconnectedUser.partnerId);
      this.pairs.set(disconnectedUser.partnerId, client.id);
      this.pairs.delete(oldId);

      this.userFilters.set(client.id, disconnectedUser.filters);
      this.userFilters.delete(oldId);

      this.server.to(disconnectedUser.partnerId).emit('partner_reconnected', {
        oldId: oldId,
        newId: client.id,
      });

      this.disconnectedUsers.delete(oldId);

      Logger.log(`Successfully reconnected ${oldId} -> ${client.id}`, 'ChatGateway');
    } else {
      Logger.log(`Reconnect failed: no disconnected user found for ${oldId}`, 'ChatGateway');
      client.emit('reconnect_failed');
    }
  }

  @SubscribeMessage('leave_chat')
  handleLeaveChat(@ConnectedSocket() client: Socket) {
    Logger.log(`Client ${client.id} wants to leave chat`, 'ChatGateway');

    const partnerId = this.pairs.get(client.id);
    if (partnerId) {
      Logger.log(`Sending partner_left to ${partnerId}`, 'ChatGateway');
      this.server.to(partnerId).emit('partner_left', { partnerId: client.id });

      this.pairs.delete(client.id);
      this.pairs.delete(partnerId);

      this.userFilters.delete(client.id);
      this.userFilters.delete(partnerId);
    }

    this.cleanupUser(client.id);
  }
}
