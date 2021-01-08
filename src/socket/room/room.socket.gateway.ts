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
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { InjectModel } from '@nestjs/mongoose';
import { IGame, Game } from '../../models/game.model';
import { Model } from 'mongoose';
import { IRoom, Room } from '../../models/room.model';

@WebSocketGateway()
export class RoomSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<IGame>,
    @InjectModel(Room.name) private readonly roomModel: Model<IRoom>,

  ) {}

  private logger: Logger = new Logger('RoomGateway');

  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    return this.server.to(payload.room).broadcast.emit('msgToClient', payload);
  }

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, payload: any) {
    client.join(payload.roomId);
    const room = await this.roomModel.findOne({idroom: payload.roomId});
    let data : any = room;
    data.chat = room.chat.map( msg => ({ message: msg.message, ownl: msg.username == payload.username }));
    this.server.to(`${client.id}`).emit('joinRoom', data);
  }

  @SubscribeMessage('createRoom')
  public createRoom(client: Socket, payload: any): void {
    client.broadcast.emit('createRoom', payload);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('sendMessage')
  public async message(client: Socket, data: any) {
    const room = await this.roomModel.findOne({idroom: data.roomId});
    room.chat.push({message: data.body.message, username: data.body.username})
    await room.save();
    client.broadcast.in(data.roomId).emit('recievedMessage', data.body);
  }

  @SubscribeMessage('confirm')
  public confirm(client: Socket, data: any): void {
    client.emit('success');
  }

  @SubscribeMessage('play')
  public play(client: Socket, payload: any): void {
    console.log('Data: ', payload);
    /*
      payload = {
        roomId,
        index, 
        chessman,
      }
    */
    client.to(payload.roomId).emit('play', payload);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
