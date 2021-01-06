import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IGame, Game } from '../models/game.model';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name)
    private readonly gameModel: Model<IGame>,
  ) {}

  public async listAll() {
    return this.gameModel.find();
  }
  async create(input: Game) {
    const createdDate = moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
    console.log('create game data', input);
    const createGame = new this.gameModel({
      roomId: input.roomId,
      result: input.result,
      player1: input.player1,
      player2: input.player1,
      datetime: createdDate,
      chat: input.chat,
    });
    await createGame.save();
    return createGame;
  }

  async findByUsername(input: string) {
    let username = input;
    const histories = await this.gameModel.find({
      $or: [{ player1: username }, { player2: username }],
    });
    console.log(histories);
    return histories;
  }

  async findSingByID(input: string) {
    let _id = input;
    const game = await this.gameModel.findOne({ _id });
    return game;
  }

  async sendMessage(roomId: string, message: any) {}
}
