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
import { History, IHistory } from '../../models/history.model';
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
      if (
        !room.viewers.some((viewer) => viewer.username === payload.user.user)
      ) {
        room.viewers.push({
          username: payload.user.user,
          avatar: payload.user.image,
          display_name: payload.user.name,
        });
        await room.save();
      }
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
      this.server.in(payload.roomId).emit('playGame', game);
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

  @SubscribeMessage('invite')
  public inviteUser(client: Socket, payload: any): void {
    this.server.emit('invite', payload);
  }

  @SubscribeMessage('sendMessage')
  public async message(client: Socket, data: any) {
    client.broadcast.in(data.roomId).emit('recievedMessage', data.body);
    const room = await this.roomModel.findOne({ idroom: data.roomId });
    room.chat.push({
      message: data.body.message,
      username: data.body.username,
      avatar: data.body.avatar,
      display_name: data.body.display_name,
    });
    await room.save();
  }

  @SubscribeMessage('confirm')
  public confirm(client: Socket, data: any): void {
    client.emit('success');
  }

  @SubscribeMessage('close')
  public close(client: Socket, data: any): void {}

  @SubscribeMessage('drawRequest')
  public drawRequest(client: Socket, payload: any): void {
    client.to(payload.roomId).emit('drawRequest', {
      user1: payload.user.user,
      name: payload.user.name,
      user2:
        payload.user.user === payload.game.player1
          ? payload.game.player2
          : payload.game.player1,
    });
  }

  @SubscribeMessage('draw')
  public async draw(client: Socket, payload: any) {
    this.server.to(payload.roomId).emit('draw', payload.game);
    const data = await this.gameModel
      .find({ roomId: payload.roomId })
      .sort({ _id: -1 })
      .limit(1);
    const game = data[0];
    if (game.playing) {
      game.playing = false;
      await game.save();
      const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
      const history = new this.historyModel({
        roomId: payload.roomId,
        winner: payload.user.user,
        result: game.board,
        loser: payload.user.user === game.player1 ? game.player2 : game.player1,
        datetime: createdDate,
        draw: true,
      });
      await history.save();

      const player1 = await this.userModel.findOne({ user: payload.user.user });

      const player2 = await this.userModel.findOne({
        user: payload.user.user === game.player1 ? game.player2 : game.player1,
      });

      player1.totalMatch += 1;
      player2.totalMatch += 1;

      await this.userModel.update(
        { _id: player1._id },
        {
          cups: player1.cups,
          totalMatch: player1.totalMatch,
        },
      );
      await this.userModel.update(
        { _id: player2._id },
        {
          cups: player2.cups,
          totalMatch: player2.totalMatch,
        },
      );
    }
  }

  @SubscribeMessage('newGame')
  public async newGame(client: Socket, payload: any) {
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
      this.server.in(payload.roomId).emit('playGame', game);
      this.server.in(payload.roomId).emit('newGame', game);
      await game.save();
    }
  }

  @SubscribeMessage('win')
  public async endGame(client: Socket, payload: any) {
    client.to(payload.roomId).emit('play', payload.play);
    const endGame = {
      winner: payload.user.user,
      loser:
        payload.game.player1 !== payload.user.user
          ? payload.game.player1
          : payload.game.player2,
      winnerName: payload.user.name,
      admin: payload.game.player1,
    };

    this.server.in(payload.roomId).emit('endGame', endGame);

    const data = await this.gameModel
      .find({ roomId: payload.roomId })
      .sort({ _id: -1 })
      .limit(1);
    const game = data[0];
    if (game.playing) {
      game.playing = false;
      game.board.push({
        value: payload.play.value,
        index: payload.play.index,
      });
      await game.save();
      const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
      const history = new this.historyModel({
        roomId: payload.roomId,
        winner: payload.user.user,
        result: game.board,
        loser: payload.user.user === game.player1 ? game.player2 : game.player1,
        datetime: createdDate,
        draw: false,
      });
      await history.save();

      const player1 = await this.userModel.findOne({ user: payload.user.user });

      const player2 = await this.userModel.findOne({
        user: payload.user.user === game.player1 ? game.player2 : game.player1,
      });

      player1.totalMatch += 1;
      player1.wins += 1;
      player2.totalMatch += 1;

      if (player1.cups > player2.cups) {
        player1.cups += 5;
        player2.cups -= 5;
      } else {
        player1.cups += 10;
        player2.cups -= 10;
      }

      await this.userModel.update(
        { _id: player1._id },
        {
          cups: player1.cups,
          totalMatch: player1.totalMatch,
        },
      );
      await this.userModel.update(
        { _id: player2._id },
        {
          cups: player2.cups,
          totalMatch: player2.totalMatch,
        },
      );
    }
  }

  @SubscribeMessage('play')
  public async play(client: Socket, payload: any) {
    client.to(payload.roomId).emit('play', payload);
    this.server.to(client.id).emit('resetTime', payload.user);
    const data = await this.gameModel
      .find({ roomId: payload.roomId })
      .sort({ _id: -1 })
      .limit(1);
    const game = data[0];

    game.board.push({
      value: payload.value,
      index: payload.index,
    });
    game.datetime = new Date();
    await game.save();
  }

  @SubscribeMessage('endTime')
  public async endTime(client: Socket, payload: any) {
    const playerWin = await this.userModel.findOne({
      user:
        payload.user.user === payload.game.player1
          ? payload.game.player2
          : payload.game.player1,
    });

    if (playerWin) {
      const endGame = {
        winner: playerWin.user,
        loser: payload.user.user,
        winnerName: playerWin.name,
        admin: payload.game.player1,
      };

      this.server.in(payload.roomId).emit('endGame', endGame);

      const data = await this.gameModel
        .find({ roomId: payload.roomId })
        .sort({ _id: -1 })
        .limit(1);
      const game = data[0];
      if (game.playing) {
        game.playing = false;

        await game.save();
        const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
        const history = new this.historyModel({
          roomId: payload.roomId,
          winner: playerWin.user,
          result: game.board,
          loser: payload.user.user,
          datetime: createdDate,
          draw: false,
        });
        await history.save();

        const player1 = await this.userModel.findOne({
          user: payload.user.user,
        });

        player1.totalMatch += 1;
        playerWin.wins += 1;
        playerWin.totalMatch += 1;

        if (playerWin.cups > player1.cups) {
          playerWin.cups += 5;
          player1.cups -= 5;
        } else {
          playerWin.cups += 10;
          player1.cups -= 10;
        }

        await this.userModel.update(
          { _id: player1._id },
          {
            cups: player1.cups,
            totalMatch: player1.totalMatch,
          },
        );
        await this.userModel.update(
          { _id: playerWin._id },
          {
            cups: playerWin.cups,
            totalMatch: playerWin.totalMatch,
          },
        );
      }
    }
  }
  @SubscribeMessage('outRoom')
  public async outRoom(client: Socket, payload: any) {
    client.leave(payload.roomId);
    if (
      payload.user.user === payload.game.player1 ||
      payload.user.user === payload.game.player2
    ) {
      const room = await this.roomModel.findOne({ idroom: payload.roomId });
      if (payload.user.user === payload.game.player1) {
        room.isPlay = false;
        this.server.in(payload.roomId).emit('outRoom');
      }
      else{
        room.player2 = null;
        this.server.in(payload.roomId).emit('outRoom', room);
      }
      await room.save();

      const playerWin = await this.userModel.findOne({
        user:
          payload.user.user === payload.game.player1
            ? payload.game.player2
            : payload.game.player1,
      });

      if (playerWin) {

        const data = await this.gameModel
          .find({ roomId: payload.roomId })
          .sort({ _id: -1 })
          .limit(1);
        const game = data[0];
        if (game.playing) {
          game.playing = false;
          const endGame = {
            winner: playerWin.user,
            loser: payload.user.user,
            winnerName: playerWin.name,
            admin: payload.game.player1,
          };
  
          // this.server.in(payload.roomId).emit('endGame', endGame);

          await game.save();
          const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
          const history = new this.historyModel({
            roomId: payload.roomId,
            winner: playerWin.user,
            result: game.board,
            loser: payload.user.user,
            datetime: createdDate,
            draw: false,
          });
          await history.save();

          const player1 = await this.userModel.findOne({
            user: payload.user.user,
          });

          player1.totalMatch += 1;
          playerWin.wins += 1;
          playerWin.totalMatch += 1;

          if (playerWin.cups > player1.cups) {
            playerWin.cups += 5;
            player1.cups -= 5;
          } else {
            playerWin.cups += 10;
            player1.cups -= 10;
          }

          await this.userModel.update(
            { _id: player1._id },
            {
              cups: player1.cups,
              totalMatch: player1.totalMatch,
            },
          );
          await this.userModel.update(
            { _id: playerWin._id },
            {
              cups: playerWin.cups,
              totalMatch: playerWin.totalMatch,
            },
          );
        }
      }
    }
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
