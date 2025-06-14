import type { Socket } from 'socket.io';
import type { UserFilters } from './user-filters.interface';

export interface DisconnectedUser {
  socket: Socket;
  partnerId: string;
  filters: UserFilters;
  disconnectedAt: number;
}
