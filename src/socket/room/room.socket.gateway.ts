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
import { IUser, User } from '../../models/user.model';

@WebSocketGateway()
export class RoomSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<IGame>,
    @InjectModel(Room.name) private readonly roomModel: Model<IRoom>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  private logger: Logger = new Logger('RoomGateway');

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, payload: any) {
    client.join(payload.roomId);
    const room = await this.roomModel.findOne({ idroom: payload.roomId });
    const game = await this.gameModel
      .find({ roomId: payload.roomId })
      .sort({ _id: -1 })
      .limit(1);
    if (room) {
      let data: any = room;
      data.chat = room.chat.map((msg) => ({
        message: msg.message,
        ownl: msg.username == payload.user.user,
        avatar: msg.avatar,
        display_name: msg.display_name,
      }));
      this.server.to(`${client.id}`).emit('joinRoom', data);
      const board = {
        board: game.length > 0 ? game[0].board : null,
        playing: game.length > 0 ? game[0].playing : false,
        datetime: game.length > 0 ? game[0].datetime : null,
        player1: game.length > 0 ? game[0].player1 : '',
        player2: game.length > 0 ? game[0].player2 : '',
      };
      this.server.to(`${client.id}`).emit('createBoard', board);
    }
  }

  @SubscribeMessage('ready')
  public async handleReady(client: Socket, payload: any) {
    const room: any = await this.roomModel.findOne({ idroom: payload.roomId });
    if (room) {
      if (
        room.player2?.username != payload.user.user &&
        room.player1?.username != payload.user.user
      ) {
        if (!room.player2?.username) {
          room.player2 = {
            avatar: payload.user.image,
            username: payload.user.user,
            display_name: payload.user.name,
          };
        } else {
          room.player1 = {
            avatar: payload.user.image,
            username: payload.user.user,
            display_name: payload.user.name,
          };
        }
        await room.save();
        this.server.in(payload.roomId).emit('ready', room);
      }
    }
  }

  @SubscribeMessage('playGame')
  public async createGame(client: Socket, payload: any) {
    const room: any = await this.roomModel.findOne({ idroom: payload.roomId });
    if (room) {
      const game = new this.gameModel({
        roomId: room.idroom,
        player1: room.player1.username,
        player2: room.player2.username,
        board: [],
        datetime: new Date(),
        playing: true,
      });
      await game.save();
    }
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('createRoom')
  public createRoom(client: Socket, payload: any): void {
    client.broadcast.emit('createRoom', payload);
  }

  @SubscribeMessage('sendMessage')
  public async message(client: Socket, data: any) {
    const room = await this.roomModel.findOne({ idroom: data.roomId });
    room.chat.push({
      message: data.body.message,
      username: data.body.username,
      avatar: data.body.avatar,
      display_name: data.body.display_name,
    });
    await room.save();

    client.broadcast.in(data.roomId).emit('recievedMessage', data.body);
  }

  @SubscribeMessage('confirm')
  public confirm(client: Socket, data: any): void {
    client.emit('success');
  }

  @SubscribeMessage('endGame')
  public endGame(client: Socket, payload: any): void {
    // client.broadcast.emit('createRoom', payload);
  }

  @SubscribeMessage('play')
  public async play(client: Socket, payload: any) {
    const data = await this.gameModel
      .find({ roomId: payload.roomId })
      .sort({ _id: -1 })
      .limit(1);
    const game = data[0];

    game.board.push({
      value: payload.value,
      index: payload.index,
    });
    await game.save();
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
