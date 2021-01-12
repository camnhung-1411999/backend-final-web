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
import { History, IHistory } from 'src/models/history.model';
import * as moment from 'moment';

@WebSocketGateway()
export class RoomSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<IGame>,
    @InjectModel(Room.name) private readonly roomModel: Model<IRoom>,
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    @InjectModel(History.name) private readonly historyModel: Model<IHistory>,
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
      this.server.in(payload.roomId).emit("playGame", game);
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

  @SubscribeMessage('win')
  public async endGame(client: Socket, payload: any) {
    const data = await this.gameModel
      .find({ roomId: payload.roomId })
      .sort({ _id: -1 })
      .limit(1);
    const game = data[0];

    game.playing = false;
    await game.save();
    const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
    const history = new this.historyModel({
      roomId: payload.roomId,
      winner: payload.user.user,
      result: game.board,
      loser: payload.user.user === game.player1 ? game.player2 : game.player1,
      datetime: createdDate,
    });
    await history.save();

    const player1 = await this.userModel.findOne({ user: payload.user.user });

    const player2 = await this.userModel.findOne({
      user: payload.user.user === game.player1 ? game.player2 : game.player1,
    });

    player1.totalMatch += 1;
    player2.totalMatch += 1;

    if (player1.cups > player2.cups) {
      player1.cups += 5;
      player1.cups -= 5;
    } else {
      player1.cups += 10;
      player1.cups -= 10;
    }

    await player1.save();
    await player2.save();

    if (player1 && player2) {
      const endGame = {
        winner: player1.user,
        loser: player2.user,
      };

      client.in(payload.roomId).emit('endGame', endGame);
    }
  }

  @SubscribeMessage('play')
  public async play(client: Socket, payload: any) {
    console.log("ssssssssssss")
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
