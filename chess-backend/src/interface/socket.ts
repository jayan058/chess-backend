// src/types/socket-types.ts

import { Socket } from 'socket.io';

// Define an interface to extend the existing Socket interface
export interface ExtendedSocket extends Socket {
  userId?: number;
  user?: any;
}
