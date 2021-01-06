import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

// @WebSocketGateway({ namespace: '/user' })
@WebSocketGateway()
export class UserSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('UserGateway');

  @SubscribeMessage('online')
  handleOnline(client: Socket, payload: any): void {
    console.log(payload.body)
    client.broadcast.emit('online', payload.body);
  }

  @SubscribeMessage('offline')
  handleOffline(client: Socket, payload: any): void {
    client.broadcast.emit('offline', payload.body);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
